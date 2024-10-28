import { Button, Form, Input, Modal, Table } from 'antd'
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react'
import { locationApi } from '../../../services/apis/locationApi';
interface Country {
    _id: string;
    name: string;
    code: string;
    status: string;
}
const CountryManagement = () => {
    const [countries, setCountries] = useState<Country[]>([]);

    const [countryModalVisible, setCountryModalVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const [countriesResponse] = await Promise.all([
                locationApi.getCountries(),
            ]);
            setCountries(countriesResponse.data);
        };
        fetchData();
    }, []);
    const handleAddCountry = async (values: { name: string; code: string }) => {
        await locationApi.addCountry(values);
        const countriesResponse = await locationApi.getCountries();
        setCountries(countriesResponse.data);
        setCountryModalVisible(false);
    };

    const handleUpdateCountryStatus = async (countryId: string, status: string) => {
        await locationApi.updateCountryStatus(countryId, status);
        const countriesResponse = await locationApi.getCountries();
        setCountries(countriesResponse.data);
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
    return (
        <div>
            <h2>Countries</h2>
            <Button onClick={() => setCountryModalVisible(true)}>Add Country</Button>
            <Table columns={countryColumns} dataSource={countries} rowKey="_id" />
            <Modal
                title="Add Country"
                open={countryModalVisible}
                onCancel={() => setCountryModalVisible(false)}
                footer={null}
                destroyOnClose
            >
                <Form onFinish={handleAddCountry}>
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="code" label="Code" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Add</Button>
                    </Form.Item>
                </Form>
            </Modal>

        </div>
    )
}

export default CountryManagement