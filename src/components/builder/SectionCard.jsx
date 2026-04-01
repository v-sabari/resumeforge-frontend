export const SectionCard = ({ title, description, children, actions, eyebrow, id }) => (
  <section id={id} className="card scroll-mt-24 p-6">
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">{eyebrow}</p> : null}
        <h3 className="panel-title">{title}</h3>
        {description ? <p className="mt-2 text-sm leading-7 text-slate-500">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
    {children}
  </section>
);
