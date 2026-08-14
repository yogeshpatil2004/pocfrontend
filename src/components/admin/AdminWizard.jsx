import React, { useState } from 'react';
import {
  ArrowRight, ArrowLeft, Upload, Plus, Trash2, Globe, Eye, Sparkles, Layers, Code, Cpu, Briefcase, FileText, Link as LinkIcon, Search, AlertCircle
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { TechBadge } from '../ui/TechBadge';
import { createPoc, updatePoc } from '../../api/pocsApi';
import { uploadMediaFile } from '../../api/mediaApi';

export const AdminWizard = ({ initialPoc = null, onFinish }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Manual Input State Payload
  const [pocData, setPocData] = useState({
    id: initialPoc?.id || '',
    title: initialPoc?.title || '',
    slug: initialPoc?.slug || '',
    short_description: initialPoc?.short_description || '',
    full_description: initialPoc?.full_description || '',
    category_name: initialPoc?.category || initialPoc?.category_id || '',
    industry_name: initialPoc?.industry || initialPoc?.industry_id || '',
    status: initialPoc?.status || 'PUBLISHED',
    featured: initialPoc?.featured || false,
    
    // Media
    cover_image: initialPoc?.cover_image || '',
    banner_image: initialPoc?.banner_image || '',
    demo_video: initialPoc?.demo_video || '',
    gallery_images: initialPoc?.gallery_images || [],

    // Tech Stack (Manual Inputs)
    languages: 'Python, TypeScript',
    frameworks: 'FastAPI, React, LangChain',
    cloud_platforms: 'AWS, Supabase',
    databases: 'PostgreSQL, Pinecone',

    // AI Stack (Manual Inputs)
    llm_provider: 'OpenAI / Claude',
    model_name: 'GPT-4o',
    embedding_model: 'text-embedding-3-small',
    vector_db: 'Pinecone',
    rag_framework: 'Hybrid Vector Search',
    agent_framework: 'LangChain / AutoGen',

    // Business Details (Manual Inputs)
    problem_statement: initialPoc?.problem_statement || '',
    solution_statement: initialPoc?.solution_statement || '',
    business_benefits: initialPoc?.business_benefits || '',
    target_users: initialPoc?.target_users || '',
    expected_outcome: initialPoc?.expected_outcome || '',

    // Dynamic Arrays
    features: initialPoc?.features || [
      { feature_name: '', description: '', display_order: 1 }
    ],
    workflow_steps: initialPoc?.workflow_steps || [
      { title: '', description: '', step_order: 1 }
    ],

    // Links & Metrics (Manual Inputs)
    github_url: initialPoc?.github_url || '',
    live_demo_url: initialPoc?.live_demo_url || '',
    documentation_url: initialPoc?.documentation_url || '',
    youtube_url: initialPoc?.youtube_url || ''
  });

  const stepsList = [
    { num: 1, title: 'Basic Info', icon: FileText },
    { num: 2, title: 'Media Upload', icon: Upload },
    { num: 3, title: 'Technology', icon: Code },
    { num: 4, title: 'Business Details', icon: Briefcase },
    { num: 5, title: 'Features', icon: Sparkles },
    { num: 6, title: 'Workflow', icon: Layers },
    { num: 7, title: 'Links', icon: LinkIcon },
    { num: 8, title: 'Publish', icon: Globe }
  ];

  const validateStep = (step) => {
    setErrorMsg('');
    switch (step) {
      case 1:
        if (!pocData.title.trim()) {
          setErrorMsg('Title is required to proceed to the next step.');
          return false;
        }
        if (!pocData.short_description.trim()) {
          setErrorMsg('Short Description is required to proceed.');
          return false;
        }
        return true;

      case 2:
        if (!pocData.cover_image.trim()) {
          setErrorMsg('Cover Image is required to proceed (upload an image or enter a valid URL).');
          return false;
        }
        return true;

      case 3:
        if (!pocData.languages.trim() && !pocData.frameworks.trim()) {
          setErrorMsg('Please specify at least one programming language or framework.');
          return false;
        }
        return true;

      case 4:
        if (!pocData.problem_statement.trim()) {
          setErrorMsg('Problem Statement is required to proceed.');
          return false;
        }
        return true;

      case 5:
        if (!pocData.features.length || !pocData.features[0].feature_name.trim()) {
          setErrorMsg('Please enter at least one Key Feature name.');
          return false;
        }
        return true;

      case 6:
        if (!pocData.workflow_steps.length || !pocData.workflow_steps[0].title.trim()) {
          setErrorMsg('Please enter at least one Workflow Step title.');
          return false;
        }
        return true;

      case 7:
        // All links in Step 7 are optional
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 8));
    }
  };

  const handleStepClick = (targetStep) => {
    if (targetStep < currentStep) {
      setErrorMsg('');
      setCurrentStep(targetStep);
      return;
    }

    if (targetStep > currentStep) {
      if (validateStep(currentStep)) {
        setCurrentStep(targetStep);
      }
    }
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setPocData({
      ...pocData,
      title: val,
      slug: pocData.slug || generatedSlug
    });
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg('');
    const uploadedUrl = await uploadMediaFile(file, 'cover');
    setUploading(false);

    if (uploadedUrl) {
      if (field === 'gallery') {
        setPocData((prev) => ({
          ...prev,
          gallery_images: [...prev.gallery_images, uploadedUrl]
        }));
      } else {
        setPocData((prev) => ({
          ...prev,
          [field]: uploadedUrl
        }));
      }
    } else {
      setErrorMsg('Failed to upload file to Supabase S3. Please try again.');
    }
  };

  const handleAddFeature = () => {
    setPocData({
      ...pocData,
      features: [
        ...pocData.features,
        { feature_name: '', description: '', display_order: pocData.features.length + 1 }
      ]
    });
  };

  const handleFeatureChange = (index, field, val) => {
    const updated = [...pocData.features];
    updated[index][field] = val;
    setPocData({ ...pocData, features: updated });
  };

  const handleRemoveFeature = (index) => {
    const updated = pocData.features.filter((_, i) => i !== index);
    setPocData({ ...pocData, features: updated });
  };

  const handleAddWorkflowStep = () => {
    setPocData({
      ...pocData,
      workflow_steps: [
        ...pocData.workflow_steps,
        { title: '', description: '', step_order: pocData.workflow_steps.length + 1 }
      ]
    });
  };

  const handleWorkflowChange = (index, field, val) => {
    const updated = [...pocData.workflow_steps];
    updated[index][field] = val;
    setPocData({ ...pocData, workflow_steps: updated });
  };

  const handleRemoveWorkflowStep = (index) => {
    const updated = pocData.workflow_steps.filter((_, i) => i !== index);
    setPocData({ ...pocData, workflow_steps: updated });
  };

  const handleSavePoc = async (targetStatus = 'PUBLISHED') => {
    setSaving(true);
    setErrorMsg('');

    const categoryId = pocData.category_name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const payload = {
      ...pocData,
      category: pocData.category_name,
      category_id: categoryId,
      industry_id: '',
      status: targetStatus,
      tags: [
        ...pocData.frameworks.split(','),
        ...pocData.databases.split(',')
      ].map(t => t.trim()).filter(Boolean)
    };

    if (pocData.id) {
      await updatePoc(pocData.id, payload);
    } else {
      await createPoc(payload);
    }

    setSaving(false);
    if (onFinish) onFinish();
  };

  return (
    <div className="space-y-8">
      
      {/* Stepper Header (Clean numbers, NO right mark checkmarks!) */}
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

      {/* Validation Error Alert Banner */}
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg font-mono text-xs flex items-center gap-2 max-w-4xl mx-auto shadow-md">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: BASIC INFORMATION */}
      {currentStep === 1 && (
        <GlassCard hoverEffect={false} className="border-primary-200 max-w-4xl mx-auto space-y-6">
          <h3 className="text-xl font-bold text-slate-900 font-headline border-b border-slate-200 pb-3">Step 1: Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-mono text-xs text-slate-700">POC Title *</label>
              <input
                type="text"
                value={pocData.title}
                onChange={handleTitleChange}
                placeholder="e.g. Text2SQL Autonomous Analytics Engine"
                className="w-full bg-white border border-slate-200 rounded px-4 py-2.5 text-slate-900 font-sans text-sm focus:border-primary-600 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs text-slate-700">URL Slug</label>
              <input
                type="text"
                value={pocData.slug}
                onChange={(e) => setPocData({ ...pocData, slug: e.target.value })}
                placeholder="e.g. text2sql-analytics-engine"
                className="w-full bg-white border border-slate-200 rounded px-4 py-2.5 text-slate-900 font-mono text-xs focus:border-primary-600 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs text-slate-700">Category Name</label>
              <input
                type="text"
                value={pocData.category_name}
                onChange={(e) => setPocData({ ...pocData, category_name: e.target.value })}
                placeholder="e.g. Generative AI & RAG"
                className="w-full bg-white border border-slate-200 rounded px-4 py-2.5 text-slate-900 font-sans text-sm focus:border-primary-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-mono text-xs text-slate-700">Short Description (Summary) *</label>
            <textarea
              rows={2}
              value={pocData.short_description}
              onChange={(e) => setPocData({ ...pocData, short_description: e.target.value })}
              placeholder="High-level 2-line summary for showcase cards..."
              className="w-full bg-white border border-slate-200 rounded px-4 py-2.5 text-slate-900 font-sans text-sm focus:border-primary-600 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="font-mono text-xs text-slate-700">Full Description</label>
            <textarea
              rows={4}
              value={pocData.full_description}
              onChange={(e) => setPocData({ ...pocData, full_description: e.target.value })}
              placeholder="Detailed technical description of this proof of concept..."
              className="w-full bg-white border border-slate-200 rounded px-4 py-2.5 text-slate-900 font-sans text-sm focus:border-primary-600 focus:outline-none"
            />
          </div>
        </GlassCard>
      )}

      {/* STEP 2: MEDIA UPLOAD */}
      {currentStep === 2 && (
        <GlassCard hoverEffect={false} className="border-primary-200 max-w-4xl mx-auto space-y-6">
          <h3 className="text-xl font-bold text-slate-900 font-headline border-b border-slate-200 pb-3">Step 2: Media Assets & Supabase S3 Upload</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="font-mono text-xs text-slate-700">Cover Image URL *</label>
              <input
                type="text"
                value={pocData.cover_image}
                onChange={(e) => setPocData({ ...pocData, cover_image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-white border border-slate-200 rounded px-4 py-2.5 text-slate-900 font-sans text-sm focus:border-primary-600 focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'cover_image')}
                  className="hidden"
                  id="cover-upload"
                />
                <label
                  htmlFor="cover-upload"
                  className="cursor-pointer px-4 py-2 rounded bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 hover:text-primary-600 hover:border-primary-600 transition-all flex items-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5 text-primary-600" />
                  {uploading ? 'Uploading to S3...' : 'Upload Cover File'}
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <label className="font-mono text-xs text-slate-700">Banner Image URL</label>
              <input
                type="text"
                value={pocData.banner_image}
                onChange={(e) => setPocData({ ...pocData, banner_image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-white border border-slate-200 rounded px-4 py-2.5 text-slate-900 font-sans text-sm focus:border-primary-600 focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'banner_image')}
                  className="hidden"
                  id="banner-upload"
                />
                <label
                  htmlFor="banner-upload"
                  className="cursor-pointer px-4 py-2 rounded bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 hover:text-primary-600 hover:border-primary-600 transition-all flex items-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5 text-primary-600" />
                  {uploading ? 'Uploading to S3...' : 'Upload Banner File'}
                </label>
              </div>
            </div>

          </div>
        </GlassCard>
      )}

      {/* STEP 3: TECHNOLOGY STACK */}
      {currentStep === 3 && (
        <GlassCard hoverEffect={false} className="border-primary-200 max-w-4xl mx-auto space-y-6">
          <h3 className="text-xl font-bold text-slate-900 font-headline border-b border-slate-200 pb-3">Step 3: Technology Stack (Manual Inputs)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-mono text-xs text-slate-700">Languages *</label>
              <input
                type="text"
                value={pocData.languages}
                onChange={(e) => setPocData({ ...pocData, languages: e.target.value })}
                placeholder="Python, TypeScript, SQL"
                className="w-full bg-white border border-slate-200 rounded px-4 py-2.5 text-slate-900 font-sans text-sm focus:border-primary-600 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs text-slate-700">Frameworks *</label>
              <input
                type="text"
                value={pocData.frameworks}
                onChange={(e) => setPocData({ ...pocData, frameworks: e.target.value })}
                placeholder="FastAPI, React, LangChain"
                className="w-full bg-white border border-slate-200 rounded px-4 py-2.5 text-slate-900 font-sans text-sm focus:border-primary-600 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs text-slate-700">Cloud Platforms</label>
              <input
                type="text"
                value={pocData.cloud_platforms}
                onChange={(e) => setPocData({ ...pocData, cloud_platforms: e.target.value })}
                placeholder="AWS, Supabase, Vercel"
                className="w-full bg-white border border-slate-200 rounded px-4 py-2.5 text-slate-900 font-sans text-sm focus:border-primary-600 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs text-slate-700">Databases</label>
              <input
                type="text"
                value={pocData.databases}
                onChange={(e) => setPocData({ ...pocData, databases: e.target.value })}
                placeholder="PostgreSQL, Redis, Pinecone"
                className="w-full bg-white border border-slate-200 rounded px-4 py-2.5 text-slate-900 font-sans text-sm focus:border-primary-600 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs text-slate-700">LLM Provider</label>
              <input
                type="text"
                value={pocData.llm_provider}
                onChange={(e) => setPocData({ ...pocData, llm_provider: e.target.value })}
                placeholder="OpenAI / Anthropic Claude"
                className="w-full bg-white border border-slate-200 rounded px-4 py-2.5 text-slate-900 font-sans text-sm focus:border-primary-600 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs text-slate-700">Model Name</label>
              <input
                type="text"
                value={pocData.model_name}
                onChange={(e) => setPocData({ ...pocData, model_name: e.target.value })}
                placeholder="GPT-4o / Claude 3.5 Sonnet"
                className="w-full bg-white border border-slate-200 rounded px-4 py-2.5 text-slate-900 font-sans text-sm focus:border-primary-600 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs text-slate-700">Embedding Model</label>
              <input
                type="text"
                value={pocData.embedding_model}
                onChange={(e) => setPocData({ ...pocData, embedding_model: e.target.value })}
                placeholder="text-embedding-3-small"
                className="w-full bg-white border border-slate-200 rounded px-4 py-2.5 text-slate-900 font-sans text-sm focus:border-primary-600 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs text-slate-700">Vector Database</label>
              <input
                type="text"
                value={pocData.vector_db}
                onChange={(e) => setPocData({ ...pocData, vector_db: e.target.value })}
                placeholder="Pinecone / pgvector"
                className="w-full bg-white border border-slate-200 rounded px-4 py-2.5 text-slate-900 font-sans text-sm focus:border-primary-600 focus:outline-none"
              />
            </div>
          </div>
        </GlassCard>
      )}

      {/* STEP 4: BUSINESS DETAILS */}
      {currentStep === 4 && (
        <GlassCard hoverEffect={false} className="border-primary-200 max-w-4xl mx-auto space-y-6">
          <h3 className="text-xl font-bold text-slate-900 font-headline border-b border-slate-200 pb-3">Step 4: Business Impact & Solution Details</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="font-mono text-xs text-slate-700">Problem Statement *</label>
              <textarea
                rows={3}
                value={pocData.problem_statement}
                onChange={(e) => setPocData({ ...pocData, problem_statement: e.target.value })}
                placeholder="Describe the business bottleneck or engineering challenge..."
                className="w-full bg-white border border-slate-200 rounded px-4 py-2.5 text-slate-900 font-sans text-sm focus:border-primary-600 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs text-slate-700">Solution Statement</label>
              <textarea
                rows={3}
                value={pocData.solution_statement}
                onChange={(e) => setPocData({ ...pocData, solution_statement: e.target.value })}
                placeholder="How this AI architectural solution solves the bottleneck..."
                className="w-full bg-white border border-slate-200 rounded px-4 py-2.5 text-slate-900 font-sans text-sm focus:border-primary-600 focus:outline-none"
              />
            </div>
          </div>
        </GlassCard>
      )}

      {/* STEP 5: KEY FEATURES */}
      {currentStep === 5 && (
        <GlassCard hoverEffect={false} className="border-primary-200 max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-xl font-bold text-slate-900 font-headline">Step 5: Key Features</h3>
            <Button size="sm" variant="secondary" onClick={handleAddFeature} icon={Plus}>
              Add Feature
            </Button>
          </div>

          <div className="space-y-4">
            {pocData.features.map((ft, idx) => (
              <div key={idx} className="p-4 rounded bg-slate-50 border border-slate-200 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-primary-600">Feature #{idx + 1}</span>
                  {pocData.features.length > 1 && (
                    <button
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-red-400 hover:text-red-300 text-xs font-mono p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={ft.feature_name}
                    onChange={(e) => handleFeatureChange(idx, 'feature_name', e.target.value)}
                    placeholder="Feature Name (e.g. Automated Schema Linking) *"
                    className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-900 font-sans text-sm focus:border-primary-600 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={ft.description}
                    onChange={(e) => handleFeatureChange(idx, 'description', e.target.value)}
                    placeholder="Feature Description..."
                    className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-900 font-sans text-sm focus:border-primary-600 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* STEP 6: WORKFLOW STEPS */}
      {currentStep === 6 && (
        <GlassCard hoverEffect={false} className="border-primary-200 max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-xl font-bold text-slate-900 font-headline">Step 6: Workflow & Architecture Pipeline</h3>
            <Button size="sm" variant="secondary" onClick={handleAddWorkflowStep} icon={Plus}>
              Add Workflow Step
            </Button>
          </div>

          <div className="space-y-4">
            {pocData.workflow_steps.map((wf, idx) => (
              <div key={idx} className="p-4 rounded bg-slate-50 border border-slate-200 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-primary-600">Step #{idx + 1}</span>
                  {pocData.workflow_steps.length > 1 && (
                    <button
                      onClick={() => handleRemoveWorkflowStep(idx)}
                      className="text-red-400 hover:text-red-300 text-xs font-mono p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={wf.title}
                    onChange={(e) => handleWorkflowChange(idx, 'title', e.target.value)}
                    placeholder="Workflow Title (e.g. Query Ingestion) *"
                    className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-900 font-sans text-sm focus:border-primary-600 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={wf.description}
                    onChange={(e) => handleWorkflowChange(idx, 'description', e.target.value)}
                    placeholder="Workflow Step Description..."
                    className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-slate-900 font-sans text-sm focus:border-primary-600 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* STEP 7: EXTERNAL LINKS & PERFORMANCE METRICS */}
      {currentStep === 7 && (
        <GlassCard hoverEffect={false} className="border-primary-200 max-w-4xl mx-auto space-y-6">
          <h3 className="text-xl font-bold text-slate-900 font-headline border-b border-slate-200 pb-3">Step 7: External Links</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-mono text-xs text-slate-700">GitHub Repository URL (Optional)</label>
              <input
                type="text"
                value={pocData.github_url}
                onChange={(e) => setPocData({ ...pocData, github_url: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full bg-white border border-slate-200 rounded px-4 py-2.5 text-slate-900 font-sans text-sm focus:border-primary-600 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs text-slate-700">Live Demo URL</label>
              <input
                type="text"
                value={pocData.live_demo_url}
                onChange={(e) => setPocData({ ...pocData, live_demo_url: e.target.value })}
                placeholder="https://demo.vibodhai.com/..."
                className="w-full bg-white border border-slate-200 rounded px-4 py-2.5 text-slate-900 font-sans text-sm focus:border-primary-600 focus:outline-none"
              />
            </div>
          </div>
        </GlassCard>
      )}

      {/* STEP 8: PUBLISH & SAVE */}
      {currentStep === 8 && (
        <GlassCard hoverEffect={false} className="border-primary-200 max-w-4xl mx-auto space-y-8 text-center py-10">
          <div className="w-16 h-16 rounded-full bg-primary-600/20 text-primary-600 flex items-center justify-center mx-auto">
            <Globe className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 font-headline">Step 8: Publish & Save POC</h3>
          <p className="text-slate-500 font-sans text-sm max-w-md mx-auto">
            Save as draft for review or publish directly to your live public showcase gallery.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Button variant="secondary" size="lg" onClick={() => handleSavePoc('DRAFT')} disabled={saving}>
              Save as Draft
            </Button>

            <Button size="lg" onClick={() => handleSavePoc('PUBLISHED')} disabled={saving}>
              {saving ? 'Publishing...' : 'Publish to Live Showcase'}
            </Button>
          </div>
        </GlassCard>
      )}

      {/* Stepper Controls */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        <Button
          variant="secondary"
          size="md"
          onClick={() => { setErrorMsg(''); setCurrentStep(Math.max(1, currentStep - 1)); }}
          disabled={currentStep === 1}
          icon={ArrowLeft}
        >
          Previous Step
        </Button>

        <span className="font-mono text-xs text-slate-500">
          Step {currentStep} of 8
        </span>

        <Button
          size="md"
          onClick={handleNext}
          disabled={currentStep === 8}
          icon={ArrowRight}
        >
          Next Step
        </Button>
      </div>

    </div>
  );
};
