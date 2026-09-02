export const EmptyState = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    {icon && (
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-100 text-ink-300">
        {icon}
      </div>
    )}
    <h3 className="text-base font-semibold text-ink-700">{title}</h3>
    {description && <p className="mt-1 text-sm text-ink-400 max-w-sm">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);
