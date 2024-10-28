import { Modal, Form, Input, InputNumber, Button, Select, Row, Col } from 'antd';
import { useEffect } from 'react';
import { plantApi } from '../../../services/apis/plantApi';
// import { PlantSize } from '../../types'; // Import PlantSize type from your types file
const { Option } = Select
interface PlantSizeModalProps {
    isOpen: boolean;
    onClose: () => void;
    plantSize: any;
    onSuccess: () => void;
}

const PlantSizeModal: React.FC<PlantSizeModalProps> = ({ isOpen, onClose, plantSize, onSuccess }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (plantSize) {
            form.setFieldsValue(plantSize);
        } else {
            form.resetFields();
        }
    }, [plantSize, form]);

    const handleSubmit = async (values: any) => {
        console.log(values, 'Values...')
        try {
            if (plantSize) {
                await plantApi.updatePlantSize(plantSize._id, values);
            } else {
                await plantApi.createPlantSize(values);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving plant size:', error);
        }
    };

    return (
        <Modal
            title={plantSize ? "Edit Plant Size" : "Create Plant Size"}
            open={isOpen}
            onCancel={onClose}
            footer={null}
            destroyOnClose
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Row>
                    <Col span={24}>
                        <Form.Item name="title" label="Plant Size" rules={[{ required: true, message: 'Please enter the plant size title' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} lg={12}>
                        <Form.Item name="from" label="From (inches)" rules={[{ required: true, message: 'Please enter the starting size in inches' }]}>
                            <InputNumber min={0} style={{width:'90%'}} />
                        </Form.Item>
                    </Col>
                    <Col span={24} lg={12}>
                        <Form.Item name="to" label="To (inches)" rules={[{ required: true, message: 'Please enter the ending size in inches' }]}>
                            <InputNumber min={0} 
                            style={{width:'90%'}}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="description" label="Description">
                            <Input.TextArea />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="status"
                            label="Status"
                            rules={[{ required: true, message: 'Please select the status', }]}
                            initialValue={'active'}
                        >
                            <Select >
                                <Option value="active">Active</Option>
                                <Option value="inactive">Inactive</Option>
                            </Select>
                        </Form.Item>
                    </Col>



                    <Form.Item>
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </Form.Item>
                </Row>
            </Form>
        </Modal>
    );
};

export default PlantSizeModal;
