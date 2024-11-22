import { adminAxiosInstance, publicAxiosInstance } from "../axiosInstance";
import imageCompression from 'browser-image-compression';
// Function to get all plant types
const getPlantTypes = () => {
  return publicAxiosInstance.get("/plant-types/");
};

const createPlantType = (data: any) => {
  return adminAxiosInstance.post("/master-data/plants/types/", data);
};
const updatePlantType = (typeId: string, data: any) => {
  return adminAxiosInstance.put(`/master-data/plants/types/${typeId}/`, data);
};

const getPlantSizes = () => {
  return adminAxiosInstance.get("/master-data/plants/sizes/");
};
const createPlantSize = (data: any) => {
  return adminAxiosInstance.post("/master-data/plants/sizes/", data);
};
const updatePlantSize = (typeId: string, data: any) => {
  return adminAxiosInstance.put(`/master-data/plants/sizes/${typeId}/`, data);
};
const getPlantBenefits = () => {
  return adminAxiosInstance.get("/master-data/plants/benefits/");
};

const createPlantBenefit = (data: any) => {
  return adminAxiosInstance.post("/master-data/plants/benefits/", data);
};

const updatePlantBenefit = (benefitId: string, data: any) => {
  return adminAxiosInstance.put(
    `/master-data/plants/benefits/${benefitId}/`,
    data
  );
};
const createAdminPlant = (plantData: any) => {
  return adminAxiosInstance.post(`/master-data/plants/`, plantData);
};
const updatePlant = (plantId: any, plantData: any) => {
  return adminAxiosInstance.put(`/master-data/plants/${plantId}/`, plantData);
};

const getAdminPlants = () => {
  return adminAxiosInstance.get("/master-data/plants/");
};
const getAdminPotPlanters = () => {
  return adminAxiosInstance.get("/master-data/plants/");
};
const getPlantCareTips = () => {
  return adminAxiosInstance.get("/master-data/plants/care-tips/");
};

const createPlantCareTip = (data: any) => {
  return adminAxiosInstance.post("/master-data/plants/care-tips/", data);
};

const updatePlantCareTip = (careTipId: string, data: any) => {
  return adminAxiosInstance.put(
    `/master-data/plants/care-tips/${careTipId}/`,
    data
  );
};
const bulkUploadPlantTypes = (formData: any) => {
  return adminAxiosInstance.post(
    `/master-data/plants/types/bulk-upload/`,
    formData
  );
};
const bulkUploadPlants = (formData: any) => {
  return adminAxiosInstance.post(`/master-data/plants/bulk-upload/`, formData);
};

const deletePlantType = (id: string) => {
  return adminAxiosInstance.delete(`/master-data/types/${id}`);
}

const uploadImageToS3 = async (formData: FormData) => {
  const compressedFormData = new FormData();

  const entries = Array.from(formData.entries());
  for (let [key, value] of entries) {
    if (value instanceof File) {
      const compressedFile = await imageCompression(value, {
        maxSizeMB: 5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      });
      compressedFormData.append(key, compressedFile);
    } else {
      compressedFormData.append(key, value);
    }
  }

  return adminAxiosInstance.post(`/upload-single-image/`, compressedFormData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export const plantApi = {
  createPlantType,
  getPlantTypes,
  updatePlantType,
  getPlantSizes,
  createPlantSize,
  updatePlantSize,
  getPlantBenefits,
  createPlantBenefit,
  updatePlantBenefit,
  createAdminPlant,
  getAdminPlants,
  getPlantCareTips,
  createPlantCareTip,
  updatePlantCareTip,
  updatePlant,
  bulkUploadPlantTypes,
  bulkUploadPlants,
  getAdminPotPlanters,
  uploadImageToS3,
  deletePlantType
};
