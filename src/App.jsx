import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { SolutionsPage } from './pages/SolutionsPage';
import { PocDetailPage } from './pages/PocDetailPage';
import { WhyUsPage } from './pages/WhyUsPage';
import { AboutPage } from './pages/AboutPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ProtectedAdminRoute } from './components/common/ProtectedAdminRoute';
import { ProtectedEmployeeRoute } from './components/common/ProtectedEmployeeRoute';
import { NotFoundPage } from './pages/NotFoundPage';
import { TrainingMaterialsPage } from './pages/TrainingMaterialsPage';
import { EmployeeDownloadsPage } from './pages/EmployeeDownloadsPage';
import { TrainingDetailPage } from './pages/TrainingDetailPage';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F6F2F1] text-slate-900">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/why-us" element={<WhyUsPage />} />
          <Route path="/about" element={<AboutPage />} />
          
          {/* Readable Slug-based URL Routes */}
          <Route path="/solutions/:slug" element={<PocDetailPage />} />
          <Route path="/poc/:id" element={<PocDetailPage />} />
          
          <Route 
            path="/training" 
            element={
              <ProtectedEmployeeRoute>
                <TrainingMaterialsPage />
              </ProtectedEmployeeRoute>
            } 
          />
          <Route 
            path="/training/downloads" 
            element={
              <ProtectedEmployeeRoute>
                <EmployeeDownloadsPage />
              </ProtectedEmployeeRoute>
            } 
          />
          <Route 
            path="/training/:slug" 
            element={
              <ProtectedEmployeeRoute>
                <TrainingDetailPage />
              </ProtectedEmployeeRoute>
            } 
          />

          {/* Dedicated Admin Route */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboardPage />
              </ProtectedAdminRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}