import { adminAxiosInstance } from "../axiosInstance";
const getNurseries = (page = 1, pageSize = 10, searchQuery = '', statusQuery='') => {
    return adminAxiosInstance.get('/nurseries/', {
        params: {
            page: page,
            pageSize: pageSize,
            status:statusQuery,
            search: searchQuery,
        },
    });
};

const addNursery = (nurseryData: any) => {
    return adminAxiosInstance.post('/nurseries/', nurseryData);
};

const editNursery = (nurseryId: string, newData: any) => {
    return adminAxiosInstance.put(`/nurseries/${nurseryId}/`, newData);
};
const getNurseryById = (nurseryId:string) => {
    return adminAxiosInstance.get(`/nurseries/${nurseryId}/`);
};

export const nurseryApi = {
    addNursery, editNursery, getNurseries, getNurseryById
}
// Add more nurseries-related API functions as needed
