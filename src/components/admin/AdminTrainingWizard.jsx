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

      {/* STEP 2: Training Material */}
      {currentStep === 2 && (
        <GlassCard hoverEffect={false} className="max-w-4xl mx-auto space-y-6 border-primary-200">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <h3 className="text-xl font-bold text-slate-900 font-headline">Step 2: Training Material</h3>
            <Button size="sm" onClick={() => addArrayItem('resources', { resource_name: '', resource_type: 'PDF', resource_url: '' })}>Add Resource</Button>
          </div>
          <p className="text-sm font-sans text-slate-500">Add PDF, PPT, DOC, Video, GitHub or any external link resources.</p>
          <div className="space-y-4">
            {trainingData.resources.map((res, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1 w-full md:w-auto">
                  <input type="text" placeholder="Resource Name (e.g. Training Deck)" value={res.resource_name} onChange={e => updateArrayItem('resources', idx, 'resource_name', e.target.value)} className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-900 text-sm" />
                </div>
                <div className="w-full md:w-1/4 space-y-2">
                  <select value={res.resource_type} onChange={e => updateArrayItem('resources', idx, 'resource_type', e.target.value)} className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-900 text-sm">
                    {['PDF', 'PPT', 'DOC/DOCX', 'Video', 'GitHub Repository Link', 'YouTube Link', 'External Documentation Link', 'Other'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex-1 space-y-2">
                  {['PDF', 'PPT', 'DOC/DOCX', 'Video', 'Other'].includes(res.resource_type) ? (
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        placeholder="Uploaded File URL" 
                        value={res.resource_url} 
                        readOnly
                        className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-900 text-sm opacity-70" 
                      />
                      <label className="cursor-pointer bg-primary-600 hover:bg-primary-700 text-slate-900 px-3 py-2 rounded text-sm whitespace-nowrap transition-colors flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        {uploading ? 'Uploading...' : 'Upload File'}
                        <input type="file" className="hidden" onChange={(e) => handleResourceUpload(e, idx)} disabled={uploading} />
                      </label>
                    </div>
                  ) : (
                    <input type="text" placeholder="URL / Link" value={res.resource_url} onChange={e => updateArrayItem('resources', idx, 'resource_url', e.target.value)} className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-900 text-sm" />
                  )}
                </div>
                
                {/* Delete Button (moved out of absolute positioning) */}
                <div className="w-full md:w-auto flex justify-end md:block">
                  <button 
                    onClick={() => removeArrayItem('resources', idx)} 
                    className="text-red-400 hover:text-red-300 p-2.5 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                    title="Remove Resource"
                  >
                    <Trash2 className="w-4 h-4"/>
                  </button>
                </div>
              </div>
            ))}
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

