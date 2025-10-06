import axiosInstance from '../utils/apiAxios';
import { createApiService } from './Shared/BaseService';

export const CategoryServices = {
    ...createApiService("category"),

    async GetAll() {
        const response = await axiosInstance.get('api/category/GetAll');
        return response.data;
    },

        async GetNameID() {
        const response = await axiosInstance.get('api/category/GetNameID');
        return response.data;
    },

};
