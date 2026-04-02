import { cn } from '../../utils/helpers';

const VARIANTS = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  ghost:     'btn-ghost',
  danger:    'btn-danger',
};

export const Button = ({ as: Tag = 'button', variant = 'primary', className = '', children, ...props }) => (
  <Tag className={cn(VARIANTS[variant] ?? VARIANTS.primary, className)} {...props}>
    {children}
  </Tag>
);
