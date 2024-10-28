import { Col, Form, Input, Row } from 'antd';

const ContactDetailsForm = ({ form }: any) => {
  return (
    <Form layout="vertical" form={form}>
    <Row gutter={16}>
        <Col span={12}>
            <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
            >
                <Input placeholder="Email" />
            </Form.Item>
        </Col>
        <Col span={12}>
            <Form.Item
                name="mobileNumber"
                label="Mobile Number"
                rules={[{ required: true, message: 'Please enter contact details' }]}
            >
                <Input placeholder="Mobile Number" maxLength={10} />
            </Form.Item>
        </Col>
    </Row>
</Form>
  )
}

export default ContactDetailsForm