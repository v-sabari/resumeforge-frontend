import { useState } from 'react';
import { useResumeEditorContext } from '../../context/ResumeEditorContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Icon } from '../icons/Icon';
import { UpsellModal } from '../icons/UpsellModal';
import { RESUME_TEMPLATES } from '../../utils/constants';
import {
  FONT_FAMILY_OPTIONS,
  FONT_SIZE_STEP,
  MAX_FONT_SIZE,
  MIN_FONT_SIZE,
  DEFAULT_FONT_SIZE,
  normaliseFontFamily,
  normaliseFontSize,
  getFontSizeWarning,
  formatFontSizePt,
} from '../../utils/resumeTypography.js';

const TemplateCard = ({ template, active, locked, onSelect }) => (
  <button
    type="button"
    onClick={onSelect}
    className={[
      'group relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all',
      active
        ? 'border-primary-600 bg-primary-50 shadow-sm'
        : 'border-surface-200 bg-white hover:border-surface-300 hover:shadow-sm',
    ].join(' ')}
  >
    {/* Thumbnail placeholder */}
    <div
      className={[
        'flex h-24 w-full items-center justify-center rounded-lg text-xs font-medium transition-colors',
        active ? 'bg-primary-100 text-primary-700' : 'bg-surface-100 text-ink-400',
      ].join(' ')}
    >
      <Icon name="text" className="h-6 w-6 opacity-50" />
    </div>

    {/* Name */}
    <span className="text-sm font-semibold text-ink-800 leading-tight">
      {template.label}
    </span>

    {/* Premium indicator */}
    {locked && (
      <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
        <Icon name="lock" className="h-3 w-3" />
        Premium
      </span>
    )}

    {/* Selected indicator */}
    {active && (
      <span className="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600">
        <Icon name="check" className="h-3 w-3 text-white" />
      </span>
    )}

    {/* Lock overlay for premium */}
    {locked && !active && (
      <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-ink-950/0 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-1 rounded-lg bg-ink-950/80 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
          <Icon name="lock" className="h-3 w-3" />
          Upgrade to unlock
        </div>
      </div>
    )}
  </button>
);

/**
 * TemplatesPanel
 *
 * The left-hand content of the Builder's "Templates" tab. Shows a gallery
 * of all 20 templates with premium gating. Selecting a free template
 * immediately updates `resume.template` (via setTemplate) so the shared
 * preview re-renders with the new design; all resume content is preserved.
 * Premium templates trigger the UpsellModal for free users.
 *
 * PDF export already reads `resume.template`, and the template is persisted
 * with the resume on Save, so selection survives refresh and drives the
 * exported file without further wiring here.
 */
