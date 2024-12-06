import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Space,
  notification,
  Input,
  Select,
  Row,
  Col,
} from "antd";
import { Link } from "react-router-dom";
import { blogApi } from "../services/apis/blogApi";
import CustomPageHeader from "../components/PageHeader";
import "../styles/BlogList.scss"; // Import SCSS file
import { DeleteOutlined } from "@ant-design/icons";
import ConfirmDeletionModal from "../components/master-data/common/DeleteModal";
import { useLoader } from "../context/LoaderContext";

const { Search } = Input;
const { Option } = Select;

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState<any>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [reload, setReload] = useState(false);
  const { startLoader, stopLoader } = useLoader();

  useEffect(() => {
    fetchBlogs();
  }, [pagination.current, searchTerm, selectedTag, reload]);

  const handleDelete = async () => {
    if (deleteRecord) {
      try {
        startLoader();
        const response = await blogApi.deleteBlog(deleteRecord._id);
        if (response.data.success) {
          notification.success({
            message: "Blog Deleted",
            description: "The blog has been successfully deleted.",
          });
        }
      } catch (e: any) {
        console.error("Error deleting blog:", e);
        notification.error({
          message: "Error",
          description: e.data.message || "Something went wrong!",
        });
      } finally {
        stopLoader();
        setReload(true);
        setDeleteModalVisible(false);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await blogApi.getBlogs({
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchTerm,
        tags: selectedTag,
      });
      console.log(response, "Res");
      setBlogs(response.data.data);
      setPagination((prev) => ({
        ...prev,
        total: response.data.data.total, // Set total number of items for pagination
      }));
    } catch (error: any) {
      notification.error({
        message: "Error Fetching Blogs",
        description: error.message || "Something went wrong!",
      });
    } finally {
      setLoading(false);
      setReload(false);
    }
  };

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  const onSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag);
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Tags", dataIndex: "tags", key: "tags" },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => {
        const date = new Date(createdAt);
        return date.toLocaleString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: any) => (
        <Space size="middle">
          <Link to={`/blogs/edit/${record._id}`}>Edit</Link>
          <Button
            type="default"
            icon={<DeleteOutlined />}
            onClick={() => {
              setDeleteRecord(record); // Set the record to be deleted
              setDeleteModalVisible(true); // Show the confirmation modal
            }}
            danger
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="blog-list">
      <CustomPageHeader title="Blog Management" />
      <div className="blog-list-controls">
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={16}>
            <Search
              placeholder="Search by title"
              onSearch={onSearch}
              enterButton
              allowClear
              size="large"
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Filter by tag"
              style={{ width: "100%" }}
              onChange={handleTagFilter}
              size="large"
              allowClear
            >
              <Option value="technology">Technology</Option>
              <Option value="health">Health</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Button type="primary" block size="large">
              <Link to="/blogs/create">Create New Blog</Link>
            </Button>
          </Col>
        </Row>
      </div>
      <Table
        columns={columns}
        dataSource={blogs}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true, // Allow page size changes
        }}
        onChange={handleTableChange}
        className="custom-table"
      />
      <ConfirmDeletionModal
        deleteModalVisible={deleteModalVisible}
        handleDelete={handleDelete}
        handleDeleteCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default BlogList;
