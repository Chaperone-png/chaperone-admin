import { Col, DatePicker, Form, Input, Row } from 'antd';
const BasicDetailsForm = ({ form }: any) => {
  return (
    <Form layout="vertical" form={form}>
    <Row gutter={16}>
        <Col span={12}>
            <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: 'Please enter first name' }]}
            >
                <Input placeholder="First Name" />
            </Form.Item>
        </Col>
        <Col span={12}>
            <Form.Item name="middleName" label="Middle Name">
                <Input placeholder="Middle Name" />
            </Form.Item>
        </Col>
        <Col span={12}>
            <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: 'Please enter last name' }]}
            >
                <Input placeholder="Last Name" />
            </Form.Item>
        </Col>
        <Col span={12}>
            <Form.Item
                name="dob"
                label="Date of Birth"
                rules={[{ required: true, message: 'Please select date of birth' }]}
            >
                <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
        </Col>
    </Row>
</Form>
  )
}

export default BasicDetailsForm