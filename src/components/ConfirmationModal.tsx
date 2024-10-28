// src/components/ConfirmationModal.tsx
import React from 'react';
import { Modal, Button } from 'antd';

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      title={title}
      open={visible}
      destroyOnClose
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {cancelText}
        </Button>,
        <Button key="confirm" type="primary" onClick={onConfirm}>
          {confirmText}
        </Button>,
      ]}
    >
      <p>{description}</p>
    </Modal>
  );
};

export default ConfirmationModal;
