import { Modal, Form, Input, Button, Select } from 'antd';
import { useEffect } from 'react';
import { plantApi } from '../../../services/apis/plantApi';
const { Option } = Select;

interface PlantCareTipModalProps {
    isOpen: boolean;
    onClose: () => void;
    plantCareTip: any;
    onSuccess: () => void;
}

const PlantCareTipModal: React.FC<PlantCareTipModalProps> = ({ isOpen, onClose, plantCareTip, onSuccess }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (plantCareTip) {
            form.setFieldsValue(plantCareTip);
        }
    }, [plantCareTip]);

    const handleSubmit = async (values: any) => {
        try {
            if (plantCareTip) {
                await plantApi.updatePlantCareTip(plantCareTip._id, values);
            } else {
                await plantApi.createPlantCareTip(values);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving plant care tip:', error);
        }
    };

    return (
        <Modal
            title={plantCareTip ? "Edit Plant Care Tip" : "Create Plant Care Tip"}
            open={isOpen}
            onCancel={onClose}
            footer={null}
            destroyOnClose
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item name="title" label="Plant Care Tip" rules={[{ required: true, message: 'Please enter the plant care tip' }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Description"
                >
                    <Input.TextArea placeholder="Enter about care tip in detail" />
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

export default PlantCareTipModal;
