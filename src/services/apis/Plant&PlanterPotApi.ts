//Plant and PotPlanter common api file
//Delete the image
//for plant and planter
import { adminAxiosInstance } from "../axiosInstance";

const deleteImage = (id: any, payload: any) => {
    return adminAxiosInstance.put(`/delete-image/${id}`, payload);
};
export const PlantAndPlanterPotApi = { deleteImage }
