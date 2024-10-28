import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Row, Col, Table, Skeleton, Descriptions, Typography, Button, Space, Modal, Form, Input, Select } from 'antd';
import '../styles/Nursery.scss';
import '../styles/AddPlantModal.scss'; // Import the new CSS file
import { nurseryApi } from '../services/apis/nurseries';
import CustomPageHeader from '../components/PageHeader';
import { AddProductForm } from '../components/AddProductForm';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const Nursery: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [nursery, setNursery] = useState<any>(null);
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNurseryDetails = async () => {
      try {
        const response = await nurseryApi.getNurseryById(id!);
        if (response.data.nursery) {
          setNursery(response.data.nursery);
        }
        // setPlants(plantsResponse.data);
      } catch (error) {
        console.error('Error fetching nursery details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNurseryDetails();
  }, [id]);

  const plantColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Last Updated',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
    },
    {
      title: 'Available in Plant/Pot',
      dataIndex: 'availableIn',
      key: 'availableIn',
    },
  ];

  if (loading) {
    return <Skeleton active />;
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };



  return (
    <div className="nursery-container">
      <CustomPageHeader
        title="Nursery"
        onBack={() => {
          navigate('/nurseries');
        }}
      />
      <Card className="nursery-card">
        {nursery ? (
          <Descriptions
            bordered
            column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
            className="nursery-descriptions"
          >
            <Descriptions.Item label="Name">{nursery.name}</Descriptions.Item>
            <Descriptions.Item label="State">{nursery.address?.state}</Descriptions.Item>
            <Descriptions.Item label="City">{nursery.address?.city}</Descriptions.Item>
            <Descriptions.Item label="Pincode">{nursery.address?.pincode}</Descriptions.Item>
            <Descriptions.Item label="Full Address">{nursery.address?.addressLine}</Descriptions.Item>
            <Descriptions.Item label="Contact Person">{nursery.contactPerson.name}</Descriptions.Item>
            <Descriptions.Item label="Contact Number">{nursery.contactPerson.phone}</Descriptions.Item>
            <Descriptions.Item label="Email">{nursery.contactPerson.email}</Descriptions.Item>
            <Descriptions.Item label="Status">{nursery.status}</Descriptions.Item>
          </Descriptions>
        ) : (
          <p>Nursery not found.</p>
        )}
      </Card>
      <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>Plants</Title>
        </Col>
        <Col>
          <Space>
            <Button type="primary" onClick={showModal}>Add Plant/Pot</Button>
            <Button onClick={() => navigate(`/nurseries/${id}/add-bulk`)}>Add in Bulk</Button>
          </Space>
        </Col>
      </Row>
      <Card className="plants-card">
        <Table columns={plantColumns} dataSource={plants} rowKey="id" pagination={false} />
      </Card>
      <Modal
        title="Add Plant/Pot"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        className="add-plant-modal"
        destroyOnClose
      >
        <AddProductForm nurseryName={nursery?.name} />
      </Modal>
    </div>
  );
};

export default Nursery;

