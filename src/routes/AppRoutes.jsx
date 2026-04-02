import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { MarketingLayout } from '../layouts/MarketingLayout';
import { AppLayout } from '../layouts/AppLayout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { Loader } from '../components/common/Loader';

// Eagerly load auth pages (fast routes users hit first)
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

// Lazy-load all other pages to reduce initial bundle size
const LandingPage = lazy(() => import('../pages/LandingPage').then(m => ({ default: m.LandingPage })));
const PricingPage = lazy(() => import('../pages/PricingPage').then(m => ({ default: m.PricingPage })));
const PrivacyPage = lazy(() => import('../pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('../pages/TermsPage').then(m => ({ default: m.TermsPage })));
const ContactPage = lazy(() => import('../pages/ContactPage').then(m => ({ default: m.ContactPage })));
const AboutPage = lazy(() => import('../pages/AboutPage').then(m => ({ default: m.AboutPage })));
const DashboardPage = lazy(() => import('../pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ResumeBuilderPage = lazy(() => import('../pages/ResumeBuilderPage').then(m => ({ default: m.ResumeBuilderPage })));
const ProfilePage = lazy(() => import('../pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const PaymentSuccessPage = lazy(() => import('../pages/PaymentSuccessPage').then(m => ({ default: m.PaymentSuccessPage })));
const PaymentFailedPage = lazy(() => import('../pages/PaymentFailedPage').then(m => ({ default: m.PaymentFailedPage })));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

const PageLoader = () => (
  <div className="flex min-h-[40vh] items-center justify-center">
    <Loader label="Loading..." />
  </div>
);

export const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/payment/success" element={<PaymentSuccessPage />} />
      <Route path="/payment/failed" element={<PaymentFailedPage />} />

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="builder" element={<ResumeBuilderPage />} />
        <Route path="builder/:resumeId" element={<ResumeBuilderPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);
