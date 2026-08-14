import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, FileText, Video, Github, FileArchive, Image, Download, Eye, Link as LinkIcon } from 'lucide-react';
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
        <div className="w-48 h-4 bg-slate-100 rounded"></div>
      </div>
    );
  }

  if (!training) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-bold text-slate-900 font-headline mb-2">Training Material Not Found</h2>
        <p className="text-slate-500 font-sans text-sm mb-6">No material found matching URL slug "<code className="text-primary-600">{identifier}</code>".</p>
        <Link to="/training">
          <Button>Back to Training Gallery</Button>
        </Link>
      </div>
    );
  }

  const getResourceIcon = (type) => {
    switch(type) {
      case 'PDF':
      case 'DOC/DOCX':
      case 'PPT': return <FileText className="w-4 h-4" />;
      case 'Video':
      case 'YouTube Link': return <Video className="w-4 h-4" />;
      case 'GitHub Repository Link': return <Github className="w-4 h-4" />;
      case 'External Documentation Link': return <ExternalLink className="w-4 h-4" />;
      case 'ZIP File': return <FileArchive className="w-4 h-4" />;
      case 'Image': return <Image className="w-4 h-4" />;
      default: return <LinkIcon className="w-4 h-4" />;
    }
  };

  const getDownloadUrl = (url) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('supabase.co')) {
        urlObj.searchParams.set('download', '');
        return urlObj.toString();
      }
      if (urlObj.hostname.includes('cloudinary.com')) {
        if (urlObj.pathname.includes('/upload/') && !urlObj.pathname.includes('/fl_attachment')) {
          urlObj.pathname = urlObj.pathname.replace('/upload/', '/upload/fl_attachment/');
          return urlObj.toString();
        }
      }
    } catch (e) {}
    return url;
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Back Link */}
      <Link to="/training" className="inline-flex items-center gap-2 font-mono text-xs text-slate-500 hover:text-primary-600 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Training Materials
      </Link>

      {/* Hero Banner Header */}
      <div className="space-y-6 border-b border-slate-200 pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <StatusIndicator status={training.status || "PUBLISHED"} />
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 font-headline">
          {training.title}
        </h1>

        <p className="text-slate-700 font-sans text-lg max-w-3xl leading-relaxed whitespace-pre-line">
          {training.short_description}
        </p>
      </div>

      {/* Resources */}
      {training.resources && training.resources.length > 0 && (
        <GlassCard hoverEffect={false} className="space-y-6 bg-black/40">
          <div className="flex items-center gap-2 text-slate-900 font-headline font-bold text-xl border-b border-slate-200 pb-3">
            <Download className="w-5 h-5 text-blue-400" />
            <span>Training Resources & Links</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {training.resources.map((res, idx) => {
              const isDownloadable = ['PDF', 'PPT', 'DOC/DOCX', 'Image', 'ZIP File', 'Other', 'Video'].includes(res.resource_type);
              
              return (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-3 rounded bg-slate-50 border border-slate-200 group hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded bg-black flex items-center justify-center text-slate-500">
                      {getResourceIcon(res.resource_type)}
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="font-headline font-bold text-sm text-slate-900 truncate">{res.resource_name}</span>
                      <span className="font-mono text-[10px] text-slate-400">{res.resource_type}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 ml-2">
                    {isDownloadable ? (
                      <>
                        <a 
                          href={res.resource_url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="p-2 hover:bg-blue-500/10 rounded-full transition-colors text-slate-500 hover:text-blue-400" 
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
                          className="p-2 hover:bg-primary-600/10 rounded-full transition-colors text-slate-500 hover:text-primary-600" 
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
                        className="p-2 hover:bg-blue-500/10 rounded-full transition-colors text-slate-500 hover:text-blue-400" 
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
      )}

    </div>
  );
};
