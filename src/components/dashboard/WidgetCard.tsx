// src/components/WidgetCard.tsx
import React from 'react';
import { Card, Typography } from 'antd';

const { Text } = Typography;

interface WidgetProps {
  title: string;
  firstCount: number;
  secondCount: number;
  secondCountPrefix?: string;
  secondCountSuffix?: string;
  secondCountType?: 'success' | 'danger' | 'warning' | 'secondary';
}

const WidgetCard: React.FC<WidgetProps> = ({
  title,
  firstCount,
  secondCount,
  secondCountPrefix = '',
  secondCountSuffix = '',
  secondCountType = 'secondary',
}) => {
  return (
    <Card className="widget-card">
      <div className="widget-title">{title}</div>
      <div className="widget-counts">
        <div className="first-count">
          <Text type="secondary">{firstCount}</Text> {/* First count */}
        </div>
        <div className="second-count">
          <Text type={secondCountType} strong>
            {secondCountPrefix}
            {secondCount}
            {secondCountSuffix}
          </Text> {/* Second count */}
        </div>
      </div>
    </Card>
  );
};

export default WidgetCard;
