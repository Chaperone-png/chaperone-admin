import { publicAxiosInstance } from "../axiosInstance";

export const locationApi = {
  getCountries: () => publicAxiosInstance.get("/countries/"),
  getStates: () => publicAxiosInstance.get("/states/"),
  getCities: () => publicAxiosInstance.get("/cities/"),
  getCitiesByStateId: (stateId: string) =>
    publicAxiosInstance.get(`/cities/${stateId}/`),

  addCountry: (country: { name: string; code: string }) =>
    publicAxiosInstance.post("/countries/", country),
  addState: (state: { name: string; countryId: string }) =>
    publicAxiosInstance.post("/states/", state),
  addCity: (cityInfo: { name: string; stateId: string, startPincode: number, endPincode: number }) =>
    publicAxiosInstance.post("/cities/", cityInfo),
  addPincode: (cityId:string, values:any) =>
    publicAxiosInstance.post(`/cities/${cityId}/pincodes/`, values),
  updatePincodeStatus: (cityId: string, pincodeId: string, body: any) =>
    publicAxiosInstance.patch(`/cities/${cityId}/pincodes/${pincodeId}/`, body),
  updateCountryStatus: (countryId: string, status: string) =>
    publicAxiosInstance.patch(`/countries/${countryId}/status/`, { status }),
  updateStateStatus: (stateId: string, status: string) =>
    publicAxiosInstance.patch(`/states/${stateId}/status/`, { status }),
  updateCityStatus: (cityId: string, status: string) =>
    publicAxiosInstance.patch(`/cities/${cityId}/status/`, { status }),
};
