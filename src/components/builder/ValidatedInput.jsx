import { useState, useEffect, useRef } from 'react';

/**
 * PHASE-2c + 2f: ValidatedInput
 *
 * A wrapper around <input> that adds:
 *   • A programmatic label (htmlFor + id) — fixes the 57 unlabeled fields.
 *   • Inline validation on blur (email format, phone digits+length, URL format).
 *   • aria-describedby pointing at the error text element.
 *   • aria-invalid="true" when the field has a validation error.
 *   • Auto-prepends https:// to URL fields when missing.
 *
 * Validation rules:
 *   • email: must match a basic email regex (user@domain.tld).
 *   • phone: digits, +, spaces, dashes; 7-15 digits after stripping non-digits.
 *   • url: must start with http:// or https:// and have a valid domain.
 *
 * Per the brief: invalid values DO NOT block autosave (Phase 1 autosave
 * continues to fire), but they MUST block export. The export-blocking is
 * implemented in ExportPanel via a pre-export validation pass that reads the
 * same validation helpers exported below.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_DIGITS_RE = /\d/g;
const URL_RE = /^https?:\/\/[^\s]+\.[^\s]+/;

export const isValidEmail = (v) => !v || EMAIL_RE.test(v);
export const isValidPhone = (v) => {
  if (!v) return true;
  const digits = (v.match(PHONE_DIGITS_RE) || []).join('');
  if (digits.length < 7 || digits.length > 15) return false;
  // Allow digits, +, spaces, dashes, parentheses only
  return /^[0-9+\-\s()]+$/.test(v);
};
export const isValidUrl = (v) => !v || URL_RE.test(v);

/** Auto-prepend https:// to a URL string if it looks like a bare domain. */
export const normalizeUrl = (v) => {
  if (!v) return v;
  const trimmed = v.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  // Don't prepend if it's clearly not a URL (e.g. just text)
  if (/^[a-z0-9-]+(\.[a-z0-9-]+)+/i.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
};

export const validateField = (type, value) => {
  if (type === 'email' && !isValidEmail(value)) return 'Enter a valid email address.';
  if (type === 'tel'  && !isValidPhone(value)) return 'Enter a valid phone (7-15 digits, +/spaces/dashes allowed).';
  if (type === 'url'  && !isValidUrl(value))   return 'Enter a valid URL (e.g. https://example.com).';
  return '';
};

export const ValidatedInput = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  className = 'input',
  containerClassName = '',
  describedById,
  required = false,
}) => {
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  // Clear local error when the value changes externally (e.g. undo/redo,
  // autosave restore). The error will re-appear on next blur if still invalid.
  useEffect(() => {
    if (error && !validateField(type, value)) setError('');
  }, [value, type, error]);

  const handleBlur = (e) => {
    let v = e.target.value;
    if (type === 'url') {
      const normalized = normalizeUrl(v);
      if (normalized !== v) {
        v = normalized;
        onChange(v);
      }
    }
    const err = validateField(type, v);
    setError(err);
    onBlur?.(e);
  };

  const errorId = `${id}-error`;
  const isInvalid = Boolean(error);

  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="label" htmlFor={id}>
          {label}{required && <span className="text-error-600 ml-0.5" aria-hidden="true">*</span>}
        </label>
      )}
      <input
        ref={inputRef}
        id={id}
        type={type}
        className={className}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        aria-invalid={isInvalid}
        aria-describedby={isInvalid ? errorId : (describedById || undefined)}
      />
      {isInvalid && (
        <p id={errorId} className="text-xs text-error-600 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default ValidatedInput;
