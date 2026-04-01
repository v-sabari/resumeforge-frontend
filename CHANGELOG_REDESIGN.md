ResumeForge AI Frontend Redesign

Key changes in this delivery:
- Reworked global spacing, card, button, input, and layout tokens in src/index.css
- Added reusable sidebar component in src/components/navigation/AppSidebar.jsx
- Added reusable layout wrapper in src/components/ui/LayoutWrapper.jsx
- Rebuilt app shell with collapsible desktop sidebar and hamburger drawer for mobile/tablet/laptop in src/layouts/AppLayout.jsx
- Rebuilt marketing navbar drawer behavior in src/components/navigation/Navbar.jsx
- Refined footer alignment and compliance links in src/components/navigation/Footer.jsx
- Updated shared UI primitives:
  - src/components/common/PageHeader.jsx
  - src/components/common/StatCard.jsx
  - src/components/common/EmptyState.jsx
  - src/components/common/Alert.jsx
  - src/components/common/Loader.jsx
  - src/components/ui/Button.jsx
  - src/components/ui/Card.jsx
  - src/components/ui/SectionContainer.jsx
  - src/components/auth/AuthShell.jsx
- Redesigned landing sections:
  - src/components/landing/HeroSection.jsx
  - src/components/landing/FeatureSection.jsx
  - src/components/landing/PricingPreview.jsx
  - src/components/landing/TestimonialsSection.jsx
  - src/components/landing/FaqSection.jsx
- Fixed pricing card height and best value alignment in src/pages/PricingPage.jsx
- Improved dashboard alignment in src/pages/DashboardPage.jsx
- Improved profile page layout and empty state in src/pages/ProfilePage.jsx
- Tightened builder shell alignment in src/pages/ResumeBuilderPage.jsx
- Preserved routes, services, API integration, backend flows, branding assets, and existing endpoints
