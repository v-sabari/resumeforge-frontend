import { useState } from 'react';
import { useResumeEditorContext } from '../context/ResumeEditorContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { ResumePreview } from '../components/builder/ResumePreview';
import { Icon } from '../components/icons/Icon';
import { UpsellModal } from '../components/icons/UpsellModal';
import { RESUME_TEMPLATES } from '../utils/constants';

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

    {/* Premium badge */}
    {locked && (
      <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
        <Icon name="crown" className="h-3 w-3" />
        Pro
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
 * TemplatesTab
 *
 * The dedicated "Templates" page inside the Builder. Shows a gallery of all
 * 20 templates with premium gating, plus a live resume preview that updates
 * instantly when a free template is selected. Premium templates trigger the
 * UpsellModal. All resume data (personalInfo, experience, etc.) is preserved
 * when switching templates — only `resume.template` changes.
 */
export const TemplatesTab = () => {
  const editor = useResumeEditorContext();
  const { resume, template, setTemplate, setSuccess, top } = editor;
  const { premium } = useAuth();
  const isPremium = premium?.isPremium;

  const [showUpsell, setShowUpsell] = useState(false);

  const handleSelect = (t) => {
    if (t.isPremium && !isPremium) {
      setShowUpsell(true);
      return;
    }
    setTemplate(t.id);
    setSuccess('');
  };

  const previewPanel = (
    <ResumePreview
      resume={{ ...resume, sectionsConfig: resume.sectionsConfig }}
      template={template}
      onScaleChange={(scale) => { top('layoutScale', scale); setSuccess(''); }}
    />
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">

      {/* ── Template gallery (50%) ─────────────────────────────── */}
      <div className="min-w-0 space-y-5">
        <div>
          <p className="kicker mb-1">Choose a template</p>
          <p className="text-sm text-ink-500">
            Select a template below. Your resume content is preserved when switching — only the layout changes.
            Premium templates require an upgrade.
          </p>
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
      </div>

      {/* ── Live preview (50%), sticky ───────────────────────────── */}
      <div className={[
        'flex flex-col gap-5',
        'lg:sticky lg:top-6',
        'lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1',
      ].join(' ')} style={{ scrollbarWidth: 'thin' }}>
        {previewPanel}
      </div>

      {/* Upsell modal */}
      <UpsellModal open={showUpsell} onClose={() => setShowUpsell(false)} />
    </div>
  );
};
