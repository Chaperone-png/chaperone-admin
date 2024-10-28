import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { notification, Spin } from 'antd';
import BlogEditor from '../components/blogs/BlogEditor';
import CustomPageHeader from '../components/PageHeader';
import { blogApi } from '../services/apis/blogApi';
import '../styles/BlogEditor.scss';

const EditBlog: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Get blog ID from the URL
    const [blog, setBlog] = useState<any>(null); // State to hold blog data
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                if (id) {
                    const response = await blogApi.getBlogById(id); // Fetch blog by ID
                    setBlog(response.data.data);
                }
            } catch (error: any) {
                notification.error({
                    message: 'Error Fetching Blog',
                    description: error.message || 'Failed to load blog data!',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    if (loading) {
        return <Spin size="large" />;
    }

    if (!blog) {
        return <p>No blog found</p>;
    }

    return (
        <div>
            <CustomPageHeader title={'Edit Blog'} />
            <BlogEditor blogData={blog} /> {/* Pass blog data to BlogEditor */}
        </div>
    );
};

export default EditBlog;
