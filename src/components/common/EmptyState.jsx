import { Icon } from '../icons/Icon';

export const EmptyState = ({ title, description, action, icon = 'file' }) => (
  <div className="card flex flex-col items-center px-8 py-14 text-center">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
      <Icon name={icon} className="h-6 w-6" />
    </div>
    <h3 className="text-base font-semibold text-slate-900">{title}</h3>
    {description && <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">{description}</p>}
    {action && <div className="mt-6">{action}</div>}
  </div>
);
