import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './index.css';

const ADMIN_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY_ADMIN;
const TRAINING_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY_TRAINING;

const isAdminRoute = window.location.pathname.startsWith('/admin');
const PUBLISHABLE_KEY = isAdminRoute ? ADMIN_PUBLISHABLE_KEY : TRAINING_PUBLISHABLE_KEY;

// Check if a real Clerk publishable key is configured
const isValidClerkKey = PUBLISHABLE_KEY &&
  (PUBLISHABLE_KEY.startsWith('pk_test_') || PUBLISHABLE_KEY.startsWith('pk_live_')) &&
  !PUBLISHABLE_KEY.includes('placeholder');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isValidClerkKey ? (
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY}
        signInFallbackRedirectUrl={isAdminRoute ? "/admin" : "/training"}
        signUpFallbackRedirectUrl={isAdminRoute ? "/admin" : "/training"}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ClerkProvider>
    ) : (
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )}
  </React.StrictMode>
);
