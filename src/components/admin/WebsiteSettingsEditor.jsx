import React, { useState, useEffect } from 'react';
import { Save, Check, Globe } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { getWebsiteSettings, updateWebsiteSettings } from '../../api/settingsApi';

export const WebsiteSettingsEditor = () => {
  const [settings, setSettings] = useState({
    company_name: 'Vibodh AI Labs',
    tagline: 'Think AI. Build Beyond Limits.',
    contact_email: 'contact@vibodh.ai',
    linkedin_url: 'https://linkedin.com/company/vibodh-ai',
    github_url: 'https://github.com/vibodh-ai',
    hero_title: 'Think AI. Build Beyond Limits.',
    hero_subtitle: 'Enterprise-grade autonomous AI solutions, natural language query engines, and high-performance multimodal research.',
    seo_meta_title: 'Vibodh AI Labs - Think AI. Build Beyond.',
    seo_meta_description: 'Enterprise AI Research, Text-to-SQL Translation, and Multimodal Autonomous Agents.'
  });

  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    getWebsiteSettings().then(setSettings);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateWebsiteSettings(settings);
    setSaving(false);
    setSavedMessage('Website settings updated successfully!');
    setTimeout(() => setSavedMessage(''), 4000);
  };

  return (
    <GlassCard hoverEffect={false} className="border-primary-200 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-slate-900 font-headline font-bold text-xl pb-4 border-b border-slate-200">
        <Globe className="w-5 h-5 text-primary-600" />
        <span>Global Website Settings & Branding Module</span>
      </div>

      {savedMessage && (
        <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{savedMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block font-mono text-xs text-slate-700">Company Name</label>
            <input
              type="text"
              value={settings.company_name}
              onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded p-3 font-sans text-sm text-slate-900 focus:outline-none focus:border-primary-600"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-mono text-xs text-slate-700">Contact Email</label>
            <input
              type="email"
              value={settings.contact_email}
              onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded p-3 font-sans text-sm text-slate-900 focus:outline-none focus:border-primary-600"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block font-mono text-xs text-slate-700">Homepage Hero Title</label>
          <input
            type="text"
            value={settings.hero_title}
            onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
            className="w-full bg-white border border-slate-200 rounded p-3 font-headline text-base text-slate-900 focus:outline-none focus:border-primary-600"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-mono text-xs text-slate-700">Homepage Hero Subtitle</label>
          <textarea
            rows={2}
            value={settings.hero_subtitle}
            onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
            className="w-full bg-white border border-slate-200 rounded p-3 font-sans text-sm text-slate-900 focus:outline-none focus:border-primary-600"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block font-mono text-xs text-slate-700">GitHub Link</label>
            <input
              type="text"
              value={settings.github_url}
              onChange={(e) => setSettings({ ...settings, github_url: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded p-3 font-mono text-xs text-slate-900 focus:outline-none focus:border-primary-600"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-mono text-xs text-slate-700">LinkedIn Link</label>
            <input
              type="text"
              value={settings.linkedin_url}
              onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded p-3 font-mono text-xs text-slate-900 focus:outline-none focus:border-primary-600"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <Button type="submit" disabled={saving} icon={Save}>
            {saving ? 'Updating Settings...' : 'Save Settings'}
          </Button>
        </div>

      </form>
    </GlassCard>
  );
};
