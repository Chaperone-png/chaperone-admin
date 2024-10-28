import React, { useState } from 'react';
import { Form, Checkbox, Input, InputNumber, Col, Row } from 'antd';

interface Size {
  _id: string;
  title: string;
}

interface PlanterDetailsProps {
  sizes: Size[];
  checkedSizes:string[]
}

const planterTypes = ['Metal', 'Wooden', 'Hanging', 'Basktet', 'Tray'];
const colors = ['Red', 'Blue', 'Green', 'White', 'Black'];

const PotDetails: React.FC<PlanterDetailsProps> = ({ sizes, checkedSizes }) => {
  const [checkedPlanterTypes, setCheckedPlanterTypes] = useState<string[]>([]);
  const [checkedColors, setCheckedColors] = useState<{ [key: string]: string[] }>({});


  const handlePlanterTypeChange = (checkedValues: string[]) => {
    setCheckedPlanterTypes(checkedValues);
  };

  const handleColorChange = (potType: string, checkedValues: string[]) => {
    setCheckedColors((prev) => ({ ...prev, [potType]: checkedValues }));
  };

  return (
    <>

      {checkedSizes.map((checkedSize) => ( 
        <div key={checkedSize} className='field-list-wrapper'>
           <h3>{checkedSize} details</h3> 
           <div className='field-listing'>
          <Row>
          <Col xl={6} md={6} xs={24}>
          <Form.Item
            name={`${checkedSize}_size`}
            label={`Size (in inches)`}
            rules={[{ required: true, message: `Please enter the exact size for ${checkedSize}` }]}
          >
            <Input placeholder={`Enter ${checkedSize} size in inches`} />
          </Form.Item>
          </Col>
          </Row> 
          <Form.Item
            name={`${checkedSize}_potTypes`}
            label={`Available Pot Types `}
            rules={[{ required: true, message: 'Please select at least one pot type' }]}
          >
            <Checkbox.Group onChange={handlePlanterTypeChange}>
              {planterTypes.map((type) => (
                <Checkbox key={type} value={type}>
                  {type}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>  
          {checkedPlanterTypes.map((potType) => (
            <div key={potType}>
               <Row>
               <Col xl={6} md={6} xs={24}>
              <Form.Item
                name={`${checkedSize}_${potType}_price`}
                label={`Price ${potType}`}
                rules={[{ required: true, message: `Please enter the price for ${checkedSize} ${potType}` }]}
              >
                <InputNumber placeholder={`Enter  ${potType} price`} min={0} />
              </Form.Item>
              </Col>
              </Row> 
              <Form.Item
                name={`${checkedSize}_${potType}_colors`}
                label={`Available Colors ${potType}`}
                rules={[{ required: true, message: `Please select at least one color  ${potType}` }]}
              >
                <Checkbox.Group onChange={(checkedValues:any) => handleColorChange(potType, checkedValues)}>
                  {colors.map((color) => (
                    <Checkbox key={color} value={color}>
                      {color}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </Form.Item>
               <Row gutter={20} className='color-field-list'> 
              {checkedColors[potType] &&
                checkedColors[potType].map((color) => (
                  <Col xl={6} md={12}  sm={12}  xs={24}>
                  <Form.Item
                    key={color}
                    name={`${checkedSize}_${potType}_${color}_quantity`}
                    label={` Stock ${potType} (${color})`}
                    rules={[{ required: true, message: `Please enter the available stock  ${potType} (${color})` }]}
                  >
                    <InputNumber placeholder={`Enter ${potType} (${color})`} min={0} />
                  </Form.Item>
                  </Col>
                ))}
                  </Row>
            </div>
          ))}
        </div>
        </div>
      ))}
    </>
  );
};

export default PotDetails;
