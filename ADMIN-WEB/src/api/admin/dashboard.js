import apiClient from '../config';

// Get dashboard stats - GET /api/admin/dashboard/stats/
export const getDashboardStats = async () => {
  try {
    const response = await apiClient.get('/api/admin/dashboard/stats/');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
