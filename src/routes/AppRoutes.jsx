import { Navigate, Route, Routes } from 'react-router-dom';
import { MarketingLayout }   from '../layouts/MarketingLayout';
import { AppLayout }         from '../layouts/AppLayout';
import { ProtectedRoute }    from '../components/common/ProtectedRoute';
import { useSeoMeta }        from '../hooks/useSeoMeta';
import { LandingPage }       from '../pages/LandingPage';
import { LoginPage }         from '../pages/LoginPage';
import { RegisterPage }      from '../pages/RegisterPage';
import { DashboardPage }     from '../pages/DashboardPage';
import { ResumeBuilderPage } from '../pages/ResumeBuilderPage';
import { PricingPage }       from '../pages/PricingPage';
import { ProfilePage }       from '../pages/ProfilePage';
import { PaymentSuccessPage, PaymentFailedPage } from '../pages/PaymentPages';
import { ResourcesPage, ArticlePage } from '../pages/ResourcesPages';
import {
  TermsPage, PrivacyPage, RefundPolicyPage,
  AboutPage, ContactPage, NotFoundPage,
} from '../pages/StaticPages';

const SeoWrapper = ({ children }) => {
  useSeoMeta();
  return children;
};

export const AppRoutes = () => (
  <SeoWrapper>
    <Routes>
      {/* ── Marketing / public ─────────────────────────── */}
      <Route element={<MarketingLayout />}>
        <Route index          element={<LandingPage />}     />
        <Route path="pricing" element={<PricingPage />}     />
        <Route path="about"   element={<AboutPage />}       />
        <Route path="contact" element={<ContactPage />}     />
        <Route path="terms"   element={<TermsPage />}       />
        <Route path="privacy" element={<PrivacyPage />}     />
        <Route path="refund-policy" element={<RefundPolicyPage />} />
        <Route path="resources"          element={<ResourcesPage />} />
        <Route path="resources/:slug"    element={<ArticlePage />}   />
        <Route path="features" element={<Navigate to="/" replace />} />
      </Route>

      {/* ── Auth (no layout shell) ──────────────────────── */}
      <Route path="login"    element={<LoginPage />}    />
      <Route path="register" element={<RegisterPage />} />

      {/* ── Payment callbacks ───────────────────────────── */}
      <Route path="payment/success" element={<PaymentSuccessPage />} />
      <Route path="payment/failed"  element={<PaymentFailedPage />}  />

      {/* ── Authenticated app ───────────────────────────── */}
      <Route path="app" element={
        <ProtectedRoute><AppLayout /></ProtectedRoute>
      }>
        <Route index                   element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"        element={<DashboardPage />}     />
        <Route path="builder"          element={<ResumeBuilderPage />} />
        <Route path="builder/:resumeId" element={<ResumeBuilderPage />} />
        <Route path="profile"          element={<ProfilePage />}       />
      </Route>

      {/* ── 404 ────────────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </SeoWrapper>
);
