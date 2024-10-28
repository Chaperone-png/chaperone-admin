import { Col, Form, Input, message, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
interface State {
    _id: string;
    name: string;
}

interface City {
    _id: string;
    name: string;
}
const { Option } = Select;

const AddressDetailsForm = ({form}:any) => {
    const [cities, setCities] = useState<City[]>([]);
    const [selectedState, setSelectedState] = useState<string | null>(null);
    const [loadingStates, setLoadingStates] = useState(true);
    const [loadingCities, setLoadingCities] = useState(false);
    const [states, setStates] = useState<State[]>([]);

    useEffect(() => {
        // locationApi.getStates().then((response) => {
        //     setLoadingStates(false);
        //     if (response.data && Array.isArray(response.data)) {
        //         setStates(response.data);
        //     }
        // });
        setStates([{ _id: '1', name: 'MP' }])
    }, []);

    const handleStateChange = (value: string) => {
        setSelectedState(value);
        setLoadingCities(true);
        form.resetFields(['city']);

        // locationApi.getCitiesByStateId(value).then((response) => {
        //     if (response?.data && Array.isArray(response.data)) {
        //         setCities(response.data);
        //     }

        //     setLoadingCities(false);
        // }).catch((error) => {
        //     console.error('There was an error fetching the cities!', error);
        //     setLoadingCities(false);

        // });
        setCities([{ _id: '1', name: 'Maihar' }]);
    };
    const handleCityClick = () => {
        if (!selectedState) {
            message.warning('Please select a state first');
        }
    };
  return (
    <Form layout="vertical" form={form}>
    <Row gutter={16}>
        <Col span={12}>
            <Form.Item
                name="state"
                label="State"
                rules={[{ required: true, message: 'Please select state' }]}
            >
                <Select
                    placeholder="Select State"
                    onChange={handleStateChange}
                    loading={loadingStates}
                >
                    {states.map((state) => (
                        <Option key={state._id} value={state.name}>
                            {state.name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
        </Col>
        <Col span={12}>
            <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: 'Please select city' }]}
            >
                <Select
                    placeholder="Select City"
                    onClick={handleCityClick}
                    loading={loadingCities}
                    disabled={!selectedState}
                >
                    {cities.map((city) => (
                        <Option key={city._id} value={city.name}>
                            {city.name}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
        </Col>
        <Col span={12}>
            <Form.Item
                name="pincode"
                label="Pincode"
                rules={[
                    { required: true, message: 'Please enter pincode' },
                    { len: 6, message: 'Pincode must be 6 digits long' },
                    
                ]}
            >
                <Input placeholder="Pincode" maxLength={6}/>
            </Form.Item>
        </Col>
        <Col span={12}>
            <Form.Item
                name="fullAddress"
                label="Full Address"
                rules={[{ required: true, message: 'Please enter full address' }]}
            >
                <Input.TextArea placeholder="Full Address" />
            </Form.Item>
        </Col>
    </Row>
</Form>
  )
}

export default AddressDetailsForm