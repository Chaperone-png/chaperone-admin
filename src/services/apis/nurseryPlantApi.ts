import { adminAxiosInstance } from "../axiosInstance";
const createNurseryPlant = (nurseryId: string, plantData: any) => {
  return adminAxiosInstance.post(`/master-data/nurseries/${nurseryId}/nursery-plants/`, plantData);
};
const updateNurseryPlant = (nurseryId: string, plantData: any, selectedPlantId: any) => {
  return adminAxiosInstance.put(`/master-data/nurseries/${nurseryId}/nursery-plants/${selectedPlantId}/`, plantData);
};
const getNurseriesPlants = (page: number, pageSize: number, searchQuery: string, statusFilter: string) => {
  return adminAxiosInstance.get("/master-data/nurseries/nursery-plants/", {
    params: {
      currentPage: page,
      itemsPerPage: pageSize,
      searchQuery,
      statusFilter
    }
  });
};
const getPlantById = (nurseryId: string,) => {
  return adminAxiosInstance.get(`/master-data/nurseries/nursery-plants/${nurseryId}/`);
};
const updateNurseryImages = (nurseryId: string, selectedPlantId: any, formData: any) => {
  return adminAxiosInstance.put(`/master-data/nurseries/${nurseryId}/nursery-plants/${selectedPlantId}/images/`, formData);
};
const updatePlantOffers = (nurseryId: string, selectedPlantId: any, payload: any) => {
  return adminAxiosInstance.put(`/master-data/nurseries/${nurseryId}/nursery-plants/${selectedPlantId}/offers/`, payload);
};
export const nurseryPlantApi = {
  createNurseryPlant, getNurseriesPlants, getPlantById, updateNurseryPlant, updateNurseryImages, updatePlantOffers
}