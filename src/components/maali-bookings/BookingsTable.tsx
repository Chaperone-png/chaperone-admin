import React, { useState } from 'react';
import { Table, Button, Space, Tag, Tabs } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import AssignMaaliModal from './AssignMaaliModal';
import ViewMaaliBooking from './ViewMaaliBooking';
import { MaaliBookingPlanTypesData, orderTabTypes } from '../../utils/constants';

interface Booking {
    id: string;
    _id: string;
    userId: string;
    planType: string;
    startTime: Date;
    endTime?: Date;
    status: string;
    subtotal: number;
    gst: number;
    total: number;
    addressId: string;
    orderId: string;
    paymentId: string;
}

interface BookingTableProps {
    data: Booking[];
    onShowDetails: (booking: Booking) => void;
    onEdit: (booking: Booking) => void;
    onDelete: (booking: Booking) => void;
    pagination: {
        current: number;
        pageSize: number;
        total: number;
        onChange: (page: number, pageSize?: number) => void;
    };
    loading: boolean;
    setCurrentTab: (value: string) => void;
    currentTab: string;
}

const BookingTable: React.FC<BookingTableProps> = ({ data, onShowDetails, onEdit, onDelete, pagination, loading, setCurrentTab, currentTab }) => {
    const [assignMaali, setAssignMaali] = useState(false);
    const [viewMaaliId, setViewMaaliId] = useState('');

    const columns = [
        {
            title: 'Customer Name',
            key: 'customerName',
            render: (text: Date, record: any) => <span>{record.userId?.name}</span>,
        },
        {
            title: 'Contact',
            key: 'contact',
            render: (text: Date, record: any) => <span>{record.addressId?.mobileNumber}</span>,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: Date) => moment(text).format('DD-MM-YYYY'),
        },
        {
            title: 'Booking Date',
            dataIndex: 'bookingDate',
            key: 'date',
            render: (text: Date, record: any) => moment(record.date).format('DD-MM-YYYY'),
        },
        {
            title: 'Plan Type',
            dataIndex: 'planType',
            key: 'planType',
        },
        {
            title: 'Hours',
            key: 'hours',
            render: (text: any, record: any) => <span>{record.bookingDetails[record.planType]?.hours}</span>,
        },
        {
            title: 'No. of Days',
            key: 'no_of_days',
            render: (text: any, record: any) => <span>{record.bookingDetails[record.planType]?.no_of_days || '-'}</span>,
        },
        {
            title: 'No. of Months',
            key: 'no_of_months',
            render: (text: any, record: any) => <span>{record.bookingDetails[record.planType]?.no_of_months || '-'}</span>,
        },
        {
            title: 'Pincode',
            key: 'customerAddress',
            render: (text: Date, record: any) => {
                const { pincode, isDefaultAddress } = record.addressId || {};
                return (
                    <span>
                        {pincode}
                        {isDefaultAddress && <strong> (Default Address)</strong>}
                    </span>
                );
            },
        },
        {
            title: 'Maali Name',
            key: 'maaliName',
            render: (text: Date, record: any) => (
                <>
                    {record?.maaliId ? (
                        <span>{record.maaliId?.firstName} {record.maaliId?.lastName}</span>
                    ) : (
                        <span className='error'>Not Allocated</span>
                    )}
                </>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color;
                switch (status) {
                    case 'pending':
                        color = 'orange';
                        break;
                    case 'completed':
                        color = 'green';
                        break;
                    case 'in_progress':
                        color = 'blue';
                        break;
                    case 'cancelled_by_customer':
                        color = 'red';
                        break;
                    case 'rejected_by_admin':
                        color = 'volcano';
                        break;
                    case 'rejected_by_maali':
                        color = 'purple';
                        break;
                    default:
                        color = 'default';
                        break;
                }
                return <Tag color={color}>{status.replace(/_/g, ' ').toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Payment Status',
            key: 'paymentStatus',
            render: (_: any, record: Booking) => {
                let paymentStatus = record?.orderId && record?.paymentId ? 'Paid' : 'Unpaid';
                let color = paymentStatus === 'Paid' ? 'green' : 'orange';
                return <Tag color={color}>{paymentStatus}</Tag>;
            },
        },
        {
            title: 'Total (Rs.)',
            dataIndex: 'total',
            key: 'total',
            render: (text: number, record: Booking) => {
                const gstValue = record.subtotal * 0.18;
                const total = record.subtotal + gstValue; // Calculate total as subtotal + GST
                return `${Math.round(total)}`;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text: any, record: any) => (
                <Space size="middle">
                    <Button onClick={() => setAssignMaali(record)}>
                        {record.maaliId ? 'Change Maali' : 'Assign Maali'}
                    </Button>
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => setViewMaaliId(record._id)}
                    >
                        View
                    </Button>
                </Space>
            ),
        },
    ];
    const onTabChange = (key: string) => {
        setCurrentTab(key);
    };

    return (
        <>
            <Tabs activeKey={currentTab} onChange={onTabChange}>
                {MaaliBookingPlanTypesData?.map((tab: any, index: number) => {
                    return <Tabs.TabPane
                        id={tab.value}
                        tab={<span className="tab-completed">{tab.title}</span>}
                        key={tab.value}
                    />
                })}
            </Tabs>

            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                pagination={pagination}
                loading={loading}
            />
            {assignMaali && (
                <AssignMaaliModal
                    isOpen={!!assignMaali}
                    bookingDetails={assignMaali}
                    onCancel={() => setAssignMaali(false)}
                />
            )}
            {/* Render ViewMaaliBooking outside of the columns */}
            {viewMaaliId && (
                <ViewMaaliBooking
                    isOpen={!!viewMaaliId}
                    bookingDetails={data.find((booking) => booking?._id === viewMaaliId)}
                    onCancel={() => setViewMaaliId('')}
                />
            )}
        </>
    );
};

export default BookingTable;
