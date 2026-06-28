import { Icon } from '../icons/Icon';

const variantMap = {
  info:    { cls: 'alert-info',    icon: 'info'    },
  success: { cls: 'alert-success', icon: 'check'   },
  warning: { cls: 'alert-warning', icon: 'warning' },
  error:   { cls: 'alert-error',   icon: 'warning' },
};

export const Alert = ({ variant = 'info', children, className = '' }) => {
  if (!children) return null;
  const { cls, icon } = variantMap[variant] || variantMap.info;
  return (
    <div role="alert" className={`${cls} flex items-start gap-2.5 ${className}`}>
      <Icon name={icon} className="h-4 w-4 mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
};
