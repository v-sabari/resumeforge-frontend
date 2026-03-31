export const PageHeader = ({ eyebrow, title, description, actions }) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <div>
      {eyebrow ? <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">{eyebrow}</p> : null}
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
      {description ? <p className="mt-2 max-w-2xl text-sm text-slate-600">{description}</p> : null}
    </div>
    {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
  </div>
);
