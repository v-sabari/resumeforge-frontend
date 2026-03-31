# ResumeForge AI Frontend

A production-minded Vite + React frontend for the ResumeForge AI SaaS application.

## Tech Stack

- Vite + React
- React Router
- Axios
- Tailwind CSS
- Context API for authentication and app-level state

## Features

- Marketing landing page
- Register and login flows
- JWT-based session persistence
- Protected dashboard and resume builder
- Dynamic resume editing workspace
- Live ATS-friendly resume preview
- AI writing actions wired to backend endpoints
- Ad unlock flow for the first free export
- Premium payment flow with Razorpay link redirection
- Profile and billing-oriented UI
- Payment success and failure pages

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and update values:

```bash
cp .env.example .env
```

Required variables:

- `VITE_API_BASE_URL` - backend base URL
- `VITE_APP_NAME` - app display name
- `VITE_RAZORPAY_LINK` - fallback Razorpay payment link

### 3. Run the development server

```bash
npm run dev
```

The app will start on the Vite default local server.

## Production Build

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Backend API Contract

This frontend is aligned to these exact backend routes:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/resumes`
- `POST /api/resumes`
- `GET /api/resumes/{id}`
- `PUT /api/resumes/{id}`
- `DELETE /api/resumes/{id}`
- `POST /api/ai/summary`
- `POST /api/ai/bullets`
- `POST /api/ai/skills`
- `POST /api/ai/rewrite`
- `POST /api/ads/start`
- `POST /api/ads/complete`
- `POST /api/ads/fail`
- `POST /api/payments/create`
- `POST /api/payments/verify`
- `GET /api/payments/history`
- `GET /api/premium/status`
- `POST /api/premium/activate`
- `POST /api/export/check-access`
- `POST /api/export/record`
- `GET /api/export/status`

## Deployment Notes

- Build with `npm run build`
- Deploy the `dist` directory to static hosting such as Vercel, Netlify, S3 + CloudFront, or Nginx
- Ensure SPA fallback rewrites all non-file routes to `index.html`
- Inject environment variables at build time
- Point `VITE_API_BASE_URL` to the production backend

## Project Structure

```text
src/
  assets/
  components/
  context/
  hooks/
  layouts/
  pages/
  routes/
  services/
  utils/
```

## Branding Assets

The project includes SVG logo assets and favicon-ready marks under `public/` and `src/assets/`.
