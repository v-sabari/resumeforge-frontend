import { useEffect } from "react";

const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT;
const DEFAULT_SLOT = import.meta.env.VITE_ADSENSE_SLOT_CONTENT;

const AdBanner = ({ slot = DEFAULT_SLOT, className = "" }) => {

  useEffect(() => {
    if (!ADSENSE_CLIENT || !slot) return;

    try {
      if (typeof window !== "undefined" && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      console.error("AdSense push error:", e);
    }
  }, [slot]);

  // Prevent render if not configured
  if (!ADSENSE_CLIENT || !slot) return null;

  return (
    <div
      className={`adsense-wrapper my-6 overflow-hidden ${className}`}
      aria-label="Advertisement"
      role="complementary"
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdBanner;