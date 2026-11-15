// P0-1: Vercel Edge Middleware — returns a real HTTP 404 for genuinely
// unknown paths while letting valid SPA routes, the /api/* proxy, and
// static assets through to the catch-all rewrite / filesystem.
//
// Why this exists: with only a catch-all rewrite in vercel.json, every
// non-asset, non-API path returns HTTP 200 with index.html (a "soft 404").
// Search engines and monitoring can't distinguish a real page from a
// missing one. This middleware runs BEFORE the vercel.json rewrites and
// returns a 404 Response for paths whose first segment is not a known
// SPA route prefix — so /this-does-not-exist gets a real 404, while
// /pricing, /app/builder/7, /resources/some-slug all reach index.html.
//
// SAFETY: the allowlist is by TOP-LEVEL segment only, so adding a new
// nested route under an existing prefix (e.g. /tools/new-tool) needs NO
// change here. Adding a NEW top-level route requires adding its first
// segment to KNOWN_TOP_LEVEL below. See src/routes/AppRoutes.jsx.

const KNOWN_TOP_LEVEL = new Set([
  '',                // "/" (root)
  'pricing',
  'templates',
  'about',
  'contact',
  'terms',
  'privacy',
  'cookie-policy',
  'refund-policy',
  'resources',
  'features',
  'tools',
  'login',
  'register',
  'verify-email',
  'forgot-password',
  'reset-password',
  'payment',
  'app',
]);

// Skip middleware entirely for these — let vercel.json rewrites / filesystem
// handle them. Anything containing a "." is treated as a potential static
// asset (favicon.ico, sitemap.xml, /assets/index.js, ads.txt, …) and passed
// through so Vercel's filesystem + 404.html handles missing files natively.
function shouldBypass(pathname) {
  if (pathname.startsWith('/api/')) return true;
  if (pathname.startsWith('/assets/')) return true;
  // last segment contains a dot → treat as a file path
  const last = pathname.split('/').pop();
  if (last && last.includes('.')) return true;
  return false;
}

export default function middleware(request) {
  const { pathname } = new URL(request.url);

  if (shouldBypass(pathname)) {
    // Let vercel.json rewrites (API proxy) and filesystem (assets) handle it.
    return undefined; // continue pipeline
  }

  const firstSegment = pathname.split('/').filter(Boolean)[0] || '';
  if (KNOWN_TOP_LEVEL.has(firstSegment)) {
    // Valid SPA route prefix — let the catch-all rewrite serve index.html.
    return undefined;
  }

  // Genuinely unknown path — return a real HTTP 404 so it is not a soft-404.
  // Vercel serves public/404.html for unmatched paths, but the middleware
  // returning a 404 Response guarantees the status code even if a catch-all
  // rewrite would otherwise serve index.html with 200.
  const headers = new Headers({ 'content-type': 'text/html; charset=utf-8' });
  return new Response(FOUR_OH_FOUR_BODY, { status: 404, headers });
}

// Minimal inline 404 body — matches the look of public/404.html so the
// experience is consistent whether Vercel serves the static file (no
// middleware) or this middleware returns it (unknown path under catch-all).
const FOUR_OH_FOUR_BODY = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>404 — Page not found | ResumeForge AI</title>
<meta name="robots" content="noindex, nofollow">
<style>
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background:#f8fafc;color:#0f172a;margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;}
.c{text-align:center;max-width:28rem;padding:2rem;}
.code{font-size:6rem;font-weight:700;color:#cbd5e1;line-height:1;margin:0 0 1rem;user-select:none;}
h1{font-size:1.5rem;font-weight:600;margin:0 0 .5rem;}
p{color:#64748b;font-size:.875rem;margin:0 0 2rem;}
.btn{display:inline-block;padding:.625rem 1.25rem;border-radius:.5rem;text-decoration:none;font-weight:600;font-size:.875rem;}
.p{background:#4f46e5;color:#fff;}
.s{background:#fff;color:#4f46e5;border:1px solid #e2e8f0;margin-left:.5rem;}
.help{margin-top:2rem;font-size:.75rem;color:#94a3b8;}
.help a{color:#4f46e5;text-decoration:none;}
</style>
</head>
<body><div class="c">
<p class="code">404</p>
<h1>Page not found</h1>
<p>This page doesn't exist or may have been moved. Let's get you back on track.</p>
<a href="/" class="btn p">Go to homepage</a>
<a href="/pricing" class="btn s">View pricing</a>
<p class="help">Need help? <a href="mailto:support@resumeforgeai.site">support@resumeforgeai.site</a></p>
</div></body>
</html>`;

export const config = {
  // Run on every path except static assets and the API proxy, which
  // vercel.json handles. The matcher is a secondary guard; the body of
  // the function also bypasses these prefixes defensively.
  matcher: ['/((?!api/|assets/|.*\\..*).*)'],
};
