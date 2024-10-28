import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Modal, Select, Row, Col } from 'antd';
import { useForm } from 'antd/lib/form/Form';

const { Option } = Select;

interface Subcategory {
    name: string;
    description: string;
}

interface Faq {
    question: string;
    answer: string;
}

interface Benefit {
    title: string;
    description: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    itemType?: any;
    api: {
        createItemType: (data: any) => Promise<any>;
        updateItemType: (id: string, data: any) => Promise<any>;
    };
    labels: {
        modalTitle: string;
        titleLabel: string;
        descriptionLabel: string;
        statusLabel: string;
        subcategoryNameLabel: string;
        subcategoryDescriptionLabel: string;
        addSubcategoryButton: string;
        submitButton: string;
        faqQuestionLabel: string;
        faqAnswerLabel: string;
        benefitTitleLabel: string;
        benefitDescriptionLabel: string;
        addFaqButton: string;
        addBenefitButton: string;
    };
    isCategory?: boolean;
    hideSubcategory?: boolean;
    showFaqs?: boolean;
    showBenefits?: boolean;
}

const ItemTypeModal = ({ isOpen, onClose, onSuccess, itemType, api, labels, isCategory, hideSubcategory, showFaqs, showBenefits }: Props) => {
    const [form] = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [benefits, setBenefits] = useState<Benefit[]>([]);

    useEffect(() => {
        if (itemType) {
            form.setFieldsValue(itemType);
            setSubcategories(itemType.subcategories || []);
            setFaqs(itemType.faqs || []);
            setBenefits(itemType.benefits || []);
            itemType.faqs?.forEach((faq: Faq, index: number) => {
                form.setFieldValue(`faqs[${index}].question`, faq.question)
                form.setFieldValue(`faqs[${index}].answer`, faq.answer)
            })
            itemType.benefits?.forEach((benefit: Benefit, index: number) => {
                form.setFieldValue(`benefits[${index}].title`, benefit.title)
                form.setFieldValue(`benefits[${index}].description`, benefit.description || '')
            })
        } else {
            form.resetFields();
            form.setFieldsValue({ status: 'active' });
            setSubcategories([]);
            setFaqs([]);
            setBenefits([]);
        }
    }, [itemType, form]);

    const addSubcategory = () => setSubcategories([...subcategories, { name: '', description: '' }]);
    const addFaq = () => setFaqs([...faqs, { question: '', answer: '' }]);
    const addBenefit = () => setBenefits([...benefits, { title: '', description: '' }]);

    const updateSubcategory = (index: number, field: Partial<Subcategory>) => {
        const updatedSubcategories = subcategories.map((sc, i) => (i === index ? { ...sc, ...field } : sc));
        setSubcategories(updatedSubcategories);
    };

    const updateFaq = (index: number, field: Partial<Faq>) => {
        const updatedFaqs = faqs.map((faq, i) => (i === index ? { ...faq, ...field } : faq));
        setFaqs(updatedFaqs);
    };

    const updateBenefit = (index: number, field: Partial<Benefit>) => {
        const updatedBenefits = benefits.map((benefit, i) => (i === index ? { ...benefit, ...field } : benefit));
        setBenefits(updatedBenefits);
    };

    const removeSubcategory = (index: number) => setSubcategories(subcategories.filter((_, i) => i !== index));
    const removeFaq = (index: number) => setFaqs(faqs.filter((_, i) => i !== index));
    const removeBenefit = (index: number) => setBenefits(benefits.filter((_, i) => i !== index));

    const handleFinish = async (values: any) => {
        try {
            setIsLoading(true);
            const payload = {
                ...values,
                subcategories,
                faqs,
                benefits,
            };
            if (itemType) {
                await api.updateItemType(itemType._id, payload);
                message.success(`${labels.modalTitle} updated`);
            } else {
                await api.createItemType(payload);
                message.success(`New ${labels.modalTitle} created`);
            }
            if (onSuccess) onSuccess();
            setIsLoading(false);
            onClose();
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Something went wrong');
            setIsLoading(false);
        }
    };

    return (
        <Modal destroyOnClose open={isOpen} title={labels.modalTitle} onCancel={onClose} footer={null}>
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item name="title" label={labels.titleLabel} rules={[{ required: true, message: `Please input the ${labels.titleLabel}` }]}>
                    <Input placeholder={`Enter ${labels.titleLabel}`} />
                </Form.Item>
                <Form.Item name="description" label={labels.descriptionLabel}>
                    <Input.TextArea placeholder={`Enter ${labels.descriptionLabel}`} />
                </Form.Item>
                <Form.Item name="status" label={labels.statusLabel} rules={[{ required: true, message: `Please select the ${labels.statusLabel}` }]}>
                    <Select defaultValue="active">
                        <Option value="active">Active</Option>
                        <Option value="inactive">Inactive</Option>
                    </Select>
                </Form.Item>

                {isCategory && (
                    <Form.Item name="category" label={'Category'} rules={[{ required: true, message: `Please select category` }]}>
                        <Select>
                            <Option value="pot">Pot</Option>
                            <Option value="planter">Planter</Option>
                            <Option value="stand">Stand</Option>
                            <Option value="tray">Tray</Option>
                        </Select>
                    </Form.Item>
                )}

                {/* Subcategories */}
                {subcategories.map((sc, index) => (
                    <Row gutter={16} key={index} style={{ marginBottom: 16 }}>
                        <Col span={11}>
                            <Form.Item name={`subcategories[${index}].name`} label={`${labels.subcategoryNameLabel} ${index + 1}`} rules={[{ required: true }]}>
                                <Input value={sc.name} onChange={(e) => updateSubcategory(index, { name: e.target.value })} />
                            </Form.Item>
                        </Col>
                        <Col span={11}>
                            <Form.Item name={`subcategories[${index}].description`} label={`${labels.subcategoryDescriptionLabel} ${index + 1}`}>
                                <Input value={sc.description} onChange={(e) => updateSubcategory(index, { description: e.target.value })} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item>
                                <Button danger onClick={() => removeSubcategory(index)}>Remove</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                ))}

                {!hideSubcategory && <Button type="dashed" onClick={addSubcategory} style={{ width: '100%', marginBottom: 16 }}>{labels.addSubcategoryButton}</Button>}

                {/* FAQs Section */}
                {showFaqs && faqs.map((faq, index) => (
                    <Row gutter={16} key={index} style={{ marginBottom: 16 }}>
                        <Col span={11}>
                            <Form.Item name={`faqs[${index}].question`} label={`Question ${index + 1}`} rules={[{ required: true }]}>
                                <Input value={faq.question} onChange={(e) => updateFaq(index, { question: e.target.value })} />
                            </Form.Item>
                        </Col>
                        <Col span={11}>
                            <Form.Item name={`faqs[${index}].answer`} label={`Answer ${index + 1}`}>
                                <Input value={faq.answer} onChange={(e) => updateFaq(index, { answer: e.target.value })} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item>
                                <Button danger onClick={() => removeSubcategory(index)}>Remove</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                ))}

                {showFaqs && <Button type="dashed" onClick={addFaq} style={{ width: '100%', marginBottom: 16 }}>Add FAQ</Button>}

                {/* Benefits Section */}
                {showBenefits && benefits.map((benefit, index) => (
                    <Row gutter={16} key={index} style={{ marginBottom: 16 }}>
                        <Col span={11}>
                            <Form.Item name={`benefits[${index}].title`} label={`Benefit ${index + 1}`} rules={[{ required: true }]}>
                                <Input value={benefit.title} onChange={(e) => updateBenefit(index, { title: e.target.value })} />
                            </Form.Item>
                        </Col>
                        <Col span={11}>
                            <Form.Item name={`benefits[${index}].description`} label={`Benefit ${index + 1}`}>
                                <Input value={benefit.description} onChange={(e) => updateBenefit(index, { description: e.target.value })} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label=''>
                                <Button danger onClick={() => removeSubcategory(index)}>Remove</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                ))}

                {showBenefits && <Button type="dashed" onClick={addBenefit} style={{ width: '100%', marginBottom: 16 }}>Add Benefit</Button>}

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isLoading} style={{ width: '100%' }}>
                        {labels.submitButton}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ItemTypeModal;
