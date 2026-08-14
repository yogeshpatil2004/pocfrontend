import React from 'react';
import { useUser, SignInButton } from '@clerk/clerk-react';
import { Shield, Lock } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';

export const ProtectedAdminRoute = ({ children }) => {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <div className="text-center py-24 font-mono text-sm text-slate-400">Verifying Clerk administrator session...</div>;
  }

  // Render Admin Portal Login Card inside our website if signed out
  if (!isSignedIn) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 text-center py-16 max-w-xl mx-auto space-y-6">
        <GlassCard hoverEffect={false} className="w-full p-8 md:p-12 border-primary-200 space-y-6 text-center">
          
          <div className="w-16 h-16 rounded-full bg-primary-600/20 border border-primary-600/50 text-primary-600 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(255,106,33,0.3)]">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="font-mono text-xs text-primary-600 uppercase tracking-widest">Protected Management Hub</span>
            <h1 className="font-headline font-bold text-3xl text-slate-900">Vibodh AI Admin Portal</h1>
            <p className="font-sans text-sm text-slate-700 leading-relaxed max-w-md mx-auto">
              Sign in with your Clerk administrator account to access POC CRUD controls and database telemetry.
            </p>
          </div>

          <div className="pt-4 flex justify-center">
            <SignInButton mode="modal" forceRedirectUrl="/admin" fallbackRedirectUrl="/admin">
              <Button size="lg" icon={Shield}>
                Sign In to Admin Portal
              </Button>
            </SignInButton>
          </div>

        </GlassCard>
      </div>
    );
  }

  // Pure Clerk Authentication (Managed 100% via Clerk Dashboard)
  return children;
};
