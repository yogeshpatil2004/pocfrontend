import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, FileText, Video, Github, FileArchive, Image, Download, Eye, Link as LinkIcon, Folder } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { StatusIndicator } from '../components/ui/StatusIndicator';
import { getTrainingBySlugOrId, recordDownload } from '../api/trainingApi';
import { Button } from '../components/ui/Button';
import { useAuth } from '@clerk/clerk-react';

export const TrainingDetailPage = () => {
  const { slug, id } = useParams();
  const identifier = slug || id;

  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    setLoading(true);
    getTrainingBySlugOrId(identifier).then(data => {
      setTraining(data);
      setLoading(false);
    });
  }, [identifier]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center animate-pulse opacity-30 space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100"></div>
        <div className="w-64 h-8 bg-slate-100 rounded"></div>
      </div>
    );
  }

  if (!training) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center px-4">
        <h2 className="text-2xl font-bold text-slate-900 font-headline">Training Material Not Found</h2>
        <p className="text-slate-500 font-sans text-sm">The training item you are looking for does not exist or has been removed.</p>
        <Link to="/training">
          <Button variant="secondary" size="sm" icon={ArrowLeft}>
            Back to Training Portal
          </Button>
        </Link>
      </div>
    );
  }

  const getResourceIcon = (type) => {
    switch (type) {
      case 'PDF':
      case 'DOC/DOCX':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'Video':
      case 'YouTube Link':
        return <Video className="w-4 h-4 text-red-500" />;
      case 'GitHub Repository Link':
        return <Github className="w-4 h-4 text-slate-800" />;
      case 'ZIP File':
        return <FileArchive className="w-4 h-4 text-amber-500" />;
      case 'Image':
        return <Image className="w-4 h-4 text-emerald-500" />;
      default:
        return <LinkIcon className="w-4 h-4 text-primary-600" />;
    }
  };

  const getDownloadUrl = (url) => {
    if (!url) return '#';
    return url;
  };

  // Group resources by folder_name
  const groupedResources = training?.resources?.reduce((acc, res) => {
    const folder = res.folder_name?.trim() || 'General Resources';
    if (!acc[folder]) acc[folder] = [];
    acc[folder].push(res);
    return acc;
  }, {}) || {};

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Back Button */}
      <div>
        <Link to="/training" className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-slate-500 hover:text-primary-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Training Portal
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <StatusIndicator status={training.status || "PUBLISHED"} />
          <span className="font-mono text-xs text-primary-600 uppercase tracking-widest">Internal Training</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 font-headline">
          {training.title}
        </h1>
        <p className="text-slate-500 font-sans text-base max-w-3xl leading-relaxed">
          {training.short_description}
        </p>
      </div>

      {/* Folders & Resources */}
      {training.resources && training.resources.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center gap-2 font-headline font-bold text-xl text-slate-900 border-b border-slate-200 pb-3">
            <Folder className="w-6 h-6 text-primary-600" />
            <span>Training Modules & Folders</span>
          </div>

          {Object.entries(groupedResources).map(([folderName, items], fIdx) => (
            <GlassCard key={fIdx} hoverEffect={false} className="space-y-4 border-slate-200">
              <div className="flex items-center gap-3 font-headline font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
                <Folder className="w-5 h-5 text-amber-500 fill-amber-100" />
                <span>{folderName}</span>
                <span className="font-mono text-xs text-slate-400 font-normal">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((res, idx) => {
                  const isDownloadable = ['PDF', 'PPT', 'DOC/DOCX', 'Image', 'ZIP File', 'Other', 'Video'].includes(res.resource_type);
                  
                  return (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 group hover:border-primary-600/40 hover:bg-white transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                          {getResourceIcon(res.resource_type)}
                        </div>
                        <div className="flex flex-col truncate">
                          <span className="font-headline font-bold text-sm text-slate-900 truncate">{res.resource_name || 'Untitled Resource'}</span>
                          <span className="font-mono text-[10px] text-slate-400">{res.resource_type}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 ml-2 shrink-0">
                        {isDownloadable ? (
                          <>
                            <a 
                              href={res.resource_url} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="p-2 hover:bg-blue-50 rounded-full transition-colors text-slate-500 hover:text-blue-600" 
                              title="Preview in Browser"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                            <a 
                              href={getDownloadUrl(res.resource_url)} 
                              target="_blank" 
                              rel="noreferrer" 
                              download={res.resource_name}
                              onClick={async () => {
                                try {
                                  const token = await getToken();
                                  if (token) {
                                    await recordDownload(token, training.id, res.id || res.resource_name);
                                  }
                                } catch (e) {
                                  console.error("Failed to record download", e);
                                }
                              }}
                              className="p-2 hover:bg-primary-50 rounded-full transition-colors text-slate-500 hover:text-primary-600" 
                              title="Download File"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </>
                        ) : (
                          <a 
                            href={res.resource_url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="p-2 hover:bg-blue-50 rounded-full transition-colors text-slate-500 hover:text-blue-600" 
                            title="Open Link"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          ))}
        </div>
      )}

    </div>
  );
};
