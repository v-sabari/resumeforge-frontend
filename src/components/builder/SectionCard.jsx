export const SectionCard = ({ title, description, children, actions, eyebrow, id }) => (
  <section id={id} className="card scroll-mt-6 p-6">
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="kicker mb-1.5">{eyebrow}</p>}
        <h3 className="panel-title">{title}</h3>
        {description && <p className="mt-1.5 text-sm leading-6 text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
    {children}
  </section>
);
