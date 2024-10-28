import { EditTwoTone, EyeTwoTone, PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Select, Space, Table, Tag, message } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { potPlanterApi } from '../../../services/apis/potPlanterApi';
import { AdminPlantTye } from '../../../types';
import CreatePotPlanterModal from './CreatePotPlanterModal';
import PotPlanterDetail from './PotPlanterDetail';
import PotPlanterShapeModal from './PotPlanterShapeModal';
const { Option } = Select
const PotPlanterShape = () => {
    const [allPlants, setAllPlants] = useState<AdminPlantTye[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false); // State for view modal
    const [selectedType, setSelectedType] = useState<AdminPlantTye | null>(null);
    const [selectedPlant, setSelectedPlant] = useState<AdminPlantTye | null>(null); // State for selected plant

    useEffect(() => {
        fetchShapes();
    }, []);

    const fetchShapes = async () => {
        try {
            const response = await potPlanterApi.getPotPlanterShapes();
            if (response?.data && Array.isArray(response.data)) {
                setAllPlants(response.data);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error fetching plant types:', error);
        }
    };

    const handleEdit = (record: AdminPlantTye) => {
        setSelectedType(record);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedType(null);
        fetchShapes();
    };

    const handleView = (record: AdminPlantTye) => {
        setSelectedPlant(record);
        setIsViewModalOpen(true);
    };

    const handleViewModalClose = () => {
        setIsViewModalOpen(false);
        setSelectedPlant(null);
    };
    const handleStatusChange = async (value: string, record: AdminPlantTye) => {
        try {
            await potPlanterApi.updatePotPlanterShape(record._id, { status: value });
            fetchShapes(); // Refresh the table data after update
            message.success('Plant status updated!')
        } catch (error) {
            console.error('Error updating plant status:', error);
        }
    };
    const columns = [
        {
            title: 'Shape',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt: any) => (
                <>{moment(createdAt).format('DD-MM-YYYY, hh:mm a')}</>
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
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: any, record: AdminPlantTye) => (
                <Select
                    defaultValue={status}
                    style={{ width: 120 }}
                    onChange={(value) => handleStatusChange(value, record)}
                >
                    <Option value="active">Active</Option>
                    <Option value="inactive">Inactive</Option>
                </Select>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text: any, record: AdminPlantTye) => (
                <Space size="small">
                    <Button onClick={() => handleEdit(record)}>
                        <EditTwoTone />
                    </Button>
                    {/* <Button onClick={() => handleDelete(record)}><DeleteOutlined /></Button> */}
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Table columns={columns} dataSource={allPlants} pagination={false} />
            <Button
                type="primary"
                icon={<PlusOutlined />}
                className="add-new-btn"
                onClick={() => setIsModalOpen(true)}
            >
                Create New
            </Button>
            {isModalOpen && (
                <PotPlanterShapeModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    plantType={selectedType}
                    onSuccess={fetchShapes}
                    plantDetails={selectedType}
                />
            )}
        </div>
    );
};

export default PotPlanterShape;
