export const SectionCard = ({ id, eyebrow, title, description, children, actions }) => (
  <div id={id} className="card p-5 scroll-mt-6">
    <div className="flex items-start justify-between gap-3 mb-4">
      <div>
        {eyebrow && <p className="kicker mb-0.5">{eyebrow}</p>}
        <h3 className="text-base font-semibold text-ink-950">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-ink-400">{description}</p>}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
    {children}
  </div>
);
