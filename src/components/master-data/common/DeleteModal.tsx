import React from "react";
import { Modal, ButtonProps } from "antd";

interface ConfirmDeletionModalProps {
  deleteModalVisible: boolean;
  handleDelete: () => void;
  handleDeleteCancel: () => void;
}

const ConfirmDeletionModal: React.FC<ConfirmDeletionModalProps> = ({
  deleteModalVisible,
  handleDelete,
  handleDeleteCancel,
}) => {
  return (
    <Modal
      title="Confirm Deletion"
      visible={deleteModalVisible}
      onOk={handleDelete}
      onCancel={handleDeleteCancel}
      okText="Delete"
      cancelText="Cancel"
      okButtonProps={{ danger: true }}
    >
      <p>Are you sure you want to delete ?</p>
    </Modal>
  );
};

export default ConfirmDeletionModal;
