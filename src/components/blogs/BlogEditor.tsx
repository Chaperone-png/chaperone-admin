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
import { ReactQuillModules } from "../../utils/constants";

import Quill from "react-quill";

const { TextArea } = Input;
const { Option } = Select;

interface BlogEditorProps {
  blogData?: any; // Optional prop to handle editing
}

const BlogEditor: React.FC<BlogEditorProps> = ({ blogData }) => {
  const [form] = Form.useForm();
  const [content, setContent] = useState(blogData?.content || ""); // Rich text content
  const [fileList, setFileList] = useState<any[]>([]); // File list for the featured image
  const [links, setLinks] = useState<Record<string, string>>({});
  const [images, setImages] = useState<Record<string, string>>({});
  const [isLinkModalVisible, setLinkModalVisible] = useState(false);
  const [linkInput, setLinkInput] = useState({ keyword: "", url: "" });
  const [imageInput, setImageInput] = useState({ key: "", url: "" });
  const [loading, setLoading] = useState(false);
  const [fetchedImagesData, setFetchedImagesData] = useState([]);
  const [showSelectImageView, setShowSelectImageView] = useState(false);
  const [selectedImageSize, setSelectedImageSize] = useState("medium");
  const [quillInstance, setQuillInstance] = useState<any>(null);
  const quillRef = useRef<any>(null);

  const modules = {
    ...ReactQuillModules,
    clipboard: {
      matchVisual: false,
    },
  };

  useEffect(() => {
    setLinks(blogData?.links || {});
    setImages(blogData?.images || {});
  }, [blogData]);

  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      setQuillInstance(editor);
    }
  }, [quillRef.current]);

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

  const handleLinkInsert = async () => {
    if (!linkInput.keyword || !linkInput.url) {
      notification.error({
        message: "Error",
        description: "Both keyword and URL are required",
      });
      return;
    }

    try {
      startLoader();
      const response = await blogApi.getImagesFromUrl(linkInput.url);

      if (response.data.success) {
        notification.success({
          message: "Success",
          description: "Successfully fetched the images.",
        });
        const imagesData = response.data.images;

        setFetchedImagesData(imagesData);
        setShowSelectImageView(true);
      } else {
        notification.error({
          message: "Error",
          description: "Failed to fetch images for the link.",
        });
      }
    } catch (error: any) {
      console.error("Error inserting link:", error);
      notification.error({
        message: "Error",
        description: error?.message || "Failed to fetch images.",
      });
    } finally {
      stopLoader();
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    if (!quillInstance) {
      console.error("Quill editor is not initialized.");
      return;
    }

    let sizeStyle = "";
    let height = "";
    let width = "";
    switch (selectedImageSize) {
      case "extra-small":
        sizeStyle = "width: 50px; height: auto;";
        height = "50px";
        width = "50px";
        break;
      case "small":
        sizeStyle = "width: 150px; height: auto;";
        height = "150px";
        width = "150px";
        break;
      case "medium":
        sizeStyle = "width: 300px; height: auto;";
        height = "300px";
        width = "300px";
        break;
      case "large":
        sizeStyle = "width: 500px; height: auto;";
        height = "500px";
        width = "500px";
        break;
      default:
        sizeStyle = "width: 300px; height: auto;";
        height = "300px";
        width = "300px";
        break;
    }

    const imageHtml = `
      <a href="${linkInput.url}" target="_blank">
        <div class="link-image" style="cursor: pointer; display: inline-block; ">
          <img src="${imageUrl}" alt="${linkInput.keyword}" height="${height}" width="${width}" />
        </div>
      </a>
    `;

    const editor = quillRef.current.getEditor();
    const range = editor.getSelection();
    const position = range ? range.index : editor.getLength();

    editor.clipboard.dangerouslyPasteHTML(position, imageHtml);

    setLinkInput({ keyword: "", url: "" });
    setLinkModalVisible(false);
    setShowSelectImageView(false);
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

      formData.append("content", content);

      if (values.publishDate) {
        formData.append("publishDate", values.publishDate.toISOString());
      }

      if (!blogData?.imageUrl && fileList?.length > 0) {
        formData.append("file", fileList[0].file);
      }

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
      console.error("got error:", error);
      notification.error({
        message: "Error",
        description: error.message || "Something went wrong!",
      });
    } finally {
      setLoading(false);
      window.location.href = "/blogs";
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
          <div className="react-quill-container">
            <ReactQuill
              value={renderingContent}
              onChange={setContent}
              ref={quillRef}
              theme="snow"
              modules={modules}
            />
          </div>
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
          onChange={(e) =>
            setLinkInput({
              ...linkInput,
              url: decodeURIComponent(e.target.value),
            })
          }
          placeholder="Enter URL"
        />
      </Modal>

      {/* Image Selection Modal */}
      <Modal
        title="Select Image"
        visible={showSelectImageView}
        onCancel={() => setShowSelectImageView(false)}
        footer={null}
      >
        <div className="image-selection-modal">
          {fetchedImagesData.length > 0 ? (
            <Select
              value={selectedImageSize}
              onChange={setSelectedImageSize}
              style={{ marginBottom: "16px", width: "100%" }}
            >
              <Option value="extra-small">Extra Small</Option>
              <Option value="small">Small</Option>
              <Option value="medium">Medium</Option>
              <Option value="large">Large</Option>
            </Select>
          ) : (
            ""
          )}
          {fetchedImagesData.length > 0 ? (
            <>
              <Row gutter={16}>
                {fetchedImagesData.map((image: any) => (
                  <Col span={6} key={image._id}>
                    <div
                      className="image-item"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleImageSelect(image.url)}
                    >
                      <img
                        src={image.url}
                        alt={image._id}
                        style={{ maxWidth: "100%" }}
                      />
                      <p>{image.containerType}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </>
          ) : (
            <p>No images available.</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default BlogEditor;
