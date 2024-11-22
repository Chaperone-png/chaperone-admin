import React, { useState } from 'react';
import { Button, Space, Table, Tag, Modal } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Nursery } from '../types';
import NurseryTableSkeleton from './skeleton/NurseryTableSkeleton';
import { nurseryApi } from '../services/apis/nurseries';
import { useLoader } from '../context/LoaderContext';
const NurseryTable = ({
    data,
    onShowDetails,
    onEdit,
    onDelete,
    pagination,
    loading,
}: any) => {
    const navigate = useNavigate();
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);  // State to handle the delete confirmation modal
    const [deleteRecord, setDeleteRecord] = useState<any>(null);  // Store the record to be deleted
    const { startLoader, stopLoader } = useLoader();  // Loader context to manage loader state

    // Handle the delete operation
    const handleDelete = async () => {
        if (deleteRecord) {
            try {
                startLoader(); // Start loading
                await nurseryApi.deleteNursery(deleteRecord._id);  // Assuming your API has a delete function
                onDelete(deleteRecord);  // Call the onDelete prop passed from the parent
                window.location.reload();
            } catch (e) {
                console.error('Error deleting nursery:', e);
            } finally {
                stopLoader(); // Stop loading
            }
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModalVisible(false);  // Close modal if the user cancels
    };

    // Handle row click event for navigating to the details page
    const handleRowClick = (event: React.MouseEvent, record: Nursery) => {
        const target = event.target as HTMLElement;
        if (target.closest('.ant-btn')) {
            return;
        }
        // Navigate to details page when row is clicked
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
                `${location.city?.name}, ${location.state?.name}, ${location.pincode}`,
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
                    <Button
                        type="default"
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            setDeleteRecord(record);  // Set the record to be deleted
                            setDeleteModalVisible(true);  // Show the confirmation modal
                        }}
                        danger
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return loading ? (
        <NurseryTableSkeleton /> // Show skeleton loader if loading is true
    ) : (
        <>
            <Table
                columns={columns}
                dataSource={data}
                pagination={pagination}
                className="nursery-table"
                onRow={(record) => ({
                    onClick: (e) => handleRowClick(e, record),
                })}
                rowKey="id"
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
                <p>Are you sure you want to delete this nursery?</p>
            </Modal>
        </>
    );
};

export default NurseryTable;
