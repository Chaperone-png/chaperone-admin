import { adminAxiosInstance } from "../axiosInstance";

const getMaaliBookings = async (page = 1, pageSize = 10, searchQuery = '', statusQuery = '', currentTab?: string) => {
  try {
      const response = await adminAxiosInstance.get('/all-bookings/', {
          params: {
              page,
              pageSize,
              search: searchQuery,
              status: statusQuery,
              currentTab
          },
      });
      return response?.data || [];
  } catch (error) {
      console.error('Error fetching maalies:', error);
      throw new Error('Error fetching maalies');
  }
};
export const maaliBookingApi = { getMaaliBookings };
