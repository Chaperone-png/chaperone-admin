// dashboardWidget component
import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Card } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import '../../styles/DashboardWidgets.scss';
import { Link } from 'react-router-dom';
import { dashboardCategories, orderStatusTypesData } from '../../utils/constants';
import { useLoader } from '../../context/LoaderContext';
import { orderApi } from '../../services/apis/orderApi';

export interface Widget {
  title: string;
  firstCount: number;
  secondCount: number;
  secondCountPrefix: string;
  secondCountSuffix: string;
  secondCountType: 'success' | 'danger' | 'warning' | 'secondary';
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

const DashboardWidgets: React.FC <Props> = ({selectedDateRange}) => {
  const [ordersCount, setOrdersCount] = useState({
    Pending: 0,
    Completed: 0,
    Cancelled: 0,
    Total: 0,
  });
  const { startLoader, stopLoader } = useLoader();
  const [dashboardCount, setDashboardCount] = useState(dashboardCategories);

  useEffect(() => {
    fetchOrderCount(selectedDateRange);
  }, [selectedDateRange]);

  const fetchOrderCount = async (selectedDateRange: any) => {
    try {
      startLoader();
      const orderResponse = await orderApi.getAllOrdersCount(selectedDateRange);
      if (orderResponse.data.ok) {
        const data = orderResponse?.data?.orderCounts;
        const pendingCounts = data?.[orderStatusTypesData.Processing.title] || 0;
        const completedCounts = data?.[orderStatusTypesData.Completed.title] || 0;
        const cancelledCounts = data?.[orderStatusTypesData.Cancelled.title] || 0;
        setOrdersCount({
          Pending: pendingCounts,
          Completed: completedCounts,
          Cancelled: cancelledCounts,
          Total: pendingCounts + completedCounts + cancelledCounts,
        });
      }
    } catch (err) {
      console.error('Error fetching the order count:', err);
    } finally {
      stopLoader();
    }
  };

  useEffect(() => {
    setDashboardCount((prevDashboardCount) => {
      const updatedDashboardCount = [...prevDashboardCount];
      const widgets = [...updatedDashboardCount[0].widgets];
      if (widgets.length > 3) {
        widgets[0] = { ...widgets[0], firstCount: ordersCount.Total };
        widgets[1] = { ...widgets[1], firstCount: ordersCount.Pending };
        widgets[2] = { ...widgets[2], firstCount: ordersCount.Completed };
        widgets[3] = { ...widgets[3], firstCount: ordersCount.Cancelled };
      }
      updatedDashboardCount[0] = { ...updatedDashboardCount[0], widgets };
      return updatedDashboardCount;
    });
  }, [ordersCount]);

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
                      color: 'white', // Text color for contrast
                    }}
                  >
                    <Row>
                      <Col span={24} style={{ textAlign: 'center' }}>
                        <Text strong style={{ fontSize: '1.5em' }}>
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
