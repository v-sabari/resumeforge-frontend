import { useEffect, useRef, useState } from 'react';

const GSI_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

/**
 * GOOGLE SIGN-IN: "Continue with Google" button built directly on the Google
 * Identity Services (GSI) script — no @react-oauth/google dependency. The
 * GSI script is injected on first use and reused across pages.
 *
 * Renders Google's own iframe button sized to the container width. onSuccess
 * hands back the raw credential (ID token) string, which the caller POSTs to
 * /api/auth/google so the backend can verify it and create-or-login the user.
 *
 * wut: the GSI callback is registered once at mount, so it would see stale
 * onSuccess/onError closures. We keep the latest props in refs and route the
 * callback through them, so RegisterPage's handler always reads the *current*
 * referral code the user typed, and LoginPage never posts one.
 */
export const GoogleSignInButton = ({ onSuccess, onError, disabled = false }) => {
  const containerRef = useRef(null);
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
      onErrorRef.current?.(
        'Google sign-in is not configured. Set VITE_GOOGLE_CLIENT_ID in your .env and redeploy.'
      );
      return undefined;
    }

    const render = () => {
      if (cancelled || !containerRef.current || !window.google?.accounts?.id) return;

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

      const width = Math.min(400, Math.max(200, containerRef.current.clientWidth || 200));
      window.google.accounts.id.renderButton(containerRef.current, {
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
      <div
        ref={containerRef}
        className="google-signin__frame"
        aria-busy={!ready}
        data-testid="google-signin"
      >
        {!clientId
          ? (
            <p className="google-signin__placeholder">
              Google sign-in unavailable
            </p>
          )
          : !ready && (
            <p className="google-signin__placeholder">
              Loading Google sign-in…
            </p>
          )}
      </div>
    </div>
  );
};