import React, { useEffect, useState } from "react";
import { Row, Col, Typography, Card } from "antd";
import { BarChartOutlined } from "@ant-design/icons";
import "../../styles/DashboardWidgets.scss";
import { Link } from "react-router-dom";
import {
  dashboardCategories,
  orderStatusTypesData,
} from "../../utils/constants";
import { useLoader } from "../../context/LoaderContext";
import { orderApi } from "../../services/apis/orderApi";

export interface Widget {
  title: string;
  firstCount: number;
  secondCount?: number;
  secondCountPrefix?: string;
  secondCountSuffix?: string;
  secondCountType?: "success" | "danger" | "warning" | "secondary";
  link: string;
}

export interface Category {
  title: string;
  widgets: Widget[];
  path: string;
}

const { Title, Text } = Typography;

interface Props {
  selectedDateRange: [string, string] | null;
}

const DashboardWidgets: React.FC<Props> = ({ selectedDateRange }) => {
  const [ordersCount, setOrdersCount] = useState({
    Pending: 0,
    Completed: 0,
    Cancelled: 0,
    Total: 0,
  });

  const [maaliCount, setMaaliCount] = useState({
    Subscriptions: 0,
    OneTime: 0,
    Weekly: 0,
    Monthly: 0,
  });

  const { startLoader, stopLoader } = useLoader();
  const [dashboardCount, setDashboardCount] = useState(dashboardCategories);

  useEffect(() => {
    fetchOrderAndBookingCounts(selectedDateRange);
  }, [selectedDateRange]);

  const fetchOrderAndBookingCounts = async (selectedDateRange: any) => {
    try {
      startLoader();
      const response = await orderApi.getAllOrdersCount(selectedDateRange);
      if (response.data.ok) {
        const data = response?.data;

        // Extract order counts
        const orderCounts = data?.orderCounts || {};
        const pendingCounts =
          orderCounts?.[orderStatusTypesData.Processing.title] || 0;
        const completedCounts =
          orderCounts?.[orderStatusTypesData.Completed.title] || 0;
        const cancelledCounts =
          orderCounts?.[orderStatusTypesData.Cancelled.title] || 0;

        // Extract booking counts
        const bookingCounts = data?.bookingCounts || {};
        const oneTimeSubscriptions = bookingCounts?.one_time || 0;
        const weeklySubscriptions = bookingCounts?.weekly || 0;
        const monthlySubscriptions = bookingCounts?.monthly || 0;

        // Update orders count
        setOrdersCount({
          Pending: pendingCounts,
          Completed: completedCounts,
          Cancelled: cancelledCounts,
          Total: pendingCounts + completedCounts + cancelledCounts,
        });

        // Update Maali count
        setMaaliCount({
          Subscriptions:
            oneTimeSubscriptions + weeklySubscriptions + monthlySubscriptions,
          OneTime: oneTimeSubscriptions,
          Weekly: weeklySubscriptions,
          Monthly: monthlySubscriptions,
        });
      }
    } catch (err) {
      console.error("Error fetching the order and booking counts:", err);
    } finally {
      stopLoader();
    }
  };

  useEffect(() => {
    setDashboardCount((prevDashboardCount) => {
      const updatedDashboardCount = [...prevDashboardCount];

      // Update Orders Widgets
      const orderWidgets = [...updatedDashboardCount[0].widgets];
      if (orderWidgets.length > 3) {
        orderWidgets[0] = { ...orderWidgets[0], firstCount: ordersCount.Total };
        orderWidgets[1] = {
          ...orderWidgets[1],
          firstCount: ordersCount.Pending,
        };
        orderWidgets[2] = {
          ...orderWidgets[2],
          firstCount: ordersCount.Completed,
        };
        orderWidgets[3] = {
          ...orderWidgets[3],
          firstCount: ordersCount.Cancelled,
        };
      }
      updatedDashboardCount[0] = {
        ...updatedDashboardCount[0],
        widgets: orderWidgets,
      };

      // Update Maali Widgets
      const maaliWidgets = [...updatedDashboardCount[1].widgets];
      if (maaliWidgets.length > 3) {
        maaliWidgets[0] = {
          ...maaliWidgets[0],
          firstCount: maaliCount.Subscriptions,
        };
        maaliWidgets[1] = {
          ...maaliWidgets[1],
          firstCount: maaliCount.OneTime,
        };
        maaliWidgets[2] = { ...maaliWidgets[2], firstCount: maaliCount.Weekly };
        maaliWidgets[3] = {
          ...maaliWidgets[3],
          firstCount: maaliCount.Monthly,
        };
      }
      updatedDashboardCount[1] = {
        ...updatedDashboardCount[1],
        widgets: maaliWidgets,
      };

      return updatedDashboardCount;
    });
  }, [ordersCount, maaliCount]);

  return (
    <div className="dashboard-container">
      {dashboardCount?.map((category, catIndex) => (
        <div key={catIndex} className="category-container">
          <Title level={3} className="category-title">
            {category?.title}
          </Title>
          <Row gutter={[16, 16]}>
            {category?.widgets?.map((widget, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6} xl={5}>
                <Link to={widget?.link}>
                  <Card
                    title={widget?.title}
                    extra={<BarChartOutlined />}
                    style={{
                      marginBottom: 16,
                      color: "white", // Text color for contrast
                    }}
                  >
                    <Row>
                      <Col span={24} style={{ textAlign: "center" }}>
                        <Text strong style={{ fontSize: "1.5em" }}>
                          {widget?.firstCount}
                        </Text>
                      </Col>
                    </Row>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </div>
  );
};

export default DashboardWidgets;
