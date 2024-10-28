import { PlusOutlined } from '@ant-design/icons';
import { Button, Space, Table, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { plantApi } from '../../../services/apis/plantApi';
import PlantCareTipModal from './PlantCareTipModal';

const PlantCareTips = () => {
    const [plantCareTipsData, setPlantCareTips] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCareTip, setSelectedCareTip] = useState(null);

    useEffect(() => {
        fetchPlantCareTips();
    }, []);

    const fetchPlantCareTips = async () => {
        try {
            const response = await plantApi.getPlantCareTips();
            if (response.data && Array.isArray(response.data)) {
                setPlantCareTips(response.data || []);
            } else {
                setPlantCareTips([]);
            }
        } catch (error) {
            console.error('Error fetching plant care tips:', error);
        }
    };

    const handleEdit = (record: any) => {
        setSelectedCareTip(record);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedCareTip(null);
        fetchPlantCareTips();
    };

    const columns = [
        {
            title: 'Plant Care Tip Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (description: string) => description || '-'
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
                    <Button onClick={() => handleEdit(record)}>Edit</Button>
                    {/* <Button onClick={() => handleDelete(record)}>Delete</Button> */}
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Table columns={columns} dataSource={plantCareTipsData} pagination={false} />
            <Button type="primary" icon={<PlusOutlined />} className="add-new-btn" onClick={() => setIsModalOpen(true)}>
                Create New
            </Button>
            {isModalOpen && <PlantCareTipModal isOpen={isModalOpen} onClose={handleModalClose} plantCareTip={selectedCareTip} onSuccess={fetchPlantCareTips} />}
        </div>
    );
};

export default PlantCareTips;
