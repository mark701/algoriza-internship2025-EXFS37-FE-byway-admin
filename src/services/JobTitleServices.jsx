import axiosInstance from '../utils/apiAxios';

export const JobTitleServices = {

  async getAll() {
    const response = await axiosInstance.get('api/JobTitle/GetAll');
    return response.data;
  },


};
