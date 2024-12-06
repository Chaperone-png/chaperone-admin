import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  Select,
  DatePicker,
  notification,
  Row,
  Col,
  Modal,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import moment from "moment";
import "../../styles/BlogEditor.scss";
import { blogApi } from "../../services/apis/blogApi";
import { toast } from "react-toastify";
import { useLoader } from "../../context/LoaderContext";

const { TextArea } = Input;
const { Option } = Select;

interface BlogEditorProps {
  blogData?: any; // Optional prop to handle editing
}

const BlogEditor: React.FC<BlogEditorProps> = ({ blogData }) => {
  const [form] = Form.useForm();
  const [content, setContent] = useState(blogData?.content || ""); // Rich text content
  const [fileList, setFileList] = useState<any[]>([]); // File list for the featured image
  const [links, setLinks] = useState<Record<string, string>>(
    blogData?.links || {}
  );
  const [images, setImages] = useState<Record<string, string>>(
    blogData?.images || {}
  );
  const [isLinkModalVisible, setLinkModalVisible] = useState(false);
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [linkInput, setLinkInput] = useState({ keyword: "", url: "" });
  const [imageInput, setImageInput] = useState({ key: "", url: "" });
  const [loading, setLoading] = useState(false);
  const quillRef = useRef<any>(null);

  const { startLoader, stopLoader } = useLoader();
  console.log({ links, images, content });

  const renderingContent = useMemo(() => {
    let updatedContent = content;
    return updatedContent;
  }, [content, links, images]);

  useEffect(() => {
    if (blogData) {
      form.setFieldsValue({
        title: blogData.title,
        metaTitle: blogData.metaTitle,
        tags: blogData.tags,
        metaDescription: blogData.metaDescription,
        metaKeywords: blogData.metaKeywords,
        publishDate: blogData.publishDate ? moment(blogData.publishDate) : null,
      });
      if (quillRef.current) {
        quillRef.current
          .getEditor()
          .clipboard.dangerouslyPasteHTML(blogData.content || "");
      }
      setContent(blogData.content);
      setFileList(blogData.imageUrl ? [{ url: blogData.imageUrl }] : []);
    }
  }, [blogData, form]);

  const handleBeforeUpload = (file: any) => {
    setFileList([file]);
    return false;
  };

  const handleRemoveImage = () => {
    setFileList([]);
  };

  const handleFileChange = () => {
      const file = fileList[0];
      console.log({file})
      return ''
      const fileURL = URL.createObjectURL(file); 
      return fileURL;
  };

  const handleLinkInsert = () => {
    if (!linkInput.keyword || !linkInput.url) {
      notification.error({
        message: "Error",
        description: "Both keyword and URL are required",
      });
      return;
    }

    const linkKey = `link_${Date.now()}`;
    setLinks((prevLinks) => ({
      ...prevLinks,
      [linkKey]: linkInput.url,
    }));

    const editor = quillRef.current.getEditor();
    const range = editor.getSelection();
    const position = range ? range.index : editor.getLength();

    editor.insertText(position, linkInput.keyword, "link", linkInput.url); // Insert link at cursor

    setLinkInput({ keyword: "", url: "" });
    setLinkModalVisible(false);
  };

  const handleImageInsert = () => {
    if (!imageInput.key || !imageInput.url) {
      notification.error({
        message: "Error",
        description: "Both key and image URL are required",
      });
      return;
    }
    // Generate a unique key for the image
    const imageKey = `image_${Date.now()}`;
    setImages((prevImages) => ({
      ...prevImages,
      [imageKey]: imageInput.url,
    }));

    const editor = quillRef.current.getEditor();
    const range = editor.getSelection();
    const position = range ? range.index : editor.getLength();
    editor.insertEmbed(position, "image", images[imageKey]); // Insert key instead of URL
    setImageInput({ key: "", url: "" });
    setImageModalVisible(false);
  };

  const resetImageModal = () => {
    setImageInput({ key: "", url: "" });
  };

  const handleImageUpload = async (file: any) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      startLoader();
      const response = await blogApi.uploadBlogImages(formData);
      if (response.data.success) {
        const imageUrl = response.data.imageUrl;
        setImageInput((prevInput) => ({
          ...prevInput,
          url: imageUrl,
        }));

        const imageKey = `image_${Date.now()}`;
        setImages((prevImages) => ({
          ...prevImages,
          [imageKey]: imageUrl,
        }));

        const editor = quillRef.current.getEditor();
        const range = editor.getSelection();
        const position = range ? range.index : editor.getLength();
        editor.insertEmbed(position, "image", imageUrl);

        toast.success("The image has been uploaded successfully.");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload image.");
    } finally {
      stopLoader();
      resetImageModal();
      setImageModalVisible(false);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("metaTitle", values.metaTitle);
      formData.append("tags", values.tags.join(","));
      formData.append("metaDescription", values.metaDescription);
      formData.append("metaKeywords", values.metaKeywords);

      if (values.publishDate) {
        formData.append("publishDate", values.publishDate.toISOString());
      }

      formData.append("content", content);

      if (!blogData?.imageUrl || fileList.length > 0)
        formData.append("file", fileList[0].file);

      formData.append("links", JSON.stringify(links));
      formData.append("images", JSON.stringify(images));

      if (blogData) {
        await blogApi.updateBlog(blogData._id, formData);
        notification.success({
          message: "Blog Updated",
          description: "The blog has been successfully updated.",
        });
      } else {
        await blogApi.createBlog(formData);
        notification.success({
          message: "Blog Created",
          description: "The blog has been successfully created.",
        });
      }
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error.message || "Something went wrong!",
      });
    } finally {
      setLoading(false);
      window.location.href = '/blogs';
    }
  };

  return (
    <div className="blog-editor-container">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Blog Title"
              name="title"
              rules={[
                { required: true, message: "Please enter the blog title" },
              ]}
            >
              <Input placeholder="Enter blog title" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Meta Title"
              name="metaTitle"
              rules={[
                {
                  required: true,
                  message: "Please enter the meta title for SEO",
                },
              ]}
            >
              <Input placeholder="Enter meta title" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Meta Description"
              name="metaDescription"
              rules={[
                {
                  required: true,
                  message: "Please enter a meta description for SEO",
                },
              ]}
            >
              <TextArea rows={4} placeholder="Enter meta description" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Meta Keywords"
              name="metaKeywords"
              rules={[
                {
                  required: true,
                  message: "Please enter meta keywords for SEO",
                },
              ]}
            >
              <TextArea rows={4} placeholder="Enter meta keywords" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Tags"
              name="tags"
              rules={[
                { required: true, message: "Please select at least one tag" },
              ]}
            >
              <Select mode="tags" placeholder="Select tags" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Publish Date" name="publishDate">
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Content" name="content">
          <ReactQuill
            value={renderingContent}
            onChange={setContent}
            ref={quillRef}
            modules={{
              toolbar: [
                [{ header: "1" }, { header: "2" }, { font: [] }],
                [{ list: "ordered" }, { list: "bullet" }],
                ["bold", "italic", "underline"],
                [{ align: [] }],
                ["link", "image"],
              ],
            }}
          />
        </Form.Item>
        <Form.Item label="Featured Image">
          <Upload
            customRequest={handleBeforeUpload}
            fileList={fileList}
            onRemove={handleRemoveImage}
            listType="picture-card"
          >
            <UploadOutlined />
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {blogData ? "Update Blog" : "Create Blog"}
          </Button>
        </Form.Item>
      </Form>

      {/* Insert Link Button */}
      <Button type="link" onClick={() => setLinkModalVisible(true)}>
        Insert Link
      </Button>

      {/* Insert Image Button */}
      <Button type="link" onClick={() => setImageModalVisible(true)}>
        Insert Image
      </Button>

      {/* Link Modal */}
      <Modal
        title="Insert Link"
        visible={isLinkModalVisible}
        onCancel={() => setLinkModalVisible(false)}
        onOk={handleLinkInsert}
      >
        <Input
          value={linkInput.keyword}
          onChange={(e) =>
            setLinkInput({ ...linkInput, keyword: e.target.value })
          }
          placeholder="Enter keyword"
        />
        <Input
          value={linkInput.url}
          onChange={(e) => setLinkInput({ ...linkInput, url: e.target.value })}
          placeholder="Enter URL"
        />
      </Modal>

      {/* Image Modal */}
      <Modal
        title="Insert Image"
        visible={isImageModalVisible}
        onCancel={() => setImageModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setImageModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="insert"
            type="primary"
            disabled={!imageInput.url} // Disable until an image is uploaded
            onClick={handleImageInsert}
          >
            Insert Image
          </Button>,
        ]}
      >
        <Upload
          name="image"
          customRequest={({ file }) => handleImageUpload(file)} // Call handleImageUpload for the uploaded file
          showUploadList={false}
          accept="image/*"
        >
          <Button icon={<UploadOutlined />}>Upload Image</Button>
        </Upload>
        {imageInput.url && (
          <div className="uploaded-image-preview">
            <p>Preview:</p>
            <img
              src={imageInput.url}
              alt="Uploaded"
              style={{
                width: "100%",
                maxHeight: "200px",
                objectFit: "contain",
              }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BlogEditor;
