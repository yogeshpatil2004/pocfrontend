import { apiClient, MOCK_ADMIN_METRICS } from './client';

export const getAdminMetrics = async (token = null) => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await apiClient.get('/admin/metrics', { headers });
    return response.data;
  } catch (error) {
    console.warn("Backend offline or unauthorized, returning mock admin data:", error.message);
    return MOCK_ADMIN_METRICS;
  }
};
