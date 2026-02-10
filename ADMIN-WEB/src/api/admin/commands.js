import apiClient from "../config";

// Get all commands - GET /api/commands/
export const getAllCommands = async () => {
  try {
    const response = await apiClient.get("/api/commands/");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create command - POST /api/commands/
export const createCommand = async (commandData) => {
  try {
    const response = await apiClient.post("/api/commands/", commandData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get command by ID - GET /api/commands/{id}/
export const getCommandById = async (id) => {
  try {
    const response = await apiClient.get(`/api/commands/${id}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update command - PUT /api/commands/{id}/
export const updateCommand = async (id, commandData) => {
  try {
    const response = await apiClient.put(`/api/commands/${id}/`, commandData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Partial update command - PATCH /api/commands/{id}/
export const partialUpdateCommand = async (id, commandData) => {
  try {
    const response = await apiClient.patch(`/api/commands/${id}/`, commandData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete command - DELETE /api/commands/{id}/
export const deleteCommand = async (id) => {
  try {
    const response = await apiClient.delete(`/api/commands/${id}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update command status - PATCH /api/commands/{id}/update_statut/
export const updateCommandStatus = async (id, statut) => {
  try {
    const response = await apiClient.patch(
      `/api/commands/${id}/update_statut/`,
      {
        statut,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get calendar commands - GET /api/commands/calendar/
export const getCalendarCommands = async () => {
  try {
    const response = await apiClient.get("/api/commands/calendar/");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
