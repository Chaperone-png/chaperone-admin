import React, { useState } from 'react';
import { Button, Col, Row, Select, Space, Tag } from 'antd';

const { Option } = Select;

interface FilterProps {
  plants: any[];
  onApplyFilters: (filters: any) => void;
}

const PlantFilters: React.FC<FilterProps> = ({ plants, onApplyFilters }) => {
  const [selectedFilters, setSelectedFilters] = useState<any>({});

  const handleFilterChange = (key: string, value: any) => {
    setSelectedFilters((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(selectedFilters);
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select Plant Name"
            onChange={(value) => handleFilterChange('plantName', value)}
          >
            {plants.map((plant) => (
              <Option key={plant.plantName} value={plant.plantName}>
                {plant.plantName}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={6}>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select Nursery Name"
            onChange={(value) => handleFilterChange('nurseryName', value)}
          >
            {plants.map((plant) => (
              <Option key={plant.nursery.name} value={plant.nursery.name}>
                {plant.nursery.name}
              </Option>
            ))}
          </Select>
        </Col>
        {/* Add more filter dropdowns for Categories, Container Type, etc. */}
        <Col span={6}>
          <Button type="primary" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </Col>
      </Row>
      <Space style={{ marginTop: '16px' }}>
        {Object.keys(selectedFilters).map((key) => (
          <Tag key={key}>
            {key}: {selectedFilters[key].join(', ')}
          </Tag>
        ))}
      </Space>
    </div>
  );
};

export default PlantFilters;
