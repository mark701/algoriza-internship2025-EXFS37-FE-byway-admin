import axiosInstance from '../utils/apiAxios';
import { createApiService } from './Shared/BaseService';

export const CourseServices = {
    ...createApiService("Course"),

    async GetPagesAdmin(pageNumber, pageSize, criteria,category) {
        const response = await axiosInstance.get('api/Course/GetPagesAdmin', {
            params: { pageNumber, pageSize, criteria ,category},
        });
        return response.data;
    },

        async FindInclude(ID) {
        const response = await axiosInstance.get(`api/Course/GetInclude/${ID}`);
        return response.data;
    },

    

    async GetMaxPrice() {
        const response = await axiosInstance.get('api/Course/GetMaxPrice');
        return response.data;
    },

    async getCountCondition(criteria = null, category = null) {
        const response = await axiosInstance.get(`api/Course/GetCountCondation`, {
            params: { criteria, category },
        });
        return response.data;
    },
};
