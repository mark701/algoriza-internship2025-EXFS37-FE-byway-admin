import axiosInstance from '../utils/apiAxios';
import { createApiService } from './Shared/BaseService';

export const UserCoursesServices = {
    ...createApiService("UserCourses"),


    async GetPricesWithDate(TimeFilter) {
        debugger
        const response = await axiosInstance.get(`api/UserCourses/GetPricesWithDate?TimeFilter=${TimeFilter}`);
        return response.data;
    },

    
};
