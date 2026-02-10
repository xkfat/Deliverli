import apiClient from "./config";

// Login - POST /api/auth/login/
export const login = async (username, password) => {
  try {
    const response = await apiClient.post("/api/auth/login/", {
      username,
      password,
    });

    // Save tokens to localStorage
    if (response.data.access) {
      localStorage.setItem("access_token", response.data.access);
    }
    if (response.data.refresh) {
      localStorage.setItem("refresh_token", response.data.refresh);
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Refresh Token - POST /api/auth/refresh/
export const refreshToken = async (refresh) => {
  try {
    const response = await apiClient.post("/api/auth/refresh/", {
      refresh,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get Profile - GET /api/auth/profile/
export const getProfile = async () => {
  try {
    const response = await apiClient.get("/api/auth/profile/");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update Profile Photo - PATCH /api/auth/profile/photo/
export const updateProfilePhoto = async (photoFile) => {
  try {
    const formData = new FormData();
    formData.append("profile_photo", photoFile);

    const response = await apiClient.patch(
      "/api/auth/profile/photo/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete Profile Photo - DELETE /api/auth/profile/photo/
export const deleteProfilePhoto = async () => {
  try {
    const response = await apiClient.delete("/api/auth/profile/photo/");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Change Password - POST /api/auth/change-password/
export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await apiClient.post("/api/auth/change-password/", {
      old_password: oldPassword,
      new_password: newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Logout (clear tokens from localStorage)
export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};
