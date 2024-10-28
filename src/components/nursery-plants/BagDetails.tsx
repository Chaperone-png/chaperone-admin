import { Checkbox, Col, Form, Input, InputNumber, Row } from 'antd';
import React, { useState } from 'react';
import { CONTAINER_TYPES } from '../../utils/constants';

interface Size {
  _id: string;
  title: string;
  from: string;
  to: string
}

interface BagDetailsProps {
  sizes: Size[];
  checkedSizes: string[]
  containerType: string | null;
  setCheckedPotTypes: any;
  setCheckedColors: any;
  checkedPotTypes: any;
  checkedColors: any;
  offers: any;
  setOffers: any
}
const potColors = ['Red', 'Blue', 'Green', 'White', 'Black'];


const BagDetails: React.FC<BagDetailsProps> = ({ setOffers, offers, sizes, checkedSizes, containerType, setCheckedColors, checkedPotTypes, checkedColors }) => {
  const handleColorChange = (checkedSize: string, checkedValues: string[]) => {
    setCheckedColors((prev: any) => ({ ...prev, [checkedSize]: checkedValues }));
  };
  return (
    <>
      {checkedSizes.map((checkedSize) => {
        const sizeTitle = sizes.find((size) => size._id === checkedSize)?.title
        const lowerCaseTitle = sizeTitle?.toLowerCase()
        return (
          <div key={checkedSize} className='field-list-wrapper'>
            <h3>{sizeTitle} size details</h3>
            <div className='field-listing'>
              <Row gutter={20}>
                <Col xl={3} md={6} sm={12} xs={12}>
                  <Form.Item
                    name={`${checkedSize}_size`}
                    label={`Size (in inches)`}
                    rules={[{ required: true, message: `Enter the ${lowerCaseTitle} size` }]}
                  >
                    <Input placeholder={`Enter size `} />
                  </Form.Item>
                </Col>
                <Col xl={3} md={6} sm={12} xs={12}>
                  <Form.Item
                    name={`${checkedSize}_original_price`}
                    label={`Original Price(Rs.)`}
                    rules={[{ required: true, message: `Enter the ${lowerCaseTitle} size price` }]}
                  >
                    <InputNumber placeholder={`Enter price`} min={0} />
                  </Form.Item>
                </Col>
                <Col xl={3} md={6} sm={12} xs={12}>
                  {offers[checkedSize] && <Form.Item
                    name={`${checkedSize}_offer_price`}
                    label={`Offer Price(Rs.)`}
                    rules={[{ required: true, message: `Enter the price` }]}
                  >
                    <InputNumber placeholder={`Enter price`} min={0} />
                  </Form.Item>}
                  <Form.Item
                    name={`${checkedSize}_is_offer`}
                    label={`Add offer price`}
                  >
                    <Checkbox
                      checked={offers[checkedSize]}
                      onChange={(e) => {
                        // setIsOfferPrice(e.target.checked)
                        setOffers((prev: any) => {
                          return {
                            ...prev,
                            [checkedSize]: e.target.checked
                          }
                        })
                      }} />
                  </Form.Item>
                </Col>
                <Col xl={3} md={6} sm={12} xs={12}>
                  <Form.Item
                    name={`${checkedSize}_weight`}
                    label={`Weight (in grams)`}
                  >
                    <InputNumber placeholder={`Enter weight`} min={0} />
                  </Form.Item>
                </Col>
                <Col xl={3} md={6} sm={12} xs={12}>
                  <Form.Item
                    name={`${checkedSize}_quantity`}
                    label={`Available Quantity`}
                    rules={[{ required: true, message: `Enter the available quantity for ${lowerCaseTitle} size` }]}
                  >
                    <InputNumber placeholder={`Enter stock`} min={0} />
                  </Form.Item>
                </Col>
                <Col xl={9} md={9} sm={12} xs={24}>
                  <Form.Item
                    name={`${checkedSize}_description`}
                    label={`Description`}
                  >
                    <Input.TextArea placeholder={`Enter description`} />
                  </Form.Item>
                </Col>
              </Row>

              {containerType !== CONTAINER_TYPES.BAG && <>

                <Form.Item
                  name={`${checkedSize}_colors`}
                  label={`Available Colors`}
                  rules={[{ required: true, message: `Please select at least one color ` }]}
                >
                  <Checkbox.Group onChange={(checkedValues: any) => handleColorChange(checkedSize, checkedValues)}>
                    {potColors.map((color) => (
                      <Checkbox key={color} value={color}>
                        {color}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                </Form.Item>
                <Row gutter={20} className='color-field-list'>
                  {checkedColors[checkedSize] &&
                    checkedColors[checkedSize].map((color: string) => (
                      <Col xl={6} md={12} sm={12} xs={24}>
                        <Form.Item
                          key={color}
                          name={`${checkedSize}_${color}_quantity`}
                          label={`${color} Stock`}
                          rules={[{ required: true, message: `Please enter the available stock  ${checkedSize} (${color})` }]}
                        >
                          <InputNumber placeholder={`Enter available quantity for ${lowerCaseTitle} size (${color})`} min={0} />
                        </Form.Item>
                      </Col>
                    ))}
                </Row>
                {checkedPotTypes[checkedSize]?.map((potType: any) => (
                  <div className='pot-type-wrapper' key={potType}>
                    <h2>{potType} Details</h2>
                    <Row>
                      <Col xl={6} md={6} xs={24}>
                        <Form.Item
                          name={`${checkedSize}_${potType}_price`}
                          label={`Price ${potType}`}
                          rules={[{ required: true, message: `Please enter the price for ${lowerCaseTitle} ${potType}` }]}
                        >
                          <InputNumber placeholder={`Enter ${lowerCaseTitle} ${potType} price`} min={0} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={20} className='color-field-list'>
                      {checkedColors[potType] &&
                        checkedColors[potType].map((color: string) => (
                          <Col xl={6} md={12} sm={12} xs={24}>
                            <Form.Item
                              key={color}
                              name={`${checkedSize}_${potType}_${color}_quantity`}
                              label={`${potType} Stock (${color})`}
                              rules={[{ required: true, message: `Please enter the available stock  ${potType} (${color})` }]}
                            >
                              <InputNumber placeholder={`Enter available quantity for ${lowerCaseTitle} size ${potType} (${color})`} min={0} />
                            </Form.Item>
                          </Col>
                        ))}
                    </Row>
                  </div>
                ))}
              </>}

            </div>
          </div>
        )
      })}
    </>
  );
};

export default BagDetails;
