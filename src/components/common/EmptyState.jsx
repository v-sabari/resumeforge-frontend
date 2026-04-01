import { Icon } from '../icons/Icon';

export const EmptyState = ({ title, description, action }) => (
  <div className="card flex flex-col items-center py-14 px-8 text-center">
    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
      <Icon name="file" className="h-6 w-6" />
    </div>
    <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">{description}</p>
    {action && <div className="mt-6">{action}</div>}
  </div>
);
