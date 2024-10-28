import React from "react";
import Orders from "../components/orders/Order";
import { useParams } from "react-router-dom";
const OrderPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  return (
    <Orders type={type}/>
  );
};

export default OrderPage;
