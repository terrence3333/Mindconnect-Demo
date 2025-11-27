import api from './api';

export const supportService = {
  async getAllGroups(params) {
    try {
      const response = await api.get('/support-groups', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getGroupById(id) {
    try {
      const response = await api.get(`/support-groups/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async joinGroup(id) {
    try {
      const response = await api.post(`/support-groups/${id}/join`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async leaveGroup(id) {
    try {
      const response = await api.post(`/support-groups/${id}/leave`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getUpcomingSessions() {
    try {
      // This would fetch user's upcoming sessions
      const response = await api.get('/appointments', {
        params: { status: 'confirmed' }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
