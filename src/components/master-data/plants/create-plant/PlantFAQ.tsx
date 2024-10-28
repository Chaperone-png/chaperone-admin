import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Row, Col, Form, Input, Button } from 'antd';
import React from 'react';

interface Props {
  faqs: any;
  setFaqs: any;
}

const PlantFAQ = ({ faqs, setFaqs }: Props) => {
  const addFAQ = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const updateFAQ = (index: number, key: string, value: string) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index][key] = value;
    setFaqs(updatedFaqs);
  };

  const removeFAQ = (index: number) => {
    const updatedFaqs = [...faqs];
    updatedFaqs.splice(index, 1);
    setFaqs(updatedFaqs);
  };

  return (
    <Row gutter={16}>
      <Col   xs={24}>
        <Form.List name="faqs">
          {(fields, { add, remove }) => (
            <>
              {faqs.map((faq: any, index: number) => (
                <Row key={index} gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      name={[index, 'question']}
                      rules={[{ required: true, message: 'Please enter a question' }]}
                      label={"FAQ Question"}
                    >
                      <Input
                        placeholder="Enter Question"
                        value={faq.question}
                        onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name={[index, 'answer']}
                      rules={[{ required: true, message: 'Please enter an answer' }]}
                      label={"FAQ Answer"}
                    >
                      <Input
                        placeholder="Enter Answer"
                        value={faq.answer}
                        onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24}  sm={{ span: 12, offset: 8}}    className='remove-faq-btn'>
                    <Button onClick={() => removeFAQ(index)} style={{ marginBottom: '5px' }}>
                      <MinusCircleOutlined />
                      Remove
                    </Button>
                  </Col>
                </Row> 
              ))}
              <Row>
                <Col xs={24}  sm={{ span: 12, offset: 8}}  className='add-faq-btn'>
                  <Form.Item >
                  <Button type="dashed" onClick={addFAQ} block icon={<PlusCircleOutlined />}>
                    Add FAQ
                  </Button>
                  </Form.Item>
              </Col>
              </Row>
              
            </>
          )}
        </Form.List>
      </Col>
    </Row>
  );
};

export default PlantFAQ;
