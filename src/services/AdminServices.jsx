// src/services/AdminServices.js
import axiosInstance from '../utils/apiAxios';

export const AdminServices = {
  async login(UserData) {
      
  debugger

    const response = await axiosInstance.post('api/Admin/Login', UserData);
    return response;
  },
};