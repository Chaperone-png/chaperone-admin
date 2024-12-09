import React from "react";
import { Modal, Select } from "antd";

const { Option } = Select;

interface UpdateStatusModalProps {
  visible: boolean; // Whether the modal is visible
  currentStatus: string; // Current status to be pre-selected
  onStatusChange: (status: string) => void; // Handler for selecting a new status
  onCancel: () => void; // Handler for canceling the modal
  onSubmit: () => void; // Handler for submitting the selected status
}

const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({
  visible,
  currentStatus,
  onStatusChange,
  onCancel,
  onSubmit,
}) => {
  return (
    <Modal
      title="Update Status"
      visible={visible}
      onOk={onSubmit}
      onCancel={onCancel}
      okText="Update"
      cancelText="Cancel"
    >
      <p>Select a new status for the nursery:</p>
      <Select
        value={currentStatus}
        onChange={onStatusChange}
        style={{ width: "100%" }}
      >
        <Option value="active">Active</Option>
        <Option value="inactive">Inactive</Option>
      </Select>
    </Modal>
  );
};

export default UpdateStatusModal;
