import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Palette, Shield, RefreshCw, Layers, RotateCcw, Globe, Eye, Activity, LayoutDashboard, Settings, Menu, X, BarChart } from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { TechBadge } from '../components/ui/TechBadge';
import { StatusIndicator } from '../components/ui/StatusIndicator';
import { getPocs, deletePoc, restorePoc, getAnalytics } from '../api/pocsApi';
import { getTrainings, deleteTraining } from '../api/trainingApi';
import { AdminWizard } from '../components/admin/AdminWizard';
import { AdminTrainingWizard } from '../components/admin/AdminTrainingWizard';
import { TrainingExplorer } from '../components/training/TrainingExplorer';
import { WebsiteSettingsEditor } from '../components/admin/WebsiteSettingsEditor';

export const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [pocs, setPocs] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPoc, setSelectedPoc] = useState(null);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchPocsAndAnalytics = async () => {
    setLoading(true);
    const list = await getPocs({ status: statusFilter, include_deleted: true });
    const trainingList = await getTrainings({ status: statusFilter });
    const stats = await getAnalytics();
    setPocs(list);
    setTrainings(trainingList);
    setAnalytics(stats);
    setLoading(false);
  };

  useEffect(() => {
    fetchPocsAndAnalytics();
  }, [statusFilter]);

  const handleDeletePoc = async (pocId) => {
    if (!window.confirm("Soft delete this POC? (It can be restored from DELETED status)")) return;
    await deletePoc(pocId);
    fetchPocsAndAnalytics();
  };

  const handleRestorePoc = async (pocId) => {
    await restorePoc(pocId);
    fetchPocsAndAnalytics();
  };

  const handleEditPoc = (poc) => {
    setSelectedPoc(poc);
    setActiveTab('wizard');
  };

  const handleDeleteTraining = async (trainingId) => {
    if (!window.confirm("Soft delete this training material?")) return;
    await deleteTraining(trainingId);
    fetchPocsAndAnalytics();
  };

  const handleEditTraining = (training) => {
    setSelectedTraining(training);
    setActiveTab('wizard_training');
  };

  const tabs = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'manage_pocs', icon: Layers, label: 'POCs' },
    { id: 'wizard', icon: PlusCircle, label: 'New POC' },
    { id: 'manage_trainings', icon: Layers, label: 'Training Materials' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 font-headline flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary-600" />
          Admin Hub
        </h1>
        <div className="flex items-center gap-4">
          <UserButton afterSignOutUrl="/admin" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if (tab.id === 'wizard') setSelectedPoc(null);
              if (tab.id === 'wizard_training') setSelectedTraining(null);
            }}
            className={`flex items-center gap-2 px-4 py-3 font-mono text-sm transition-colors border-b-2 -mb-[1px] ${
              activeTab === tab.id 
                ? 'border-primary-600 text-primary-600 bg-primary-50/50' 
                : 'border-transparent text-slate-500 hover:text-primary-600 hover:bg-slate-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="py-4">
        {activeTab === 'overview' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="relative z-10 max-w-2xl space-y-6">
              <div className="flex items-center gap-2 text-primary-600 font-mono text-xs uppercase tracking-widest">
                <Shield className="w-4 h-4" />
                <span>Enterprise Admin Management Hub</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 font-headline leading-tight">
                Welcome to Vibodh AI
              </h2>
              <p className="text-slate-500 font-sans text-lg">
                Manage your Proof of Concepts (POCs), oversee enterprise training materials, and configure global website settings all from one unified dashboard.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Button onClick={() => setActiveTab('wizard')} icon={PlusCircle}>
                  Create New POC
                </Button>
                <Button variant="secondary" onClick={() => setActiveTab('manage_trainings')} icon={Layers}>
                  Manage Training Materials
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'wizard' && (
          <AdminWizard initialPoc={selectedPoc} onFinish={() => { setActiveTab('manage_pocs'); fetchPocsAndAnalytics(); }} />
        )}

        {activeTab === 'manage_pocs' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <h3 className="text-xl font-bold text-slate-900 font-headline">Active POC Repository ({pocs.length})</h3>
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="text-slate-500 hidden sm:inline-block">Filter Status:</span>
                {['ALL', 'PUBLISHED', 'DRAFT', 'ARCHIVED', 'DELETED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded border text-[10px] transition-colors ${
                      statusFilter === st ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
            {pocs.length === 0 ? (
              <div className="text-center py-16 font-mono text-sm text-slate-500">
                No POCs matching status filter. <br className="mb-2"/> 
                <Button variant="secondary" size="sm" className="mt-4" onClick={() => setActiveTab('wizard')}>Create New POC</Button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pocs.map((poc) => {
                  const isDeleted = poc.status === 'DELETED';
                  return (
                    <div key={poc.id} className={`py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 px-3 rounded transition-colors ${isDeleted ? 'bg-red-50 opacity-75' : 'hover:bg-slate-50'}`}>
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="font-headline font-bold text-base text-slate-900 flex items-center gap-2">
                            <span>{poc.title}</span>
                          </div>
                          <div className="flex items-center gap-3 font-mono text-[10px] text-slate-500 mt-1">
                            <span>Cat: {poc.category_name || poc.category_id}</span>
                            <span>•</span>
                            <span className="text-emerald-600"><Eye className="w-3 h-3 inline mr-1" />{poc.views || 0}</span>
                            <span>•</span>
                            <span className="text-primary-600">{poc.demo_requests || 0} Req</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <TechBadge label={poc.status} variant={isDeleted ? 'accent' : 'default'} />
                        <Button size="sm" variant="secondary" onClick={() => handleEditPoc(poc)}>Edit</Button>
                        {isDeleted ? (
                          <button onClick={() => handleRestorePoc(poc.id)} className="px-3 py-1.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-mono flex items-center gap-1 hover:bg-emerald-100" title="Restore POC">
                            <RotateCcw className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Restore</span>
                          </button>
                        ) : (
                          <button onClick={() => handleDeletePoc(poc.id)} className="p-2 rounded bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition-colors" title="Soft Delete POC">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'manage_trainings' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <TrainingExplorer isAdmin={true} />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
             <WebsiteSettingsEditor />
          </div>
        )}
      </div>
    </div>
  );
};
