import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, Button, Upload, Select, DatePicker, notification, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { blogApi } from '../../services/apis/blogApi';
import '../../styles/BlogEditor.scss';
import moment from 'moment'; // Import moment for date handling

const { TextArea } = Input;
const { Option } = Select;

interface BlogEditorProps {
    blogData?: any; // Optional prop to handle editing
}

const BlogEditor: React.FC<BlogEditorProps> = ({ blogData }) => {
    const [form] = Form.useForm();
    const [content, setContent] = useState(blogData?.content || ''); // For managing the editor's content
    const [fileList, setFileList] = useState<any[]>([]); // To store selected image temporarily
    const [loading, setLoading] = useState(false);
    const quillRef = useRef<any>(null); // Ref for Quill editor

    useEffect(() => {
        if (blogData) {
            form.setFieldsValue({
                title: blogData.title,
                content: blogData.content,
                tags: blogData.tags,
                metaDescription: blogData.metaDescription,
                metaKeywords: blogData.metaKeywords,
                publishDate: blogData.publishDate ? moment(blogData.publishDate) : null, // Convert to moment
            });
            if (quillRef.current) {
                quillRef.current.getEditor().clipboard.dangerouslyPasteHTML(blogData.content || '');
            }
            setContent(blogData.content); // Set content for ReactQuill
            setFileList(blogData.imageUrl ? [{ url: blogData.imageUrl }] : []); // Set fileList if imageUrl exists
        }
    }, [blogData, form]);

    // Handle image selection but don't upload instantly
    const handleBeforeUpload = (file: any) => {
        setFileList([file]); // Only allow one image at a time, overwrite previous
        return false; // Prevent automatic upload
    };

    // Clear selected image if needed
    const handleRemoveImage = () => {
        setFileList([]);
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const formattedValues = {
                ...values,
                content, // Include editor content
                publishDate: values.publishDate ? values.publishDate.toISOString() : null, // Convert to ISO string
            };

            if (blogData) {
                // If blogData exists, it means we're in edit mode
                await blogApi.updateBlog(blogData._id, formattedValues);
                notification.success({
                    message: 'Blog Updated',
                    description: 'The blog has been successfully updated.',
                });
            } else {
                // If no blogData, this is a new blog creation
                await blogApi.createBlog(formattedValues);
                notification.success({
                    message: 'Blog Created',
                    description: 'The blog has been successfully created.',
                });
            }
        } catch (error: any) {
            notification.error({
                message: 'Error',
                description: error.message || 'Something went wrong!',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="blog-editor-container">
            <Form form={form} layout="vertical" onFinish={onFinish} scrollToFirstError>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Blog Title"
                            name="title"
                            rules={[{ required: true, message: 'Please enter the blog title' }]}
                        >
                            <Input placeholder="Enter blog title" className="input-field" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Tags" name="tags">
                            <Select mode="tags" placeholder="Add tags (e.g., tech, health)">
                                <Option value="technology">Technology</Option>
                                <Option value="health">Health</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Featured Image" name="image">
                            <Upload
                                beforeUpload={handleBeforeUpload} // Handle image selection
                                fileList={fileList} // Keep track of selected file
                                onRemove={handleRemoveImage} // Allow removing selected image
                                listType="picture"
                            >
                                <Button icon={<UploadOutlined />}>Upload Featured Image</Button>
                            </Upload>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="Schedule Publish Date" name="publishDate">
                            <DatePicker showTime className="input-field" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label="Content" name="content">
                    <ReactQuill
                        value={content}
                        ref={quillRef}

                        onChange={setContent}
                        theme="snow"
                        className="quill-editor"
                        placeholder="Write your blog content here..."
                    />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Meta Description" name="metaDescription">
                            <TextArea rows={3} placeholder="Add meta description" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item label="Meta Keywords" name="metaKeywords">
                            <Input placeholder="Meta keywords (comma separated)" />
                        </Form.Item>
                    </Col>
                </Row>

                <div className="form-actions">
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {blogData ? 'Update Blog' : 'Create Blog'}
                        </Button>
                    </Form.Item>
                </div>
            </Form>
        </div>
    );
};

export default BlogEditor;
