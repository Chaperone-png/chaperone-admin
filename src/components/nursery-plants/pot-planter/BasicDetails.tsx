import React, { useEffect, useState } from 'react';
import { Form, Select, Button, Input } from 'antd';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import { potPlanterApi } from '../../../services/apis/potPlanterApi';

const { Option } = Select;

const BasicDetails = ({ nurseryId, onSuccess, potPlanterDetails }: any) => { // Add onSuccess as a prop
    const [potPlanterTypes, setPotPlanterTypes] = useState<string[]>([]);
    const [shapes, setShapes] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [form] = Form.useForm();
    useEffect(() => {
        if (potPlanterDetails) {
            form.setFieldsValue({
                productName: potPlanterDetails.productName,
                potPlanterType: potPlanterDetails.potPlanterType,
                potPlanterShape: potPlanterDetails.potPlanterShape
            })
        }
    }, [potPlanterDetails])
    // Fetch Types and Shapes on component mount
    useEffect(() => {
        const fetchTypesAndShapes = async () => {
            setLoading(true);
            try {
                const response = await potPlanterApi.getPotPlanterTypes();
                setPotPlanterTypes(response.data);

                const shapesResponse = await potPlanterApi.getPotPlanterShapes();
                setShapes(shapesResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTypesAndShapes();
    }, []);

    // Handle form submit
    const onFinish = async (values: any) => {
        try {
            const response = await potPlanterApi.createPotPlanter(nurseryId, values);
            console.log(response, 'RESSS')
            toast.success('PotPlanter created successfully'); // Show success toast
            onSuccess(response.data.data); // Call onSuccess to move to the next step
        } catch (error) {
            toast.error('Error creating PotPlanter');
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h2>Basic Details</h2>
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item
                    label="Product Name"
                    name="productName"
                    rules={[{ required: true, message: 'Please enter the product name!' }]}
                >
                    <Input placeholder="Enter product name" disabled={loading} />
                </Form.Item>
                <Form.Item
                    label="Select Type"
                    name="potPlanterType"
                    rules={[{ required: true, message: 'Please select a type!' }]}
                >
                    <Select
                        placeholder="Select a type"
                        loading={loading}
                        disabled={loading}
                    >
                        {potPlanterTypes.map((type: any) => (
                            <Option key={type._id} value={type._id}>
                                {type.title}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Select Shape"
                    name="potPlanterShape"
                    rules={[{ required: true, message: 'Please select a shape!' }]}
                >
                    <Select
                        placeholder="Select a shape"
                        loading={loading}
                        disabled={loading}
                    >
                        {shapes.map((shape: any) => (
                            <Option key={shape._id} value={shape._id}>
                                {shape.title}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default BasicDetails;
