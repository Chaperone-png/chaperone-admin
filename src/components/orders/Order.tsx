import React, { useState, useEffect } from "react";
import { Table, Button, Tag, Tabs } from "antd"; // Using Ant Design components
import { format } from "date-fns";
import OrderDetailsModal from "./component/OrderDetailsModal";
import EditStatusModal from "./component/EditStatusModal";
import "./Orders.scss";
import { orderApi } from "../../services/apis/orderApi";
import { toast } from "react-toastify";
import CustomPageHeader from "../PageHeader";
import { orderStatusTypesData, orderTabTypes, statusColorConstants } from "../../utils/constants";
import { useLoader } from "../../context/LoaderContext";
import { EditTwoTone } from "@ant-design/icons";

interface Props{
  type: any;
}
const Orders: React.FC <Props> = ({ type}) => {
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [selectiveOrders, setSelectiveOrders] = useState<any[]>([]);
  const [currentTab, setCurrentTab] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editStatusModalOpen, setEditStatusModalOpen] =
    useState<boolean>(false);
  const [orderStatus, setOrderStatus] = useState<string>("");

  const { startLoader, stopLoader } = useLoader();

  // Fetch all the placed orders
  const fetchAllOrders = async () => {
    try {
      startLoader();
      const allOrderResponse = await orderApi.getAllOrders();
      if (Array.isArray(allOrderResponse.data)) {
        setAllOrders(allOrderResponse.data);
      } else {
        setAllOrders([]);
      }
    } catch (err) {
      console.error("Error while loading all orders", err);
      setAllOrders([]); // Set an empty array in case of error
    }
    finally {
      stopLoader();
    }
  };

  useEffect(() => {
    fetchAllOrders();
    }, []);

    useEffect(() => {
    if(type)
      setCurrentTab(type);
    else
    setCurrentTab('all');
    },[type])


  useEffect(() => {
    let filteredOrders = [];

    if (currentTab === "all") {
      filteredOrders = allOrders;
    } else {
      filteredOrders = allOrders?.filter(
        (order) => String(order.deliveryStatus).toLowerCase() === currentTab
      );
    }

    // Ensure filteredOrders is an array before sorting
    filteredOrders =
      Array.isArray(filteredOrders) && filteredOrders.length > 0
        ? filteredOrders.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        : [];

    setSelectiveOrders(filteredOrders);
  }, [currentTab, allOrders]);

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      render: (_: any, __: any, index: number) => index + 1,
      width: "5%",
    },
    {
      title: "Order ID",
      dataIndex: "orderId",
      render: (orderId: string, record: any) => (
        <a href="#" onClick={() => handleViewDetails(record)}>
          {orderId}
        </a>
      ),
      width: "10%",
    },
    {
      title: "Items",
      dataIndex: "items",
      render: (items: any[]) => (
        <div className="scrollable-row">
          {items.map((item) => (
            <div key={item.id} className="item-row">
              <div>
                <img
                  src={item.imageUrl}
                  alt={item.plantName}
                  className="item-image"
                />
                <span>{item.plantName}</span>
              </div>
              {renderDeliveryStatusChip(item.currentStatus)}
            </div>
          ))}
        </div>
      ),
      width: "20%",
    },
    {
      title: "Address",
      dataIndex: "user",
      render: (user: any) => (
        <span>
          {user?.address?.mobileNumber} - {user?.address?.street}, {user?.address?.city}, {user?.address?.state}
        </span>
      ),
      width: "20%",
    },
    {
      title: "Date & Time",
      dataIndex: "orderDate",
      render: (date: string) => format(new Date(date), "dd/MM/yyyy hh:mm a"),
      width: "15%",
    },
    {
      title: "Price",
      dataIndex: "totalAmount",
      render: (amount: number) => `₹${amount.toFixed(2)}`,
      width: "10%",
    },
    {
      title: "Status",
      dataIndex: "paymentStatus",
      render: (status: string) => renderStatusChip(status),
      width: "10%",
    },
    {
      title: "DeliveryStatus",
      dataIndex: "deliveryStatus",
      render: (_: any, order: any) => (
        <div className="deliveryStatusAction">
          <span>{renderDeliveryStatusChip(order?.deliveryStatus)}</span>
          <Button className="editButton" onClick={() => handleEditStatus(order)}>
            <EditTwoTone />
          </Button>
        </div>
      ),
      width: "10%",
    },
  ];

  const handleRowClick = (record: any) => {
    setSelectedOrder(record);
    setOrderStatus(record.deliveryStatus);
  };

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleEditStatus = (order: any) => {
    setSelectedOrder(order);
    setOrderStatus(order.deliveryStatus);
    setEditStatusModalOpen(true);
  };

  const renderStatusChip = (paymentStatus: string) => {
    let color = statusColorConstants[paymentStatus];

    return (
      <Tag color={color}>
        {paymentStatus === "Completed" ? "Paid" : "Unpaid"}
      </Tag>
    );
  };
  const renderDeliveryStatusChip = (deliveryStatus: keyof typeof orderStatusTypesData) => {
    const data = orderStatusTypesData[deliveryStatus];
    const color = data?.color;

    return <Tag color={color}>{data?.title}</Tag>;
  };

  const handleSaveStatus = async (orderStatus: string, itemId: string) => {
    try {
      startLoader();
      const orderId = selectedOrder?.orderId;
      const { data } = await orderApi.updatePaymentStatus(
        orderId,
        itemId,
        orderStatus
      );
      if (data.ok === true) {
        let updateData = [...allOrders];
        allOrders?.map((order, index) => {
          if (order.orderId === orderId) {
            updateData[index].deliveryStatus = orderStatus;
          }
          setAllOrders(updateData);
        });
        setEditStatusModalOpen(false);
        toast.success("Delivery Status Updated Successfully.");
        window.location.reload();
      }
    } catch (err) {
      toast.error(
        "got error while udpating the delivery status please try again."
      );
      console.log("got error while udpating the delivery status", err);
    }
    finally {
      stopLoader();
    }
  };

  const onTabChange = (key: string) => {
    setCurrentTab(key);
  };

  return (
    <div className="orders-container">
      <CustomPageHeader title="Orders" />

      <Tabs activeKey={currentTab} onChange={onTabChange}>
        {orderTabTypes.map((tab, index) => {
          return <Tabs.TabPane
            id={tab.id}
            tab={<span className="tab-completed">{tab.title}</span>}
            key={tab.value}
          />
        })}
      </Tabs>

      <Table
        columns={columns}
        dataSource={selectiveOrders}
        rowKey="orderId"
        className="orderBigTbl"
        pagination={false}
        scroll={{ y: 600 }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />

      {modalOpen && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setModalOpen(false)}
        />
      )}

      {editStatusModalOpen && (
        <EditStatusModal
          order={selectedOrder}
          onSave={handleSaveStatus}
          onClose={() => setEditStatusModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Orders;
