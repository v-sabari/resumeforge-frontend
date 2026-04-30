import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ARTICLES } from '../data/articles';

const APP_NAME = 'ResumeForge AI';
const BASE_URL = 'https://www.resumeforgeai.site';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

const PAGE_META = {
  '/': {
    title: `${APP_NAME} – Build ATS-Ready Resumes in Minutes`,
    description:
      'ResumeForge AI helps you build professional, ATS-optimized resumes with AI assistance. Free to start. Export PDF in minutes. Trusted by job seekers worldwide.',
  },
  '/pricing': {
    title: `Pricing – ${APP_NAME}`,
    description:
      'Start free, upgrade for unlimited exports. ResumeForge AI offers transparent one-time pricing with no subscription required.',
  },
  '/features': {
    title: `Features – ${APP_NAME}`,
    description:
      'AI-powered bullet points, live ATS preview, multiple templates, PDF export, and more. Everything you need to build a job-winning resume.',
  },
  '/about': {
    title: `About Us – ${APP_NAME}`,
    description:
      'Learn about ResumeForge AI — our mission to help every job seeker build a professional, ATS-ready resume without the confusion.',
  },
  '/contact': {
    title: `Contact Us – ${APP_NAME}`,
    description:
      'Have a question? Contact the ResumeForge AI support team. We respond within 24 hours.',
  },
  '/register': {
    title: `Create Free Account – ${APP_NAME}`,
    description:
      'Sign up for free and build your professional resume today. No credit card required.',
  },
  '/login': {
    title: `Sign In – ${APP_NAME}`,
    description: 'Sign in to your ResumeForge AI account and continue building your resume.',
  },
  '/forgot-password': {
    title: `Forgot Password – ${APP_NAME}`,
    description: 'Request a password reset OTP for your ResumeForge AI account.',
  },
  '/reset-password': {
    title: `Reset Password – ${APP_NAME}`,
    description: 'Reset your ResumeForge AI account password securely using the OTP sent to your email.',
  },
  '/terms': {
    title: `Terms of Service – ${APP_NAME}`,
    description: 'Read the terms of service for ResumeForge AI.',
  },
  '/privacy': {
    title: `Privacy Policy – ${APP_NAME}`,
    description: 'Read the privacy policy for ResumeForge AI. We take your data privacy seriously.',
  },
  '/refund-policy': {
    title: `Refund Policy – ${APP_NAME}`,
    description: 'Read the refund and cancellation policy for ResumeForge AI Premium.',
  },
  '/resources': {
    title: `Career Resources & Resume Tips – ${APP_NAME}`,
    description:
      'Free resume writing guides, ATS tips, action verb lists, LinkedIn advice, and career resources from the ResumeForge AI team.',
  },
  '/tools': {
    title: `Free Resume Tools – ATS Keyword Checker & Word Count | ${APP_NAME}`,
    description:
      'Free resume analysis tools: check your ATS keyword strength, count resume words, and get instant tips — no account required. Powered by ResumeForge AI.',
  },
  // App pages (noindex)
  '/app/dashboard': { title: `Dashboard – ${APP_NAME}`,      description: 'Your resume dashboard.',          noIndex: true },
  '/app/builder':   { title: `Resume Builder – ${APP_NAME}`, description: 'Build your resume.',              noIndex: true },
  '/app/profile':   { title: `Profile – ${APP_NAME}`,        description: 'Manage your account.',            noIndex: true },
  '/app/referral':  { title: `Referral Hub – ${APP_NAME}`,   description: 'Refer friends and earn Premium.', noIndex: true },
  '/admin':         { title: `Admin Panel – ${APP_NAME}`,    description: 'Admin dashboard.',                noIndex: true },
  '/verify-email':  { title: `Verify Email – ${APP_NAME}`,   description: 'Verify your email.',              noIndex: true },
  '/payment/callback': { title: `Payment Confirmation – ${APP_NAME}`, description: 'Confirming your payment.',         noIndex: true },
  '/payment/success':  { title: `Payment Successful – ${APP_NAME}`,   description: 'Payment successful.',              noIndex: true },
  '/payment/failed':   { title: `Payment Failed – ${APP_NAME}`,       description: 'Payment could not be completed.',  noIndex: true },
};

// F1 FIX: guard against SSG environment where document does not exist.
// useEffect never runs during static generation, but upsert is called
// from inside useEffect so this guard is a safety net.
const isBrowser = typeof document !== 'undefined';

const upsert = (selector, attrs, tag = 'meta') => {
  if (!isBrowser) return;
  let el = document.querySelector(selector);
  if (!el) { el = document.createElement(tag); document.head.appendChild(el); }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
};

const getArticleMeta = (path) => {
  if (!path.startsWith('/resources/')) return null;
  const slug = path.replace('/resources/', '').trim();
  if (!slug) return null;
  const article = ARTICLES.find(a => a.slug === slug);
  if (!article) return null;
  return {
    title: `${article.title} – ${APP_NAME}`,
    description: article.excerpt,
    canonicalPath: `/resources/${article.slug}`,
  };
};

const getMeta = (path) => {
  const article = getArticleMeta(path);
  if (article) return article;
  if (PAGE_META[path]) return PAGE_META[path];
  const prefix = Object.entries(PAGE_META).find(([k]) =>
    k !== '/' && (path === k || path.startsWith(`${k}/`)));
  return prefix ? prefix[1] : PAGE_META['/'];
};

export const useSeoMeta = () => {
  const location = useLocation();

  useEffect(() => {
    if (!isBrowser) return;

    const path = location.pathname;
    const meta = getMeta(path);
    const canonical = `${BASE_URL}${meta.canonicalPath || path}`;

    document.title = meta.title;

    upsert('meta[name="description"]',        { name: 'description',    content: meta.description });
    upsert('link[rel="canonical"]',           { rel: 'canonical',        href: canonical }, 'link');
    upsert('meta[name="robots"]',             { name: 'robots',          content: meta.noIndex ? 'noindex,nofollow' : 'index,follow' });
    upsert('meta[property="og:type"]',        { property: 'og:type',     content: 'website' });
    upsert('meta[property="og:url"]',         { property: 'og:url',      content: canonical });
    upsert('meta[property="og:title"]',       { property: 'og:title',    content: meta.title });
    upsert('meta[property="og:description"]', { property: 'og:description', content: meta.description });
    upsert('meta[property="og:image"]',       { property: 'og:image',    content: DEFAULT_OG_IMAGE });
    upsert('meta[property="og:site_name"]',   { property: 'og:site_name', content: APP_NAME });
    upsert('meta[name="twitter:card"]',       { name: 'twitter:card',    content: 'summary_large_image' });
    upsert('meta[name="twitter:title"]',      { name: 'twitter:title',   content: meta.title });
    upsert('meta[name="twitter:description"]',{ name: 'twitter:description', content: meta.description });
    upsert('meta[name="twitter:image"]',      { name: 'twitter:image',   content: DEFAULT_OG_IMAGE });

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path:     location.pathname + location.search,
        page_title:    meta.title,
        page_location: window.location.href,
      });
    }
  }, [location.pathname, location.search]);
};

export const trackEvent = (eventName, params = {}) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
};