import { adminAxiosInstance, maaliAxiosInstance } from "../axiosInstance";

const createMaaliAccount = (data: any) => {
  return maaliAxiosInstance.post("/maalis/", data);
};

const updateMaaliDetails = (id: any, data: any) => {
  return maaliAxiosInstance.put(`/maalis/${id}/`, data);
};
const updateMaaliStatus = (id: any, data: any) => {
  return maaliAxiosInstance.put(`/maalis/status/${id}/`, data);
};

const getMaalis = async (
  page = 1,
  pageSize = 10,
  searchQuery = "",
  statusQuery = ""
) => {
  try {
    const response = await maaliAxiosInstance.get("/maalis/", {
      params: {
        page,
        pageSize,
        search: searchQuery,
        status: statusQuery,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching maalies:", error);
    throw new Error("Error fetching maalies");
  }
};
const getMaali = async (maaliId = "") => {
  try {
    const response = await maaliAxiosInstance.get(`/maalis/${maaliId}/`);
    return response;
  } catch (error) {
    console.error("Error fetching maali:", error);
    throw new Error("Error fetching maali");
  }
};
const assignMaaliToBooking = (bookingId: string, maaliId: string) => {
  return adminAxiosInstance.post("/assign-maali", {
    maaliBookingId: bookingId,
    maaliId: maaliId,
  });
};
export const maaliApi = {
  createMaaliAccount,
  getMaalis,
  updateMaaliDetails,
  updateMaaliStatus,
  getMaali,
  assignMaaliToBooking,
};
