import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

const LOCAL_STORAGE_KEY = 'vibodh_ai_pocs';

export const getStoredPocs = () => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveStoredPocs = (pocs) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(pocs));
  } catch (e) {}
};

const DOWNLOADS_STORAGE_KEY = 'vibodh_training_downloads';

export const getStoredDownloads = () => {
  try {
    const data = localStorage.getItem(DOWNLOADS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveStoredDownload = (item) => {
  try {
    const downloads = getStoredDownloads();
    const existingIdx = downloads.findIndex(d => d.resource_url === item.resource_url);
    if (existingIdx >= 0) {
      downloads.splice(existingIdx, 1);
    }
    downloads.unshift({
      ...item,
      download_date: new Date().toISOString()
    });
    localStorage.setItem(DOWNLOADS_STORAGE_KEY, JSON.stringify(downloads.slice(0, 50))); // Keep last 50
  } catch (e) {}
};

export const MOCK_CATEGORIES = [];

export const MOCK_ADMIN_METRICS = {
  totalRequests: "1,048",
  avgLatency: "185ms",
  successRate: "99.98%",
  activeModels: 4,
  modelStatus: [
    { name: "Text-to-SQL Pipeline", version: "v2.4.0", provider: "OpenAI / Claude", status: "Healthy", latency: "180ms" }
  ],
  systemLogs: [
    "[SYSTEM 05:00:00] Dynamic POC repository active.",
    "[DB 05:00:05] Supabase session active."
  ]
};
