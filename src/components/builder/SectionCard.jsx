export const SectionCard = ({ title, description, children, actions, eyebrow, id }) => (
  <section id={id} className="card scroll-mt-24 p-5 sm:p-6">
    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div>
        {eyebrow ? <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">{eyebrow}</p> : null}
        <h3 className="panel-title">{title}</h3>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p> : null}
      </div>
      {actions ? <div className="flex gap-2">{actions}</div> : null}
    </div>
    {children}
  </section>
);
