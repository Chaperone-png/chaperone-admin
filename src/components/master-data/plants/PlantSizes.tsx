import { EditTwoTone, PlusOutlined } from '@ant-design/icons';
import { Button, Space, Table, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { plantApi } from '../../../services/apis/plantApi';
import PlantSizeModal from './PlantSizeModal';

const PlantSizes = () => {
    const [plantSizesData, setPlantSizes] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSize, setSelectedSize] = useState(null);

    useEffect(() => {
        fetchPlantSizes();
    }, []);

    const fetchPlantSizes = async () => {
        try {
            const response = await plantApi.getPlantSizes();
            if (response.data && Array.isArray(response.data)) {
                console.log(response)
                setPlantSizes(response?.data || []);
            } else {
                setPlantSizes([]);

            }
        } catch (error) {
            console.error('Error fetching plant sizes:', error);
        }
    };

    const handleEdit = (record: any) => {
        setSelectedSize(record);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedSize(null);
        fetchPlantSizes();
    };

    const columns = [
        {
            title: 'Plant Size',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'From (inches)',
            dataIndex: 'from',
            key: 'from',
        },
        {
            title: 'To (inches)',
            dataIndex: 'to',
            key: 'to',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (description: string) => <>{description || '-'}</>
        },
        {
            title: 'Last Updated',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (updatedAt: any) => {
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
            render: (status: any) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>{status}</Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text: any, record: any) => (
                <Space size="small">
                    <Button onClick={() => handleEdit(record)}><EditTwoTone /></Button>
                    {/* <Button onClick={() => handleDelete(record)}><DeleteOutlined /></Button> */}
                </Space>
            ),
        },
    ];

    return (
        <div>

            <Table columns={columns} dataSource={plantSizesData} pagination={false} />
            <Button type="primary" icon={<PlusOutlined />} className="add-new-btn" onClick={() => setIsModalOpen(true)}>
                Create New
            </Button>
            {isModalOpen && <PlantSizeModal isOpen={isModalOpen} onClose={handleModalClose} plantSize={selectedSize} onSuccess={fetchPlantSizes} />}
        </div>
    );
};

export default PlantSizes;
