import { Button, Checkbox, Col, Form, Radio, Row } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from '../../redux/store';
import { nurseryPlantApi } from '../../services/apis/nurseryPlantApi';
import { plantApi } from '../../services/apis/plantApi';
import '../../styles/ContainerDetails.scss';
import { ContainerType } from '../../types';
import { CONTAINER_TYPES } from '../../utils/constants';
import { capitalizeFirstLetter } from '../../utils/util';
import BagDetails from './BagDetails';
import PotDetails from './PotDetails';
import { setCreatedPlantData } from '../../redux/nurseryPlantSlice';
interface Size {
  _id: string;
  title: string;
  from: string;
  to: string
}
const potTypes = ['Ceramic', 'Plastic', 'Terracotta', 'Metal'];
const planterTypes = ['Metal', 'Wooden', 'Hanging', 'Basktet', 'Tray'];
const ContainerDetails = ({ nurseryId, plantId, handleNext, updateApi, productType }: any) => {
  const {
    createdPlantData,
  } = useSelector((state: RootState) => state.nurseryPlant);
  const [checkedSizes, setCheckedSizes] = useState<string[]>([]);
  const [checkedPotTypes, setCheckedPotTypes] = useState<any[]>([]);
  const [offers, setOffers] = useState<{ [key: string]: any }>({});

  const [checkedColors, setCheckedColors] = useState<{ [key: string]: string[] }>({});
  const [form] = Form.useForm();
  const [selectedContainerType, setSelectedContainerType] = useState<ContainerType | null>(null);
  const [sizes, setSizes] = useState<Size[]>([]);
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const response = await plantApi.getPlantSizes(); // Replace with your actual API endpoint
        setSizes(response.data);
      } catch (error) {
        console.error('Error fetching sizes:', error);
      }
    };

    fetchSizes();
  }, []);
  const showExistingDetails = useCallback(() => {
    if (createdPlantData) {

      if (createdPlantData.containerType || productType === 'Pot/Planter') {
        console.log(createdPlantData, 'createdPlantData')
        form.setFieldValue('containerType', createdPlantData.containerType);
        form.setFieldValue(`containerMaterial`, createdPlantData.containerMaterial || '');

        setSelectedContainerType(createdPlantData.containerType);
        const availableSizes = createdPlantData.availableSizes.map((size) => size.plantSizeId)
        setCheckedSizes(availableSizes)
        form.setFieldValue('availableSizes', availableSizes)
        if (createdPlantData.availableSizes) {

          createdPlantData.availableSizes.forEach((sizeDetail) => {
            const sizeId = sizeDetail.plantSizeId
            form.setFieldValue(`${sizeId}_size`, sizeDetail.detail.size);
            form.setFieldValue(`${sizeId}_original_price`, sizeDetail.detail.original_price);
            form.setFieldValue(`${sizeId}_is_offer`, !!sizeDetail.detail.is_offer);
            form.setFieldValue(`${sizeId}_offer_price`, sizeDetail.detail.offer_price);
            form.setFieldValue(`${sizeId}_weight`, sizeDetail.detail.weight);
            form.setFieldValue(`${sizeId}_description`, sizeDetail.detail.description);
            setOffers((prev) => ({ ...prev, [sizeId]: sizeDetail.detail.is_offer === 'yes' }))

            if (createdPlantData.containerType === 'pot' || createdPlantData.containerType === 'planter' || productType === 'Pot/Planter') {
              createdPlantData.availableSizes.forEach((size: any) => {
                const colors = size.detail.colors
                const colorNames = colors.map((color: any) => {
                  console.log('hereeee>>>>>>>>>>', color.colorName)
                  return color.colorName
                })
                console.log(colorNames, 'Color names>>>>>>>>>>>>>>', `${size}_colors`, size)
                form.setFieldValue(`${size.plantSizeId}_colors`, colorNames)
                setCheckedColors((prev) => ({ ...prev, [size.plantSizeId]: colorNames }))
                colors.forEach((color: any) => {
                  form.setFieldValue(`${size.plantSizeId}_${color.colorName}_quantity`, color.quantity)
                })
              })
            } else {
              form.setFieldValue(`${sizeId}_quantity`, sizeDetail.detail.quantity);
            }

          })
        }
      }
    }
  }, [createdPlantData, form])
  useEffect(() => {
    showExistingDetails()
  }, [showExistingDetails])
  console.log(selectedContainerType, 'Container type')
  const onFinish = async (values: any) => {
    console.log('Form values:', values);
    const formData = new FormData();
    if (productType !== 'Pot/Planter') {
      formData.append('containerType', values.containerType);
      formData.append('containerMaterial', values.containerMaterial || 'polythene');
    }

    values.availableSizes.forEach((size: any, index: number) => {
      formData.append(`availableSizes[${index}][plantSizeId]`, size);
      formData.append(`availableSizes[${index}][detail][size]`, values[`${size}_size`]);
      formData.append(`availableSizes[${index}][detail][original_price]`, values[`${size}_original_price`]);
      formData.append(`availableSizes[${index}][detail][is_offer]`, offers[size] ? 'yes' : 'no');
      formData.append(`availableSizes[${index}][detail][offer_price]`, offers[size] ? values[`${size}_offer_price`] : 0);
      formData.append(`availableSizes[${index}][detail][weight]`, values[`${size}_weight`] || 0);
      formData.append(`availableSizes[${index}][detail][description]`, values[`${size}_description`] || '');
      if (values.containerType === CONTAINER_TYPES.POT || values.containerType === CONTAINER_TYPES.PLANTER || productType === 'Pot/Planter') {
        const potColors = values[`${size}_colors`];
        potColors.forEach((color: any, colorIndex: number) => {
          const quantity = values[`${size}_${color}_quantity`];
          formData.append(`availableSizes[${index}][detail][colors][${colorIndex}][colorName]`, color);
          formData.append(`availableSizes[${index}][detail][colors][${colorIndex}][quantity]`, quantity);
        });
      } else {
        formData.append(`availableSizes[${index}][detail][quantity]`, values[`${size}_quantity`] || 0);
      }
    });

    try {
      const response = await updateApi(nurseryId, formData, plantId);
      console.log(response);
      setCreatedPlantData(response.data)
      dispatch(setCreatedPlantData(response.data));

      handleNext()
      toast.success('Container and size details updated');
    } catch (error) {
      console.log(error, 'ERRRRRRRRRRRRRR');
    }
  };
  const handleSizeChange = (checkedValues: string[]) => {
    setCheckedSizes(checkedValues);
  };
  const materialTypes = selectedContainerType === 'planter' ? planterTypes : potTypes

  return (
    <Form form={form} onFinish={onFinish} layout="horizontal" className="container-details-form">
      {productType !== 'Pot/Planter' && <Row>
        <Col span={24}>
          <Form.Item
            name="containerType"
            label="Container Type"
            rules={[{ required: true, message: 'Please select a container type' }]}
          >
            <Radio.Group onChange={(e) => {
              // form.resetFields()
              setSelectedContainerType(e.target.value);
              form.setFieldValue('containerType', e.target.value)
              // setCheckedSizes([])
            }
            }>
              <Radio value={CONTAINER_TYPES.BAG}>Bag</Radio>
              <Radio value={CONTAINER_TYPES.POT}>Pot</Radio>
              <Radio value={CONTAINER_TYPES.PLANTER}>Planter</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>}
      {(selectedContainerType === 'pot' || selectedContainerType === 'planter') && <Row>
        <Form.Item name={'containerMaterial'} label={`Select ${selectedContainerType === 'planter' ? 'Planter' : 'Pot'} material`} rules={[{ required: true, message: 'Please select material type' }]}>
          <Radio.Group>
            {materialTypes.map((material) => {
              return <Radio value={material}>{material}</Radio>
            })}

          </Radio.Group>
        </Form.Item>
      </Row>}
      <Row>
        {(selectedContainerType || productType === 'Pot/Planter') && <Form.Item
          name={`availableSizes`}
          label={productType === 'Pot/Planter' ? 'Available Sizes' : `Available ${capitalizeFirstLetter(selectedContainerType || '')} Sizes`}
          rules={[{ required: true, message: 'Please select at least one bag size' }]}
        >
          <Checkbox.Group onChange={handleSizeChange}>
            {sizes.map((size) => (
              <Checkbox key={size._id} value={size._id}>
                {size.title} ({size.from}-{size.to} inches)
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>}
        {(selectedContainerType || productType === 'Pot/Planter') ?
          <Col span={24}>
            <BagDetails
              setCheckedPotTypes={setCheckedPotTypes}
              setCheckedColors={setCheckedColors}
              checkedColors={checkedColors}
              checkedPotTypes={checkedPotTypes}
              setOffers={setOffers}
              offers={offers}
              sizes={sizes} checkedSizes={checkedSizes} containerType={selectedContainerType} />
            {/* {selectedContainerType === CONTAINER_TYPES.BAG ? (
            ) : <PotDetails sizes={sizes} checkedSizes={checkedSizes}
              containerType={selectedContainerType}
              checkedColors={checkedColors}
              checkedPotTypes={checkedPotTypes}
              setCheckedColors={setCheckedColors}
              setCheckedPotTypes={setCheckedPotTypes}
            />} */}
          </Col>
          : null}
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default ContainerDetails;
