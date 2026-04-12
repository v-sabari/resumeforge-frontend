import { Navigate, Route, Routes } from 'react-router-dom';
import { MarketingLayout } from '../layouts/MarketingLayout';
import { AppLayout } from '../layouts/AppLayout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { FeaturesRedirect } from '../components/common/FeaturesRedirect';
import { useSeoMeta } from '../hooks/useSeoMeta';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { VerifyEmailPage } from '../pages/VerifyEmailPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ResumeBuilderPage } from '../pages/ResumeBuilderPage';
import { PricingPage } from '../pages/PricingPage';
import { ProfilePage } from '../pages/ProfilePage';
import { PaymentSuccessPage, PaymentFailedPage } from '../pages/PaymentPages';
import { ResourcesPage, ArticlePage } from '../pages/ResourcesPages';
import { ContactPage } from '../pages/ContactPage';
import {
  TermsPage,
  PrivacyPage,
  RefundPolicyPage,
  AboutPage,
  NotFoundPage,
} from '../pages/StaticPages';

const SeoWrapper = ({ children }) => {
  useSeoMeta();
  return children;
};

export const AppRoutes = () => (
  <SeoWrapper>
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
  </SeoWrapper>
);