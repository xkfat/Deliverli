import apiClient from '../config';

// Get all livreurs - GET /api/admin/livreurs/
export const getAllLivreurs = async () => {
  try {
    const response = await apiClient.get('/api/admin/livreurs/');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create livreur - POST /api/admin/livreurs/
export const createLivreur = async (livreurData) => {
  try {
    const response = await apiClient.post('/api/admin/livreurs/', livreurData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get livreur by ID - GET /api/admin/livreurs/{id}/
export const getLivreurById = async (id) => {
  try {
    const response = await apiClient.get(`/api/admin/livreurs/${id}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update livreur - PUT /api/admin/livreurs/{id}/
export const updateLivreur = async (id, livreurData) => {
  try {
    const response = await apiClient.put(`/api/admin/livreurs/${id}/`, livreurData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Partial update livreur - PATCH /api/admin/livreurs/{id}/
export const partialUpdateLivreur = async (id, livreurData) => {
  try {
    const response = await apiClient.patch(`/api/admin/livreurs/${id}/`, livreurData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete livreur - DELETE /api/admin/livreurs/{id}/
export const deleteLivreur = async (id) => {
  try {
    const response = await apiClient.delete(`/api/admin/livreurs/${id}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get livreur location - GET /api/admin/livreurs/{id}/location/
export const getLivreurLocation = async (id) => {
  try {
    const response = await apiClient.get(`/api/admin/livreurs/${id}/location/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
