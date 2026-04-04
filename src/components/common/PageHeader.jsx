export const PageHeader = ({ eyebrow, title, description, actions }) => (
  <div className="page-header flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div>
      {eyebrow && <p className="kicker mb-1">{eyebrow}</p>}
      <h1 className="text-2xl font-display font-semibold text-ink-950 tracking-tight">{title}</h1>
      {description && <p className="mt-1.5 text-sm text-ink-400 max-w-xl">{description}</p>}
    </div>
    {actions && <div className="shrink-0 flex items-center gap-2">{actions}</div>}
  </div>
);
