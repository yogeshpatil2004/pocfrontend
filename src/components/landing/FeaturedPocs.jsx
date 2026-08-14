import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { TechBadge } from '../ui/TechBadge';
import { getPocs } from '../../api/pocsApi';

export const FeaturedPocs = () => {
  const [pocs, setPocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPocs({ status: 'PUBLISHED' }).then(data => {
      setPocs(data);
      setLoading(false);
    });
  }, []);

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="font-mono text-xs text-primary-600 uppercase tracking-widest">Featured Demos</span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 font-headline mt-2">
              Proof of Concept Gallery
            </h2>
          </div>
          {pocs.length > 0 && (
            <Link to="/solutions">
              <Button variant="ghost" size="sm" icon={ArrowRight}>
                View All Solutions
              </Button>
            </Link>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12 font-mono text-sm text-slate-400">Querying Supabase PostgreSQL POCs...</div>
        ) : pocs.length === 0 ? (
          <GlassCard hoverEffect={false} className="text-center py-16 max-w-xl mx-auto border-slate-200">
            <div className="w-12 h-12 rounded-full bg-primary-600/20 text-primary-600 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-headline mb-2">No AI Solutions Published Yet</h3>
            <p className="text-slate-500 font-sans text-sm">
              Our engineering team is deploying cutting-edge multimodal AI research and text-to-SQL agents. Check back soon!
            </p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
        )}

      </div>
    </section>
  );
};
