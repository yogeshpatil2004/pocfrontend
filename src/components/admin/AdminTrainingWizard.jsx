import React, { useState } from 'react';
import {
  ArrowRight, ArrowLeft, Upload, Trash2, Globe, FileText, AlertCircle, Link as LinkIcon
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { createTraining, updateTraining } from '../../api/trainingApi';
import { uploadMediaFile } from '../../api/mediaApi';

export const AdminTrainingWizard = ({ initialTraining = null, onFinish }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [trainingData, setTrainingData] = useState({
    id: initialTraining?.id || '',
    title: initialTraining?.title || '',
    slug: initialTraining?.slug || '',
    short_description: initialTraining?.short_description || '',
    status: initialTraining?.status || 'DRAFT',
    resources: initialTraining?.resources || [],
  });

  const stepsList = [
    { num: 1, title: 'Basic Info', icon: FileText },
    { num: 2, title: 'Training Material', icon: Upload },
    { num: 3, title: 'Publish', icon: Globe }
  ];

  const validateStep = (step) => {
    setErrorMsg('');
    if (step === 1) {
      if (!trainingData.title.trim() || !trainingData.short_description.trim()) {
        setErrorMsg('Title and Short Description are required.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handleStepClick = (targetStep) => {
    if (targetStep < currentStep || validateStep(currentStep)) {
      setErrorMsg('');
      setCurrentStep(targetStep);
    }
  };

  const handleResourceUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg('');
    const uploadedUrl = await uploadMediaFile(file, 'training');
    setUploading(false);

    if (uploadedUrl) {
      updateArrayItem('resources', index, 'resource_url', uploadedUrl);
      if (!trainingData.resources[index].resource_name) {
        updateArrayItem('resources', index, 'resource_name', file.name);
      }
    } else {
      setErrorMsg('Failed to upload file.');
    }
  };

  const addArrayItem = (field, defaultItem) => {
    setTrainingData(prev => ({
      ...prev,
      [field]: [...prev[field], defaultItem]
    }));
  };

  const updateArrayItem = (field, index, key, value) => {
    const updated = [...trainingData[field]];
    updated[index][key] = value;
    setTrainingData({ ...trainingData, [field]: updated });
  };

  const removeArrayItem = (field, index) => {
    const updated = trainingData[field].filter((_, i) => i !== index);
    setTrainingData({ ...trainingData, [field]: updated });
  };

  const handleSave = async (targetStatus = 'PUBLISHED') => {
    setSaving(true);
    setErrorMsg('');

    const payload = {
      ...trainingData,
      status: targetStatus
    };

    try {
      if (trainingData.id) {
        await updateTraining(trainingData.id, payload);
      } else {
        await createTraining(payload);
      }
      if (onFinish) onFinish();
    } catch (e) {
      setErrorMsg('Failed to save training material.');
    }
    setSaving(false);
  };

  return (
    <div className="space-y-8">
      {/* Stepper Header */}
      <div className="overflow-x-auto pb-4 scrollbar-none border-b border-slate-200">
        <div className="flex items-center gap-3 min-w-max">
          {stepsList.map((st) => {
            const Icon = st.icon;
            const isCompleted = currentStep > st.num;
            const isCurrent = currentStep === st.num;

            return (
              <button
                key={st.num}
                onClick={() => handleStepClick(st.num)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded text-xs font-mono transition-all border ${
                  isCurrent
                    ? 'bg-primary-600 text-slate-900 border-primary-600 shadow-[0_0_15px_rgba(79,70,229,0.3)] font-semibold'
                    : isCompleted
                    ? 'bg-white text-slate-800 border-slate-300'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{st.num}. {st.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg font-mono text-xs flex items-center gap-2 max-w-4xl mx-auto shadow-md">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: Basic Info */}
      {currentStep === 1 && (
        <GlassCard hoverEffect={false} className="max-w-4xl mx-auto space-y-6 border-primary-200">
          <h3 className="text-xl font-bold text-slate-900 font-headline border-b border-slate-200 pb-3">Step 1: Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" value={trainingData.title} onChange={e => setTrainingData({...trainingData, title: e.target.value})} placeholder="Training Title *" className="w-full bg-white border border-slate-200 rounded px-4 py-2.5 text-slate-900 font-sans text-sm focus:border-primary-600" />
            <input type="text" value={trainingData.slug} onChange={e => setTrainingData({...trainingData, slug: e.target.value})} placeholder="Slug (optional)" className="w-full bg-white border border-slate-200 rounded px-4 py-2.5 text-slate-900 font-mono text-sm focus:border-primary-600" />
          </div>
          <textarea rows={4} value={trainingData.short_description} onChange={e => setTrainingData({...trainingData, short_description: e.target.value})} placeholder="Short Description *" className="w-full bg-white border border-slate-200 rounded px-4 py-2.5 text-slate-900 font-sans text-sm focus:border-primary-600" />
        </GlassCard>
      )}

      {/* STEP 2: Training Material & Folders */}
      {currentStep === 2 && (
        <GlassCard hoverEffect={false} className="max-w-4xl mx-auto space-y-6 border-primary-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-3">
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-headline">Step 2: Training Folders & Resources</h3>
              <p className="text-xs font-sans text-slate-500 mt-1">Organize files, links, videos, and documents into folders or modules.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => addArrayItem('resources', { folder_name: 'New Folder', resource_name: '', resource_type: 'PDF', resource_url: '' })}>
                + Add Folder / File
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {trainingData.resources.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-sans text-sm">
                No resources added yet. Click "+ Add Folder / File" to add documents, links, or videos.
              </div>
            ) : (
              trainingData.resources.map((res, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Folder / Module Name */}
                    <div>
                      <label className="block text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        📁 Folder / Module Name
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. Module 1: Architecture" 
                        value={res.folder_name || ''} 
                        onChange={e => updateArrayItem('resources', idx, 'folder_name', e.target.value)} 
                        className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-900 text-sm focus:border-primary-600" 
                      />
                    </div>

                    {/* Resource Name */}
                    <div>
                      <label className="block text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        📄 Resource Title
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. Training Slide Deck" 
                        value={res.resource_name} 
                        onChange={e => updateArrayItem('resources', idx, 'resource_name', e.target.value)} 
                        className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-900 text-sm focus:border-primary-600" 
                      />
                    </div>

                    {/* Resource Type */}
                    <div>
                      <label className="block text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        📌 Type
                      </label>
                      <select 
                        value={res.resource_type} 
                        onChange={e => updateArrayItem('resources', idx, 'resource_type', e.target.value)} 
                        className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-900 text-sm focus:border-primary-600"
                      >
                        {['PDF', 'PPT', 'DOC/DOCX', 'ZIP File', 'Video', 'GitHub Repository Link', 'YouTube Link', 'Google Drive Link', 'External Documentation Link', 'Other'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* URL or File Upload */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                    <div className="flex-1 w-full">
                      {['PDF', 'PPT', 'DOC/DOCX', 'Video', 'ZIP File', 'Other'].includes(res.resource_type) ? (
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            placeholder="Uploaded File URL" 
                            value={res.resource_url} 
                            readOnly
                            className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-900 text-sm opacity-70" 
                          />
                          <label className="cursor-pointer bg-primary-600 hover:bg-primary-700 text-slate-900 px-3 py-2 rounded text-sm whitespace-nowrap transition-colors flex items-center gap-2 shrink-0">
                            <Upload className="w-4 h-4" />
                            {uploading ? 'Uploading...' : 'Upload File'}
                            <input type="file" className="hidden" onChange={(e) => handleResourceUpload(e, idx)} disabled={uploading} />
                          </label>
                        </div>
                      ) : (
                        <input 
                          type="text" 
                          placeholder="Paste External Link / URL (https://...)" 
                          value={res.resource_url} 
                          onChange={e => updateArrayItem('resources', idx, 'resource_url', e.target.value)} 
                          className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-900 text-sm focus:border-primary-600" 
                        />
                      )}
                    </div>

                    <button 
                      onClick={() => removeArrayItem('resources', idx)} 
                      className="text-red-500 hover:text-red-600 p-2 rounded bg-red-50 hover:bg-red-100 border border-red-200 transition-colors shrink-0 self-end sm:self-auto"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>
      )}

      {/* STEP 3: Publish */}
      {currentStep === 3 && (
        <GlassCard hoverEffect={false} className="max-w-4xl mx-auto space-y-6 border-primary-200 text-center py-10">
          <Globe className="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-slate-900 font-headline">Step 3: Publish</h3>
          <p className="text-slate-500 font-sans text-sm">Review your training material and save.</p>
          <div className="flex justify-center gap-4 mt-6">
            <Button variant="secondary" onClick={() => handleSave('DRAFT')} disabled={saving}>Save Draft</Button>
            <Button onClick={() => handleSave('PUBLISHED')} disabled={saving}>Publish</Button>
            {trainingData.id && <Button variant="secondary" onClick={() => handleSave('ARCHIVED')} disabled={saving}>Archive</Button>}
          </div>
        </GlassCard>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between max-w-4xl mx-auto pt-6 border-t border-slate-200">
        <Button
          variant="secondary"
          onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
          disabled={currentStep === 1 || saving}
          icon={ArrowLeft}
        >
          Previous
        </Button>

        {currentStep < 3 && (
          <Button
            onClick={handleNext}
            disabled={saving}
          >
            Next Step <ArrowRight className="w-4 h-4 ml-2 inline" />
          </Button>
        )}
      </div>

    </div>
  );
};

