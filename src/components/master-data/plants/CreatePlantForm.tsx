import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, Input, message, Radio, Row, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { nurseryPlantApi } from '../../../services/apis/nurseryPlantApi';
import { plantApi } from '../../../services/apis/plantApi';
import '../../../styles/CreatePlantForm.scss';
import { AdminPlantTye } from '../../../types';
import PlantAbout from './create-plant/PlantAbout';
import PlantBenefits from './create-plant/PlantBenefits';
import PlantCareTips from './create-plant/PlantCareTips';
import PlantFAQ from './create-plant/PlantFAQ';
import PlantTypes from './create-plant/PlantTypes';
import PlantZodiacSigns from './create-plant/PlantZodiacSigns';

interface CreatePlantFormProps {
  onSuccess?: (plantData?: any) => void;
  plantDetails?: AdminPlantTye | null;
  nursery?: {
    id: any,
    isAdd: boolean,
    plantId: any
  } | undefined
  productTypeId?: any;

}

const CreatePlantForm: React.FC<CreatePlantFormProps> = ({ onSuccess, plantDetails, nursery, productTypeId }) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [customBenefits, setCustomBenefits] = useState<{ title: string; description: string }[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [about, setAbout] = useState('');
  const [form] = Form.useForm();
  const [plantTypes, setPlantTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customCareTips, setCustomCareTips] = useState<{ title: string; description: string }[]>([]);
  const [maintenanceType, setMaintenanceType] = useState<string>(''); // State for maintenance type
  const [waterSchedule, setWaterSchedule] = useState<string[]>([]); // State for water schedule checkboxes
  const [lightEfficient, setLightEfficient] = useState<string[]>([]); // State for water schedule checkboxes
  const { selectedPlantId } = useSelector((state: RootState) => state.nurseryPlant);
  const [nurseryPlantDescription, setNurseryPlantDescription] = useState('')
  useEffect(() => {
    plantApi.getPlantTypes()
      .then(response => {
        setPlantTypes(response.data);
      })
      .catch(error => {
        console.error('Error fetching plant types:', error);
      });
  }, []);

  useEffect(() => {
    if (plantDetails) {
      form.setFieldsValue({
        plantName: plantDetails.plantName,
        plantTypeIds: plantDetails.plantTypeIds.map((plantType: any) => plantType._id),
        about: plantDetails.about,
        zodiacSigns: plantDetails.zodiacSigns,
        faqs: plantDetails.faqs,
        maintenanceType: plantDetails.maintenanceType || '',
        waterSchedule: plantDetails.waterSchedule || [],
        lightEfficient: plantDetails.lightEfficient || [],
        description: plantDetails.description,
      });
      setFileList(plantDetails.images);
      setNurseryPlantDescription(plantDetails.description || ''); // Set water schedule if present
      setFaqs(plantDetails.faqs || []);
      setCustomBenefits(plantDetails.plantBenefits || []);
      setCustomCareTips(plantDetails.plantCareTips || []);
      setAbout(plantDetails.about || '');
      setMaintenanceType(plantDetails.maintenanceType || ''); // Set maintenance type if present
      setWaterSchedule(plantDetails.waterSchedule || []); // Set water schedule if present
      setLightEfficient(plantDetails.lightEfficient || []); // Set water schedule if present
    } else {
      form.resetFields()
    }
  }, [plantDetails, form]);
  const handleFinish = async (values: any) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('plantName', values.plantName);
      if (nursery && plantDetails) {
        plantDetails.plantTypeIds.forEach((plantType: any) => {
          formData.append('plantTypeIds', plantType._id);
        });
        plantDetails.zodiacSigns?.forEach((zodiacSign: string) =>
          formData.append('zodiacSigns', zodiacSign)
        );
        formData.append('about', plantDetails.about);

      } else if (!nursery) {
        formData.append('about', values.about);

        values.plantTypeIds?.forEach((plantTypeId: any) => {
          formData.append('plantTypeIds', plantTypeId);
        });
        values.zodiacSigns?.forEach((zodiacSign: string) =>
          formData.append('zodiacSigns', zodiacSign)
        );
      }
      formData.append('plantBenefits', JSON.stringify(customBenefits || []));
      formData.append('plantCareTips', JSON.stringify(customCareTips || []));
      formData.append('faqs', JSON.stringify(faqs || []));

      fileList?.forEach((file) => {
        formData.append('images', file.originFileObj);
      });
      if (maintenanceType) {
        formData.append('maintenanceType', maintenanceType); // Append maintenance type to form data
      }
      if (waterSchedule.length > 0) {
        formData.append('waterSchedule', JSON.stringify(waterSchedule)); // Append water schedule to form data
      }
      if (lightEfficient.length > 0) {
        formData.append('lightEfficient', JSON.stringify(lightEfficient)); // Append water schedule to form data
      }
      if (productTypeId) {
        formData.append('productTypeId', productTypeId)
      }

      let response;
      if (plantDetails) {
        // Update existing plant
        try {
          if (!nursery) {
            response = await plantApi.updatePlant(plantDetails?._id, formData);
            message.success('Plant updated in your inventory');
          } else {
            if (selectedPlantId && nursery) {
              formData.append('adminPlantId', selectedPlantId);
              formData.append('description', nurseryPlantDescription);
            }
            if (nursery.isAdd) {
              response = await nurseryPlantApi.createNurseryPlant(nursery.id, formData);
              console.log(response)
              message.success('Plant details saved')
            } else {
              response = await nurseryPlantApi.updateNurseryPlant(nursery.id, formData, nursery.plantId);
              console.log('Here...')
            }
          }
        } catch (error: any) {
          console.error('Error updating plant:', error?.response, 'RESPONSE', error);
          if (error?.response?.data?.message) {
            message.error(error?.response?.data?.message);
          } else {
            message.error('Something went wrong');
          }
        }
      } else {
        // Create new plant
        if (!nursery) {
          try {
            const response = await plantApi.createAdminPlant(formData);
            console.log('Plant created successfully:', response.data);
            onSuccess && await onSuccess();
            message.success('Plant added to your inventory');
          } catch (error: any) {
            console.error('Error creating plant:', error?.response, 'RESPONSE');
            if (error?.response?.data?.message) {
              message.error(error?.response?.data?.message);
            } else {
              message.error('Something went wrong');
            }
          }
        } else {
          response = await nurseryPlantApi.createNurseryPlant(nursery.id, formData);
          console.log(response)
          message.success('Plant details saved')
        }
      }
      response?.data && onSuccess && await onSuccess(response?.data);
    } catch (error) {
      console.error('Error creating new entities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleFinish}
      scrollToFirstError
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 12 }}
      className="add-plant-form create-plant-form"
    >
      <Row gutter={16}>
        <Col xs={24}>
          <Form.Item
            id='plant-name-field'
            label={
              <span>
                {nursery ? 'Plant Title (visible on website)' : 'Plant Name'}{" "}
                <Tooltip
                  overlayClassName="custom-tooltip"
                  title="This name would be visible on users search list, you can add some descriptive title. For e.g., Snake plant|keep you home cool| 24 inch"
                  placement="right"
                >
                  <InfoCircleOutlined />
                </Tooltip>
              </span>
            }
            name="plantName"
            rules={[{ required: true, message: "Please enter the product title" }, { max: 100, message: 'Maximum 100 characters allowed' }]}
          >
            <Input placeholder="Enter plant name" />
          </Form.Item>
        </Col>
        {!nursery && <Col span={24}>
          <PlantTypes plantTypes={plantTypes} />
        </Col>}
      </Row>
      <>
        {nursery &&
          <PlantAbout about={nurseryPlantDescription} setAbout={setNurseryPlantDescription} label='Any important information(Optional)' name='description' />
        }

        {!nursery && <>
          <PlantAbout required about={about} setAbout={setAbout} label="About this product" name='about' />
          <PlantBenefits setCustomBenefits={setCustomBenefits} customBenefits={customBenefits} />
          <Row gutter={16}>
            <PlantCareTips customCareTips={customCareTips} setCustomCareTips={setCustomCareTips} />
            <Col span={24}>
              <PlantZodiacSigns />
            </Col>
            <Col xs={24}>
              <PlantFAQ faqs={faqs} setFaqs={setFaqs} />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Maintenance Type" name="maintenanceType">
                <Radio.Group onChange={(e) => setMaintenanceType(e.target.value)} value={maintenanceType}>
                  <Radio value="High">High</Radio>
                  <Radio value="Low">Low</Radio>
                  <Radio value="Medium">Medium</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Water Schedule"
                name="waterSchedule"
                rules={[
                  {
                    required: true,
                    message: 'Please select at least one water schedule option',
                    validator: (_, value) =>
                      value && value.length > 0 ? Promise.resolve() : Promise.reject(new Error('Please select at least one water schedule option')),
                  },
                ]}
              >
                <Checkbox.Group onChange={(checkedValues) => setWaterSchedule(checkedValues)} value={waterSchedule}>
                  <Checkbox value="Every alternate day">Every alternate day</Checkbox>
                  <Checkbox value="Once a day">Once a day</Checkbox>
                  <Checkbox value="Once a week">Once a week</Checkbox>
                  <Checkbox value="Once in Two Weeks">Once in Two Weeks</Checkbox>
                  <Checkbox value="Twice a week">Twice a week</Checkbox>
                  <Checkbox value="Water Once a Week">Water Once a Week</Checkbox>
                </Checkbox.Group>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Light Efficient"
                name="lightEfficient"
                rules={[
                  {
                    required: true,
                    message: 'Please select at least one light efficiency option',
                    validator: (_, value) =>
                      value && value.length > 0 ? Promise.resolve() : Promise.reject(new Error('Please select at least one light efficiency option')),
                  },
                ]}
              >
                <Checkbox.Group onChange={(checkedValues) => setLightEfficient(checkedValues)} value={lightEfficient}>
                  <Checkbox value="Bright Indirect Light">Bright Indirect Light</Checkbox>
                  <Checkbox value="Direct Sunlight">Direct Sunlight</Checkbox>
                  <Checkbox value="Low Light">Low Light</Checkbox>
                  <Checkbox value="Needs Medium to Low Light">Needs Medium to Low Light</Checkbox>
                  <Checkbox value="Needs Partial to Indirect Light">Needs Partial to Indirect Light</Checkbox>
                </Checkbox.Group>
              </Form.Item>
            </Col>
          </Row>
        </>}
      </>

      <Col xs={24} sm={{ span: 12, offset: 8 }} className='bottom-btn-center'>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} disabled={isLoading}>
            {nursery ? 'Save & Next' : 'Save'}
          </Button>
        </Form.Item>
      </Col>

    </Form>
  );
};

export default CreatePlantForm;
