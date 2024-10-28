import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Select, message, Tag, Row, Col } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { productApi } from '../services/apis/productApi';

const { Option } = Select;

interface DynamicField {
  id: number;
  type: string;
  label: string;
  options: string[];
  requirement: 'required' | 'optional';
  dropdownOptions: string[]; // New field for dropdown options
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  plantType?: any;
}

const ProductTypeModal = ({ isOpen, onClose, onSuccess, plantType }: Props) => {
  const [form] = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedFieldId, setSelectedFieldId] = useState<number | null>(null);

  useEffect(() => {
    if (plantType) {
      form.setFieldsValue(plantType);
      setDynamicFields(plantType.dynamicFields || []);
    } else {
      form.resetFields();
      form.setFieldsValue({ status: 'active' });
      setDynamicFields([]);
    }
  }, [plantType, form]);

  const addDynamicField = () => {
    const newField: DynamicField = {
      id: Date.now(),
      type: 'text',
      label: '',
      options: [],
      requirement: 'required',
      dropdownOptions: [], // Initialize dropdown options
    };
    setDynamicFields([...dynamicFields, newField]);
  };

  const updateDynamicField = (id: number, field: Partial<DynamicField>) => {
    setDynamicFields(dynamicFields.map(df => df.id === id ? { ...df, ...field } : df));
  };

  const removeDynamicField = (id: number) => {
    setDynamicFields(dynamicFields.filter(df => df.id !== id));
  };

  const handleInputConfirm = (id: number) => {
    if (inputValue && !dynamicFields.find(field => field.id === id)?.options.includes(inputValue)) {
      const updatedFields = dynamicFields.map(df => df.id === id ? { ...df, options: [...df.options, inputValue] } : df);
      setDynamicFields(updatedFields);
    }
    setInputValue('');
    setSelectedFieldId(null);
  };

  const handleOptionRemove = (fieldId: number, option: string) => {
    const updatedFields = dynamicFields.map(df => df.id === fieldId ? { ...df, options: df.options.filter(opt => opt !== option) } : df);
    setDynamicFields(updatedFields);
  };

  const validateDynamicFields = () => {
    let isValid = true;
    for (const field of dynamicFields) {
      if (!field.label) {
        message.error('Each dynamic field must have a label');
        isValid = false;
      }
      if ((field.type === 'radio' || field.type === 'checkbox') && field.options.length === 0) {
        message.error(`Field "${field.label}" must have at least one option`);
        isValid = false;
      }
    }
    return isValid;
  };

  const handleFinish = async (values: any) => {
    if (!validateDynamicFields()) {
      return;
    }
    try {
      setIsLoading(true);
      const payload = {
        ...values,
        dynamicFields
      };
      if (plantType) {
        await productApi.updateProductType(plantType._id, payload);
        message.success('Product type updated');
      } else {
        await productApi.createProductType(payload);
        message.success('New product type created');
      }
      if (onSuccess) {
        await onSuccess();
      }
      setIsLoading(false);
      onClose();
    } catch (error) {
      console.error('Error saving plant type:', error);
      message.error('Something went wrong');
      setIsLoading(false);
    }
  };

  return (
    <Modal
      destroyOnClose
      open={isOpen}
      title={plantType ? 'Edit product type' : 'Create product type'}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please input the title' }]}
        >
          <Input placeholder="Enter product type e.g., Tool, Plant, Fertilizer" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please input the description' }]}
        >
          <Input.TextArea placeholder="Enter product description which will help to improve seo performance" />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select the status' }]}
        >
          <Select defaultValue="active">
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </Form.Item>

        {dynamicFields.map((field, index) => (
          <div key={field.id} style={{ marginBottom: 20 }}>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                  name={`field_label_${index}`}
                  label="Field Label"
                  rules={[{ required: true, message: 'Please enter the field name' }]}
                >
                  <Input
                    placeholder="Field Name"
                    value={field.label}
                    onChange={(e) => updateDynamicField(field.id, { label: e.target.value })}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name={`field_type_${index}`}
                  label="Field Type"
                  required
                >
                  <Select
                    value={field.type}
                    defaultValue={'text'}
                    onChange={(value) => updateDynamicField(field.id, { type: value })}
                  >
                    <Option value="text">Text</Option>
                    <Option value="radio">Radio</Option>
                    <Option value="checkbox">Checkbox</Option>
                    <Option value="dropdown">Dropdown</Option>

                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name={`field_requirement_${index}`}
                  label="Required?"
                  required
                >
                  <Select
                    value={field.requirement}
                    defaultValue={'required'}
                    onChange={(value) => updateDynamicField(field.id, { requirement: value as 'required'|'optional' })}
                  >
                    <Option value="required">Yes</Option>
                    <Option value="optional">No</Option>
                  </Select>
                </Form.Item>
              </Col>
              {/* {field.type === 'dropdown' && <Col span={12}>
                <Form.Item
                  name={`field_dropdown_${index}`}
                  label="Dropdown Options"
                  rules={[{ required: field.type === 'dropdown', message: 'Please enter dropdown options' }]}
                >
                  <                  Input
                    placeholder="Dropdown Options (comma-separated)"
                    value={field.dropdownOptions?.join(', ')}
                    onChange={(e) => updateDynamicField(field.id, { dropdownOptions: e.target.value.split(',').map(opt => opt.trim()) })}
                    disabled={field.type !== 'dropdown'}
                  />
                </Form.Item>
              </Col>} */}
              <Col span={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Button danger onClick={() => removeDynamicField(field.id)}>
                  Remove
                </Button>
              </Col>
            </Row>
            {(field.type === 'radio' || field.type === 'checkbox' || field.type === 'dropdown') && (
              <Row style={{ marginTop: 10 }}>
                <Col span={24}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                    {field.options.map((option, index) => (
                      <Tag
                        key={index}
                        closable
                        onClose={() => handleOptionRemove(field.id, option)}
                        style={{ marginBottom: 8 }}
                      >
                        {option}
                      </Tag>
                    ))}
                    {selectedFieldId === field.id && (
                      <Input
                        type="text"
                        size="small"
                        style={{ width: 100 }}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onBlur={() => handleInputConfirm(field.id)}
                        onPressEnter={() => handleInputConfirm(field.id)}
                        placeholder="Add option"
                      />
                    )}
                    <Button
                      type="dashed"
                      onClick={() => setSelectedFieldId(field.id)}
                      style={{ marginLeft: 8, marginBottom: 8 }}
                    >
                      + Add option
                    </Button>
                  </div>
                  {(field.type === 'radio' || field.type === 'checkbox') && field.options.length === 0 && (
                    <div style={{ color: 'red', marginTop: 8 }}>
                      At least one option is required
                    </div>
                  )}
                </Col>
              </Row>
            )}
          </div>
        ))}

        <Form.Item>
          <Button type="dashed" onClick={addDynamicField} style={{ width: '100%', marginBottom: 16 }}>
            Add Field
          </Button>
          <Button type="primary" htmlType="submit" disabled={isLoading} loading={isLoading} style={{ width: '100%' }}>
            {plantType ? 'Update' : 'Add'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductTypeModal;

