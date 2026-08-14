import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser, UserButton } from '@clerk/clerk-react';
import { 
  Home, 
  LayoutGrid, 
  HelpCircle, 
  Info,
  Shield,
  BookOpen,
  Download,
  Users
} from 'lucide-react';

export const Sidebar = () => {
  const location = useLocation();
  const { isSignedIn } = useUser();

  const isActive = (path) => location.pathname === path;
  const isAdminPage = location.pathname.startsWith('/admin');
  const isEmployeePage = location.pathname.startsWith('/training');

  const NavItem = ({ to, icon: Icon, label, active }) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg mx-3 transition-colors ${
        active 
          ? 'bg-primary-50 text-primary-600 font-bold' 
          : 'text-slate-500 hover:text-primary-600 hover:bg-primary-50/50'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-sans text-sm">{label}</span>
    </Link>
  );

  return (
    <aside className="w-64 bg-white text-slate-600 h-screen flex flex-col border-r border-slate-200 shrink-0">
      {/* Logo Area */}
      <div className="h-20 flex items-center px-6 border-b border-slate-200 shrink-0">
        <Link to="/" className="flex items-center gap-3 group">
          <img src="/logo.png" alt="Vibodh AI Logo" className="h-8 w-auto object-contain transition-transform group-hover:scale-105" />
          <div>
            <span className="font-sans font-bold text-base tracking-tight text-slate-900 group-hover:text-primary-600 transition-colors">
              VIBODH AI
            </span>
            <span className="block font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              PLATFORM
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 space-y-1">
        {isAdminPage ? (
          <>
            <div className="px-6 mb-2">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Admin</span>
            </div>
            <NavItem to="/admin" icon={Shield} label="Dashboard" active={true} />
            <NavItem to="/" icon={Home} label="View Website" active={false} />
          </>
        ) : isEmployeePage && isSignedIn ? (
          <>
            <div className="px-6 mb-2">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Employee</span>
            </div>
            <NavItem to="/training" icon={BookOpen} label="Training" active={isActive('/training')} />
            <NavItem to="/training/downloads" icon={Download} label="Downloads" active={isActive('/training/downloads')} />
            <NavItem to="/" icon={Home} label="View Website" active={false} />
          </>
        ) : isEmployeePage && !isSignedIn ? (
          <>
            <div className="px-6 mb-2">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Employee</span>
            </div>
            <NavItem to="/" icon={Home} label="View Website" active={false} />
          </>
        ) : (
          <>
            <NavItem to="/" icon={Home} label="Overview" active={isActive('/')} />
            <NavItem to="/solutions" icon={LayoutGrid} label="POC Library" active={isActive('/solutions')} />
            <NavItem to="/why-us" icon={HelpCircle} label="Why Us" active={isActive('/why-us')} />
            <NavItem to="/about" icon={Info} label="About" active={isActive('/about')} />
          </>
        )}
      </div>

      {/* User Section (Bottom) */}
      {(isSignedIn || isAdminPage || isEmployeePage) && (
        <div className="p-4 border-t border-slate-200 shrink-0">
          <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-slate-50 border border-slate-200">
            <UserButton afterSignOutUrl="/" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-900">{isSignedIn ? "User Account" : "Guest"}</span>
              <span className="text-xs text-slate-400">{isSignedIn ? "Manage settings" : "Sign in to access"}</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