export const TemplatesPanel = () => {
  const editor = useResumeEditorContext();
  const { currentId, template, setTemplate, setSuccess, resume, setResume } = editor;
  const { premium } = useAuth();
  const isPremium = premium?.isPremium;

  const [showUpsell, setShowUpsell] = useState(false);

  const fontFamily = normaliseFontFamily(resume?.fontFamily);
  const fontSize   = normaliseFontSize(resume?.fontSize);

  // The control is bounded to the supported range, but an existing resume may
  // hold a value outside it (e.g. an old 8px = 6pt). We NEVER clamp or rewrite
  // that stored value — we only pin the slider's thumb into range and surface
  // the advisory warning; the badge always shows the true value.
  const sliderValue = Math.min(Math.max(fontSize, MIN_FONT_SIZE), MAX_FONT_SIZE);
  const sizeWarning = getFontSizeWarning(fontSize);

  const applyTypography = (patch, label) => {
    setResume((prev) => ({ ...prev, ...patch }));
    setSuccess(currentId
      ? `${label} — click Save changes to persist it.`
      : `${label}. Save to keep it.`);
  };

  const handleSelect = (t) => {
    if (t.isPremium && !isPremium) {
      setShowUpsell(true);
      return;
    }
    setTemplate(t.id);
    setSuccess(currentId ? 'Template applied — click Save changes to persist it.' : `Applied “${t.label}”. Save to keep it.`);
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="kicker mb-1">Choose a template</p>
        <p className="text-sm text-ink-500">
          Select a template below. Your resume content is preserved when switching — only the layout changes.
          Premium templates require an upgrade.
        </p>
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {RESUME_TEMPLATES.map((t) => {
          const active = t.id === template;
          const locked = t.isPremium && !isPremium;
          return (
            <TemplateCard
              key={t.id}
              template={t}
              active={active}
              locked={locked}
              onSelect={() => handleSelect(t)}
            />
          );
        })}
      </div>

      {/* Resume-only typography — affects the preview, PDF and DOCX text only.
          The application UI is never styled by these values (see
          utils/resumeTypography.js — the family CSS is generated there and
          scoped to `.resume-typography[data-font-family]`). */}
      <div className="rounded-xl border border-surface-200 bg-white p-4 space-y-4">
        <div>
          <p className="kicker mb-1">Typography</p>
          <p className="text-sm text-ink-500">
            Applies only to this resume’s preview and exported file — never to the app itself.
          </p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="resume-font-family" className="block text-xs font-semibold text-ink-700">
            Font family
          </label>
          <select
            id="resume-font-family"
            className="input"
            value={fontFamily}
            onChange={(e) => {
              const next = e.target.value;
              applyTypography(
                { fontFamily: next },
                `Font set to ${FONT_FAMILY_OPTIONS.find((f) => f.id === next)?.label || next}`,
              );
            }}
          >
            {FONT_FAMILY_OPTIONS.map((f) => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>
          <p className="text-[11px] text-ink-400">
            {FONT_FAMILY_OPTIONS.find((f) => f.id === fontFamily)?.description}
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="resume-font-size" className="block text-xs font-semibold text-ink-700">
              Base font size
            </label>
            <span className="rounded-full bg-surface-100 px-2 py-0.5 text-[11px] font-semibold text-ink-600">
              {formatFontSizePt(fontSize)}
            </span>
          </div>
          <input
            id="resume-font-size"
            type="range"
            className="w-full accent-primary-600"
            min={MIN_FONT_SIZE}
            max={MAX_FONT_SIZE}
            step={FONT_SIZE_STEP}
            value={sliderValue}
            aria-valuetext={`${fontSize.toFixed(1)} points`}
            aria-describedby={sizeWarning ? 'resume-font-size-warning' : undefined}
            onChange={(e) => {
              const next = normaliseFontSize(e.target.value);
              applyTypography({ fontSize: next }, `Font size set to ${formatFontSizePt(next)}`);
            }}
          />
          {sizeWarning && (
            <p
              id="resume-font-size-warning"
              role={sizeWarning.level === 'warn' ? 'status' : undefined}
              className={
                sizeWarning.level === 'warn'
                  ? 'text-[11px] font-medium text-amber-700'
                  : 'text-[11px] text-ink-400'
              }
            >
              {sizeWarning.message}
            </p>
          )}
          <div className="flex items-center justify-between text-[11px] text-ink-400">
            <span>{formatFontSizePt(MIN_FONT_SIZE)}</span>
            <button
              type="button"
              className="font-semibold text-primary-700 underline underline-offset-2 hover:text-primary-800"
              onClick={() => applyTypography(
                { fontFamily: 'template', fontSize: DEFAULT_FONT_SIZE },
                'Typography reset to template defaults',
              )}
            >
              Reset to template defaults
            </button>
            <span>{formatFontSizePt(MAX_FONT_SIZE)}</span>
          </div>
        </div>
      </div>

      {/* Premium upsell banner for free users */}
      {!isPremium && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <Icon name="crown" className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-amber-900">Unlock all 20 templates</p>
              <p className="mt-0.5 text-xs text-amber-700">
                Upgrade to Premium once for lifetime access to all 10 premium-exclusive templates and every other feature.
              </p>
              <button
                type="button"
                onClick={() => setShowUpsell(true)}
                className="mt-2 text-xs font-semibold text-amber-800 underline underline-offset-2 hover:text-amber-900"
              >
                Learn more
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upsell modal */}
      <UpsellModal open={showUpsell} onClose={() => setShowUpsell(false)} />
    </div>
  );
};
