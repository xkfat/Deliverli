import apiClient from './config';

// Track command by tracking ID - GET /api/track/{tracking_id}/
export const trackCommand = async (trackingId) => {
  try {
    const response = await apiClient.get(`/api/track/${trackingId}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
