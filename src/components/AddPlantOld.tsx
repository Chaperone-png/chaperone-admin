import { InfoCircleOutlined, MinusCircleOutlined, PlusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, ColorPicker, Form, Input, List, message, Radio, Row, Space, Tooltip, Upload } from 'antd';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { nurseryPlantApi } from '../services/apis/nurseryPlantApi';
import { plantApi } from '../services/apis/plantApi';
import { isComboOptions } from '../utils/constants';
import AddSizeModal from './AddSizeModal';
import PlantFormFields from './PlantFormFields';
import PotFormFields from './PotFormFields';

const AddPlantOld = () => {
    const [isAddSizeModalVisible, setIsAddSizeModalVisible] = useState(false);
    const [currentSize, setCurrentSize] = useState('');
    const [plantSizes, setPlantSizes] = useState<any[]>([]);
    const [newCareTip, setNewCareTip] = useState('');
    const [sizeDetailsVisible, setSizeDetailsVisible] = useState<boolean>(false);
    const [showPlanters, setShowPlanters] = useState<boolean>(false);
    const [selectedPlanters, setSelectedPlanters] = useState<string[]>([])
    const [isCombo, setIsCombo] = useState<string>("no"); // Default value for combo
    const [planterSizesMap, setPlanterSizesMap] = useState<{ [planter: string]: string[] }>({});
    const [productTypes, setProductTypes] = useState<any[]>([]);
    const [plantBenefits, setPlantBenefits] = useState([]);
    const [customBenefits, setCustomBenefits] = useState<string[]>([]);
    const [customBenefit, setCustomBenefit] = useState('');
    const [about, setAbout] = useState('')
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

    const [selectedColors, setSelectedColors] = useState<any>({});
    const [isSaving, setIsSaving] = useState(false)
    const [form] = Form.useForm()
    useEffect(() => {
        // Fetch plant sizes when the component mounts
        plantApi.getPlantSizes()
            .then(response => {
                setPlantSizes(response.data);
            })
            .catch(error => {
                console.error('Error fetching plant sizes:', error);
            });
    }, []);
    useEffect(() => {
        // Fetch plant benefits when the component mounts
        plantApi
            .getPlantBenefits()
            .then((response) => {
                setPlantBenefits(response.data);
            })
            .catch((error) => {
                console.error('Error fetching plant benefits:', error);
            });
    }, [])
    const [fileList, setFileList] = useState<any[]>([]); // State to hold uploaded files

    const [careTips, setCareTips] = useState<string[]>([]);
    const [faqs, setFaqs] = useState<any[]>([]);


    const [selectedImageColors, setSelectedImageColors] = useState<any>({});



    const handleFinish = async (values: any) => {
        console.log('Form values:', values, selectedColors);
        setIsSaving(true);

        const formData = new FormData();
        formData.append('nurseryId', values.nurseryId);
        formData.append('plantName', values.productName);
        formData.append('productTypeId', values.productCategoryId);
        formData.append('plantTypeId', values.plantTypeId);

        selectedSizes.forEach((size, index) => {
            formData.append(`availableSizes[${index}][plantSizeId]`, size);
            formData.append(`availableSizes[${index}][detail][size]`, values[`${size}_size`]);
            formData.append(`availableSizes[${index}][detail][price]`, values[`${size}_price`]);
            formData.append(`availableSizes[${index}][detail][mrp]`, values[`${size}_price`]);
            formData.append(`availableSizes[${index}][detail][discount]`, values[`${size}_discount`] || 0);
            formData.append(`availableSizes[${index}][detail][quantity]`, values[`${size}_quantity`] || 0);
            const colors = selectedColors[size];
            console.log(colors, 'COLORS')
            colors.forEach((selectColor: any, colorIndex: any) => {
                formData.append(`availableSizes[${index}][detail][colors][${colorIndex}][colorName]`, selectColor.toHexString?.() || selectColor);
                formData.append(`availableSizes[${index}][detail][colors][${colorIndex}][quantity]`, values[`${size}_colorQuantity_${colorIndex}`]);
            });
        });

        formData.append('combo[isCombo]', values.isCombo);
        formData.append('combo[count]', values.comboCount || 0);
        formData.append('about', values.about);

        careTips.forEach((careTip, index) => {
            formData.append(`careTips[${index}]`, careTip);
        });

        faqs.forEach((faq, index) => {
            formData.append(`faqs[${index}][question]`, faq.question);
            formData.append(`faqs[${index}][answer]`, faq.answer);
        });

        fileList.forEach((file, index) => {
            formData.append('images', file.originFileObj);
            const selectedColor = selectedImageColors[file.uid];

            if (selectedColor) {
                formData.append(`imagesColors[${index}]`, selectedColor); // Assuming 'imageColors' is the field to store selected image colors
            } else {
                // const sizes = Object.keys(selectedColors);
                // selectedColors[sizes[0]]

            }
        });

        try {
            const response = await nurseryPlantApi.createNurseryPlant(values.nurseryId, formData);
            console.log(response);
            message.success('Plant uploaded successfully');
        } catch (error) {
            console.log(error, 'ERRRRRRRRRRRRRR');
        }
    };
    const handleColorChange = (fileUid: any, color: any) => {
        setSelectedImageColors((prevState: any) => ({
            ...prevState,
            [fileUid]: color
        }));
    };
    const handleAddSizeModalCancel = () => {
        setIsAddSizeModalVisible(false)
    }
    const addColorPicker = (size: string) => {
        setSelectedColors((prevColors: any) => ({
            ...prevColors,
            [size]: [...(prevColors[size] || []), ''] // Add empty string as placeholder for new color
        }));
    };

    const updateColor = (index: number, color: any, size: string) => {
        setSelectedColors((prevColors: any) => {
            const newColors = [...prevColors[size]];
            newColors[index] = color;
            return {
                ...prevColors,
                [size]: newColors
            };
        });
    };


    const removeColor = (index: number, size: string) => {
        setSelectedColors((prevColors: any) => {
            const newColors = prevColors[size].filter((_: any, idx: any) => idx !== index);
            return {
                ...prevColors,
                [size]: newColors
            };
        });
    };
    const handlePlantersChange = (values: string[]) => {
        setSelectedPlanters(values);
    };
    // Function to handle file upload
    const handleFileChange = (info: any) => {
        let fileList = [...info.fileList];

        // Limit the number of uploaded files
        fileList = fileList.slice(-4);

        // Update state
        setFileList(fileList);
    };
    const handleCustomBenefitChange = (value: string) => {
        setCustomBenefit(value);
    };

    const addCustomBenefit = (e?: any) => {
        e?.preventDefault?.()
        if (customBenefit.trim() !== '') {
            setCustomBenefits([...customBenefits, customBenefit]);
            setCustomBenefit('');
        }
    };
    const addCareTip = (e: any) => {
        e?.preventDefault?.()

        if (newCareTip.trim()) {
            setCareTips([...careTips, newCareTip]);
            setNewCareTip('');
        }
    };

    const removeCareTip = (index: number) => {
        setCareTips(careTips.filter((_, i) => i !== index));
    };
    const addFAQ = () => {
        setFaqs([...faqs, { question: '', answer: '' }]);
    };

    const updateFAQ = (index: number, key: any, value: any) => {
        const updatedFaqs = [...faqs];
        updatedFaqs[index][key] = value;
        setFaqs(updatedFaqs);
    };

    const removeFAQ = (index: number) => {
        const updatedFaqs = [...faqs];
        updatedFaqs.splice(index, 1);
        setFaqs(updatedFaqs);
    };
    const handleSizeChange = (checkedValues: string[]) => {
        setSelectedSizes(checkedValues);
        setSizeDetailsVisible(checkedValues.length > 0);
        setSelectedColors((prevColors: any) => {
            const updatedColors: { [size: string]: string[] } = {};
            checkedValues.forEach(size => {
                updatedColors[size] = prevColors[size] || ['#55AD59'];
            });
            return updatedColors;
        });
    };
    const handlePotSizeChange = (checkedValues: string[], planter: string) => {
        setPlanterSizesMap(prevSizesMap => ({
            ...prevSizesMap,
            [planter]: checkedValues
        }));
    };

    const renderUploadItem = (originNode: any, file: any, fileList: any, actions: any) => {
        const sizes = Object.keys(selectedColors);
        return (
            <div style={{ display: 'flex', flexDirection: 'column', }}>
                {originNode}
                <Radio.Group onChange={(e) => handleColorChange(file.uid, e.target.value)}>
                    {sizes.map(size => (
                        selectedColors[size].map((color: any) => (
                            <Radio key={color?.toHexString?.()} value={color?.toHexString?.()}>
                                <ColorPicker defaultValue={color} value={color} />
                            </Radio>
                        ))
                    ))}
                </Radio.Group>
            </div>
        );
    };
    return (
        <div>
            <Form
                scrollToFirstError
                form={form}
                // layout="vertical"
                labelCol={{ span: 8 }}  // Adjust the span as needed for label width
                wrapperCol={{ span: 15 }}  // Adjust the span as needed for form item width
                onFinish={handleFinish}
                className="add-plant-form">

                <Row gutter={16}>
                    <>
                        <Col xs={24}>
                            <Form.Item
                                label={
                                    <span>
                                        Product Name{" "}
                                        <Tooltip
                                            overlayClassName="custom-tooltip"
                                            title="This name would be visible on users search list, you can add some descriptive title. For e.g., Snake plant|keep you home cool| 24 inch"
                                            placement="right"
                                        >
                                            <InfoCircleOutlined />
                                        </Tooltip>
                                    </span>
                                }
                                name="productName"
                                rules={[{ required: true, message: "Please enter the product title" }]}
                            >
                                <Input placeholder="Product Title" />
                            </Form.Item>
                        </Col>
                        <PlantFormFields
                        />
                        <PotFormFields
                            selectedPlanters={selectedPlanters}
                            selectedColors={selectedColors}
                            addColorPicker={addColorPicker}
                            updateColor={updateColor}
                            removeColor={removeColor}
                            handlePlantersChange={handlePlantersChange}
                        />
                    </>


                </Row>
                <Row gutter={16}>
                    <Col xs={24} sm={24} >
                        <Form.Item label="Is Combo?" name="isCombo" initialValue="no">
                            <Radio.Group onChange={(e) => setIsCombo(e.target.value)}>
                                {isComboOptions.map(option => (
                                    <Radio key={option.value} value={option.value}>{option.label}</Radio>
                                ))}
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    {isCombo === "yes" && (
                        <Col xs={24} sm={24} >
                            <Form.Item label="Combo Count" name="comboCount">
                                <Input type="number" placeholder="Enter Combo Count" />
                            </Form.Item>

                        </Col>
                    )}
                </Row>

                <Col xs={24} sm={24} >
                    <Form.Item
                        label="Available Sizes (in inches)"
                        name="sizes"
                        rules={[{ required: true, message: "Please select at least one size" }]}
                    >
                        <Checkbox.Group onChange={handleSizeChange} style={{ width: '100%' }}>
                            <Row>
                                {plantSizes.map((size: any) => (
                                    <Col key={size} xs={24} >
                                        <Checkbox value={size._id}>{size.title}({size.from}-{size.to}inches)</Checkbox>
                                    </Col>
                                ))}
                            </Row>
                        </Checkbox.Group>
                    </Form.Item>
                </Col>

                {sizeDetailsVisible && (
                    <Col >
                        {selectedSizes.map(size => {
                            const sizeLabel = plantSizes.find(((plantSize: any) => plantSize._id === size))?.title;
                            return (
                                <Form.Item label={`${sizeLabel} size details`}>
                                    <Row gutter={16} >
                                        <Col >
                                            <Row gutter={16}>
                                                <Col span={24} lg={12} md={8}>
                                                    <Form.Item
                                                        label="Size (in inches)"
                                                        name={`${size}_size`}
                                                        rules={[{ required: true, message: `Please enter ${sizeLabel} size` }]}
                                                    >
                                                        <Input type="number" placeholder={`${sizeLabel} Size`} />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={24} md={8} lg={12}>
                                                    <Form.Item
                                                        label="Price"
                                                        name={`${size}_price`}
                                                        rules={[{ required: true, message: `Please enter ${sizeLabel} price` }]}
                                                    >
                                                        <Input type="number" placeholder="Price" />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={24} md={8} lg={12}>
                                                    <Form.Item
                                                        label="Discount %"
                                                        name={`${size}_discount`}
                                                    >
                                                        <Input type="number" placeholder="Discount" />
                                                    </Form.Item>
                                                </Col>
                                                {/*<Col span={24} md={8} lg={6}>
                                                            <Form.Item
                                                                label="Quantity"
                                                                name={`${size}_quantity`}
                                                                rules={[{ required: true, message: `Please enter ${sizeLabel} quantity` }]}
                                                            >
                                                                <Input type="number" placeholder="Quantity" />
                                                            </Form.Item>
                            </Col>*/}
                                                <Col span={24} >
                                                    <Form.Item
                                                        label="Select Colors"
                                                        name={`${size}_colors`}
                                                        className="color-form-item"
                                                    >
                                                        <Space direction="vertical">
                                                            {selectedColors[size]?.map((color: any, index: any) => (
                                                                <div key={index} style={{ display: 'flex', }}>
                                                                    <ColorPicker value={color} onChange={(value) => updateColor(index, value, size)}
                                                                        style={{ marginRight: '20px' }}
                                                                    />
                                                                    {" "}
                                                                    <Form.Item
                                                                        name={`${size}_colorQuantity_${index}`}
                                                                        rules={[{ required: true, message: `Please enter quantity` }]}
                                                                    >
                                                                        <Input type="number" placeholder={`Available Stock`} />
                                                                    </Form.Item>
                                                                    {" "}
                                                                    {index !== 0 && <Button
                                                                        type="text"
                                                                        htmlType="button"
                                                                        icon={<MinusCircleOutlined />}
                                                                        onClick={() => removeColor(index, size)}
                                                                        style={{ marginLeft: 8 }}
                                                                    />}
                                                                </div>
                                                            ))}
                                                            <Button
                                                                type="dashed"
                                                                htmlType="button"
                                                                onClick={() => addColorPicker(size)}
                                                            >
                                                                Add available colors
                                                            </Button>
                                                        </Space>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Form.Item>
                            )
                        })}
                    </Col>
                )}

                <Row gutter={16}>
                    <Col xs={24}>
                        <Form.Item
                            label="About this product"
                            name="about"
                            rules={[{ required: true, message: "Please enter the description" }]}
                        >
                            <ReactQuill

                                style={{ height: '200px', marginBottom: '80px' }} // 
                                value={about}
                                onChange={setAbout}
                                modules={{
                                    toolbar: [
                                        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                        [{ size: [] }],
                                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                        [{ 'list': 'ordered' }, { 'list': 'bullet' },
                                        { 'indent': '-1' }, { 'indent': '+1' }],
                                        ['link', 'image', 'video'],
                                        ['clean']
                                    ],
                                }}
                                formats={[
                                    'header', 'font', 'size',
                                    'bold', 'italic', 'underline', 'strike', 'blockquote',
                                    'list', 'bullet', 'indent',
                                    'link', 'image', 'video'
                                ]}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginBottom: '20px' }}>
                    <Col xs={24}>
                        <Form.Item label="Upload Images" name="images">
                            <Upload
                                fileList={fileList}
                                onChange={handleFileChange}
                                beforeUpload={() => false} // To prevent default file upload behavior
                                listType="picture-card"
                                itemRender={renderUploadItem}
                            >
                                {fileList.length < 4 && <div>
                                    <UploadOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>}
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>

                <Col xs={24} sm={24}>
                    <Form.Item
                        label="Select Plant Benefits"
                        name="plantBenefits"
                    // rules={[{ required: true, message: 'Please select at least one plant benefit' }]}
                    >
                        <Checkbox.Group>
                            {plantBenefits.map((benefit: any) => (
                                <Checkbox key={benefit._id} value={benefit._id}>
                                    {benefit.title}
                                </Checkbox>
                            ))}


                        </Checkbox.Group>

                    </Form.Item>
                    {customBenefits.length > 0 &&
                        <Col lg={{ offset: 8 }}>
                            <Row>

                                <Col>
                                    <label>Added Benefits:</label>
                                    {customBenefits.length > 0 && <List
                                        dataSource={customBenefits}
                                        renderItem={(benefit, index) => (
                                            <List.Item
                                                actions={[<MinusCircleOutlined onClick={() => {
                                                    // If the checkbox is unchecked, remove the benefit from the customBenefits array
                                                    const updatedBenefits = customBenefits.filter((b: string) => b !== benefit);
                                                    setCustomBenefits(updatedBenefits);
                                                }} />]}
                                            >
                                                {benefit}
                                            </List.Item>
                                        )}
                                    />}
                                </Col>
                            </Row>
                        </Col>}
                    <Col>
                        <Form.Item label='Add Benefit'>
                            <Input
                                value={customBenefit}
                                onChange={(e) => handleCustomBenefitChange(e.target.value)}
                                placeholder="Enter Custom Benefit"
                                onPressEnter={addCustomBenefit}

                            />
                        </Form.Item>

                    </Col>
                    <Col style={{ marginTop: '5px' }} lg={{ offset: 8 }}>
                        <Form.Item label=''>
                            <Button onClick={addCustomBenefit}

                                htmlType="button">Add Benefit</Button>
                        </Form.Item>
                    </Col>
                </Col>
                <Row gutter={16}>
                    <Col lg={{ offset: 8 }}>
                        <Row>
                            {careTips.length > 0 &&
                                <Col>
                                    <label>Plant Care Tips:</label>
                                    {careTips.length > 0 && <List
                                        dataSource={careTips}
                                        renderItem={(benefit, index) => (
                                            <List.Item
                                                actions={[<MinusCircleOutlined onClick={() => {
                                                    // If the checkbox is unchecked, remove the benefit from the customBenefits array
                                                    const updatedBenefits = careTips.filter((b: string) => b !== benefit);
                                                    setCareTips(updatedBenefits);
                                                }} />]}
                                            >
                                                {benefit}
                                            </List.Item>
                                        )}
                                    />}
                                </Col>}
                        </Row>
                    </Col>
                    <Col span={24}>
                        {newCareTip !== null && (
                            <Form.Item label='Care Tips'>
                                <Input
                                    placeholder="Enter care tip"
                                    value={newCareTip}
                                    onChange={(e) => setNewCareTip(e.target.value)}
                                    onPressEnter={addCareTip}
                                    addonAfter={<Button
                                        htmlType="button"

                                        onClick={addCareTip}>Add Care Tip</Button>}
                                />
                            </Form.Item>
                        )}
                    </Col>
                    <Col xs={24}>
                        <>
                            <Row>
                                {faqs.length > 0 && <Col span={24} >
                                    <Form.Item label='Frequently asked questions'>
                                        {faqs.map((faq, index) => (
                                            <div key={index} style={{ marginBottom: '8px' }}>
                                                <Input
                                                    placeholder="Question"
                                                    value={faq.question}
                                                    onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                                                />
                                                <Input
                                                    placeholder="Answer"
                                                    value={faq.answer}
                                                    style={{ marginTop: '8px' }}
                                                    onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                                                />
                                                <Button
                                                    htmlType="button"
                                                    style={{ marginTop: '8px' }}

                                                    icon={<MinusCircleOutlined />} onClick={() => removeFAQ(index)}>
                                                    Remove FAQ
                                                </Button>
                                            </div>
                                        ))}
                                    </Form.Item>

                                </Col>}
                                <Col span={12} lg={{ offset: 8 }}>
                                    <Button
                                        htmlType="button"

                                        icon={<PlusCircleOutlined />} onClick={addFAQ}>
                                        Add FAQ
                                    </Button>
                                </Col>
                            </Row>


                        </>
                    </Col>
                </Row>

                <Col span={24} lg={{ offset: 8 }} style={{ marginTop: '10px', textAlign: 'center' }}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Col>


                <AddSizeModal
                    visible={isAddSizeModalVisible}
                    onCancel={handleAddSizeModalCancel}
                    currentSize={currentSize}
                    onOk={(values) => {
                        // Handle form submission here and update state accordingly
                        console.log('Submitted values:', values);
                        setIsAddSizeModalVisible(false);
                    }}
                />
            </Form>
        </div>
    )
}

export default AddPlantOld