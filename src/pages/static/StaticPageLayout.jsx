export const StaticPageLayout = ({ eyebrow, title, description, children }) => (
  <div className="section-shell pt-12 sm:pt-16">
    {/* Header */}
    <div className="mx-auto max-w-2xl">
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
      {description && (
        <p className="mt-4 text-base leading-7 text-slate-600">{description}</p>
      )}
    </div>

    {/* Content */}
    <div className="mx-auto mt-10 max-w-2xl">
      <div className="card p-7 sm:p-8 prose-content">
        {children}
      </div>
    </div>
  </div>
);
