import { message } from "antd";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const baseURL = "https://chaperoneserverco.com/api";
// const baseURL = "http://localhost:5000/api";

const createAxiosInstance = (basePath: string) => {
  const instance = axios.create({
    baseURL: `${baseURL}${basePath}`,
    timeout: 40000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use(
    (config: any) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      if (config.data instanceof FormData) {
        config.headers["Content-Type"] = "multipart/form-data";
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response?.status === 500) {
        console.error("Server Error: 500");
        message.error("Something went wrong");
      }

      if (error.response?.status === 401) {
        // Access the AuthContext using useContext
        const authContext = useContext(AuthContext);
        authContext.logout();
        window.location.href = "/login"; // Adjust the path according to your routing
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const publicAxiosInstance = createAxiosInstance("/public");
export const adminAxiosInstance = createAxiosInstance("/admin");
export const maaliAxiosInstance = createAxiosInstance("/maali");
export const orderAxiosInstance = createAxiosInstance("/order");
export const plantDayCareAxiosInstance = createAxiosInstance("/daycare");
