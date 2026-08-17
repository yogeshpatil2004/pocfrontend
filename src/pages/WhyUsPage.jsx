import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';

export const WhyUsPage = () => {
  const pillars = [
    {
      num: '01',
      title: 'Comprehensive AI Delivery',
      description: 'Your one-stop solution for AI Delivery Solutions, Business, Data, Applications, and Technology. Backed by a team with over 50 years of combined experience in Architectural Consulting and Business.'
    },
    {
      num: '02',
      title: 'AI-Native Architecture',
      description: 'You are as strong as your foundation. Build your business with us. We excel in creating AI-native product architectures, such as SaaS with AI, that scale seamlessly to millions of users.'
    },
    {
      num: '03',
      title: 'Rapid Pilot Integration',
      description: 'We move fast without breaking things. Our rapid pilot programs deliver tangible, high-impact AI capabilities that are seamlessly integrated directly into your existing product.'
    },
    {
      num: '04',
      title: 'AI Feature Velocity',
      description: 'Speed to market matters. With our intense focus on AI feature velocity, we facilitate vastly faster feature development for products that leverage our scalable architecture and AI integrations.'
    }
  ];

  const comparisonRows = [
    'Over 50 years of combined architectural experience',
    'AI-native SaaS architectures built for millions of users',
    'Rapid pilot programs with seamless product integration',
    'High-speed AI feature velocity and deployment',
    'Hardened blueprints from 10+ successful launches',
    'Transparent, fixed-scope pricing with no surprises'
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* Back Button */}
      <div>
        <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-slate-500 hover:text-primary-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Overview
        </Link>
      </div>

      {/* Hero Header */}
      <div className="text-center max-w-4xl mx-auto space-y-6">
        <span className="font-mono text-xs text-primary-600 uppercase tracking-widest">Why Vibodh AI Labs</span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 font-headline leading-tight">
          Beyond Prototypes, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-800 via-indigo-600 to-primary-400">
            Proven in Production.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-700 font-sans max-w-2xl mx-auto leading-relaxed">
          Hardened by 10+ Successful Launches. Build Your Vision with Our Blueprint.
        </p>
      </div>

      {/* 4 Pillars Section */}
      <div className="space-y-10">
        <div className="border-b border-slate-200 pb-6">
          <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">Our Foundation</span>
          <h2 className="text-3xl font-bold text-slate-900 font-headline mt-1">Four Pillars That Accelerate Your AI Vision</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((pillar, idx) => (
            <GlassCard key={idx} className="space-y-4 relative overflow-hidden group">
              <div className="font-mono text-xs text-primary-600 font-bold">STEP {pillar.num}</div>
              <h3 className="text-xl font-bold text-slate-900 font-headline group-hover:text-primary-600 transition-colors">
                {pillar.title}
              </h3>
              <p className="text-sm text-slate-700 font-sans leading-relaxed">
                {pillar.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Comparison Matrix: Vibodh AI Labs vs Typical Consulting */}
      <GlassCard hoverEffect={false} className="space-y-8 border-primary-200">
        <div className="text-center max-w-2xl mx-auto space-y-2 border-b border-slate-200 pb-6">
          <span className="font-mono text-xs text-primary-600 uppercase tracking-widest">The Difference</span>
          <h2 className="text-2xl md:text-4xl font-bold text-slate-900 font-headline">Vibodh AI Labs vs. Typical Consulting</h2>
        </div>

        <div className="divide-y divide-white/10">
          <div className="grid grid-cols-12 py-3 px-4 font-mono text-xs text-slate-500 uppercase tracking-wider">
            <div className="col-span-6">Capability</div>
            <div className="col-span-3 text-center text-primary-600 font-bold">Vibodh AI Labs</div>
            <div className="col-span-3 text-center text-slate-400">Typical Consulting</div>
          </div>

          {comparisonRows.map((row, idx) => (
            <div key={idx} className="grid grid-cols-12 py-4 px-4 items-center text-sm font-sans hover:bg-slate-50 transition-colors">
              <div className="col-span-6 text-slate-800 font-medium">{row}</div>
              <div className="col-span-3 flex justify-center">
                <div className="w-7 h-7 rounded-full bg-primary-600/20 border border-primary-600 flex items-center justify-center text-primary-600">
                  <Check className="w-4 h-4" />
                </div>
              </div>
              <div className="col-span-3 flex justify-center">
                <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-300">
                  ✕
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Call to Action CTA */}
      <GlassCard hoverEffect={false} className="text-center py-12 border-primary-200 space-y-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 font-headline">Ready to build your foundation?</h2>
        <p className="text-slate-700 font-sans text-sm max-w-xl mx-auto">
          Leverage our blueprint and launch your enterprise AI capabilities with speed and precision.
        </p>
        <div className="flex justify-center pt-2">
          <Link to="/solutions">
            <Button variant="brick" size="lg" icon={ArrowRight}>
              Explore Solutions POCs
            </Button>
          </Link>
        </div>
      </GlassCard>

    </div>
  );
};
