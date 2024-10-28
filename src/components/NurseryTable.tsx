import React from 'react';
import { Button, Space, Table, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Nursery } from '../types';
import NurseryTableSkeleton from './skeleton/NurseryTableSkeleton'; // Import the skeleton component

const NurseryTable = ({
    data,
    onShowDetails,
    onEdit,
    onDelete,
    onApprove,
    onReject,
    pagination,
    loading,
}: any) => {
    const navigate = useNavigate();

    const handleRowClick = (event: React.MouseEvent, record: Nursery) => {
        // Prevent row click if clicking on an action button
        const target = event.target as HTMLElement;
        if (target.closest('.ant-btn')) {
            return;
        }
        // Handle row click event
        console.log('Clicked row:', record);
        // Example: Navigate to details page
        navigate(`/nurseries/${record._id}`);
    };

    const columns = [
        {
            title: 'Nursery Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Location',
            dataIndex: 'address',
            key: 'address',
            render: (location: { city: any; state: any; pincode: string; addressLine: string }) =>
                `${location.city?.name},${location.state?.name}`,
        },
        {
            title: 'Contact Person',
            dataIndex: 'contactPerson',
            key: 'contactPerson',
            render: (contactPerson: any) => `${contactPerson.name}`,
        },
        {
            title: 'Contact Number',
            dataIndex: 'contactPerson',
            key: 'phone',
            render: (contactPerson: any) => `${contactPerson.phone}`,
        },
        {
            title: 'Email',
            dataIndex: 'contactPerson',
            key: 'email',
            render: (contactPerson: any) => `${contactPerson.email}`,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'active' ? 'green' : status === 'inactive' ? 'red' : 'gold'}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text: any, record: any) => (
                <Space size="small">
                    <Button type="default" onClick={() => onShowDetails(record)}>
                        <EyeOutlined />
                    </Button>
                    <Button type="default" onClick={() => onEdit(record)}>
                        <EditOutlined />
                    </Button>
                    {/* <Button type="default" onClick={() => onDelete(record)}>
                        <DeleteOutlined type="danger" />
                    </Button> */}
                </Space>
            ),
        },
    ];

    return loading ? <NurseryTableSkeleton /> : ( // Render skeleton component when loading is true
        <Table
            columns={columns}
            dataSource={data}
            pagination={pagination}
            className="nursery-table"
            onRow={(record) => ({
                onClick: (e) => handleRowClick(e, record),
            })}
        />
    );
};

export default NurseryTable;
