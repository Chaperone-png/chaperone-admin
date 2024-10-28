import React, { useState } from 'react';
import { Modal, Form, Input, Button, ColorPicker } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

export const AddSizeModal = ({ visible, onCancel, onOk, currentSize }: { visible: boolean; onCancel: () => void; onOk: (values: any) => void, currentSize:string }) => {
    const [form] = Form.useForm();
    const addColorPicker = (fieldKey: string) => {
        form.setFieldsValue({
            [fieldKey]: [...form.getFieldValue(fieldKey), ''] // Add empty string as a placeholder for a new color
        });
    };
    return (
        <Modal
            title={`Add ${currentSize} size details`}
            open={visible}
            destroyOnClose
        >
            <Form form={form} layout="vertical" onFinish={(values)=>{}}>
                <Form.Item
                    label="Size (in inches)"
                    name={`${currentSize}_size`}
                    rules={[{ required: true, message: `Please enter ${currentSize} size` }]}
                >
                    <Input type="number" placeholder={`${currentSize} Size`} />
                </Form.Item>
                <Form.Item
                    label="Price"
                    name={`${currentSize}_price`}
                    rules={[{ required: true, message: `Please enter ${currentSize} price` }]}
                >
                    <Input type="number" placeholder="Price" />
                </Form.Item>
                <Form.Item
                    label="Discount %"
                    name={`${currentSize}_discount`}
                >
                    <Input type="number" placeholder="Discount" />
                </Form.Item>
                <Form.Item
                    label="Quantity"
                    name={`${currentSize}_quantity`}
                    rules={[{ required: true, message: `Please enter ${currentSize} quantity` }]}
                >
                    <Input type="number" placeholder="Quantity" />
                </Form.Item>
                <Form.Item
                    label="Select Colors"
                    name={`${currentSize}_colors`}
                >
                    {form.getFieldValue(`${currentSize}_colors`)?.map((color: string, index: number) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                            <ColorPicker
                                value={color}
                                onChange={(value) => {
                                    const colors = form.getFieldValue(`${currentSize}_colors`);
                                    colors[index] = value;
                                    form.setFieldsValue({
                                        [`${currentSize}_colors`]: colors
                                    });
                                }}
                            />
                            <Button
                                type="text"
                                icon={<CloseOutlined />}
                                onClick={() => {
                                    const colors = form.getFieldValue(`${currentSize}_colors`);
                                    colors.splice(index, 1);
                                    form.setFieldsValue({
                                        [`${currentSize}_colors`]: colors
                                    });
                                }}
                            />
                        </div>
                        
                    ))}
                    <Button type="dashed" onClick={() => addColorPicker(`${currentSize}_colors`)}>
                        Add Color
                    </Button>
                </Form.Item>
                <Form.Item
                
                >
                    {/* Include ColorPicker and Button for adding colors here */}
                    <Button htmlType='submit'>Save</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddSizeModal;
