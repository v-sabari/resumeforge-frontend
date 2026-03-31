export const EmptyState = ({ title, description, action }) => (
  <div className="card p-8 text-center">
    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-xl">✨</div>
    <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
    <p className="mt-2 text-sm text-slate-600">{description}</p>
    {action ? <div className="mt-6">{action}</div> : null}
  </div>
);
