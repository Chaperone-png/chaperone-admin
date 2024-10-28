import { Col, Form, Input, Row } from 'antd';

const BankDetailsForm = ({ form }: any) => {
  return (
    <Form layout="vertical" form={form}>
    <Row gutter={16}>
        <Col span={12}>
            <Form.Item
                name="accountNumber"
                label="Account Number"
                rules={[{ required: true, message: 'Please enter account number' }]}
            >
                <Input placeholder="Account Number" />
            </Form.Item>
        </Col>
        <Col span={12}>
            <Form.Item
                name="ifscCode"
                label="IFSC Code"
                rules={[{ required: true, message: 'Please enter IFSC code' }]}
            >
                <Input placeholder="IFSC Code" />
            </Form.Item>
        </Col>
        <Col span={12}>
            <Form.Item
                name="bankName"
                label="Bank Name"
                rules={[{ required: true, message: 'Please enter bank name' }]}
            >
                <Input placeholder="Bank Name" />
            </Form.Item>
        </Col>
    </Row>
</Form>
  )
}

export default BankDetailsForm