import { apiClient } from './client';

export const getWebsiteSettings = async () => {
  try {
    const response = await apiClient.get('/settings');
    return response.data;
  } catch (error) {
    return {
      company_name: "Vibodh AI Labs",
      tagline: "Think AI. Build Beyond Limits.",
      contact_email: "contact@vibodh.ai",
      hero_title: "Think AI. Build Beyond Limits.",
      hero_subtitle: "Enterprise-grade autonomous AI solutions, natural language query engines, and high-performance multimodal research.",
      hero_cta_primary_label: "Explore Solutions POCs",
      hero_cta_primary_url: "/solutions",
      seo_meta_title: "Vibodh AI Labs - Think AI. Build Beyond.",
      seo_meta_description: "Enterprise AI Research, Text-to-SQL Translation, and Multimodal Autonomous Agents."
    };
  }
};

export const updateWebsiteSettings = async (settingsData) => {
  try {
    const response = await apiClient.put('/settings', settingsData);
    return response.data;
  } catch (error) {
    return settingsData;
  }
};
