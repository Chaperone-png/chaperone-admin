import React from 'react';
import BlogEditor from '../components/blogs/BlogEditor';
import CustomPageHeader from '../components/PageHeader';
import '../styles/BlogEditor.scss'
const CreateBlog: React.FC = () => {
    return (
        <div>
            <CustomPageHeader
                title={'Create Blog'}
            />
            <BlogEditor />
        </div>
    );
};

export default CreateBlog;
