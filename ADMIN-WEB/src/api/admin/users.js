import apiClient from "../config";

// Get all users - GET /api/admin/users/
export const getAllUsers = async () => {
  try {
    const response = await apiClient.get("/api/admin/users/");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create user - POST /api/admin/users/
export const createUser = async (userData) => {
  try {
    const response = await apiClient.post("/api/admin/users/", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get user by ID - GET /api/admin/users/{id}/
export const getUserById = async (id) => {
  try {
    const response = await apiClient.get(`/api/admin/users/${id}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update user - PUT /api/admin/users/{id}/
export const updateUser = async (id, userData) => {
  try {
    const response = await apiClient.put(`/api/admin/users/${id}/`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Partial update user - PATCH /api/admin/users/{id}/
export const partialUpdateUser = async (id, userData) => {
  try {
    const response = await apiClient.patch(`/api/admin/users/${id}/`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete user - DELETE /api/admin/users/{id}/
export const deleteUser = async (id) => {
  try {
    const response = await apiClient.delete(`/api/admin/users/${id}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Toggle user active status (ban/unban) - POST /api/admin/users/{id}/toggle_active/
export const toggleUserActive = async (id) => {
  try {
    const response = await apiClient.post(
      `/api/admin/users/${id}/toggle_active/`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
