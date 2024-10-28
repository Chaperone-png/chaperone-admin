import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, message, Modal, Row, Select, Upload, UploadFile, UploadProps } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { InboxOutlined } from '@ant-design/icons';
import { Nursery, nurseryValidationRules } from '../types';
import { nurseryApi } from '../services/apis/nurseries';
import { locationApi } from '../services/apis/locationApi';

interface RegisterNurseryProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit?: (values: Nursery) => void;
    nursery?: any;
    updateNurseries: any;
}

const { Option } = Select;

const RegisterNursery: React.FC<RegisterNurseryProps> = ({ visible, onCancel, onSubmit, nursery, updateNurseries }) => {
    const [form] = Form.useForm();
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);
    const [selectedState, setSelectedState] = useState(null);
    const [loadingStates, setLoadingStates] = useState(true);
    const [loadingCities, setLoadingCities] = useState(false);

    useEffect(() => {
        // Fetch states from API
        locationApi.getStates().then((response) => {
            setLoadingStates(false);
            if (response.data && Array.isArray(response.data)) {
                setStates(response.data);
            }
        });
    }, []);

    useEffect(() => {
        if (nursery) {
            form.setFieldsValue({
                name: nursery.name,
                contactPerson: nursery.contactPerson.name,
                contactNumber: nursery.phone,
                email: nursery.contactPerson.email,
                state: nursery.address.state,
                city: nursery.address.city,
                pincode: nursery.address.pincode,
                fullAddress: nursery.address.addressLine,
            });

            setSelectedState(nursery.address.state._id);
            form.setFieldValue('state',nursery.address.state._id)
            form.setFieldValue('city',nursery.address.city._id)

            // Fetch cities based on the state of the existing nursery
            setLoadingCities(true);
            locationApi.getCitiesByStateId(nursery.address.state._id).then((response) => {
                if (response.data && Array.isArray(response.data)) {
                    setCities(response.data);
                }
                setLoadingCities(false);
            });

            // Populate fileList state with existing image URLs
            setFileList(
                nursery.images.map((imageUrl: string, index: number) => ({
                    uid: index.toString(),
                    name: `Image ${index + 1}`,
                    status: 'done',
                    url: imageUrl,
                }))
            );
        } else {
            form.resetFields();
            setFileList([]);
        }
    }, [nursery, form]);

    const handleUploadChange = (info: UploadChangeParam) => {
        const { fileList } = info;
        setFileList(fileList);
        setImageFiles(fileList.map((file) => file.originFileObj).filter((file) => file) as File[]);
    };

    const handleCancel = () => {
        form.resetFields();
        setFileList([]);
        onCancel();
    };

    const handleSubmit = async (values: any) => {
        setIsLoading(true);
        const formData = new FormData();
        fileList.forEach((file: any) => {
            if (file.url) {
                formData.append('urls', file.url);
            } else {
                formData.append('images', file.originFileObj);
            }
        });
        console.log(Object.keys(values),'VALUESSSSSSSSSS')
        Object.keys(values).forEach((value: any) => {
            if (value !== 'images' || value !== 'url') {
                formData.append(value, values[value] as any);
            }
        });
        try {
            if (!nursery) {
                const response = await nurseryApi.addNursery(formData);
                await updateNurseries();
                message.success('New nursery registered');
            } else {
                const response = await nurseryApi.editNursery(nursery._id, formData);
                await updateNurseries();
                message.success('Nursery details updated');
            }
            setIsLoading(false);
            onCancel();
        } catch (error) {
            setIsLoading(false);
            console.log(error, 'Error');
        }
    };

    const uploadProps: UploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setFileList([...fileList, file]);
            return false;
        },
        fileList,
    };

    const handleStateChange = (value: any) => {
        setSelectedState(value);
        setLoadingCities(true);
        form.resetFields(['city'])

        // Fetch cities based on selected state from API
        locationApi.getCitiesByStateId(value)
            .then((response) => {
                if (response?.data && Array.isArray(response.data)) {
                    setCities(response.data);
                }
                setLoadingCities(false);
            })
            .catch((error) => {
                console.error('There was an error fetching the cities!', error);
                setLoadingCities(false);
            });
    };

    const handleCityClick = () => {
        if (!selectedState) {
            message.warning('Please select a state first');
        }
    };

    return (
        <Modal
            title={nursery ? "Edit Nursery" : "Add New Nursery"}
            open={visible}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel} disabled={isLoading}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={() => form.submit()} disabled={isLoading} loading={isLoading}>
                    {nursery ? 'Update' : 'Save'}
                </Button>,
            ]}
            centered
            bodyStyle={{ maxHeight: 'calc(100vh - 180px)', overflowY: 'auto' }}
            className="custom-modal"
            destroyOnClose
            width={600}
        >
            <Form form={form} onFinish={handleSubmit} layout="vertical">
                <Form.Item label="Nursery Name" name="name" rules={nurseryValidationRules.name}>
                    <Input placeholder="Enter nursery name" />
                </Form.Item>
                <Form.Item label="Contact Person Name" name="contactPerson" rules={nurseryValidationRules.contactPerson}>
                    <Input placeholder="Enter contact person name" />
                </Form.Item>
                <Form.Item label="Contact Number" name="contactNumber" rules={nurseryValidationRules.contactNumber}>
                    <Input placeholder="Enter contact number" />
                </Form.Item>
                <Form.Item label="Email" name="email" rules={nurseryValidationRules.email}>
                    <Input placeholder="Enter email" />
                </Form.Item>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8} lg={12}>
                        <Form.Item label="State" name="state" rules={nurseryValidationRules.state}>
                            <Select
                                placeholder="Select state"
                                onChange={handleStateChange}
                                loading={loadingStates}
                            >
                                {states.map((state) => (
                                    <Option key={state._id} value={state._id}>{state.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={12}>
                        <Form.Item label="City" name="city" rules={nurseryValidationRules.city}>
                            <Select
                                placeholder="Select city"
                                onClick={handleCityClick}
                                loading={loadingCities}
                                disabled={!selectedState}
                            >
                                {cities.map((city) => (
                                    <Option key={city._id} value={city._id}>{city.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item label="Pincode" name="pincode" rules={nurseryValidationRules.pincode}>
                    <Input placeholder="Enter pincode" />
                </Form.Item>
                <Form.Item label="Full address" name="fullAddress" rules={nurseryValidationRules.fullAddress}>
                    <Input placeholder="Enter full address" />
                </Form.Item>
                {!nursery && (
                    <Form.Item label="Create Password" name="password" rules={nurseryValidationRules.password}>
                        <Input.Password placeholder="Enter password" />
                    </Form.Item>
                )}
                <Form.Item label="Nursery Images" name="images">
                    <Upload
                        listType="picture-card"
                        multiple
                        {...uploadProps}
                        onChange={handleUploadChange}
                    >
                        <div>
                            <InboxOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default RegisterNursery;
