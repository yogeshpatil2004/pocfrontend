import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';

export const TrainingGrid = ({ trainings, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse opacity-50">
        {[1,2,3].map(i => (
          <div key={i} className="h-64 rounded-xl bg-slate-50 border border-slate-200"></div>
        ))}
      </div>
    );
  }

  if (trainings.length === 0) {
    return (
      <GlassCard hoverEffect={false} className="text-center py-16 max-w-xl mx-auto border-slate-200">
        <div className="w-12 h-12 rounded-full bg-primary-600/20 text-primary-600 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 font-headline mb-2">No Training Materials Found</h3>
        <p className="font-sans text-sm text-slate-500">
          Try clearing your search query.
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {trainings.map((training) => (
        <GlassCard key={training.id} className="flex flex-col justify-between h-full group p-6">
          <div className="space-y-4">
            
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded bg-primary-600/10 text-primary-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="px-2 py-1 rounded bg-white/90 border border-slate-200 text-[10px] font-mono text-primary-500 uppercase">
                {training.status}
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 font-headline group-hover:text-primary-600 transition-colors">
              {training.title}
            </h3>

            <p className="text-sm text-slate-500 font-sans leading-relaxed line-clamp-3">
              {training.short_description}
            </p>

            {training.resources && training.resources.length > 0 && (
              <div className="font-mono text-xs text-slate-400 pt-2">
                {training.resources.length} Resource{training.resources.length !== 1 ? 's' : ''} Attached
              </div>
            )}
          </div>

          <div className="pt-6 mt-6 border-t border-slate-200 flex items-center justify-end">
            <Link to={`/training/${training.slug || training.id}`}>
              <Button variant="secondary" size="sm" icon={ArrowRight}>
                View Materials
              </Button>
            </Link>
          </div>
        </GlassCard>
      ))}
    </div>
  );
};
