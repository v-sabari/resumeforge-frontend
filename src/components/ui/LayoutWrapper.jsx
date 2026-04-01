import { cn } from '../../utils/helpers';

export const LayoutWrapper = ({ className = '', children }) => (
  <div className={cn('layout-wrapper', className)}>{children}</div>
);
