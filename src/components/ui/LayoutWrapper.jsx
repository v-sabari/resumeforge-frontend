import { cn } from '../../utils/helpers';
export const LayoutWrapper = ({ className = '', children }) => (
  <div className={cn('page-container', className)}>{children}</div>
);
