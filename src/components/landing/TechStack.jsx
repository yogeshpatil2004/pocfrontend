import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Bot, Database, Cpu, ShieldCheck, Layers, Zap } from 'lucide-react';

export const TechStack = () => {
  const capabilities = [
    { 
      title: "Agentic AI Orchestration", 
      category: "Autonomous Systems", 
      desc: "Multi-agent task execution and intelligent workflow automation.",
      icon: Bot 
    },
    { 
      title: "Text-to-SQL Engines", 
      category: "NL Data Intelligence", 
      desc: "Translate natural language directly into secure, complex SQL queries.",
      icon: Database 
    },
    { 
      title: "Enterprise RAG Pipelines", 
      category: "Context Retrieval", 
      desc: "High-precision knowledge search across millions of unstructured documents.",
      icon: Cpu 
    },
    { 
      title: "AI Security & Governance", 
      category: "Compliance & Safety", 
      desc: "Role-based access control, privacy barriers, and complete audit logging.",
      icon: ShieldCheck 
    },
    { 
      title: "AI-Native SaaS Architecture", 
      category: "Scalable Infrastructure", 
      desc: "Resilient cloud blueprints built to scale smoothly to millions of active users.",
      icon: Layers 
    },
    { 
      title: "High Velocity Accelerators", 
      category: "Rapid Deployment", 
      desc: "Pre-engineered modules shrinking deployment timelines from months to weeks.",
      icon: Zap 
    }
  ];

  return (
    <section id="techstack" className="py-20 bg-white/60 border-t border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-14 space-y-3">
          <span className="font-mono text-xs text-primary-600 uppercase tracking-widest font-bold">Enterprise Capabilities</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-headline">Engineering Beyond Prototypes</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base font-sans">
            We deliver production-ready AI solutions engineered for high performance, enterprise security, and long-term elasticity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <GlassCard key={idx} hoverEffect={true} className="p-6 space-y-4 border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-primary-600 uppercase tracking-wider bg-primary-50 px-2.5 py-1 rounded-full border border-primary-100">
                    {item.category}
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-headline font-bold text-lg text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 font-sans leading-relaxed">{item.desc}</p>
                </div>
              </GlassCard>
            );
          })}
        </div>

      </div>
    </section>
  );
};
