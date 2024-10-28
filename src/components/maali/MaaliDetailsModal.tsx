import React from 'react';
import { Modal, Descriptions } from 'antd';

const MaaliDetailsModal: React.FC<{
    visible: boolean;
    maali: any;
    onClose: () => void;
}> = ({ visible, maali, onClose }) => {
    if (!maali) return null;
    console.log(maali, 'Maali')
    return (
        <Modal
            open={visible}
            title="Maali Details"
            onCancel={onClose}
            footer={null}
        >
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Full Name">{`${maali.firstName} ${maali.middleName || ''} ${maali.lastName}`}</Descriptions.Item>
                <Descriptions.Item label="Date of Birth">{new Date(maali.dob).toLocaleDateString()}</Descriptions.Item>
                <Descriptions.Item label="Full Address">{maali.fullAddress}</Descriptions.Item>
                <Descriptions.Item label="City">{maali.city}</Descriptions.Item>
                <Descriptions.Item label="State">{maali.state}</Descriptions.Item>
                <Descriptions.Item label="Pincode">{maali.pincode}</Descriptions.Item>
                <Descriptions.Item label="Email">{maali.email}</Descriptions.Item>
                <Descriptions.Item label="Contact">{maali.mobileNumber}</Descriptions.Item>
                <Descriptions.Item label="Status">{maali.status}</Descriptions.Item>
                <Descriptions.Item label="Bank Name">{maali.bankDetails.bankName}</Descriptions.Item>
                <Descriptions.Item label="Account Number">{maali.bankDetails.accountNumber}</Descriptions.Item>
                <Descriptions.Item label="IFSC Code">{maali.bankDetails.ifscCode}</Descriptions.Item>
                <Descriptions.Item label="Aadhar Card">
                    <a href={maali.docInfo?.aadhar?.image} target="_blank" rel="noopener noreferrer">
                        View Aadhar Card
                    </a>
                </Descriptions.Item>
                <Descriptions.Item label="PAN Card">
                    <a href={maali.docInfo?.pan?.image} target="_blank" rel="noopener noreferrer">
                        View PAN Card
                    </a>
                </Descriptions.Item>
                <Descriptions.Item label="Driving License">
                    <a href={maali.docInfo?.drivingLicense?.image} target="_blank" rel="noopener noreferrer">
                        View Driving License
                    </a>
                </Descriptions.Item>
                <Descriptions.Item label="Voter Id">
                    <a href={maali.docInfo?.voterId?.image} target="_blank" rel="noopener noreferrer">
                        Voter Id
                    </a>
                </Descriptions.Item>
                
                {/* Add more documents if needed */}
            </Descriptions>
        </Modal>
    );
};

export default MaaliDetailsModal;
