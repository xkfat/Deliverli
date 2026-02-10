import apiClient from './config';

// Get all equipe members - GET /api/equipe/
export const getAllEquipeMembers = async () => {
  try {
    const response = await apiClient.get('/api/equipe/');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create equipe member - POST /api/equipe/
export const createEquipeMember = async (memberData) => {
  try {
    const response = await apiClient.post('/api/equipe/', memberData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get equipe member by ID - GET /api/equipe/{id}/
export const getEquipeMemberById = async (id) => {
  try {
    const response = await apiClient.get(`/api/equipe/${id}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update equipe member - PUT /api/equipe/{id}/
export const updateEquipeMember = async (id, memberData) => {
  try {
    const response = await apiClient.put(`/api/equipe/${id}/`, memberData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Partial update equipe member - PATCH /api/equipe/{id}/
export const partialUpdateEquipeMember = async (id, memberData) => {
  try {
    const response = await apiClient.patch(`/api/equipe/${id}/`, memberData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete equipe member - DELETE /api/equipe/{id}/
export const deleteEquipeMember = async (id) => {
  try {
    const response = await apiClient.delete(`/api/equipe/${id}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
