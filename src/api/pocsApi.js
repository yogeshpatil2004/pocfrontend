import { apiClient, getStoredPocs, saveStoredPocs } from './client';

export const getPocs = async (params = {}) => {
  let queryParams = typeof params === 'string' ? { category_id: params } : (params || {});

  try {
    const response = await apiClient.get('/pocs', { params: queryParams });
    if (response.data && Array.isArray(response.data)) {
      if (!queryParams.category_id && (!queryParams.status || queryParams.status === 'PUBLISHED')) {
        saveStoredPocs(response.data);
      }
      return response.data;
    }
  } catch (error) {
    console.warn("Backend API offline, reading from local storage:", error.message);
  }

  let local = getStoredPocs();

  // If status specified, filter by status
  if (queryParams.status && queryParams.status !== 'ALL') {
    local = local.filter(p => p.status === queryParams.status);
  } else if (!queryParams.status) {
    // Default to PUBLISHED for public site
    local = local.filter(p => p.status !== 'DELETED');
  }

  if (queryParams.category_id && queryParams.category_id !== 'all') {
    local = local.filter(p => p.category_id === queryParams.category_id || p.category === queryParams.category_id);
  }

  if (queryParams.search) {
    const q = queryParams.search.toLowerCase();
    local = local.filter(p =>
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.short_description && p.short_description.toLowerCase().includes(q)) ||
      (p.full_description && p.full_description.toLowerCase().includes(q)) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  return local;
};

export const getPocBySlugOrId = async (identifier) => {
  try {
    const response = await apiClient.get(`/pocs/${identifier}`);
    if (response.data) return response.data;
  } catch (error) {
    console.warn(`Backend offline. Searching local storage for '${identifier}':`, error.message);
  }

  const local = getStoredPocs();
  const found = local.find(p => p.slug === identifier || p.id === identifier);
  return found || null;
};

export const createPoc = async (pocData) => {
  try {
    const response = await apiClient.post('/pocs', pocData);
    const created = response.data;
    const current = getStoredPocs();
    saveStoredPocs([created, ...current.filter(p => p.id !== created.id)]);
    return created;
  } catch (error) {
    console.warn("Backend offline, saving created POC to browser storage:", error.message);
    const current = getStoredPocs();
    saveStoredPocs([pocData, ...current.filter(p => p.id !== pocData.id)]);
    return pocData;
  }
};

export const updatePoc = async (pocId, updateData) => {
  try {
    const response = await apiClient.put(`/pocs/${pocId}`, updateData);
    return response.data;
  } catch (error) {
    console.warn("Backend offline, updating local storage:", error.message);
    const current = getStoredPocs();
    const updated = current.map(p => p.id === pocId ? { ...p, ...updateData } : p);
    saveStoredPocs(updated);
    return updateData;
  }
};

export const deletePoc = async (pocId) => {
  try {
    await apiClient.delete(`/pocs/${pocId}`);
  } catch (error) {
    console.warn("Backend offline, marking soft delete in local storage:", error.message);
  }
  const current = getStoredPocs();
  const updated = current.map(p => p.id === pocId ? { ...p, status: 'DELETED' } : p);
  saveStoredPocs(updated);
  return true;
};

export const restorePoc = async (pocId) => {
  try {
    await apiClient.post(`/pocs/${pocId}/restore`);
  } catch (error) {
    console.warn("Backend offline, restoring in local storage:", error.message);
  }
  const current = getStoredPocs();
  const updated = current.map(p => p.id === pocId ? { ...p, status: 'PUBLISHED' } : p);
  saveStoredPocs(updated);
  return true;
};

export const getCategories = async () => {
  try {
    const response = await apiClient.get('/categories');
    return response.data;
  } catch (error) {
    return [{ id: "all", name: "All Solutions" }];
  }
};

export const trackView = async (identifier) => {
  try {
    await apiClient.post(`/pocs/${identifier}/view`);
  } catch (e) {}
};

export const getAnalytics = async () => {
  try {
    const response = await apiClient.get('/admin/analytics');
    return response.data;
  } catch (error) {
    const local = getStoredPocs();
    return {
      totalPocs: local.length,
      published: local.filter(p => p.status === 'PUBLISHED').length,
      drafts: local.filter(p => p.status === 'DRAFT').length,
      archived: local.filter(p => p.status === 'ARCHIVED').length,
      deleted: local.filter(p => p.status === 'DELETED').length,
      totalViews: local.reduce((acc, p) => acc + (p.views || 0), 0),
      demoRequests: local.reduce((acc, p) => acc + (p.demo_requests || 0), 0),
      lastUpdated: new Date().toISOString()
    };
  }
};
