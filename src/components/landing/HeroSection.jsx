import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export const HeroSection = () => {
  return (
    <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden orange-glow-bg border-b border-slate-100">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-8">

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 font-headline leading-[1.1]">
            Think AI. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-800 via-indigo-600 to-primary-400">
              Build Beyond Limits.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-700 font-sans max-w-2xl mx-auto leading-relaxed">
            Enterprise-grade autonomous AI solutions, natural language query engines, and high-performance multimodal research. Built for scale, security, and developer speed.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link to="/solutions">
              <Button size="lg" icon={ArrowRight}>
                Explore Solutions POCs
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};
