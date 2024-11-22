import { EditTwoTone, PlusOutlined, UploadOutlined, DeleteTwoTone, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Space, Table, Tag, Upload, message, Modal } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { plantApi } from '../../../services/apis/plantApi';
import PlantTypeModal from './PlantTypeModal';

const { confirm } = Modal;

const PlantTypes = () => {
    const [plantTypesData, setPlantTypes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState(null);

    // Fetch Plant Types on Component Mount
    useEffect(() => {
        fetchPlantTypes();
    }, []);

    const fetchPlantTypes = async () => {
        try {
            const response = await plantApi.getPlantTypes();
            setPlantTypes(response.data);
        } catch (error) {
            console.error('Error fetching plant types:', error);
        }
    };

    // Handle Edit
    const handleEdit = (record: any) => {
        setSelectedType(record);
        setIsModalOpen(true);
    };

    // Handle Delete
    const handleDelete = async (id: string) => {
        try {
            await plantApi.deletePlantType(id);
            message.success('Plant type deleted successfully');
            fetchPlantTypes();
        } catch (error) {
            console.error('Error deleting plant type:', error);
            message.error('Failed to delete plant type');
        }
    };

    // Show Confirmation Modal
    const showDeleteConfirm = (record: any) => {
        confirm({
            title: `Are you sure you want to delete this plant type ${record?.title}`,
            icon: <ExclamationCircleOutlined />,
            content: `This action cannot be undone.`,
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                handleDelete(record._id);
            },
        });
    };

    // Handle Modal Close
    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedType(null);
        fetchPlantTypes();
    };

    // Handle File Upload
    const handleFileUpload = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await plantApi.bulkUploadPlantTypes(formData);
            message.success('Plant types uploaded successfully');
            fetchPlantTypes();
        } catch (error) {
            console.error('Error uploading plant types:', error);
            message.error('Failed to upload plant types');
        }
    };

    // Columns for the Table
    const columns = [
        {
            title: 'Plant Type',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (description: string) => <>{description || '-'}</>,
        },
        {
            title: 'Subcategories',
            dataIndex: 'subcategories',
            key: 'subcategories',
            render: (subcategories: any) => (
                <>
                    {subcategories && subcategories.length > 0 ? (
                        <ul>
                            {subcategories.map((sub: any, index: number) => (
                                <li key={index}>
                                    <strong>{sub.name}</strong>: {sub.description || 'No description'}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        'No subcategories'
                    )}
                </>
            ),
        },
        {
            title: 'Last Updated',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (updatedAt: any) => (
                <>{moment(updatedAt).format('DD-MM-YYYY, hh:mm a')}</>
            ),
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
            render: (status: string) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>{status}</Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text: any, record: any) => (
                <Space size="small">
                    <Button onClick={() => handleEdit(record)}>
                        <EditTwoTone />
                    </Button>
                    <Button danger onClick={() => showDeleteConfirm(record)}>
                        <DeleteTwoTone />
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" icon={<PlusOutlined />} className="add-new-btn" onClick={() => setIsModalOpen(true)}>
                Create New
            </Button>{' '}
            <Upload
                beforeUpload={(file) => {
                    handleFileUpload(file);
                    return false;
                }}
                showUploadList={false}
            >
                <Button icon={<UploadOutlined />}>Bulk Upload</Button>
            </Upload>
            {isModalOpen && (
                <PlantTypeModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    plantType={selectedType}
                    onSuccess={fetchPlantTypes}
                />
            )}
            <Table columns={columns} dataSource={plantTypesData} pagination={false} rowKey="id" />
        </div>
    );
};

export default PlantTypes;
