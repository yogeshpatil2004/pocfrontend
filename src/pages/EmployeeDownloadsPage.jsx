import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Video, Github, ExternalLink, FileArchive, Image, Link as LinkIcon } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { getDownloadsHistory } from '../api/trainingApi';
import { useAuth } from '@clerk/clerk-react';

export const EmployeeDownloadsPage = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const token = await getToken();
        if (token) {
          const data = await getDownloadsHistory(token);
          setDownloads(data);
        }
      } catch (error) {
        console.error("Failed to load downloads", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDownloads();
  }, [getToken]);

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
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 min-h-[60vh]">
      <Link to="/training" className="inline-flex items-center gap-2 font-mono text-xs text-slate-500 hover:text-primary-600 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Training Dashboard
      </Link>
      
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 font-headline">My Downloads</h1>
        <p className="text-slate-500 font-sans">A history of files you've recently downloaded.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 animate-pulse opacity-50">
          <div className="w-12 h-12 rounded-full bg-slate-100 mb-4"></div>
          <div className="h-6 w-32 bg-slate-100 rounded mb-2"></div>
        </div>
      ) : downloads.length === 0 ? (
        <GlassCard className="text-center py-16">
          <Download className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">You haven't downloaded any training materials yet.</h3>
          <p className="text-slate-500 text-sm">When you download materials, they will appear here for easy access.</p>
        </GlassCard>
      ) : (
        <GlassCard className="p-0 overflow-hidden bg-black/40">
          <div className="divide-y divide-white/10">
            {downloads.map((item, idx) => (
              <div key={idx} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4 overflow-hidden w-full">
                  <div className="w-10 h-10 rounded bg-black flex-shrink-0 flex items-center justify-center text-slate-500">
                    {getResourceIcon(item.resource?.resource_type)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-headline font-bold text-base text-slate-900 truncate">{item.resource?.resource_name}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-xs text-primary-600 bg-primary-600/10 px-2 py-0.5 rounded-full">{item.resource?.resource_type}</span>
                      <span className="font-mono text-xs text-slate-400 hidden sm:inline-block">•</span>
                      <Link to={`/training/${item.training?.slug || item.training_id}`} className="font-mono text-xs text-slate-500 hover:text-blue-400 truncate">
                        From: {item.training?.title}
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end mt-4 sm:mt-0">
                  <span className="font-mono text-[10px] text-slate-400 mr-2 whitespace-nowrap hidden md:inline-block">
                    {new Date(item.downloaded_at).toLocaleDateString()}
                  </span>
                  <a 
                    href={getDownloadUrl(item.resource?.resource_url)} 
                    target="_blank" 
                    rel="noreferrer" 
                    download={item.resource?.resource_name}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-primary-600/10 text-slate-700 hover:text-primary-600 rounded font-mono text-xs transition-colors border border-slate-200 hover:border-primary-200"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Again
                  </a>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
};
