import axiosInstance from '../../utils/apiAxios';

// Global API Service Factory
export const createApiService = (endpoint) => {
  const baseEndpoint = `api/${endpoint}`;
  
  return {

    async save(item) {
        const response = await axiosInstance.post(`${baseEndpoint}/Save`, item, {
        headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    async update(item) {
        const response = await axiosInstance.put(`${baseEndpoint}/Update`, item, {
        headers: { 'Content-Type': 'multipart/form-data' },
        });

        return response.data;
    },

    async delete(id) {
      const response = await  axiosInstance.delete(`${baseEndpoint}/Delete/${id}`);

      return response.data
    },

    async getCount() {
      const response = await axiosInstance.get(`${baseEndpoint}/GetCount`);
      return response.data;
    },





  };
};