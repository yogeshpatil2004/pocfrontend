import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Clock, CheckCircle2, Github, ExternalLink, Youtube, FileText, Layers } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { TechBadge } from '../components/ui/TechBadge';
import { StatusIndicator } from '../components/ui/StatusIndicator';
import { getPocBySlugOrId, trackView } from '../api/pocsApi';

export const PocDetailPage = () => {
  const { slug, id } = useParams();
  const identifier = slug || id || 'text-to-sql-agent';

  const [poc, setPoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPocBySlugOrId(identifier).then(data => {
      setPoc(data);
      setLoading(false);
      if (data) {
        trackView(identifier);
      }
    });
  }, [identifier]);

  if (loading) {
    return <div className="text-center py-24 font-mono text-sm text-slate-400">Querying Supabase PostgreSQL telemetry...</div>;
  }

  if (!poc) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-bold text-slate-900 font-headline mb-2">POC Not Found</h2>
        <p className="text-slate-500 font-sans text-sm mb-6">No solution found matching URL slug "<code className="text-primary-600">{identifier}</code>".</p>
        <Link to="/solutions">
          <Button>Back to POC Gallery</Button>
        </Link>
      </div>
    );
  }

  const hasMetrics = poc.accuracy || poc.latency;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Back Link */}
      <Link to="/solutions" className="inline-flex items-center gap-2 font-mono text-xs text-slate-500 hover:text-primary-600 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to POC Showcase Gallery
      </Link>

      {/* Hero Banner Header */}
      <div className="space-y-6 border-b border-slate-200 pb-8">

        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 font-headline">
          {poc.title}
        </h1>

        <p className="text-slate-700 font-sans text-lg max-w-3xl leading-relaxed">
          {poc.short_description}
        </p>

        {/* External Action Links */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          {poc.github_url && (
            <a href={poc.github_url} target="_blank" rel="noreferrer">
              <Button variant="secondary" size="sm" icon={Github}>GitHub Repo</Button>
            </a>
          )}
          {poc.live_demo_url && (
            <a href={poc.live_demo_url} target="_blank" rel="noreferrer">
              <Button size="sm" icon={ExternalLink}>Live Demo</Button>
            </a>
          )}
        </div>
      </div>

      {/* Image Cover Banner */}
      {poc.cover_image && (
        <div className="relative w-full max-h-[450px] aspect-[16/9] rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
          <img src={poc.cover_image} alt={poc.title} className="w-full h-full object-cover object-center" />
        </div>
      )}

      {/* Detailed Overview */}
      {poc.full_description && (
        <GlassCard hoverEffect={false} className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 font-headline border-b border-slate-200 pb-3">Technical Overview & Architecture</h2>
          <div className="font-sans text-slate-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
            {poc.full_description}
          </div>
        </GlassCard>
      )}

      {/* Dynamic Features List */}
      {poc.features && poc.features.length > 0 && poc.features.some(f => f.feature_name) && (
        <GlassCard hoverEffect={false} className="space-y-6">
          <div className="flex items-center gap-2 text-slate-900 font-headline font-bold text-xl border-b border-slate-200 pb-3">
            <Sparkles className="w-5 h-5 text-primary-600" />
            <span>Key Architectural Features</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {poc.features.filter(f => f.feature_name).map((feat, idx) => (
              <div key={idx} className="p-4 rounded bg-white border border-slate-200 space-y-2">
                <div className="font-headline font-bold text-base text-slate-900">{feat.feature_name}</div>
                <div className="font-sans text-xs text-slate-500">{feat.description}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Dynamic Workflow Steps */}
      {poc.workflow_steps && poc.workflow_steps.length > 0 && poc.workflow_steps.some(w => w.title) && (
        <GlassCard hoverEffect={false} className="space-y-6">
          <div className="flex items-center gap-2 text-slate-900 font-headline font-bold text-xl border-b border-slate-200 pb-3">
            <Layers className="w-5 h-5 text-primary-600" />
            <span>Step-by-Step Execution Workflow</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {poc.workflow_steps.filter(w => w.title).map((step, idx) => (
              <div key={idx} className="p-4 rounded bg-white border border-slate-200 space-y-2">
                <div className="font-mono text-xs text-primary-600 font-bold">Step {idx + 1}: {step.title}</div>
                <div className="font-sans text-xs text-slate-500">{step.description}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

    </div>
  );
};
