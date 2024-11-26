import { adminAxiosInstance } from "../axiosInstance";
const getNurseries = (
  page = 1,
  pageSize = 10,
  searchQuery = "",
  statusQuery = ""
) => {
  return adminAxiosInstance.get("/nurseries/", {
    params: {
      page: page,
      pageSize: pageSize,
      status: statusQuery,
      search: searchQuery,
    },
  });
};

const addNursery = (nurseryData: any) => {
  return adminAxiosInstance.post("/nurseries/", nurseryData);
};

const editNursery = (nurseryId: string, newData: any) => {
  return adminAxiosInstance.put(`/nurseries/${nurseryId}/`, newData);
};

const updateNurseryStatus = (nurseryId: string, payload: any) => {
  return adminAxiosInstance.put(
    `/nurseries/${nurseryId}/update-status`,
    payload
  );
};

const getNurseryById = (nurseryId: string) => {
  return adminAxiosInstance.get(`/nurseries/${nurseryId}/`);
};

const deleteNursery = (nurseryId: string) => {
  return adminAxiosInstance.delete(`/delete-nurserie/${nurseryId}/`);
};

export const nurseryApi = {
  addNursery,
  editNursery,
  getNurseries,
  getNurseryById,
  deleteNursery,
  updateNurseryStatus,
};
// Add more nurseries-related API functions as needed
