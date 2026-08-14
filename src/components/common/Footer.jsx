import React from 'react';
import { Phone, Mail, MapPin, Linkedin, ArrowUpRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Footer = () => {
  const location = useLocation();

  // Hide public audience footer on internal pages (/admin, /training)
  if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/training')) {
    return null;
  }

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-500 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-6 space-y-4">
            <Link to="/" className="flex items-center gap-3.5 group">
              <div className="w-10 h-10 rounded-lg bg-[#0B0F19] border border-slate-200 flex items-center justify-center p-1.5 shadow-sm transition-all group-hover:scale-105 group-hover:border-primary-200">
                <img
                  src="/logo.png"
                  alt="Vibodh AI Logo"
                  className="w-full h-full object-contain mix-blend-screen"
                />
              </div>
              <div>
                <span className="font-headline font-bold text-xl tracking-tight text-slate-900 group-hover:text-primary-600 transition-colors">
                  Vibodh <span className="text-primary-600">AI</span>
                </span>
                <span className="block font-mono text-[9px] font-bold text-slate-500 uppercase tracking-widest -mt-0.5">
                  THINK AI BUILD BEYOND
                </span>
              </div>
            </Link>
            
            <p className="font-sans text-sm text-slate-500 max-w-md leading-relaxed">
              AI Delivery Solutions and Architectural Consulting for forward-thinking enterprises. Engineered for production scale.
            </p>

            {/* Social & Direct Contact Badges */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://www.linkedin.com/company/vibodh-ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:text-primary-600 hover:border-primary-600/50 transition-all"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              <a
                href="tel:+919886019992"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:text-primary-600 hover:border-primary-600/50 transition-all"
                title="Call Us"
              >
                <Phone className="w-4 h-4" />
              </a>

              <a
                href="mailto:reachus@vibodhailabs.com"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:text-primary-600 hover:border-primary-600/50 transition-all"
                title="Email Us"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation Col */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-mono text-xs text-slate-900 uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-2 font-sans text-sm">
              <li><Link to="/about" className="hover:text-primary-600 transition-colors">About Us</Link></li>
              <li><Link to="/why-us" className="hover:text-primary-600 transition-colors">Why Us</Link></li>
              <li><Link to="/solutions" className="hover:text-primary-600 transition-colors">POC Library</Link></li>
            </ul>
          </div>

          {/* Contact Details Col */}
          <div className="lg:col-span-3 space-y-3 font-mono text-xs">
            <h4 className="text-slate-900 uppercase tracking-widest">Contact Information</h4>
            
            <div className="space-y-3 pt-1 text-slate-700">
              <a href="tel:+919886019992" className="flex items-center gap-2 hover:text-primary-600 transition-colors">
                <Phone className="w-3.5 h-3.5 text-primary-600" />
                <span>+91 9886019992</span>
              </a>

              <a href="mailto:reachus@vibodhailabs.com" className="flex items-center gap-2 hover:text-primary-600 transition-colors">
                <Mail className="w-3.5 h-3.5 text-primary-600" />
                <span>reachus@vibodhailabs.com</span>
              </a>

              <div className="flex items-center gap-2 text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-primary-600" />
                <span>Bengaluru, Karnataka, India</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Vibodh AI. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="https://www.linkedin.com/company/vibodh-ai/" target="_blank" rel="noreferrer" className="hover:text-primary-600 transition-colors flex items-center gap-1">
              LinkedIn <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
