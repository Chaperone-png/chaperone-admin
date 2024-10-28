import React, { useState, useEffect } from 'react';
import { Button, Input, Select, Table, Form, Modal, Tabs } from 'antd';
import { ColumnsType } from 'antd/es/table';
import CustomPageHeader from '../components/PageHeader';
import { locationApi } from '../services/apis/locationApi';
import '../styles/LocationsMasterData.scss'
const { TabPane } = Tabs;

const { Option } = Select;

interface Country {
    _id: string;
    name: string;
    code: string;
    status: string;
}

interface State {
    _id: string;
    name: string;
    country: string;
    status: string;
}

interface Pincode {
    _id: string;
    code: string;
    status: string;
}
interface City {
    _id: string;
    name: string;
    state: string;
    status: string;
    pincodes: Pincode[];
}

const Locations: React.FC = () => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [countryModalVisible, setCountryModalVisible] = useState(false);
    const [stateModalVisible, setStateModalVisible] = useState(false);
    const [cityModalVisible, setCityModalVisible] = useState(false);
    const [pincodeModalVisible, setPincodeModalVisible] = useState(false);
    const [selectedCity, setSelectedCity] = useState<City | null>(null);
    
    const handleAddPincode = async (values: { code: string }) => {
        try{
            console.log('Selected city,', selectedCity)
            if (selectedCity) {
                await locationApi.addPincode(selectedCity._id, values);
                const citiesResponse = await locationApi.getCities();
                setCities(citiesResponse.data);
                setPincodeModalVisible(false);
            }
        }catch(e){
            console.log(e, 'Error')
        }

    };
    
    const handleUpdatePincodeStatus = async (cityId: string, pincodeId: string, status: string) => {
        await locationApi.updatePincodeStatus(cityId, pincodeId, { status });
        const citiesResponse = await locationApi.getCities();
        setCities(citiesResponse.data);
    };
    useEffect(() => {
        const fetchData = async () => {
            const [countriesResponse, statesResponse, citiesResponse] = await Promise.all([
                locationApi.getCountries(),
                locationApi.getStates(),
                locationApi.getCities(),
            ]);
            console.log(countriesResponse.data, 'countriesResponse')
            console.log(statesResponse.data, 'statesResponse')
            console.log(citiesResponse.data, 'citiesResponse')

            setCountries(countriesResponse.data);
            setStates(statesResponse.data);
            setCities(citiesResponse.data);
        };
        fetchData();
    }, []);

    const handleAddCountry = async (values: { name: string; code: string }) => {
        await locationApi.addCountry(values);
        const countriesResponse = await locationApi.getCountries();
        setCountries(countriesResponse.data);
        setCountryModalVisible(false);
    };

    const handleAddState = async (values: { name: string; countryId: string }) => {
        await locationApi.addState(values);
        const statesResponse = await locationApi.getStates();
        setStates(statesResponse.data);
        setStateModalVisible(false);
    };

    const handleAddCity = async (values: { name: string; stateId: string, startPincode: number, endPincode: number }) => {
        await locationApi.addCity(values);
        const citiesResponse = await locationApi.getCities();
        setCities(citiesResponse.data);
        setCityModalVisible(false);
    };

    const handleUpdateCountryStatus = async (countryId: string, status: string) => {
        await locationApi.updateCountryStatus(countryId, status);
        const countriesResponse = await locationApi.getCountries();
        setCountries(countriesResponse.data);
    };

    const handleUpdateStateStatus = async (stateId: string, status: string) => {
        await locationApi.updateStateStatus(stateId, status);
        const statesResponse = await locationApi.getStates();
        setStates(statesResponse.data);
    };

    const handleUpdateCityStatus = async (cityId: string, status: string) => {
        await locationApi.updateCityStatus(cityId, status);
        const citiesResponse = await locationApi.getCities();
        setCities(citiesResponse.data);
    };

    const countryColumns: ColumnsType<Country> = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Code', dataIndex: 'code', key: 'code' },
        { title: 'Status', dataIndex: 'status', key: 'status' },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <>
                    <Button onClick={() => handleUpdateCountryStatus(record._id, record.status === 'active' ? 'inactive' : 'active')}>{record.status === 'active' ? "Deactivate" : "Activate"}</Button>
                </>
            ),
        },
    ];

    const stateColumns: ColumnsType<State> = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        {
            title: 'Country',
            key: 'country',
            render: (text, record) => {
                const country = countries.find(country => country._id === record.country);
                return country ? country.name : 'Unknown Country';
            },
        },
        { title: 'Status', dataIndex: 'status', key: 'status' },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                
                <>
                    <Button onClick={() => handleUpdateStateStatus(record._id, record.status === 'active' ? 'inactive' : 'active')}>{record.status === 'active' ? "Deactivate" : "Activate"}</Button>
                </>
            ),
        },
    ];

    const cityColumns: ColumnsType<City> = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        {
            title: 'State',
            key: 'state',
            render: (text, record) => {
                const state = states.find(state => state._id === record.state);
                return state ? state.name : 'Unknown State';
            },
        },
        {
            title: 'Country',
            key: 'country',
            render: (text, record) => {
                const state = states.find(state => state._id === record.state);
                const country = state ? countries.find(country => country._id === state.country) : null;
                return country ? country.name : 'Unknown Country';
            },
        },
        { title: 'Status', dataIndex: 'status', key: 'status' },
        {
            title: 'Pincodes',
            key: 'pincodes',
            render: (text, record) => (
                <>
                    <Button onClick={() => { setSelectedCity(record); setPincodeModalVisible(true); }}>Manage Pincodes</Button>
                </>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <>
                    <Button onClick={() => handleUpdateCityStatus(record._id, record.status === 'active' ? 'inactive' : 'active')}>{record.status === 'active' ? "Deactivate" : "Activate"}</Button>
                </>
            ),
        },
    ];
    

    return (
        <div className='locations-master-data'>
            <CustomPageHeader title="Locations" />
            <Tabs defaultActiveKey="1">
                <TabPane tab="Countries" key="1">
                    <div>
                        <Table columns={countryColumns} dataSource={countries} rowKey="_id" />
                        <Button className='add-new-btn' onClick={() => setCountryModalVisible(true)}>Add Country</Button>
                    </div>
                </TabPane>
                <TabPane tab="States" key="2">
                    <div>
                        <Table columns={stateColumns} dataSource={states} rowKey="_id" />
                        <Button className='add-new-btn' onClick={() => setStateModalVisible(true)}>Add State</Button>
                    </div>

                </TabPane>
                <TabPane tab="Cities" key="3">
                    <div>
                        <Table columns={cityColumns} dataSource={cities} rowKey="_id" />
                        <Button className='add-new-btn' onClick={() => setCityModalVisible(true)}>Add City</Button>
                    </div>
                </TabPane>
            </Tabs>





            <Modal
                title="Add Country"
                open={countryModalVisible}
                onCancel={() => setCountryModalVisible(false)}
                footer={null}
                destroyOnClose
            >
                <Form onFinish={handleAddCountry}>
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input  placeholder='Country Name'/>
                    </Form.Item>
                    <Form.Item name="code" label="Code" rules={[{ required: true }]}>
                        <Input placeholder='Country Code'/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Add</Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Add State"
                open={stateModalVisible}
                onCancel={() => setStateModalVisible(false)}
                footer={null}
                destroyOnClose
            >
                <Form onFinish={handleAddState}>
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input placeholder='State Name'/>
                    </Form.Item>
                    <Form.Item name="countryId" label="Country" rules={[{ required: true }]}>
                        <Select placeholder='Select Country'>
                            {countries.map((country) => (
                                <Option key={country._id} value={country._id}>
                                    {country.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Add</Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Add City"
                open={cityModalVisible}
                onCancel={() => setCityModalVisible(false)}
                footer={null}
                destroyOnClose
            >
                <Form onFinish={handleAddCity}>
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input placeholder='City Name'/>
                    </Form.Item>
                    <Form.Item name="stateId" label="State" rules={[{ required: true }]}>
                        <Select placeholder='Select State'>
                            {states.map((state) => (
                                <Option key={state._id} value={state._id}>
                                    {state.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="startPincode" label="Start Pincode" rules={[{ required: false }]}>
                        <Input placeholder='Start Pincode'/>
                    </Form.Item>
                    <Form.Item name="endPincode" label="End Pincode" rules={[{ required: false }]}>
                        <Input placeholder='End Pincode'/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Add</Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Manage Pincodes"
                open={pincodeModalVisible}
                onCancel={() => setPincodeModalVisible(false)}
                footer={null}
                destroyOnClose
            >
                <Table
                    columns={[
                        { title: 'Pincode', dataIndex: 'code', key: 'code' },
                        { title: 'Status', dataIndex: 'status', key: 'status' },
                        {
                            title: 'Action',
                            key: 'action',
                            render: (text, record: Pincode) => (
                                <Button onClick={() => handleUpdatePincodeStatus(selectedCity!._id, record._id, record.status === 'active' ? 'inactive' : 'active')}>
                                    {record.status === 'active' ? 'Deactivate' : 'Activate'}
                                </Button>
                            ),
                        },
                    ]}
                    dataSource={selectedCity?.pincodes || []}
                    rowKey="_id"
                />
                <Form onFinish={handleAddPincode}>
                    <Form.Item name="code" label="Pincode" rules={[{ required: true }]}>
                        <Input placeholder='Pincode' />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Add Pincode</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Locations;
