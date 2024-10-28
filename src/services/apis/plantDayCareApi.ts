import { plantDayCareAxiosInstance } from "../axiosInstance";

export const plantDayCareApi = {
  getAllDayCares: () => plantDayCareAxiosInstance.get("/get-all-day-cares"),
  assignMaali: (dayCareId: any, payload: any) => plantDayCareAxiosInstance.put(`/day-care/${dayCareId}/assign-maali`, payload),
  reAssignMaali: (dayCareId: any, payload: any) => plantDayCareAxiosInstance.put(`/day-care/${dayCareId}/re-assign-maali`, payload),
};
