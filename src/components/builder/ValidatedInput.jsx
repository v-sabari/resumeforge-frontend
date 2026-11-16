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
 * Validation rules live in src/utils/resumeValidation.js (the single source
 * of truth shared with the editor, preview, save payload and export gate).
 * Per the brief: invalid values DO NOT block autosave (Phase 1 autosave
 * continues to fire), but they MUST block export. The export-blocking is
 * implemented in ExportPanel via validateResume().
 */

export {
  EMAIL_RE,
  URL_RE,
  isValidEmail,
  isValidPhone,
  isValidUrl,
  normalizeUrl,
  validateField,
} from '../../utils/resumeValidation.js';

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
