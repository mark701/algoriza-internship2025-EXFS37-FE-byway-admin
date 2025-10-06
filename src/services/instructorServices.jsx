import axiosInstance from '../utils/apiAxios';
import { createApiService } from './Shared/BaseService';

export const instructorServices = {
    ...createApiService("instructor"),

  async getPages(pageNumber, pageSize, criteria) {
    const response = await axiosInstance.get('api/instructor/GetPages', {
      params: { pageNumber, pageSize, criteria },
    });
    return response.data;
  },

      async getIdName() {
      const response = await axiosInstance.get('api/instructor/GetID_Name');
      return response.data;
    },

    

};
