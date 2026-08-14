import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { UserButton, useUser } from '@clerk/clerk-react';

export const Header = () => {
  const location = useLocation();
  const { user, isSignedIn } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const isAdminPage = location.pathname.startsWith('/admin');
  const isEmployeePage = location.pathname.startsWith('/training');

  const navLinks = isAdminPage ? [
    { to: '/admin', label: 'Dashboard', active: true },
    { to: '/', label: 'View Website', active: false },
  ] : isEmployeePage && isSignedIn ? [
    { to: '/training', label: 'Training', active: isActive('/training') },
    { to: '/training/downloads', label: 'Downloads', active: isActive('/training/downloads') },
    { to: '/', label: 'View Website', active: false },
  ] : [
    { to: '/', label: 'Overview', active: isActive('/') },
    { to: '/solutions', label: 'POC Library', active: isActive('/solutions') },
    { to: '/why-us', label: 'Why Us', active: isActive('/why-us') },
    { to: '/about', label: 'About', active: isActive('/about') },
  ];

  return (
    <header className="sticky top-4 z-50 flex flex-col items-center w-full px-4 mb-6">
      <div className="flex items-center justify-between w-full max-w-7xl h-16 bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-md shadow-slate-200/50 rounded-full px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <img src="/logo.png" alt="Vibodh AI Logo" className="h-8 w-auto object-contain transition-transform group-hover:scale-105" />
          <div className="flex flex-col leading-none">
            <span className="font-sans font-bold text-lg tracking-tight text-slate-900 group-hover:text-primary-600 transition-colors">
              VIBODH AI
            </span>
            <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              PLATFORM
            </span>
          </div>
        </Link>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/60">
          {navLinks.map((link) => (
            <Link
              key={link.to + link.label}
              to={link.to}
              className={`px-5 py-1.5 rounded-full text-sm transition-all duration-200 ${
                link.active
                  ? 'bg-white text-primary-600 shadow-sm font-bold'
                  : 'text-slate-600 font-semibold hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions & Mobile Hamburger Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          {/* User Profile / Button */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="text-right hidden xl:block">
                <div className="text-xs font-semibold text-slate-900">{user.fullName}</div>
                <div className="text-[10px] text-slate-500">{user.primaryEmailAddress?.emailAddress}</div>
              </div>
            )}
            <UserButton afterSignOutUrl="/" />
          </div>

          {/* Mobile Hamburger Button (3 horizontal lines) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="md:hidden w-10 h-10 rounded-full bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 flex items-center justify-center text-slate-800 transition-colors focus:outline-none"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 stroke-[2.5]" />
            ) : (
              <Menu className="w-5 h-5 stroke-[2.5]" />
            )}
          </button>
        </div>

      </div>

      {/* Floating Mobile Navigation Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 w-full max-w-7xl bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl rounded-3xl p-4 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.to + link.label}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-5 py-3 rounded-2xl text-sm font-semibold transition-all flex items-center justify-between ${
                link.active
                  ? 'bg-primary-600/10 text-primary-600 font-bold'
                  : 'text-slate-700 hover:bg-slate-100/80'
              }`}
            >
              <span>{link.label}</span>
              {link.active && <span className="w-2 h-2 rounded-full bg-primary-600" />}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};