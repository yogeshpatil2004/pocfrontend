import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';
import { UserButton, useUser } from '@clerk/clerk-react';

export const Header = () => {
  const location = useLocation();
  const { user, isSignedIn } = useUser();

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
    <header className="sticky top-4 z-50 flex justify-center w-full px-4 mb-6">
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

        {/* Center Nav Links */}
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

        {/* Right Actions */}
        <div className="flex items-center gap-4 shrink-0">
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
        </div>

      </div>
    </header>
  );
};