import { adminAxiosInstance } from "../axiosInstance";

const login = (username: string, password: string) => {
    return adminAxiosInstance.post('/admin/login/', { username, password });
};

const logout = () => {
    return adminAxiosInstance.post('/admin/logout/');
};
export const authApi = {login, logout}
// Add more auth-related API functions as needed
