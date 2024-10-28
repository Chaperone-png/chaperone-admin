import { InfoCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Col, Form, Checkbox, Row, List, Input, Button, Alert, Tooltip } from 'antd';
import React, { useState } from 'react';

interface Props {
    setCustomBenefits: React.Dispatch<React.SetStateAction<{ title: string; description: string }[]>>;
    customBenefits: { title: string; description: string }[];
}

const PlantBenefits: React.FC<Props> = ({ setCustomBenefits, customBenefits }) => {
    const [customBenefit, setCustomBenefit] = useState<{ title: string; description: string }>({
        title: '',
        description: '',
    });
    const [error, setError] = useState<string>('');

    const addCustomBenefit = () => {
        if (customBenefit.title.trim() !== '' && customBenefit.description.trim() !== '') {
            setCustomBenefits([...customBenefits, customBenefit]);
            setCustomBenefit({ title: '', description: '' });
            setError(''); // Clear any existing error
        } else {
            setError('Please enter both title and description'); // Set error message
        }
    };

    const handleCustomBenefitChange = (key: string, value: string) => {
        setCustomBenefit((prev) => ({ ...prev, [key]: value }));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addCustomBenefit();
        }else{
            setError('')
        }
    };

    return (
        <Col xs={24} sm={24}>
            {/* <Form.Item 
              label={<span>
              Select Plant Benefits{" "}
              <Tooltip
                overlayClassName="custom-tooltip"
                title="You can select the benefits from the existing benefits list or you can add a new one"
                placement="right"
              >
                <InfoCircleOutlined />
              </Tooltip>
            </span>}
             name="plantBenefitIds"> 
                <Checkbox.Group className="checkbox-list  checklist-bg">
                    {plantBenefits.map((benefit: any) => (
                        benefit.status === 'active' && (
                            <div key={benefit._id} className="checkbox-item">
                                <label className="checkbox-label">
                                    <Checkbox value={benefit._id} />
                                    <Tooltip title={benefit.description}><span className="checkbox-title">{benefit.title}</span></Tooltip>
                                </label>
                            </div>
                        )
                    ))}
                    {plantBenefits?.length === 0 && <div>No plant benefits found in your database. Meanwhile, you can add below.</div>}
                </Checkbox.Group>
            </Form.Item> */}

            {customBenefits.length > 0 && (
                <Col lg={{ offset: 8 }}>
                    <Row>
                        <Col>
                            <label><b><u>Added Benefits:</u></b></label>
                            {customBenefits.length > 0 && (
                                <List
                                    dataSource={customBenefits}
                                    renderItem={(benefit: any, index) => (
                                        <List.Item
                                            actions={[<MinusCircleOutlined onClick={() => setCustomBenefits((prev) => prev.filter((_, i) => i !== index))} />]}
                                        >
                                            <div>
                                                <strong>Title:</strong> {benefit.title}
                                                <br />
                                                <strong>Description:</strong> {benefit.description}
                                            </div>
                                        </List.Item>
                                    )}
                                />
                            )}
                        </Col>
                    </Row>
                </Col>
            )}

            <Col className='add-listing' span={24}>
                <Form.Item label="Add Benefit">
                    <Row gutter={16} style={{ alignItems: 'center' }}>
                        <Col xl={24} md={24} sm={24} xs={24} className='listing-space'>
                            <Input
                                value={customBenefit.title}
                                onChange={(e) => handleCustomBenefitChange('title', e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Enter Custom Benefit Title"
                            />
                        </Col>
                        <Col xl={24} md={24} sm={24} xs={24} className='listing-space'>
                            <Input.TextArea
                                value={customBenefit.description}
                                onChange={(e) => handleCustomBenefitChange('description', e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Enter Custom Benefit Description"
                                rows={4}
                            />
                        </Col>
                        <Col xl={4} md={24} sm={24} xs={24} className='listing-space'>
                            <Button onClick={addCustomBenefit} htmlType="button" >
                                Add Benefit
                            </Button>
                        </Col>
                        <Col xs={24}>{error && <Alert message={error} type="error" showIcon />}</Col>
                    </Row>
                </Form.Item>

            </Col>
        </Col>
    );
};

export default PlantBenefits;
