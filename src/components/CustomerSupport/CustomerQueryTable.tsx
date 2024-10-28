//default comment
import React, { useState } from 'react';
import { Table, Button, Modal, Input, Tag } from 'antd';
import { format } from 'date-fns';
import './CustomerQueryTable.scss'; // Import SCSS
import { toast } from 'react-toastify';
import { useLoader } from '../../context/LoaderContext';
import { helpSupportApi } from '../../services/apis/helpSupportApi';

interface Query {
    id: string;
    title: string;
    description: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    responses: any[];
    sender: {
        name: string;
        phone: string;
    };
}

interface CustomerQueryProps {
    queries: Query[];
    setReload: (value: boolean) => void;
}

const CustomerQueryTable: React.FC<CustomerQueryProps> = ({ queries, setReload }) => {
    const [selectedQuery, setSelectedQuery] = useState<Query>({} as Query);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        to: '',
        from: 'support@example.com',
        subject: '',
        content: '',
    });
    const { startLoader, stopLoader } = useLoader();

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            render: (_: any, __: any, index: number) => index + 1,
            width: '5%',
        },
        {
            title: 'Title',
            dataIndex: 'title',
            render: (title: string, query: Query) => (
                <div>
                    <span className="query-title" style={{ color: 'red', fontWeight: 'bold' }}>{title}</span>
                </div>
            ),
            width: '20%',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            width: '20%',
        },
        {
            title: 'User',
            dataIndex: 'sender',
            render: (sender: { name: string, phone: any }) => {
                return (
                    <div>
                        <span>{sender.name}</span>
                        <Button type="link" onClick={() => handleWhatsAppChat(sender.phone)}>
                            Chat Us
                        </Button>
                    </div>
                );
            },
            width: '15%',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: '15%',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            render: (date: string) => format(new Date(date), 'dd/MM/yyyy hh:mm a'),
            width: '10%',
        },
        {
            title: 'Actions',
            dataIndex: 'id',
            render: (_: any, query: Query) => (
                query.responses.length > 0 ? <Tag color="green">Already Responded</Tag> : <Button type="primary" onClick={() => handleRespond(query)}>
                    Respond
                </Button>
            ),
            width: '10%',
        },
    ];

    const handleWhatsAppChat = (phone: string) => {
        const whatsappLink = `https://wa.me/${phone}?text=Hi!%20This%20is%20Support.%20How%20can%20we%20assist%20you%20today?`;
        window.open(whatsappLink, '_blank');
    };

    const handleRespond = (query: Query) => {
        setSelectedQuery(query);
        setFormData({
            ...formData,
            to: query.email,
            subject: `Re: ${query.title}`
        });
        setIsModalOpen(true);
    };

    const resetData = () => {
        setSelectedQuery({} as Query);
        setFormData({
            to: '',
            from: 'support@example.com',
            subject: '',
            content: '',
        });
        setIsModalOpen(false);
    }

    const handleSendEmail = async () => {
        try {
            if (!formData.to && !formData.from && !formData.subject && !formData.content) {
                toast.error('Please fill in all fields');
                return;
            }
            startLoader();
            const response = await helpSupportApi.addQueryRespond(selectedQuery?.id, formData);
            if (response?.data?.ok) {
                toast.success(response?.data?.message);
            } else {
                toast.error(response?.data?.message);
            }
        } catch (err) {
            console.log("got error while sending email", err);
            toast.error("Error while sending email");
        } finally {
            stopLoader();
            resetData();
            setReload(true);
        }
    };

    return (
        <div className="orders-container">
            <Table
                columns={columns}
                dataSource={queries}
                rowKey="id"
                pagination={false}
                scroll={{ y: 600 }}
            />

            <Modal
                title="Respond to Query"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleSendEmail}
                okText="Send"
                cancelText="Cancel"
            >
                <div className="email-form">
                    <div className="form-item">
                        <label>To:</label>
                        <Input value={formData.to} onChange={(e) => setFormData({ ...formData, to: e.target.value })} />
                    </div>
                    <div className="form-item">
                        <label>From:</label>
                        <Input value={formData.from} onChange={(e) => setFormData({ ...formData, from: e.target.value })} />
                    </div>
                    <div className="form-item">
                        <label>Subject:</label>
                        <Input value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
                    </div>
                    <div className="form-item">
                        <label>Content:</label>
                        <Input.TextArea rows={4} value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default CustomerQueryTable;
