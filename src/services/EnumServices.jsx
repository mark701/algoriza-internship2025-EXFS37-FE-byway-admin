import axiosInstance from '../utils/apiAxios';

export const EnumServices = {

  async getCourseLevels() {
    const response = await axiosInstance.get('api/Enum/courseLevels');
    return response.data;
  },


};
