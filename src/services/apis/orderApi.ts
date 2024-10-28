import { orderAxiosInstance } from "../axiosInstance";

const getAllOrders = () => {
  return orderAxiosInstance.get("/get-all-orders/");
};

const updatePaymentStatus = (
  orderId: string,
  itemId: string,
  status: string
) => {
  return orderAxiosInstance.put(
    `/update-delivery-status?orderId=${orderId}&itemId=${itemId}&status=${status}`
  );
};

const getAllOrdersCount = (selectedDateRange: any) => {
  return orderAxiosInstance.get("/get-orders-count", {
    params:{
      selectedDateRange
    }
  });
}
export const orderApi = { getAllOrders, updatePaymentStatus, getAllOrdersCount };
