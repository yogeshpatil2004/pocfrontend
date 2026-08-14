import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Target, Users, Briefcase, Heart, Award, MapPin, Linkedin } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';

export const AboutPage = () => {
  const values = [
    {
      num: '01',
      title: 'Intellectual Honesty',
      description: "We say what we believe - even when it's not what a client wants to hear. Long-term trust matters more than short-term approval."
    },
    {
      num: '02',
      title: 'Excellence Without Ego',
      description: "We hold our work to an extremely high standard, but stay humble about what we don't know. The best ideas come from everywhere."
    },
    {
      num: '03',
      title: 'Outcomes Over Outputs',
      description: 'We measure success by business results, not deliverable counts. A working system beats an elegant architecture document every time.'
    },
    {
      num: '04',
      title: 'Continuous Learning',
      description: "AI is evolving faster than any other field in history. We invest heavily in staying at the frontier - so our clients don't have to."
    }
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      
      {/* Back Button */}
      <div>
        <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-slate-500 hover:text-primary-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Overview
        </Link>
      </div>

      {/* Hero Header */}
      <div className="text-center max-w-4xl mx-auto space-y-6">
        <span className="font-mono text-xs text-primary-600 uppercase tracking-widest">About Vibodh AI Labs</span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 font-headline leading-tight">
          Empowering Businesses Through <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-800 via-indigo-600 to-primary-400">
            Innovative Technology.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-700 font-sans max-w-3xl mx-auto leading-relaxed">
          At VIBODH AI, we specialize in delivering scalable AI Delivery Solutions and elite Architectural Consulting tailored to your vision.
        </p>
      </div>

      {/* Mission, Team, Services */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="space-y-4">
          <div className="w-10 h-10 rounded bg-primary-600/20 border border-primary-600 flex items-center justify-center text-primary-600">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-headline">Our Mission</h3>
          <p className="text-sm text-slate-700 font-sans leading-relaxed">
            At VIBODH AI (registered as Vibodh AI Labs LLP), we specialize in delivering AI Delivery Solutions along with Architectural Consulting services tailored for our clients. Our mission is to empower businesses of all sizes to achieve their full potential through innovative technology, including scalable architecture and SAAS with AI.
          </p>
        </GlassCard>

        <GlassCard className="space-y-4">
          <div className="w-10 h-10 rounded bg-blue-500/20 border border-blue-500 flex items-center justify-center text-blue-400">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-headline">Our Team</h3>
          <p className="text-sm text-slate-700 font-sans leading-relaxed">
            At VIBODH AI, our team of experts brings over 50 years of combined experience in the IT industry, specializing in Architectural Consulting and AI Delivery Solutions. We are passionate about helping businesses succeed by leveraging scalable architecture and innovative SAAS with AI solutions, and we take pride in our expertise across Business, Architecture, and AI.
          </p>
        </GlassCard>

        <GlassCard className="space-y-4">
          <div className="w-10 h-10 rounded bg-purple-500/20 border border-purple-500 flex items-center justify-center text-purple-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-headline">Our Services</h3>
          <p className="text-sm text-slate-700 font-sans leading-relaxed">
            We provide a comprehensive suite of IT consulting services, including AI Delivery Solutions, Architectural Consulting, customer segmentation, product expansion, and more. Our aim is to assist businesses in optimizing their IT infrastructure and enhancing their operations with scalable architecture and SAAS with AI, particularly through our VIBODH AI initiatives.
          </p>
        </GlassCard>
      </div>

      {/* Leadership Section */}
      <div className="space-y-8">
        <div className="border-b border-slate-200 pb-6">
          <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">Leadership & Engineering</span>
          <h2 className="text-3xl font-bold text-slate-900 font-headline mt-1">The People Behind the Engineering</h2>
        </div>

        <div className="max-w-2xl">
          <GlassCard hoverEffect={false} className="flex flex-col sm:flex-row items-start gap-6 border-primary-200">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#ff6a21] to-purple-600 flex items-center justify-center font-bold text-2xl text-slate-900 font-mono flex-shrink-0">
              AM
            </div>

            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-headline">Anupama M Menasinakai</h3>
                  <div className="font-mono text-xs text-primary-600">Founder & Gen-AI Architect</div>
                </div>
                <a
                  href="https://linkedin.com/in/anupamamm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded bg-slate-50 hover:bg-primary-600/20 text-slate-700 hover:text-primary-600 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed">
                Anupama helps businesses build customized, scalable AI solutions — from Agentic AI systems and RAG pipelines to platform modernization and AI governance. A technology leader with 16+ years across SaaS product development, enterprise architecture, and Generative AI, she previously led a microservices-based GenAI Knowledge Management platform at ITC Infotech and spent a decade building products at Harman / Symphony Services. She holds an Advanced Certification in Data Science & AI from IIT Madras.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Values Section */}
      <div className="space-y-10">
        <div className="border-b border-slate-200 pb-6">
          <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">Core Principles</span>
          <h2 className="text-3xl font-bold text-slate-900 font-headline mt-1">What We Believe In</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((val, idx) => (
            <GlassCard key={idx} className="space-y-3">
              <div className="font-mono text-xs text-primary-600 font-bold">0{idx + 1}</div>
              <h3 className="text-lg font-bold text-slate-900 font-headline">{val.title}</h3>
              <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed">
                {val.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>

    </div>
  );
};
