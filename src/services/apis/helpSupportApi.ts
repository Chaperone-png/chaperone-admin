import { publicAxiosInstance } from "../axiosInstance";

//deal api 

//add deal endpoint
export const helpSupportApi = {
  getAllUsersQueries: () => publicAxiosInstance.get("/get-all-users-queries"),
  addQueryRespond: (queryId: string, body: any) => publicAxiosInstance.put(`/add-query-respond/${queryId}`, body),
};
