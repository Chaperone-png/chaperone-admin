import { Button, Select, Space, Table, Modal } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { maaliApi } from '../../services/apis/maaliApi';
import { DeleteOutlined } from '@ant-design/icons';
import ActionModal from '../common/ActionModal';
import { useLoader } from '../../context/LoaderContext';

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
    setReload: (value: boolean) => void;
}> = ({ data, onShowDetails, onEdit, onDelete, pagination, loading, setReload }) => {
    const navigate = useNavigate();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState<{ id: string; status: string, type: string }>({ id: '', status: '', type: '' });
    const [description, setDescription] = useState('');
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);  // New state for delete confirmation modal
    const [deleteRecord, setDeleteRecord] = useState<any>(null);  // State to hold the record to be deleted

    const { startLoader, stopLoader } = useLoader();
    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            const payload: any = {
                status,
            };
            if (status === 'rejected') {
                payload.rejectionReason = description;
            } else if (status === 'pending') {
                payload.pendingDetails = description;
            }
            await maaliApi.updateMaaliStatus(id, payload);
        } catch (e) {
            console.error("Error updating status:", e);
        }
    };

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

    // Handle delete action
    const handleDelete = async () => {
        if (deleteRecord) {
            try {
                startLoader();
                await maaliApi.deleteMaali(deleteRecord._id);  // Call the API to delete the record
                onDelete(deleteRecord);
                window.location.reload();
            } catch (e) {
                console.error("Error deleting maali:", e);
            }
            finally {
                stopLoader();
                setReload(true);

            }
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModalVisible(false);
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
                return <>{(record.workPincodes)?.join(',')}</>;
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
                    <Button
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            setDeleteRecord(record);
                            setDeleteModalVisible(true);  // Show confirmation modal for deletion
                        }}
                        danger
                    >
                        Delete
                    </Button>
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
                title={modalData.type === 'rejected' ? 'Reject Maali Application' : 'Request Changes'}
            />

            {/* Delete Confirmation Modal */}
            <Modal
                title="Confirm Deletion"
                visible={deleteModalVisible}
                onOk={handleDelete}
                onCancel={handleDeleteCancel}
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
            >
                <p>Are you sure you want to delete this maali?</p>
            </Modal>
        </>
    );
};

export default MaaliTable;
