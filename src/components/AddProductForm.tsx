import { InfoCircleOutlined } from "@ant-design/icons";
import { Col, Form, message, Row, Select, Tooltip } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { nurseryApi } from "../services/apis/nurseries";
import { productApi } from "../services/apis/productApi";
import "../styles/AddPlantModal.scss";
import { ProductCategory } from "../types";
import AddNurseryPlant from "./nursery-plants/AddNurseryPlant";
import { RootState } from "../redux/store";
import {
  setCreatedPlantData,
  setNurseryId,
  setProductCategory,
  setSelectedPlantId,
  setSelectedPlantTemplate,
} from "../redux/nurseryPlantSlice";
import { nurseryPlantApi } from "../services/apis/nurseryPlantApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomPageHeader from "./PageHeader";
import AddPotPlanter from "./nursery-plants/AddPotPlanter";
import { potPlanterApi } from "../services/apis/potPlanterApi";

const { Option } = Select;

export const AddProductForm: React.FC<{
  nurseryName?: string;
}> = ({ nurseryName }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { nurseryId, selectedProductTypeId, createdPlantData } = useSelector(
    (state: RootState) => state.nurseryPlant
  );
  const [selectedProductTypeTitle, setSelectedProductTypeTitle] = useState<
    ProductCategory | ""
  >("");
  const [productCategories, setProductCategories] = useState<any[]>([]);
  const [nurseries, setNurseries] = useState<any[]>([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const fetchInitialData = useCallback(async () => {
    try {
      const nurseryResponse = await nurseryApi.getNurseries();
      if (
        nurseryResponse?.data?.nurseries &&
        Array.isArray(nurseryResponse.data.nurseries)
      ) {
        setNurseries(nurseryResponse.data.nurseries);
      } else {
        setNurseries([]);
      }
      const productResponse = await productApi.getProductTypes();
      if (productResponse && Array.isArray(productResponse.data)) {
        setProductCategories(productResponse.data);
      } else {
        setProductCategories([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  const resetPlantData = () => {
    dispatch(setCreatedPlantData(null));
    dispatch(setSelectedPlantTemplate(null));
    dispatch(setSelectedPlantId(undefined));
    dispatch(setNurseryId(undefined));
    dispatch(setProductCategory(undefined));
  };

  const fetchPlantDetails = useCallback(
    async (plantId: string) => {
      try {
        const currentUpdationType =
          (sessionStorage.getItem("Updation_type") as ProductCategory) ;
        const item_id = sessionStorage.getItem("item_id") || '';
        
        setSelectedProductTypeTitle(currentUpdationType);

        console.log({ selectedProductTypeTitle, item_id, currentUpdationType });

        if (selectedProductTypeTitle === "Plant") {
          const response = await nurseryPlantApi.getPlantById(item_id);
          const plantDetails = response.data;
          if (plantDetails) {
            dispatch(setNurseryId(plantDetails.nursery._id));
            dispatch(setProductCategory(plantDetails.productType._id));
            dispatch(setCreatedPlantData(plantDetails));
          } else {
            message.error( 
              "The product you're trying to access does not exist."
            );
            resetPlantData();
            navigate("/products/add-product");
          }
        } else if (selectedProductTypeTitle === "Pot/Planter") {
          const response = await potPlanterApi.getPotPlanterById(item_id);
          const plantDetails = response.data?.potPlanter;
          if (plantDetails) {
            dispatch(setNurseryId(plantDetails?.nursery?._id));
            dispatch(setCreatedPlantData(plantDetails));
          } else {
            message.error(
              "The product you're trying to access does not exist."
            );
            resetPlantData();
            navigate("/products/add-product");
          }
        }
      } catch (error) {
        console.error("Error fetching plant details:", error);
      }
    },
    [dispatch, navigate, selectedProductTypeTitle]
  );

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    //this will handle the current type according to the step 1
    //response data
    if (
      createdPlantData?.hasOwnProperty("potPlanterType") &&
      createdPlantData?.hasOwnProperty("potPlanterShape")
    ) {
      setSelectedProductTypeTitle("Pot/Planter");
    } else if (createdPlantData) {
      setSelectedProductTypeTitle("Plant");
    }
  }, [createdPlantData]);

  useEffect(() => {
    const plantId = searchParams.get("plantId") || "";
    fetchPlantDetails(plantId);
  }, [fetchPlantDetails, searchParams]);

  useEffect(() => {
    form.setFieldsValue({
      nurseryId: nurseryId,
      productCategoryId: selectedProductTypeId,
    });
  }, [nurseryId, selectedProductTypeId, form]);

  const handleProductTypeChange = (value: ProductCategory) => {
    dispatch(setProductCategory(value));
    const selectedTitle = productCategories.find(
      (category) => category._id === value
    )?.title;
    setSelectedProductTypeTitle(selectedTitle || "");
  };

  const handleNurseryChange = (value: string) => {
    dispatch(setNurseryId(value));
  };

  return (
    <>
      <CustomPageHeader
        title={createdPlantData ? `Nursery plant update` : "List new product"}
        onBack={() => {
          navigate("/products");
        }}
      />
      <Form
        scrollToFirstError
        form={form}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        className="add-plant-form"
      >
        <div className="add-product-fields">
          <Row gutter={16}>
            <Col md={12} xs={24}>
              <Form.Item
                label={
                  <span>
                    Nursery{" "}
                    <Tooltip
                      overlayClassName="custom-tooltip"
                      title="Select the nursery on behalf of whom you are adding this product"
                      placement="right"
                    >
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                name="nurseryId"
                rules={[
                  { required: true, message: "Please select the seller" },
                ]}
              >
                <Select
                  showSearch
                  disabled={!!createdPlantData}
                  placeholder="Select Nursery"
                  optionFilterProp="children"
                  onChange={handleNurseryChange}
                  filterOption={(input, option) => {
                    const nurseryName =
                      option?.props.children.props.children.props.children;
                    const inputLower = input.toLowerCase();
                    const nurseryNameLower = nurseryName.toLowerCase();
                    return nurseryNameLower.includes(inputLower);
                  }}
                >
                  {nurseries.map((nursery: any) => (
                    <Option key={nursery._id} value={nursery._id}>
                      <Tooltip
                        title={
                          <>
                            Nursery Name: {nursery.name},<br />
                            Seller Name: {nursery.contactPerson.name}, <br />
                            Location: {nursery.address.city?.name},{" "}
                            {nursery.address.state?.name},{" "}
                            {nursery.address.pincode}
                          </>
                        }
                      >
                        <div>{nursery.name}</div>
                      </Tooltip>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item
                label="Product Type"
                name="productCategoryId"
                rules={[
                  { required: true, message: "Please select the product type" },
                ]}
              >
                <Select
                  disabled={!!createdPlantData}
                  onChange={handleProductTypeChange}
                  placeholder="Select product category"
                >
                  {productCategories.map((type: any) => (
                    <Option key={type._id} value={type._id}>
                      {type.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
      {selectedProductTypeTitle && (
        <>
          {selectedProductTypeId && selectedProductTypeTitle === "Plant" && (
            <AddNurseryPlant />
          )}
          {selectedProductTypeTitle === "Pot/Planter" && <AddPotPlanter />}
        </>
      )}
    </>
  );
};
