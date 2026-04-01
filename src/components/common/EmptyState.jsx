import { Icon } from '../icons/Icon';

export const EmptyState = ({ title, description, action }) => (
  <div className="card p-10 text-center">
    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[22px] bg-brand-50 text-brand-700">
      <Icon name="file" className="h-7 w-7" />
    </div>
    <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
    <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-600">{description}</p>
    {action ? <div className="mt-8 flex justify-center">{action}</div> : null}
  </div>
);
