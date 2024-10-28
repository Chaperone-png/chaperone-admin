import React, { useEffect, useState } from "react";
import { Modal, Select, Button } from "antd";
import "./Modal.scss";
import { OrderStatusKeys, orderStatusTypesData } from "../../../utils/constants";

const { Option } = Select;

interface EditStatusModalProps {
  order: any;
  onSave: (status: string, itemId: string) => void;
  onClose: () => void;
}

interface SelectedIdType {
  type: 'itemId' | 'orderId';
  value: string;
}

const EditStatusModal: React.FC<EditStatusModalProps> = ({
  order,
  onSave,
  onClose,
}) => {
  const [selectedItem, setSelectedItem] = useState<SelectedIdType | null>(null);
  const [selectiveStatus, setSelectiveStatus] = useState<string>('');

  useEffect(() => {
    setSelectiveStatus(order.deliveryStatus);
    setSelectedItem({
      type: 'orderId',
      value: order.orderId
    });
  }, [order]);

  useEffect(() => {
    if (selectedItem?.type === 'orderId') {
      setSelectiveStatus(order.deliveryStatus);
    } else {
      const newStatus = order.items?.filter((item: any) => item.id === selectedItem?.value);
      setSelectiveStatus(newStatus[0]?.currentStatus);
    }
  }, [selectedItem]);

  const onUpdateHandler = () => {
    if (selectedItem?.type === 'orderId') {
      onSave(selectiveStatus, '');
    } else {
      onSave(selectiveStatus, selectedItem?.value ?? '');
    }
  };

  return (
    <Modal
      title="Edit Order Status"
      visible={!!order}
      onCancel={onClose}
      footer={null}
      centered
      className="edit-status-modal"
    >
      {order && (
        <>
          <div className="radio-view">
            <Select
              value={selectedItem?.value}
              onChange={(value) => {
                const [type, id] = value.split(':');
                setSelectedItem({ type: type as 'itemId' | 'orderId', value: id });
              }}
              style={{ width: '100%', marginBottom: '1rem' }}
            >
              <Option value={`orderId:${order.orderId}`}>Order ID: {order.orderId}</Option>
              {order.items.map((item: any) => (
                <Option key={item.id} value={`itemId:${item.id}`}>
                  {item.plantName} (ID: {item.id})
                </Option>
              ))}
            </Select>
          </div>

          <Select
            value={selectiveStatus}
            style={{ width: "100%", marginBottom: '1rem' }}
            onChange={(value) => setSelectiveStatus(value)}
          >
            {Object.keys(orderStatusTypesData).map((key) => {
              const statusKey = key as OrderStatusKeys;
              return (
                <Option key={statusKey} value={statusKey}>
                  {orderStatusTypesData[statusKey].title}
                </Option>
              );
            })}
          </Select>

          <div className="modal-actions modal-Button-Group">
            <Button onClick={onClose} className="cancel-btn">
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={onUpdateHandler}
              className="save-btn"
              disabled={!selectedItem}
            >
              Save
            </Button>

          </div>
        </>
      )}
    </Modal>
  );
};

export default EditStatusModal;
