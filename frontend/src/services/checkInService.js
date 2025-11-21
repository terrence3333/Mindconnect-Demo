import api from './api';

export const checkInService = {
  async createCheckIn(checkInData) {
    try {
      const response = await api.post('/check-ins', checkInData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getUserCheckIns(params) {
    try {
      const response = await api.get('/check-ins', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getCheckInById(id) {
    try {
      const response = await api.get(`/check-ins/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async updateCheckIn(id, checkInData) {
    try {
      const response = await api.put(`/check-ins/${id}`, checkInData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async deleteCheckIn(id) {
    try {
      const response = await api.delete(`/check-ins/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
