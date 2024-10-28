import { EditTwoTone, PlusOutlined } from '@ant-design/icons';
import { Button, Space, Table, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { potPlanterApi } from '../../../services/apis/potPlanterApi';
import PlantTypeModal from './PotPlanterTypeModal';

const PotsPlanterTypes = () => {
    const [plantTypesData, setPlantTypes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState(null);

    useEffect(() => {
        fetchPlantTypes();
    }, []);

    const fetchPlantTypes = async () => {
        try {
            const response = await potPlanterApi.getPotPlanterTypes();
            setPlantTypes(response.data);
        } catch (error) {
            console.error('Error fetching plant types:', error);
        }
    };

    const handleEdit = (record: any) => {
        setSelectedType(record);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedType(null);
        fetchPlantTypes();
    };

    const columns = [
        {
            title: 'Plant Type',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
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
            <Table columns={columns} dataSource={plantTypesData} pagination={false} />
            <Button type="primary" icon={<PlusOutlined />} className="add-new-btn" onClick={() => setIsModalOpen(true)}>
                Create New
            </Button>
            {isModalOpen && <PlantTypeModal isOpen={isModalOpen} onClose={handleModalClose} plantType={selectedType} onSuccess={fetchPlantTypes} />}
        </div>
    );
}

export default PotsPlanterTypes;
