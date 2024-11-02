import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Card, Col, Tag } from 'antd';
const NurseryCard = ({ nursery, onShowDetails, onEdit, onDelete }: any) => (
    <Col xs={24} sm={12} md={8} lg={6} xl={4} key={nursery.key}>
        <Card
            hoverable
            actions={[
                <Button type="link" key="details" onClick={() => onShowDetails(nursery)}><EyeOutlined /></Button>,
                <Button type="primary" key="edit" onClick={() => onEdit(nursery)}><EditOutlined /></Button>,
                <Button type="default" key="delete" onClick={() => onDelete(nursery)}><DeleteOutlined /></Button>,
            ]}
            className="custom-card-actions"
            bodyStyle={{ padding: '16px' }}
            style={{ marginBottom: '16px' }}
        >
            <Card.Meta title={nursery.name} description={`${nursery.address.city}, ${nursery.address.state}`} />
            <Card.Meta style={{marginTop:'8px'}} description={<Tag color={nursery?.status === 'active' ? 'green' : nursery?.status === 'inactive' ? 'red' : 'gold'}>
                {nursery?.status?.toUpperCase()}
            </Tag>} />

        </Card>
    </Col>
);

export default NurseryCard;
