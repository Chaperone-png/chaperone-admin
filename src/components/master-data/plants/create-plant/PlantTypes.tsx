import { Form, Select } from 'antd'
import React from 'react'
import SelectNoData from '../../../common/SelectNoData'
const { Option } = Select
interface Props {
    plantTypes:any;
}
const PlantTypes = ({plantTypes}:Props) => {
  return (
    <Form.Item label="Plant Type" name="plantTypeIds" rules={[{ required: true, message: "Please select the plant category" }]}>
    <Select placeholder="Select or start typing plant type"
      mode="multiple"
      showSearch
      filterOption={(input, option) =>
        (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
      }
      notFoundContent={<SelectNoData title="Plant types not found" />}

    >
      {plantTypes.map((category: { title: string, _id: string, status: 'active' | 'inactive' }) => (
        category.status === 'active' &&
        <Option key={category._id} value={category._id}>{category.title}</Option>
      ))}
    </Select>
  </Form.Item>
  )
}

export default PlantTypes