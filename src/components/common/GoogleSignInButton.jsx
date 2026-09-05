import { useEffect, useRef, useState } from 'react';

const GSI_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

/**
 * GOOGLE SIGN-IN: "Continue with Google" button built directly on the Google
 * Identity Services (GSI) script — no @react-oauth/google dependency. The
 * GSI script is injected on first use and reused across pages.
 *
 * onSuccess hands back the raw credential (ID token) string, which the caller
 * POSTs to /api/auth/google so the backend can verify it and create-or-login.
 *
 * CRITICAL (DOM conflict fix): Google's renderButton owns whatever element it
 * renders into and destroys/replaces that element's children on every render.
 * React must therefore never mount its own children into that node — otherwise
 * the next React commit tries to removeChild a node GSI already removed and
 * throws "NotFoundError: Failed to execute 'removeChild'". The GSI target div
 * is kept permanently empty; the Loading placeholder lives OUTSIDE it as a
 * sibling, so React only ever manipulates nodes it owns.
 *
 * The GSI callback is registered once and routed through refs, so handlers see
 * the current props (RegisterPage's handler reads the latest typed referral
 * code) without re-registering the GSI callback.
 */
export const GoogleSignInButton = ({ onSuccess, onError, disabled = false }) => {
  const targetRef = useRef(null);
  const initRef = useRef(false);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const [ready, setReady] = useState(false);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [onSuccess, onError]);

  useEffect(() => {
    let cancelled = false;

    if (!clientId) {
      return undefined;
    }

    const render = () => {
      if (cancelled || !targetRef.current || !window.google?.accounts?.id) return;

      // React StrictMode double-invokes effects in dev — the target already
      // holding a rendered iframe means renderButton already ran.
      if (targetRef.current.children.length > 0) {
        setReady(true);
        return;
      }

      if (!initRef.current) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          // No One Tap popups — the user must deliberately click the button.
          auto_select: false,
          callback: (response) => {
            if (cancelled) return;
            if (!response?.credential) {
              onErrorRef.current?.('Google sign-in was cancelled. Please try again.');
              return;
            }
            onSuccessRef.current?.(response.credential);
          },
        });
        initRef.current = true;
      }

      const target = targetRef.current;
      const width = Math.min(400, Math.max(200, target.parentElement?.clientWidth || target.clientWidth || 200));
      window.google.accounts.id.renderButton(target, {
        theme: 'outlined',
        size: 'large',
        shape: 'rectangular',
        logo_alignment: 'left',
        text: 'continue_with',
        width,
      });
      setReady(true);
    };

    if (window.google?.accounts?.id) {
      render();
    } else {
      const script = document.createElement('script');
      script.src = GSI_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = render;
      script.onerror = () => {
        if (!cancelled) {
          onErrorRef.current?.('Failed to load Google Sign-In. Please try again.');
        }
      };
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
    };
  }, [clientId]);

  return (
    <div className={`google-signin ${disabled ? 'google-signin--disabled' : ''}`}>
      {!clientId
        ? (
          <p className="google-signin__placeholder">Google sign-in unavailable</p>
        )
        : (
          <>
            {!ready && (
              <p className="google-signin__placeholder">Loading Google sign-in…</p>
            )}
            {/* GSI-owned element: never mount React children into this div. */}
            <div ref={targetRef} className="google-signin__target" aria-busy={!ready} />
          </>
        )}
    </div>
  );
};