import React from 'react';
import { Button, Modal } from 'antd';

const NurseryDetailsModal = ({ visible, nursery, onClose }:any) => (
    <Modal
        title="Nursery Details"
        open={visible}
        onCancel={onClose}
        footer={[
            <Button key="close" onClick={onClose}>
                Close
            </Button>,
        ]}
        destroyOnClose
    >
        {nursery && (
            <div>
                <p><strong>Name:</strong> {nursery.name}</p>
                <p><strong>address:</strong> {`${nursery.address.addressLine}, ${nursery.address.city?.name}, ${nursery.address.state?.name} - ${nursery.address.pincode}`}</p>
                <p><strong>Contact Person:</strong> {nursery.contactPerson.name}</p>
                <p><strong>Contact Number:</strong> {nursery.contactPerson.phone}</p>
                <p><strong>Email:</strong> {nursery.contactPerson.email}</p>
            </div>
        )}
    </Modal>
);

export default NurseryDetailsModal;
