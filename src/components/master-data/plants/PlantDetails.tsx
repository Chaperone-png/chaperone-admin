import React from 'react';
import { Card, Col, Row, List, Image, Typography, Tag } from 'antd';
import { AdminPlantTye } from '../../../types';
import '../../../styles/PlantDetails.scss'; // Import SCSS file

const { Title, Paragraph } = Typography;

type PlantDetailsProps = {
  plant: AdminPlantTye;
};

const PlantDetails: React.FC<PlantDetailsProps> = ({ plant }) => {
  return (
    <Row gutter={16} className="plant-details-container">
      <Col span={24} md={12}>
        <Title level={4}>About</Title>
        {plant.about && (
          <p dangerouslySetInnerHTML={{ __html: plant.about }}></p>
        )}
        <Title level={4}>Plant Categories</Title>
        <div className="plant-categories">
          {plant.plantTypeIds.map((item) => (
            <div key={item._id} className="plant-category-item">
              <Tag>{item.title}</Tag>
            </div>
          ))}
        </div>
        <Title level={4}>Care Tips</Title>
        <List
          dataSource={plant.careTipsIds}
          renderItem={(item) => (
            <List.Item>
              <Paragraph>{item.title}</Paragraph>
            </List.Item>
          )}
        />
        <Title level={4}>Zodiac Signs</Title>
        <Paragraph>{plant.zodiacSigns.join(', ')}</Paragraph>
      </Col>
    </Row>
  );
};

export default PlantDetails;
