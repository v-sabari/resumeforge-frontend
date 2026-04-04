/**
 * AdBanner — safe AdSense placement component.
 *
 * PLACEMENT RULES:
 *   ✅ OK to show ads: /resources, /resources/:slug, /about, /contact, /pricing (non-checkout sections)
 *   ❌ NEVER show ads in: /app/*, /login, /register, /payment/*
 *
 * Usage:
 *   <AdBanner slot="XXXXXXXXXX" />
 *
 * To enable: replace the client and slot with your AdSense values in .env
 *   VITE_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
 *   VITE_ADSENSE_SLOT_CONTENT=XXXXXXXXXX
 */

const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT;

export const AdBanner = ({ slot, className = '' }) => {
  // Only render if AdSense is configured
  if (!ADSENSE_CLIENT || !slot) return null;

  return (
    <div className={`adsense-wrapper my-6 overflow-hidden ${className}`}
         aria-label="Advertisement">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};
