# ResumeForge AI — Frontend Deployment Guide
> Last updated: April 2025 | Production Hardening Pass Applied

---

## Quick Start Checklist (do in this order)

- [ ] Copy `.env.example` → `.env` and fill all values
- [ ] Create `og-image.png` (1200×630 px) → place in `/public/`
- [ ] Create `favicon.ico` (32×32) and `apple-touch-icon.png` (180×180) → place in `/public/`
- [ ] Set up 5 email accounts (support / billing / privacy / legal / hello @yourdomain)
- [ ] Sign up at formspree.io → replace `YOUR_FORMSPREE_ID` in `src/pages/StaticPages.jsx`
- [ ] Deploy to Vercel (instructions below)
- [ ] Uncomment GA4 script in `index.html` with real Measurement ID
- [ ] Uncomment Google Search Console meta tag with real verification token
- [ ] Submit sitemap in Google Search Console
- [ ] After AdSense approval: update `public/ads.txt` and uncomment AdSense script in `index.html`

---

## Environment Variables (Vercel → Settings → Environment Variables)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Backend URL, no trailing slash | `https://resumeforge-backend.onrender.com` |
| `VITE_APP_NAME` | App display name | `ResumeForge AI` |
| `VITE_RAZORPAY_KEY_ID` | Public key from Razorpay Dashboard → Settings → API Keys | `rzp_live_XXXXXXXXXXXXXXXX` |
| `VITE_RAZORPAY_LINK` | Your Razorpay Payment Link URL | `https://rzp.io/rzp/XXXXXXXX` |
| `VITE_GA4_ID` | GA4 Measurement ID | `G-XXXXXXXXXX` |
| `VITE_ADSENSE_CLIENT` | AdSense Publisher ID (after approval only) | `ca-pub-XXXXXXXXXXXXXXXX` |

---

## Deploying to Vercel

```bash
# Option A: Vercel CLI
npm install -g vercel
vercel --prod

# Option B: Vercel Dashboard
# 1. Push code to GitHub
# 2. Import project at vercel.com/new
# 3. Framework Preset: Vite
# 4. Build command: npm run build
# 5. Output directory: dist
# 6. Add environment variables in Settings tab
```

---

## Local Development

```bash
cp .env.example .env
# Fill VITE_API_BASE_URL=http://localhost:8080
npm install
npm run dev
```

---

## Production Build Test (before deploy)

```bash
npm run build
npm run preview
# Open http://localhost:4173 and verify everything works
```

---

## Files You Must Create Manually

### `public/og-image.png`
- Size: **1200 × 630 px**
- Format: PNG (widely supported for OG)
- Content: Logo + tagline + brand colour background
- Max size: 200 KB
- Tools: Canva (free), Figma, Adobe Express

### `public/favicon.ico`
- Size: **32 × 32 px** (ICO format)
- Needed for: Firefox, older browsers, browser tabs on Windows

### `public/apple-touch-icon.png`
- Size: **180 × 180 px** (PNG format)
- Needed for: iOS home screen icon when users save the app

---

## Contact Form Setup (Formspree)

1. Go to **https://formspree.io** → create free account
2. Create a new form → you get an ID like `xyzabcde`
3. Open `src/pages/StaticPages.jsx`
4. Find `YOUR_FORMSPREE_ID` and replace it with your real ID
5. Free tier: 50 submissions/month (sufficient for launch)

---

## Google Analytics 4 Setup

1. Go to **analytics.google.com** → create a GA4 property
2. Admin → Data Streams → Web → get your **Measurement ID** (`G-XXXXXXXXXX`)
3. In `index.html`, replace `G-XXXXXXXXXX` in both places and uncomment the script block
4. The `useSeoMeta` hook already fires `page_view` events on every route change automatically

---

## Google Search Console

1. Go to **search.google.com/search-console**
2. Add property → Domain or URL prefix → `https://resumeforge.ai`
3. Verify ownership via HTML tag method
4. Copy the `content` attribute value into `index.html` meta tag → uncomment it
5. After deployment: Sitemaps → Submit → `https://resumeforge.ai/sitemap.xml`

---

## Google AdSense (after site is live and has content)

1. Apply at **adsense.google.com**
2. After approval, get your Publisher ID (`ca-pub-XXXXXXXXXXXXXXXX`)
3. Update `public/ads.txt`: `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`
4. In `index.html`, replace `ca-pub-XXXXXXXXXXXXXXXX` and uncomment the AdSense script
5. Set `VITE_ADSENSE_CLIENT` and `VITE_ADSENSE_SLOT_CONTENT` env vars in Vercel

---

## Security Headers (already configured in vercel.json)

- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: DENY
- ✅ X-XSS-Protection
- ✅ Referrer-Policy
- ✅ Permissions-Policy
- ✅ Content-Security-Policy
- ✅ Asset caching (immutable, 1 year) for `/assets/`

---

## Performance Notes

- Vendor code splitting is enabled (React, Zustand, Axios in separate chunks)
- Fonts load with `display=swap` — no render blocking
- All auth/app routes are lazy-loadable — add `React.lazy()` for further gains
- Target Lighthouse score: 85+ Performance, 95+ SEO, 90+ Accessibility

---

## Post-Deploy Verification

Run through this after every deploy:

```
✅ Homepage loads, title correct in browser tab
✅ /pricing — both plans shown, upgrade button works
✅ /register — form submits, redirects to dashboard
✅ /login — works, wrong password shows error
✅ /app/dashboard — protected, redirects if not logged in
✅ /contact — form submits (check Formspree dashboard)
✅ /terms, /privacy, /refund-policy — all load
✅ /resources — articles list loads
✅ 404 — visit /fake-page, see 404 page
✅ Mobile — test on real device, all pages usable
✅ https://resumeforge.ai/robots.txt — correct
✅ https://resumeforge.ai/sitemap.xml — correct
✅ PDF export — download works correctly
✅ Payment flow — test in Razorpay test mode
```
