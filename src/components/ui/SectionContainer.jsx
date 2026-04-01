import { cn } from '../../utils/helpers';

export const SectionContainer = ({ id, className = '', children }) => (
  <section id={id} className={cn('section-shell', className)}>
    {children}
  </section>
);
