import apiClient from './config';

// Update driver availability - PATCH /api/driver/availability/
export const updateDriverAvailability = async (isAvailable) => {
  try {
    const response = await apiClient.patch('/api/driver/availability/', {
      is_available: isAvailable,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update driver location - POST /api/driver/location/
export const updateDriverLocation = async (latitude, longitude) => {
  try {
    const response = await apiClient.post('/api/driver/location/', {
      latitude,
      longitude,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
