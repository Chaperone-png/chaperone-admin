import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag } from 'antd';
import { DeleteOutlined, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import ProductTypeModal from './ProductTypeModal';
import { productApi } from '../services/apis/productApi';
import moment from 'moment';

const ProductTypeTable = () => {
  const [productTypesData, setProductTypesData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    fetchProductTypes();
  }, []);

  const fetchProductTypes = async () => {
    try {
      const response = await productApi.getProductTypes();
      setProductTypesData(response.data);
    } catch (error) {
      console.error('Error fetching plant types:', error);
    }
  };

  const handleEdit = (record:any) => {
    setSelectedType(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (record:any) => {
    try {
      await axios.delete(`/api/plantTypes/${record._id}`);
      fetchProductTypes();
    } catch (error) {
      console.error('Error deleting plant type:', error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedType(null);
    fetchProductTypes();
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Last Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (updatedAt:any)=>{
        return <>{moment(updatedAt).format('DD-MM-YYYY, hh:mm a')}</>
      }
    },
    {
      title: 'Updated By',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status:any) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text:any, record:any) => (
        <Space size="small">
          <Button onClick={() => handleEdit(record)}><EditTwoTone /></Button>
          {/* <Button onClick={() => handleDelete(record)}><DeleteOutlined /></Button> */}
        </Space>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} className="add-new-btn" onClick={() => setIsModalOpen(true)}>
        Create New
      </Button>
      <Table columns={columns} dataSource={productTypesData} pagination={false} />
      <ProductTypeModal isOpen={isModalOpen} onClose={handleModalClose} plantType={selectedType} onSuccess={fetchProductTypes} />
    </>
  );
};

export default ProductTypeTable;
