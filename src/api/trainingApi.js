import { apiClient } from './client';

export const getTrainings = async (params = {}) => {
  try {
    const response = await apiClient.get('/training', { params });
    return response.data || [];
  } catch (error) {
    console.error("Error fetching training materials:", error);
    return [];
  }
};

export const getTrainingBySlugOrId = async (identifier) => {
  try {
    const response = await apiClient.get(`/training/${identifier}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching training material '${identifier}':`, error);
    return null;
  }
};

export const createTraining = async (data) => {
  try {
    const response = await apiClient.post('/training', data);
    return response.data;
  } catch (error) {
    console.error("Error creating training material:", error);
    throw error;
  }
};

export const updateTraining = async (id, data) => {
  try {
    const response = await apiClient.put(`/training/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating training material '${id}':`, error);
    throw error;
  }
};

export const deleteTraining = async (id) => {
  try {
    await apiClient.delete(`/training/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting training material '${id}':`, error);
    return false;
  }
};

export const getTrainingCategories = async () => {
  try {
    const response = await apiClient.get('/training/categories');
    return response.data || [];
  } catch (error) {
    console.error("Error fetching training categories:", error);
    return [];
  }
};

export const recordDownload = async (token, trainingId, resourceId) => {
  try {
    const response = await apiClient.post('/training/downloads', {
      training_id: trainingId,
      resource_id: resourceId
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error recording download:", error);
    throw error;
  }
};

export const getDownloadsHistory = async (token) => {
  try {
    const response = await apiClient.get('/training/downloads/history', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data || [];
  } catch (error) {
    console.error("Error fetching download history:", error);
    return [];
  }
};
