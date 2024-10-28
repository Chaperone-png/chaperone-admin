import { InfoCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, Input, List, Row, Alert, Tooltip } from 'antd';
import { useState } from 'react';

interface Props {
    setCustomCareTips: React.Dispatch<React.SetStateAction<{ title: string; description: string }[]>>;
    customCareTips: { title: string; description: string }[];
}

const PlantCareTips: React.FC<Props> = ({ setCustomCareTips, customCareTips }) => {
    const [newCareTip, setNewCareTip] = useState<{ title: string; description: string }>({
        title: '',
        description: '',
    });
    const [error, setError] = useState<string>('');

    const addCareTip = () => {
        if (newCareTip.title.trim() !== '' && newCareTip.description.trim() !== '') {
            setCustomCareTips([...customCareTips, newCareTip]);
            setNewCareTip({ title: '', description: '' });
            setError(''); // Clear any existing error
        } else {
            setError('Please enter both title and description'); // Set error message
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addCareTip();
        }else{
            setError(''); // Clear any existing error
        }
    };

    return (
        <>
            {/* <Col xs={24} sm={24}>
                <Form.Item 
                label={<span>
                    Select Care Tips{" "}
                    <Tooltip
                      overlayClassName="custom-tooltip"
                      title="You can select the plant care tip from the existing tips or you can add a new one"
                      placement="right"
                    >
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>}
                 name="careTipsIds">
                    <Checkbox.Group className="checkbox-list checklist-bg">
                        {careTips.map((careTip: any) => (
                            careTip.status === 'active' && (
                                <div key={careTip._id} className="checkbox-item">
                                    <label className="checkbox-label">
                                        <Checkbox value={careTip._id} />
                                        <Tooltip title={careTip.description}><span className="checkbox-title">{careTip.title}</span></Tooltip>
                                    </label>
                                </div>
                            )
                        ))}
                        {careTips?.length === 0 && <div>No care tips found in your database. Meanwhile, you can add below.</div>}
                    </Checkbox.Group>
                </Form.Item>
            </Col> */}

            <Col lg={{ offset: 8 }}>
                <Row>
                    {customCareTips.length > 0 && (
                        <Col>
                            <label><b><u>Added Plant Care Tips:</u></b></label>
                            {customCareTips.length > 0 && (
                                <List
                                    dataSource={customCareTips}
                                    renderItem={(careTip: { title: string; description: string }, index) => (
                                        <List.Item
                                            actions={[
                                                <MinusCircleOutlined onClick={() => setCustomCareTips((prev) => prev.filter((_, i) => i !== index))} />,
                                            ]}
                                        >
                                            <div>
                                                <strong>Title:</strong> {careTip.title}
                                                <br />
                                                <strong>Description:</strong> {careTip.description}
                                            </div>
                                        </List.Item>
                                    )}
                                />
                            )}
                        </Col>
                    )}
                </Row>
            </Col>

            <Col className='add-listing' span={24}>
                <Form.Item label="Care Tips">
                    <Row gutter={16} style={{ alignItems: 'center' }}>
                        <Col xl={24} md={24} sm={24} xs={24} className='listing-space'>
                            <Input
                                placeholder="Enter care tip title"
                                value={newCareTip.title}
                                onChange={(e) => setNewCareTip((prev) => ({ ...prev, title: e.target.value }))}
                                onKeyDown={handleKeyDown}
                            />
                        </Col>
                        <Col xl={24} md={24} sm={24} xs={24} className='listing-space'>
                            <Input.TextArea
                                placeholder="Enter care tip description"
                                value={newCareTip.description}
                                onChange={(e) => setNewCareTip((prev) => ({ ...prev, description: e.target.value }))}
                                onKeyDown={handleKeyDown}
                                rows={4}
                            />
                        </Col>
                        <Col xl={4} md={24} sm={24} xs={24} className='listing-space'>
                            <Button htmlType="button" onClick={addCareTip}>
                                Add Care Tip
                            </Button>
                        </Col>
                        <Col xs={24}>
                            {error && <Alert message={error} type="error" showIcon />}
                        </Col>
                    </Row>
                </Form.Item>
            </Col>
        </>
    );
};

export default PlantCareTips;
