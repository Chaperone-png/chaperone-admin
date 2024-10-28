import { InboxOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, List, message, Row, Select, Steps, Upload, UploadFile, UploadProps } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { locationApi } from '../../services/apis/locationApi';
import { maaliApi } from '../../services/apis/maaliApi';
import { City, MaaliType, State } from '../../types';
import CustomPageHeader from '../PageHeader';
const { Option } = Select;
const { Step } = Steps;
const CreateMaaliForm = ({ maali, updateMaalis, onCancel }: { maali?: MaaliType | null, onCancel?: any, updateMaalis?: any }) => {
    const [newPincode, setNewPincode] = useState('');
    const [form] = Form.useForm();
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [selectedState, setSelectedState] = useState<string | null>(null);
    const [loadingStates, setLoadingStates] = useState(true);
    const [loadingCities, setLoadingCities] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<any>({});
    const [aadharImage, setAadharImage] = useState<UploadFile | null>(null);
    const [panImage, setPanImage] = useState<UploadFile | null>(null);
    const [dlImage, setDlImage] = useState<UploadFile | null>(null);
    const [voterIdImage, setVoterIdImage] = useState<UploadFile | null>(null);
    const [pincodes, setPincodes] = useState<string[]>([]);


    const handleCityClick = () => {
        if (!selectedState) {
            message.warning('Please select a state first');
        }
    };
    const handleSubmit = async () => {
        setIsLoading(true);
        const finalFormData = new FormData();
        console.log(aadharImage, 'AadharImage')
        console.log(panImage, 'panImage')
        console.log(dlImage, 'dlImage')
        console.log(voterIdImage, 'voterIdImage')

        if (aadharImage) finalFormData.append('aadharImage', aadharImage as any);
        if (panImage) finalFormData.append('panImage', panImage as any);
        if (dlImage) finalFormData.append('dlImage', dlImage as any);
        if (voterIdImage) finalFormData.append('voterIdImage', voterIdImage as any);
        console.log(formData, 'Form data..............')
        Object.keys(formData).forEach((key) => {
            if (key === 'dob') {
                finalFormData.append(key, formData[key].format('YYYY-MM-DD'));
            } else {
                finalFormData.append(key, formData[key] || '');
            }
        });
        finalFormData.append('workPincodes', JSON.stringify(pincodes))
        try {
            if (!maali) {
                await maaliApi.createMaaliAccount(finalFormData);
                await updateMaalis?.();
                message.success('New Maali added successfully');
            } else {
                await maaliApi.updateMaaliDetails(maali._id, finalFormData);
                await updateMaalis?.();
                message.success('Maali details updated successfully');
            }
            setIsLoading(false);
            onCancel?.();
        } catch (error) {
            console.log(error, 'error')
            setIsLoading(false);
            console.error(error);
            message.error('An error occurred while saving Maali details');
        }
    };
    const nextStep = async () => {
        try {
            await form.validateFields();
            const values = form.getFieldsValue();
            setFormData((prevData: any) => ({ ...prevData, ...values }));
            setCurrentStep(currentStep + 1);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };
    const handleUploadChange = (info: any, docType: string) => {
        const { fileList } = info;

        if (fileList.length > 0) {
            const file = fileList[0];
            switch (docType) {
                case 'aadhar':
                    setAadharImage(file);
                    break;
                case 'pan':
                    setPanImage(file);
                    break;
                case 'dl':
                    setDlImage(file);
                    break;
                case 'voter':
                    setVoterIdImage(file);
                    break;
                default:
                    break;
            }
        } else {
            switch (docType) {
                case 'aadhar':
                    setAadharImage(null);
                    break;
                case 'pan':
                    setPanImage(null);
                    break;
                case 'dl':
                    setDlImage(null);
                    break;
                case 'voter':
                    setVoterIdImage(null);
                    break;
                default:
                    break;
            }
        }
    };
    const addPincode = () => {
        if (newPincode && !pincodes.includes(newPincode)) {
            setPincodes([...pincodes, newPincode]);
            setNewPincode('');
        }
    };

    const removePincode = (pincodeToRemove: string) => {
        setPincodes(pincodes.filter(pincode => pincode !== pincodeToRemove));
    };
    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const uploadProps = (docType: string): UploadProps<any> => ({
        onRemove: (file) => {
            handleUploadChange({ fileList: [] }, docType); // Clear the file from state
        },
        beforeUpload: (file) => {
            handleUploadChange({ fileList: [file] }, docType); // Set the file to state
            return false; // Prevent automatic upload
        },
        fileList: (() => {
            switch (docType) {
                case 'aadhar':
                    return aadharImage ? [aadharImage] : [];
                case 'pan':
                    return panImage ? [panImage] : [];
                case 'dl':
                    return dlImage ? [dlImage] : [];
                case 'voter':
                    return voterIdImage ? [voterIdImage] : [];
                default:
                    return [];
            }
        })(),
    });
    useEffect(() => {
        if (maali?.state) {
            handleStateChange(maali.state._id)
        } else {
            locationApi.getStates().then((response) => {
                setLoadingStates(false);
                if (response.data && Array.isArray(response.data)) {
                    setStates(response.data);
                }
            });
        }

    }, []);

    useEffect(() => {
        if (maali) {
            form.setFieldsValue({
                firstName: maali.firstName,
                middleName: maali.middleName,
                lastName: maali.lastName,
                dob: moment(maali.dob),
                state: maali.state._id,
                city: maali.city._id,
                pincode: maali.pincode,
                fullAddress: maali.fullAddress,
                email: maali.email,
                mobileNumber: maali.mobileNumber,
                accountNumber: maali.bankDetails.accountNumber,
                ifscCode: maali.bankDetails.ifscCode,
                bankName: maali.bankDetails.bankName,
            });
            setPincodes(maali.workPincodes || [])
            setAadharImage(maali?.docInfo?.aadharImage?.image ? {
                uid: 'aadhar-image',
                name: 'Aadhar Image',
                status: 'done',
                url: maali?.docInfo?.aadharImage?.image,
            } : null);

            setPanImage(maali?.docInfo?.panImage?.image ? {
                uid: 'pan-image',
                name: 'PAN Image',
                status: 'done',
                url: maali?.docInfo?.panImage?.image,
            } : null);

            setDlImage(maali?.docInfo?.drivingLicense?.image ? {
                uid: 'dl-image',
                name: 'Driving License Image',
                status: 'done',
                url: maali?.docInfo?.drivingLicense?.image,
            } : null);

            setVoterIdImage(maali?.docInfo?.voterIdCardImage?.image ? {
                uid: 'voter-id-image',
                name: 'Voter ID Image',
                status: 'done',
                url: maali?.docInfo?.voterIdCardImage?.image,
            } : null);
        } else {
            form.resetFields();
            setAadharImage(null);
            setPanImage(null);
            setDlImage(null);
            setVoterIdImage(null);
        }
    }, [maali, form]);

    const handleStateChange = (value: string) => {
        setSelectedState(value);
        setLoadingCities(true);
        form.resetFields(['city']);

        locationApi.getCitiesByStateId(value).then((response) => {
            if (response?.data && Array.isArray(response.data)) {
                setCities(response.data);
            }

            setLoadingCities(false);
        }).catch((error) => {
            console.error('There was an error fetching the cities!', error);
            setLoadingCities(false);

        });
    };

    const steps = [
        {
            title: 'Basic Details',
            content: (
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
            ),
        },
        {
            title: 'Address Details',
            content: (
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
                                        <Option key={state._id} value={state._id}>
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
                                        <Option key={city._id} value={city._id}>
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
                                <Input placeholder="Pincode" />
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
            ),
        },
        {
            title: 'Contact Details',
            content: (
                <Form layout="vertical" form={form}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
                            >
                                <Input placeholder="Email" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="mobileNumber"
                                label="Contact Details"
                                rules={[{ required: true, message: 'Please enter contact details' }]}
                            >
                                <Input placeholder="Contact Details" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            ),
        },
        {
            title: 'Bank Details',
            content: (
                <Form layout="vertical" form={form}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="accountNumber"
                                label="Account Number"
                                rules={[{ required: true, message: 'Please enter account number' }]}
                            >
                                <Input placeholder="Account Number" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="ifscCode"
                                label="IFSC Code"
                                rules={[{ required: true, message: 'Please enter IFSC code' }]}
                            >
                                <Input placeholder="IFSC Code" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="bankName"
                                label="Bank Name"
                                rules={[{ required: true, message: 'Please enter bank name' }]}
                            >
                                <Input placeholder="Bank Name" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            ),
        },
        {
            title: 'Work Locations',
            content: (
                <div>
                    <Form layout="inline" onFinish={addPincode}>
                        <Form.Item>
                            <Input
                                placeholder="Enter Pincode"
                                value={newPincode}
                                onChange={(e) => setNewPincode(e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Add Pincode
                            </Button>
                        </Form.Item>
                    </Form>
                    <List
                        size="small"
                        bordered
                        dataSource={pincodes}
                        renderItem={(item) => (
                            <List.Item
                                actions={[
                                    <Button type="link" onClick={() => removePincode(item)}>
                                        Remove
                                    </Button>,
                                ]}
                            >
                                {item}
                            </List.Item>
                        )}
                    />
                </div>
            ),
        },
        {
            title: 'Upload Documents',
            content: (
                <div>
                    <Form layout="vertical" form={form}>
                        <Form.Item label="Aadhar Card">
                            <Upload.Dragger {...uploadProps('aadhar')}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            </Upload.Dragger>
                        </Form.Item>
                        <Form.Item label="PAN Card">
                            <Upload.Dragger {...uploadProps('pan')}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            </Upload.Dragger>
                        </Form.Item>
                        <Form.Item label="Driving License">
                            <Upload.Dragger {...uploadProps('dl')}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            </Upload.Dragger>
                        </Form.Item>
                        <Form.Item label="Voter ID Card">
                            <Upload.Dragger {...uploadProps('voter')}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            </Upload.Dragger>
                        </Form.Item>
                    </Form>
                </div>
            ),
        },
    ];
    return (
        <div>
            <CustomPageHeader title={!maali ? "Create New Maali" : `Update Maali: ${maali.firstName} ${maali.lastName}`} />
            <div style={{ padding: '24px', background: '#fafafa', borderRadius: '4px' }}>
                <Steps current={currentStep} style={{ marginBottom: 24 }}>
                    {steps.map((step, index) => (
                        <Step key={index} title={step.title} />
                    ))}
                </Steps>
            </div>
            <div style={{ padding: '8px', background: '#fafafa', borderRadius: '4px' }}>
                {steps[currentStep].content}
                <div style={{ marginTop: 24 }}>
                    {currentStep > 0 && (
                        <Button
                            style={{
                                margin: '0 8px',
                                fontSize: '16px',
                                padding: '10px 20px',
                                height: 'auto'
                            }}
                            onClick={prevStep}
                        >
                            Previous
                        </Button>
                    )}
                    {currentStep < steps.length - 1 && (
                        <Button
                            type="primary"
                            style={{
                                fontSize: '16px',
                                padding: '10px 20px',
                                height: 'auto'
                            }}
                            onClick={nextStep}
                        >
                            Next
                        </Button>
                    )}
                    {currentStep === steps.length - 1 && (
                        <Button
                            type="primary"
                            loading={isLoading}
                            style={{
                                fontSize: '16px',
                                padding: '10px 20px',
                                height: 'auto'
                            }}
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    )}
                </div>
            </div>

        </div>
    )
}

export default CreateMaaliForm