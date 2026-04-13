import { memo } from 'react';

const icons = {
  logo: (p) => (
  <svg viewBox="0 0 64 64" fill="none" {...p}>
    {/* Background */}
    <rect x="2" y="2" width="60" height="60" rx="12" fill="#071A47" />

    {/* Main White G Shape */}
    <path
      d="
        M18 18
        H48
        V26
        H26
        V38
        H40
        V46
        H18
        V18
        Z
      "
      fill="#FFFFFF"
    />

    {/* Cyan Bottom Accent Bar */}
    <rect
      x="26"
      y="38"
      width="14"
      height="8"
      fill="#42B8F4"
    />

    {/* Cyan Dot */}
    <circle
      cx="42"
      cy="47"
      r="4.5"
      fill="#42B8F4"
    />
  </svg>
),
};

export const Icon = memo(({ name, className = 'h-5 w-5', ...rest }) => {
  const Comp = icons[name];
  if (!Comp) return null;

  const hasAccessibleLabel =
    typeof rest['aria-label'] === 'string' && rest['aria-label'].trim().length > 0;

  return (
    <Comp
      className={className}
      focusable="false"
      aria-hidden={hasAccessibleLabel ? undefined : true}
      {...rest}
    />
  );
});

Icon.displayName = 'Icon';