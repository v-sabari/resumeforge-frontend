import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { MarketingLayout }  from '../layouts/MarketingLayout';
import { AppLayout }        from '../layouts/AppLayout';
import { ProtectedRoute }   from '../components/common/ProtectedRoute';
import { PublicOnlyRoute }  from '../components/common/PublicOnlyRoute';
import { FeaturesRedirect } from '../components/common/FeaturesRedirect';
import { useSeoMeta }       from '../hooks/useSeoMeta';

/* ── Lazy pages ─────────────────────────────────────────────────── */
const LandingPage         = lazy(() => import('../pages/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage           = lazy(() => import('../pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage        = lazy(() => import('../pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const VerifyEmailPage     = lazy(() => import('../pages/VerifyEmailPage').then(m => ({ default: m.VerifyEmailPage })));
const ForgotPasswordPage  = lazy(() => import('../pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage   = lazy(() => import('../pages/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));
const DashboardPage       = lazy(() => import('../pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ResumeEditorPage    = lazy(() => import('../pages/ResumeEditorPage').then(m => ({ default: m.ResumeEditorPage })));
const ResumeSectionsPage  = lazy(() => import('../pages/ResumeSectionsPage').then(m => ({ default: m.ResumeSectionsPage })));
const BuilderLayout       = lazy(() => import('../layouts/BuilderLayout').then(m => ({ default: m.BuilderLayout })));
const PricingPage         = lazy(() => import('../pages/PricingPage').then(m => ({ default: m.PricingPage })));
const ProfilePage         = lazy(() => import('../pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const ResourcesPage       = lazy(() => import('../pages/ResourcesPages').then(m => ({ default: m.ResourcesPage })));
const ArticlePage         = lazy(() => import('../pages/ResourcesPages').then(m => ({ default: m.ArticlePage })));
const ContactPage         = lazy(() => import('../pages/ContactPage').then(m => ({ default: m.ContactPage })));

const TermsPage           = lazy(() => import('../pages/StaticPages').then(m => ({ default: m.TermsPage })));
const PrivacyPage         = lazy(() => import('../pages/StaticPages').then(m => ({ default: m.PrivacyPage })));
const RefundPolicyPage    = lazy(() => import('../pages/StaticPages').then(m => ({ default: m.RefundPolicyPage })));
const AboutPage           = lazy(() => import('../pages/StaticPages').then(m => ({ default: m.AboutPage })));
const NotFoundPage        = lazy(() => import('../pages/StaticPages').then(m => ({ default: m.NotFoundPage })));

// Phase 1: payment callback (HMAC-verified, replaces /payment/success)
const PaymentCallbackPage = lazy(() => import('../pages/PaymentPages').then(m => ({ default: m.PaymentCallbackPage })));
const PaymentFailedPage   = lazy(() => import('../pages/PaymentPages').then(m => ({ default: m.PaymentFailedPage })));

// Phase 3: referral hub (authenticated, inside /app)
const ReferralPage        = lazy(() => import('../pages/ReferralPage').then(m => ({ default: m.ReferralPage })));

// Free tools and AI-powered pages (public)
const FreeToolsPage       = lazy(() => import('../pages/FreeToolsPage').then(m => ({ default: m.FreeToolsPage })));
const LinkedInToolsPage   = lazy(() => import('../pages/LinkedInToolsPage').then(m => ({ default: m.LinkedInToolsPage })));
const ATSScorePage        = lazy(() => import('../pages/ATSScorePage').then(m => ({ default: m.ATSScorePage })));

// Admin panel (authenticated, admin-only)
const AdminPage           = lazy(() => import('../pages/AdminPage').then(m => ({ default: m.AdminPage })));

const SeoWrapper = ({ children }) => {
  useSeoMeta();
  return children;
};

export const AppRoutes = () => (
  <SeoWrapper>
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <Routes>

        {/* ── Marketing (public) ─────────────────────────────── */}
        <Route element={<MarketingLayout />}>
          <Route index          element={<LandingPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="about"   element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="terms"   element={<TermsPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="refund-policy" element={<RefundPolicyPage />} />
          <Route path="resources"     element={<ResourcesPage />} />
          <Route path="resources/:slug" element={<ArticlePage />} />
          <Route path="features"      element={<FeaturesRedirect />} />
          
          {/* Free Tools */}
          <Route path="tools"         element={<FreeToolsPage />} />
          <Route path="tools/linkedin" element={<LinkedInToolsPage />} />
          <Route path="tools/ats-score" element={<ATSScorePage />} />
        </Route>

        {/* ── Auth (public-only — redirects away if already logged in) ─ */}
        <Route path="login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        {/*
          /register?ref=CODE
          RegisterPage reads the ?ref= param and pre-fills the referral code field.
          This is the primary referral entry point.
        */}
        <Route path="register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
        <Route path="verify-email"    element={<VerifyEmailPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password"  element={<ResetPasswordPage />} />

        {/* ── Payment (public, HMAC-protected) ──────────────── */}
        {/* Configure in Razorpay Dashboard → Payment Links → Callback URL */}
        <Route path="payment/callback" element={<PaymentCallbackPage />} />
        <Route path="payment/failed"   element={<PaymentFailedPage />} />
        {/* Redirect legacy bookmarks */}
        <Route path="payment/success"  element={<Navigate to="/payment/callback" replace />} />

        {/* ── App (authenticated) ───────────────────────────── */}
        <Route
          path="app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"         element={<DashboardPage />} />
          {/* Resume builder — BuilderLayout mounts ONE shared editor state
              (ResumeEditorProvider) around both nested pages below, so
              switching between Editor and Sections never re-fetches or
              re-creates the resume — see layouts/BuilderLayout.jsx. */}
          <Route path="builder" element={<BuilderLayout />}>
            <Route index            element={<ResumeEditorPage />} />
            <Route path="sections"  element={<ResumeSectionsPage />} />
          </Route>
          <Route path="builder/:resumeId" element={<BuilderLayout />}>
            <Route index            element={<ResumeEditorPage />} />
            <Route path="sections"  element={<ResumeSectionsPage />} />
          </Route>
          <Route path="profile"           element={<ProfilePage />} />
          {/* Phase 3: referral hub */}
          <Route path="referral"          element={<ReferralPage />} />
          {/* Admin panel - requires ADMIN role */}
          <Route
    path="admin"
    element={
        <ProtectedRoute roles={["ADMIN"]}>
            <AdminPage />
        </ProtectedRoute>
    }
/>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  </SeoWrapper>
);
