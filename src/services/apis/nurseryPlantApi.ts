import { adminAxiosInstance } from "../axiosInstance";
const createNurseryPlant = (nurseryId: string, plantData: any) => {
  return adminAxiosInstance.post(
    `/master-data/nurseries/${nurseryId}/nursery-plants/`,
    plantData
  );
};
const updateNurseryPlant = (
  nurseryId: string,
  plantData: any,
  selectedPlantId: any
) => {
  return adminAxiosInstance.put(
    `/master-data/nurseries/${nurseryId}/nursery-plants/${selectedPlantId}/`,
    plantData
  );
};

const updateNurseryPlantStatus = (
  nurseryId: string,
  plantData: any,
  selectedPlantId: any
) => {
  return adminAxiosInstance.post(
    `/master-data/nurseries/${nurseryId}/nursery-plants/status-update/${selectedPlantId}/`,
    plantData,
    {
      headers: {
        "Cache-Control": "no-cache",
      },
    }
  );
};

const getNurseriesPlants = (
  page: number,
  pageSize: number,
  searchQuery: string,
  statusFilter: string,
  sortBy: number
) => {
  return adminAxiosInstance.get("/master-data/nurseries/nursery-plants/", {
    params: {
      currentPage: page,
      itemsPerPage: pageSize,
      searchQuery,
      statusFilter,
      sortBy,
    },
  });
};
const getPlantById = (nurseryId: string) => {
  return adminAxiosInstance.get(
    `/master-data/nurseries/nursery-plants/${nurseryId}/`
  );
};

const deleteNurseryPlant = (nurseryId: string) => {
  return adminAxiosInstance.delete(
    `/master-data/nurseries/nursery-plants/${nurseryId}/`
  );
};

const updateNurseryImages = (
  nurseryId: string,
  selectedPlantId: any,
  payload: any
) => {
  return adminAxiosInstance.put(
    `/master-data/nurseries/${nurseryId}/nursery-plants/${selectedPlantId}/images/`,
    payload
  );
};
const updatePlantOffers = (
  nurseryId: string,
  selectedPlantId: any,
  payload: any
) => {
  return adminAxiosInstance.put(
    `/master-data/nurseries/${nurseryId}/nursery-plants/${selectedPlantId}/offers/`,
    payload
  );
};
export const nurseryPlantApi = {
  createNurseryPlant,
  getNurseriesPlants,
  getPlantById,
  updateNurseryPlant,
  updateNurseryImages,
  updatePlantOffers,
  updateNurseryPlantStatus,
  deleteNurseryPlant,
};
