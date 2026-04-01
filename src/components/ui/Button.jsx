import { cn } from '../../utils/helpers';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
};

export const Button = ({
  as: Component = 'button',
  variant = 'primary',
  className = '',
  children,
  ...props
}) => (
  <Component className={cn(variants[variant] || variants.primary, className)} {...props}>
    {children}
  </Component>
);
