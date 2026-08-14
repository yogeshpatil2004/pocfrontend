import React from 'react';
import { HeroSection } from '../components/landing/HeroSection';
import { CapabilitiesGrid } from '../components/landing/CapabilitiesGrid';
import { TechStack } from '../components/landing/TechStack';
import { FeaturedPocs } from '../components/landing/FeaturedPocs';

export const HomePage = () => {
  return (
    <div className="space-y-0">
      <HeroSection />
      <CapabilitiesGrid />
      <TechStack />
      <FeaturedPocs />
    </div>
  );
};
