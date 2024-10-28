import React from "react";
import { Modal, Tag } from "antd";
import "./OrderDetailsModal.scss";
import { orderStatusTypesData } from "../../../utils/constants";

interface OrderDetailsModalProps {
  order: any;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const { orderId, items, user, orderDate, totalAmount, deliveryStatus, deliveryPartner } = order;

  const renderStatusChip = (deliveryStatus: keyof typeof orderStatusTypesData) => {
    const data = orderStatusTypesData[deliveryStatus];
    const color = data?.color;
    return <Tag color={color}>{data?.title}</Tag>;
  };

  return (
    <Modal
      title="Order Details"
      visible={true}
      onCancel={onClose}
      footer={null}
      className="order-details-modal"
    >
      <div className="modal-content">
        <h3>Order ID: {orderId}</h3>
        <p><strong>Date & Time:</strong> {new Date(orderDate).toLocaleString()}</p>
        <p><strong>Total Amount:</strong> ₹{totalAmount.toFixed(2)}</p>
        <p><strong>Status:</strong> {renderStatusChip(deliveryStatus)}</p>

        <div className="user-details">
          <h4>User Details:</h4>
          <p><strong>Name:</strong> {user?.username}</p>
          <p><strong>Contact:</strong> {user?.contactNumber}</p>
          <p><strong>Address:</strong> {user?.address?.street}, {user?.address?.city}, {user?.address?.state}</p>
        </div>

        <div className="order-items">
          <h4>Items:</h4>
          {items.map((item: any) => (
            <div key={item.id} className="item-details">
              <img src={item.imageUrl} alt={item.plantName} className="item-image" />
              <div className="item-info">
                <p><strong>Name:</strong> {item.plantName}</p>
                <p><strong>Available Size:</strong> {item.availableType}</p>
                <p><strong>Pot Type:</strong> {item.potType}</p>
                <p><strong>Color:</strong> {item.color}</p>
                <p>
                  <strong>Price:</strong> ₹
                  {item.offerAmount > 0 ? (
                    <>
                      <span className="original-price">₹{item.originalPrice.toFixed(2)}</span>
                      <span className="discounted-price">₹{item.price.toFixed(2)}</span>
                      <span className="offer-percentage">({item.offerAmount}% off)</span>
                    </>
                  ) : (
                    item.price.toFixed(2)
                  )}
                </p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p><strong>Total Price:</strong> ₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="delivery-partner">
          <h4>Delivery Partner:</h4>
          <p><strong>Name:</strong> {deliveryPartner?.name}</p>
          <p><strong>Contact:</strong> {deliveryPartner?.contactNumber}</p>
          <p><strong>Company:</strong> {deliveryPartner?.company}</p>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailsModal;
