import { PlusOutlined } from '@ant-design/icons';
import { Button, Space, Table, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { plantApi } from '../../../services/apis/plantApi';
import PlantBenefitsModal from './PlantBenefitsModal';

const PlantBenefits = () => {
    const [plantBenefitsData, setPlantBenefits] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBenefit, setSelectedBenefit] = useState(null);

    useEffect(() => {
        fetchPlantBenefits();
    }, []);

    const fetchPlantBenefits = async () => {
        try {
            const response = await plantApi.getPlantBenefits();
            if (response.data && Array.isArray(response.data)) {
                setPlantBenefits(response.data || []);
            } else {
                setPlantBenefits([]);
            }
        } catch (error) {
            console.error('Error fetching plant benefits:', error);
        }
    };

    const handleEdit = (record: any) => {
        setSelectedBenefit(record);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedBenefit(null);
        fetchPlantBenefits();
    };

    const columns = [
        {
            title: 'Plant Benefit Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (description:string)=> description || '-'
        },
        {
            title: 'Last Updated',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (updatedAt: any) => {
                return <>{moment(updatedAt).format('DD-MM-YYYY, hh:mm a')}</>
            }
        },
        // {
        //     title: 'Updated By',
        //     dataIndex: 'updatedBy',
        //     key: 'updatedBy',
        // },
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

            <Table columns={columns} dataSource={plantBenefitsData} pagination={false} />
            <Button type="primary" icon={<PlusOutlined />} className="add-new-btn" onClick={() => setIsModalOpen(true)}>
                Create New
            </Button>
            {isModalOpen && <PlantBenefitsModal isOpen={isModalOpen} onClose={handleModalClose} plantBenefit={selectedBenefit} onSuccess={fetchPlantBenefits} />}
        </div>
    );
};

export default PlantBenefits;
