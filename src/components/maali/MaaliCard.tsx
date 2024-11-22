import React from 'react';
import { Card, Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const MaaliCard: React.FC<{
    maali: any;
    onShowDetails: (maali: any) => void;
    onEdit: (maali: any) => void;
    onDelete: (maali: any) => void;
}> = ({ maali, onShowDetails, onEdit, onDelete }) => {
    console.log({maali})
    return (
        <Card
            title={`${maali.firstName} ${maali.middleName || ''} ${maali.lastName}`}
            extra={
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => onEdit(maali)}>Edit</Button>
                    <Button icon={<DeleteOutlined />} onClick={() => onDelete(maali)} danger>Delete</Button>
                </Space>
            }
        >
            <p>Date of Birth: {new Date(maali.dob).toLocaleDateString()}</p>
            <p>Address: {maali.fullAddress}, {maali.city?.name}, {maali.state?.name}, {maali.pincode}</p>
            <p>Email: {maali.email}</p>
            <p>Contact: {maali.mobileNumber}</p>
            <p>Status: {maali.applicationStatus.status}</p>
        </Card>
    );
};

export default MaaliCard;
