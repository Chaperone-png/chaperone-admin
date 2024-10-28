import { adminAxiosInstance } from "../axiosInstance";


const createProductType = (data: any) => {
  return adminAxiosInstance.post("/master-data/product/types/", data);
};
const updateProductType = (typeId:string,data: any) => {
    return adminAxiosInstance.post(`/master-data/product/types/${typeId}/`, data);
  };
const getProductTypes = () => {
    return adminAxiosInstance.get("/master-data/product/types/");
  };
export const productApi = { createProductType,getProductTypes, updateProductType };
