import { Modal, Form, Input, InputNumber, Button, Select } from 'antd';
import { useEffect } from 'react';
import { plantApi } from '../../../services/apis/plantApi';
const { Option } = Select
interface PlantBenefitsModalProps {
    isOpen: boolean;
    onClose: () => void;
    plantBenefit: any;
    onSuccess: () => void;
}

const PlantBenefitsModal: React.FC<PlantBenefitsModalProps> = ({ isOpen, onClose, plantBenefit, onSuccess }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (plantBenefit) {
            form.setFieldsValue(plantBenefit);
        }
    }, [plantBenefit]);

    const handleSubmit = async (values: any) => {
        try {
            if (plantBenefit) {
                await plantApi.updatePlantBenefit(plantBenefit._id, values);
            } else {
                await plantApi.createPlantBenefit(values);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving plant benefit:', error);
        }
    };

    return (
        <Modal
            title={plantBenefit ? "Edit Plant Benefit" : "Create Plant Benefit"}
            open={isOpen}
            onCancel={onClose}
            footer={null}
            destroyOnClose
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item name="title" label="Plant Benefit" rules={[{ required: true, message: 'Please enter the plant benefit' }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Description"
                //   rules={[{ required: true, message: 'Please input the description' }]}
                >
                    <Input.TextArea placeholder="Enter about benefit in detail" />
                </Form.Item>
                <Form.Item
                    name="status"
                    label="Status"
                    rules={[{ required: true, message: 'Please select the status', }]}
                    initialValue={'active'}
                >
                    <Select defaultValue="active" defaultActiveFirstOption>
                        <Option value="active">Active</Option>
                        <Option value="inactive">Inactive</Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PlantBenefitsModal;