import React from 'react';
import { Modal, Input } from 'antd';

interface ActionModalProps {
    isOpen: boolean;
    title: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onOk: () => void;
    onCancel: () => void;
}

const ActionModal: React.FC<ActionModalProps> = ({ isOpen, title, placeholder, value, onChange, onOk, onCancel }) => {
    return (
        <Modal
            title={title}
            open={isOpen}
            onOk={onOk}
            onCancel={onCancel}
        >
            <Input.TextArea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={4}
            />
        </Modal>
    );
};

export default ActionModal;
