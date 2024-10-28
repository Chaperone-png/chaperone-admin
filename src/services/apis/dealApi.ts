import { publicAxiosInstance } from "../axiosInstance";

//deal api 

export const dealApi = {
  addDealOfWeek: (body: any) => publicAxiosInstance.post("/add-deal-of-the-week", body),
  getActiveDeal: () => publicAxiosInstance.get("/get-active-deal"),
};
