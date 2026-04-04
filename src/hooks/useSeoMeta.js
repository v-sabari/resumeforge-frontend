import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const APP_NAME = 'ResumeForge AI';

const PAGE_META = {
  '/': {
    title:       `${APP_NAME} – Build ATS-Ready Resumes in Minutes`,
    description: 'ResumeForge AI helps you build professional, ATS-optimized resumes with AI assistance. Free to start. Export PDF in minutes. Trusted by job seekers worldwide.',
  },
  '/pricing': {
    title:       `Pricing – ${APP_NAME}`,
    description: `Start free, upgrade for unlimited exports. ResumeForge AI offers transparent one-time pricing with no subscription required.`,
  },
  '/features': {
    title:       `Features – ${APP_NAME}`,
    description: `AI-powered bullet points, live ATS preview, multiple templates, PDF export, and more. Everything you need to build a job-winning resume.`,
  },
  '/about': {
    title:       `About Us – ${APP_NAME}`,
    description: `Learn about ResumeForge AI — our mission to help every job seeker build a professional, ATS-ready resume without the confusion.`,
  },
  '/contact': {
    title:       `Contact Us – ${APP_NAME}`,
    description: `Have a question? Contact the ResumeForge AI support team. We respond within 24 hours.`,
  },
  '/register': {
    title:       `Create Free Account – ${APP_NAME}`,
    description: `Sign up for free and build your professional resume today. No credit card required.`,
  },
  '/login': {
    title:       `Sign In – ${APP_NAME}`,
    description: `Sign in to your ResumeForge AI account and continue building your resume.`,
  },
  '/terms': {
    title:       `Terms of Service – ${APP_NAME}`,
    description: `Read the terms of service for ResumeForge AI.`,
  },
  '/privacy': {
    title:       `Privacy Policy – ${APP_NAME}`,
    description: `Read the privacy policy for ResumeForge AI. We take your data privacy seriously.`,
  },
  '/resources': {
    title:       `Career Resources & Resume Tips – ${APP_NAME}`,
    description: `Free resume writing guides, ATS tips, action verb lists, LinkedIn advice, and career resources from the ResumeForge AI team.`,
  },
  '/refund-policy': {
    title:       `Refund Policy – ${APP_NAME}`,
    description: `Read the refund and cancellation policy for ResumeForge AI Premium.`,
  },
  '/app/dashboard': {
    title:       `Dashboard – ${APP_NAME}`,
    description: `Your resume dashboard.`,
    noIndex:     true,
  },
  '/app/builder': {
    title:       `Resume Builder – ${APP_NAME}`,
    description: `Build your resume.`,
    noIndex:     true,
  },
};

/**
 * Sets <title>, <meta name="description">, and canonical <link> per route.
 * Also fires GA4 page_view events on navigation.
 */
export const useSeoMeta = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;

    // Match exact or prefix (for /resources/:slug, /app/builder/:id)
    const meta =
      PAGE_META[path] ||
      Object.entries(PAGE_META).find(([k]) => path.startsWith(k) && k !== '/')?.[1] ||
      PAGE_META['/'];

    // Set title
    document.title = meta.title;

    // Set meta description
    let desc = document.querySelector('meta[name="description"]');
    if (!desc) {
      desc = document.createElement('meta');
      desc.setAttribute('name', 'description');
      document.head.appendChild(desc);
    }
    desc.setAttribute('content', meta.description);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    const baseUrl = window.location.origin;
    canonical.setAttribute('href', `${baseUrl}${path}`);

    // Robots noindex for app routes
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', meta.noIndex ? 'noindex,nofollow' : 'index,follow');

    // GA4 page_view (if gtag loaded)
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path:  path,
        page_title: meta.title,
      });
    }
  }, [location.pathname]);
};

/**
 * Fires a GA4 custom event.
 * Safe to call even if GA4 is not loaded.
 */
export const trackEvent = (eventName, params = {}) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
};
