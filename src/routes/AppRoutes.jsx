import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { MarketingLayout } from '../layouts/MarketingLayout';
import { AppLayout } from '../layouts/AppLayout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { FeaturesRedirect } from '../components/common/FeaturesRedirect';
import { useSeoMeta } from '../hooks/useSeoMeta';

/* Lazy Loaded Pages */
const LandingPage = lazy(() => import('../pages/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('../pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const VerifyEmailPage = lazy(() => import('../pages/VerifyEmailPage').then(m => ({ default: m.VerifyEmailPage })));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));
const DashboardPage = lazy(() => import('../pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ResumeBuilderPage = lazy(() => import('../pages/ResumeBuilderPage').then(m => ({ default: m.ResumeBuilderPage })));
const PricingPage = lazy(() => import('../pages/PricingPage').then(m => ({ default: m.PricingPage })));
const ProfilePage = lazy(() => import('../pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const PaymentSuccessPage = lazy(() => import('../pages/PaymentPages').then(m => ({ default: m.PaymentSuccessPage })));
const PaymentFailedPage = lazy(() => import('../pages/PaymentPages').then(m => ({ default: m.PaymentFailedPage })));
const ResourcesPage = lazy(() => import('../pages/ResourcesPages').then(m => ({ default: m.ResourcesPage })));
const ArticlePage = lazy(() => import('../pages/ResourcesPages').then(m => ({ default: m.ArticlePage })));
const ContactPage = lazy(() => import('../pages/ContactPage').then(m => ({ default: m.ContactPage })));

const TermsPage = lazy(() => import('../pages/StaticPages').then(m => ({ default: m.TermsPage })));
const PrivacyPage = lazy(() => import('../pages/StaticPages').then(m => ({ default: m.PrivacyPage })));
const RefundPolicyPage = lazy(() => import('../pages/StaticPages').then(m => ({ default: m.RefundPolicyPage })));
const AboutPage = lazy(() => import('../pages/StaticPages').then(m => ({ default: m.AboutPage })));
const NotFoundPage = lazy(() => import('../pages/StaticPages').then(m => ({ default: m.NotFoundPage })));

const SeoWrapper = ({ children }) => {
  useSeoMeta();
  return children;
};

export const AppRoutes = () => (
  <SeoWrapper>
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <Routes>
        <Route element={<MarketingLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="refund-policy" element={<RefundPolicyPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="resources/:slug" element={<ArticlePage />} />
          <Route path="features" element={<FeaturesRedirect />} />
        </Route>

        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />

        <Route path="payment/success" element={<PaymentSuccessPage />} />
        <Route path="payment/failed" element={<PaymentFailedPage />} />

        <Route
          path="app"
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
  </SeoWrapper>
);