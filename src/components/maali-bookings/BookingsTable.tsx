import React, { useState } from 'react';
import { Table, Button, Space, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import AssignMaaliModal from './AssignMaaliModal';

interface Booking {
    id: string;
    userId: string;
    planType: string;
    startTime: Date;
    endTime?: Date;
    status: string;
    subtotal: number;
    gst: number;
    total: number;
    addressId: string;
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
}

const BookingTable: React.FC<BookingTableProps> = ({ data, onShowDetails, onEdit, onDelete, pagination, loading }) => {
    const [assignMaali, setAssignMaali] = useState(false);
    const columns = [
        // {
        //     title: 'User ID',
        //     key: 'userId',
        //     render: (text: Date, record:any) => <span>{record.userId?._id}</span>,
        // },
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
                const {
                    state,
                    city,
                    pincode,
                    mobileNumber,
                    houseNo,
                    area,
                    landmark,
                    default: isDefaultAddress
                } = record.addressId;

                const addressParts = [
                    houseNo,
                    area,
                    landmark,
                    city,
                    state,
                    pincode
                ].filter(Boolean); // Filter out any empty or undefined values

                return (
                    <span>
                        {/* {addressParts.join(', ')} */}
                        {pincode}
                        {isDefaultAddress && <strong> (Default Address)</strong>}
                    </span>
                );
            },
        },
        {
            title: 'Maali Name',
            key: 'maaliName',
            render: (text: Date, record: any) => <>
                {record?.maaliId ? <span>{record.maaliId?.firstName} {record.maaliId?.lastName}</span> : <span className='error'>Not Allocated</span>}
            </>,
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
            title: 'Total (Rs.)',
            dataIndex: 'total',
            key: 'total',
            render: (text: number) => `${text.toFixed(2)}`,
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
                        onClick={() => window.location.href = `/booking/${record.id}`}
                    >
                        View
                    </Button>
                </Space>
            ),
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
            {assignMaali && <AssignMaaliModal isOpen={!!assignMaali} bookingDetails={assignMaali} onCancel={() => {
                setAssignMaali(false)
            }} />}
        </>
    );
};

export default BookingTable;
