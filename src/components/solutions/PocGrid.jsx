import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { TechBadge } from '../ui/TechBadge';

export const PocGrid = ({ pocs, loading }) => {
  if (loading) {
    return <div className="text-center py-20 font-mono text-sm text-slate-400">Querying Supabase PostgreSQL...</div>;
  }

  if (pocs.length === 0) {
    return (
      <GlassCard hoverEffect={false} className="text-center py-16 max-w-xl mx-auto border-slate-200">
        <div className="w-12 h-12 rounded-full bg-primary-600/20 text-primary-600 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 font-headline mb-2">No Matching AI POCs Found</h3>
        <p className="font-sans text-sm text-slate-500">
          Try clearing your search query or selecting another category filter.
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {pocs.map((poc) => (
        <GlassCard key={poc.id} className="flex flex-col justify-between h-full group">
          <Link to={`/solutions/${poc.slug || poc.id}`} className="space-y-4 block cursor-pointer">
            <div className="relative h-48 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <img
                src={poc.cover_image || poc.thumbnail}
                alt={poc.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <h3 className="text-xl font-bold text-slate-900 font-headline group-hover:text-primary-600 transition-colors">
              {poc.title}
            </h3>

            <p className="text-sm text-slate-500 font-sans leading-relaxed">
              {poc.short_description || poc.description}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {poc.tags?.map((tag, i) => (
                <TechBadge key={i} label={tag} />
              ))}
            </div>
          </Link>

          <div className="pt-6 mt-6 border-t border-slate-200 flex items-center justify-between gap-3">
            <Link to={`/solutions/${poc.slug || poc.id}`} className="text-xs font-semibold text-slate-500 hover:text-primary-600 font-mono transition-colors">
              View Overview &rarr;
            </Link>

            {poc.live_demo_url ? (
              <a href={poc.live_demo_url} target="_blank" rel="noopener noreferrer">
                <Button size="sm" icon={ExternalLink}>
                  Launch Demo
                </Button>
              </a>
            ) : (
              <Link to={`/solutions/${poc.slug || poc.id}`}>
                <Button variant="secondary" size="sm" icon={ArrowRight}>
                  View Details
                </Button>
              </Link>
            )}
          </div>
        </GlassCard>
      ))}
    </div>
  );
};
