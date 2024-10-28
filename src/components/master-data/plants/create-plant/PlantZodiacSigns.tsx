import { Form, Select } from 'antd'
import React from 'react'
import { zodiacSigns } from '../../../../utils/constants'
const { Option } = Select
const PlantZodiacSigns = () => {
    return (
        <Form.Item label="Zodiac" name="zodiacSigns">
            <Select placeholder="Select related zodiac"
                // mode="tags"
                mode="multiple"
            >
                {zodiacSigns.map((zodiac) => (
                    <Option key={zodiac} value={zodiac}>{zodiac}</Option>
                ))}
            </Select>
        </Form.Item>
    )
}

export default PlantZodiacSigns