import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-8xl font-bold font-mono text-primary-600 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-slate-900 font-headline mb-2">Endpoint Not Found</h2>
      <p className="text-slate-500 font-sans text-sm mb-6 max-w-md">
        The requested resource or POC route does not exist in the Vibodh AI registry.
      </p>
      <Link to="/">
        <Button>Return to Home</Button>
      </Link>
    </div>
  );
};
