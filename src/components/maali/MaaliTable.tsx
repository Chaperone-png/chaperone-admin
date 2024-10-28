import { Button, Select, Space, Table } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { maaliApi } from '../../services/apis/maaliApi';
import ActionModal from '../common/ActionModal';

const { Option } = Select;

const MaaliTable: React.FC<{
    data: any[];
    onShowDetails: (maali: any) => void;
    onEdit: (maali: any) => void;
    onDelete: (maali: any) => void;
    pagination: {
        current: number;
        pageSize: number;
        total: number;
        onChange: (page: number, pageSize?: number) => void;
    };
    loading: boolean;
}> = ({ data, onShowDetails, onEdit, onDelete, pagination, loading }) => {
    const navigate = useNavigate()
    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState<{ id: string; status: string, type: string }>({ id: '', status: '', type: '' });
    const [description, setDescription] = useState('');
    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            const payload: any = {
                status,
            };
            if (status === 'rejected') {
                payload.rejectionReason = description
            } else if (status === 'pending') {
                payload.pendingDetails = description
            }
            await maaliApi.updateMaaliStatus(id, payload)
        } catch (e) {

        }
    }
    const handleStatusChange = (id: string, value: string) => {
        if (value === 'rejected' || value === 'pending') {
            setModalData({ id, status: value, type: value });
            setModalVisible(true);
        } else {
            handleUpdateStatus(id, value);
        }
    };
    const handleModalOk = () => {
        handleUpdateStatus(modalData.id, modalData.status);
        setModalVisible(false);
        setDescription('');
    };

    const handleModalCancel = () => {
        setModalVisible(false);
        setDescription('');
    };



    const columns = [
        {
            title: 'Name',
            dataIndex: 'firstName',
            key: 'name',
            render: (text: any, record: any) => `${record.firstName} ${record.middleName || ''} ${record.lastName}`,
        },
        {
            title: 'State',
            key: 'state',
            render: (text: any, record: any) => `${record.state?.name}`,
        },
        {
            title: 'City',
            key: 'city',
            render: (text: any, record: any) => `${record.city?.name}`,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Contact',
            dataIndex: 'mobileNumber',
            key: 'mobileNumber',
        },
        {
            title: 'Work Locations',
            dataIndex: 'workPincodes',
            render: (text: any, record: any) => {
                return <>
                    {(record.workPincodes)?.join(',')}</>
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (text: any, record: any) => (
                <Select
                    defaultValue={record.applicationStatus?.status}
                    onChange={(value) => handleStatusChange(record._id, value)}
                    style={{ width: 120 }}
                >
                    <Option value="in_review">In Review</Option>
                    <Option value="pending">Request Change</Option>
                    <Option value="rejected">Rejected</Option>
                    <Option value="approved">Approved</Option>
                    {/* <Option value="rejected_by_maali">Rejected by Maali</Option> */}
                </Select>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text: any, record: any) => (
                <Space size="middle">
                    <Button onClick={() => onShowDetails(record)}>View</Button>
                    <Button onClick={() => navigate(`/maalis/edit/${record._id}`)}>Edit</Button>
                </Space>
            ),
        },
        {
            title: 'Total Bookings',
            dataIndex: 'firstName',
            key: 'name',
            render: (text: any, record: any) => `${record.firstName} ${record.middleName || ''} ${record.lastName}`,
        },
    ];

    return (
        <>
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                pagination={pagination}
                loading={loading}
            />
            <ActionModal
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                onChange={(e) => { setDescription(e?.target?.value) }}
                value={description}
                placeholder='Enter more details'
                isOpen={modalVisible}
                title={modalData.type === 'rejected' ? 'Reject Maali Application' : 'Request Changes'} />
        </>
    );
};

export default MaaliTable;
