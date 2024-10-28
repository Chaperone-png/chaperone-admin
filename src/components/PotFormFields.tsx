import { CloseOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, ColorPicker, Form, Input, Row, Space, Typography } from "antd";
import React, { useState } from "react";
import "../styles/AddPlantModal.scss";
import { availablePlanters } from "../utils/constants";

const { Text } = Typography;

interface PotFormFieldsProps {
    selectedPlanters: string[];
    selectedColors: any;
    handlePlantersChange: (values: string[]) => void;
    addColorPicker: (size: string) => void;
    updateColor: (index: number, color: any, size: string) => void;
    removeColor: (index: number, size: string) => void;
}

const PotFormFields: React.FC<PotFormFieldsProps> = ({
    selectedPlanters,
    selectedColors,
    handlePlantersChange,
    addColorPicker,
    updateColor,
    removeColor,
}) => {

    const [planterSizesMap, setPlanterSizesMap] = useState<{ [planter: string]: string[] }>({});

    const handlePotSizeChange = (checkedValues: string[], planter: string) => {
        setPlanterSizesMap(prevSizesMap => ({
            ...prevSizesMap,
            [planter]: checkedValues
        }));
    };
    return (
        <>
            <Col xs={24} sm={24}>
                <Form.Item label="Select Available Planters" name="planters">
                    <Checkbox.Group onChange={handlePlantersChange} value={selectedPlanters}>
                        <Row>
                            {availablePlanters.map(planter => (
                                <Col key={planter.value} span={12} xs={24} sm={24} md={12}>
                                    <Checkbox value={planter.value}>{planter.label}</Checkbox>
                                </Col>
                            ))}
                        </Row>
                    </Checkbox.Group>
                </Form.Item>
            </Col>
            <Col span={24} >
            {selectedPlanters?.map((planter) => <Row>
                {/* <Col span={24} > 
                <Form.Item label={`${planter} available size details`}>

                </Form.Item>
                </Col> */}
                <Col xs={24} sm={24} >
                    <Form.Item
                         label={`${planter} available size details`} 
                        name={`planter_sizes_${planter}`} rules={[{ required: true, message: "Please select at least one size" }]}>
                        <Checkbox.Group onChange={(values: any) => handlePotSizeChange(values, planter)}>
                            <Row>
                                <Col span={12} xs={24} sm={24} md={12}>
                                    <Checkbox value="small">Small (1-5)</Checkbox>
                                </Col>
                                <Col span={12} xs={24} sm={24} md={12}>
                                    <Checkbox value="medium">Medium (5-8)</Checkbox>
                                </Col>
                                <Col span={12} xs={24} sm={24} md={12}>
                                    <Checkbox value="large">Large (8-12)</Checkbox>
                                </Col>
                            </Row>
                        </Checkbox.Group>
                    </Form.Item>
                </Col>

            </Row>)}
            </Col>
            {selectedPlanters?.map((planter) => (
                <Row key={planter} gutter={16}>

                    {planterSizesMap[planter]?.map((size) => (
                        <Col key={`${planter}_${size}`} xs={24} sm={24}>
                            <Form.Item label={`${planter} - ${size.toUpperCase()} Size (in inches)`} colon={false}>
                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Form.Item name={`${planter}_${size}_size`} rules={[{ required: true, message: `Please enter ${planter} - ${size.toUpperCase()} size` }]}>
                                            <Input type="number" placeholder={`${size} Size`} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item name={`${planter}_${size}_price`} rules={[{ required: true, message: `Please enter ${planter} - ${size.toUpperCase()} price` }]}>
                                            <Input type="number" placeholder="Price" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item name={`${planter}_${size}_discount`}>
                                            <Input type="number" placeholder="Discount" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item name={`${planter}_${size}_quantity`} rules={[{ required: true, message: `Please enter ${planter} - ${size.toUpperCase()} quantity` }]}>
                                            <Input type="number" placeholder="Quantity" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item name={`${planter}_${size}_colors`}>
                                            <Space direction="vertical">
                                                {selectedColors[size]?.map((color: any, index: any) => (
                                                    <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                                        <ColorPicker value={color} onChange={(value) => updateColor(index, value, size)} />
                                                        <Button
                                                            type="text"
                                                            icon={<CloseOutlined />}
                                                            onClick={() => removeColor(index, size)}
                                                            style={{ marginLeft: 8 }}
                                                        />
                                                    </div>
                                                ))}
                                                <Button type="dashed" onClick={() => addColorPicker(size)}>
                                                    Add More Color
                                                </Button>
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Col>
                    ))}
                </Row>
            ))}
            {/* Add other pot-related form fields here */}
        </>
    );
};

export default PotFormFields;
