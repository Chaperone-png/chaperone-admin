import { adminAxiosInstance, publicAxiosInstance } from "../axiosInstance";
// Function to get all plant types
const getPotPlanterTypes = () => {
    return publicAxiosInstance.get("/pot-planter-types/");
};

const createPotPlanterType = (data: any) => {
    return adminAxiosInstance.post("/master-data/pot-planter/types/", data);
};
const updatePotPlanterType = (typeId: string, data: any) => {
    return adminAxiosInstance.put(`/master-data/pot-planter/types/${typeId}/`, data);
};

const createPotPlanterShape = (data: any) => {
    return adminAxiosInstance.post("/master-data/pot-planter/shapes/", data);
};
const updatePotPlanterShape = (typeId: string, data: any) => {
    return adminAxiosInstance.put(`/master-data/pot-planter/shapes/${typeId}/`, data);
};
const getPotPlanterShapes = () => {
    return publicAxiosInstance.get(`/pot-planter-shapes/`);
};
const createPotPlanter = (nurseryId: any, data: any) => {
    return adminAxiosInstance.post(`/master-data/nurseries/${nurseryId}/nursery-pots-planters/`, data);
};
const getPotPlanterById = (plantId: string,) => {
    return adminAxiosInstance.get(`/master-data/nurseries/pot-planters/${plantId}/`);
};

const updateNurseryPlant = (nurseryId: string, plantData: any, selectedPlantId: any) => {
    return adminAxiosInstance.put(`/master-data/nurseries/${nurseryId}/pot-planters/${selectedPlantId}/`, plantData, {
        headers: {
            "Cache-Control": "no-cache",
        },

    });
};

const updatePotPlanterStatus = (nurseryId: string, plantData: any, selectedPlantId: any) => {
    return adminAxiosInstance.post(`/master-data/nurseries/${nurseryId}/pot-planters/status-update/${selectedPlantId}/`, plantData, {
        headers: {
            "Cache-Control": "no-cache",
        },

    });
};

const updateNurseryImages = (nurseryId: string, selectedPlantId: any, formData: any) => {
    return adminAxiosInstance.put(`/master-data/nurseries/${nurseryId}/pot-planters/${selectedPlantId}/images/`, formData);
};
const getNurseriesPotsPlanters = (page: number, pageSize: number) => {
    return adminAxiosInstance.get("/master-data/nurseries/pot-planters/", {
        params: {
            currentPage: page,
            itemsPerPage: pageSize
        }
    });
};
const updatePotPlanterOffers = (nurseryId: string, selectedPlantId: any, payload: any) => {
    return adminAxiosInstance.put(`/master-data/nurseries/${nurseryId}/pot-planters/${selectedPlantId}/offers/`, payload);
};
export const potPlanterApi = {
    getPotPlanterTypes,
    createPotPlanterType,
    updatePotPlanterType,
    getPotPlanterShapes,
    createPotPlanterShape,
    updatePotPlanterShape,
    createPotPlanter,
    getPotPlanterById,
    updateNurseryPlant,
    updateNurseryImages,
    getNurseriesPotsPlanters,
    updatePotPlanterOffers,
    updatePotPlanterStatus
}