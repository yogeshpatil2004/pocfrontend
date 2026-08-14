import { apiClient } from './client';

export const uploadMediaFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000 // Allow up to 60s for media uploads
    });
    return response.data.url;
  } catch (error) {
    console.warn("Backend offline or Supabase storage upload timeout, using local blob preview URL:", error.message);
    return URL.createObjectURL(file);
  }
};
