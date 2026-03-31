import { HeroSection } from '../components/landing/HeroSection';
import { FeatureSection } from '../components/landing/FeatureSection';
import { PricingPreview } from '../components/landing/PricingPreview';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { FaqSection } from '../components/landing/FaqSection';

export const LandingPage = () => (
  <>
    <HeroSection />
    <FeatureSection />
    <PricingPreview />
    <TestimonialsSection />
    <FaqSection />
  </>
);
