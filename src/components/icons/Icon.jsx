const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const Icon = ({ name, className = 'h-5 w-5' }) => {
  const paths = {
    dashboard: <><path d="M4 13h7V4H4z" /><path d="M13 20h7v-9h-7z" /><path d="M13 4h7v7h-7z" /><path d="M4 20h7v-5H4z" /></>,
    builder: <><path d="M4 20h16" /><path d="M6 16.5V4.8a.8.8 0 0 1 .8-.8H16l2 2v10.5a.8.8 0 0 1-.8.8H6.8a.8.8 0 0 1-.8-.8Z" /><path d="M14 4v3h3" /></>,
    pricing: <><path d="M12 3v18" /><path d="M17 7.5c0-1.9-2.2-3.5-5-3.5s-5 1.6-5 3.5 2 2.7 5 3.5 5 1.6 5 3.5-2.2 3.5-5 3.5-5-1.6-5-3.5" /></>,
    profile: <><path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="8" r="4" /></>,
    sparkles: <><path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8Z" /><path d="M5 16l.8 1.9L8 19l-2.2 1.1L5 22l-.8-1.9L2 19l2.2-1.1Z" /><path d="M19 14l.9 2L22 17l-2.1 1.1-.9 1.9-.9-1.9L16 17l2.1-1Z" /></>,
    file: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" /><path d="M14 3v5h5" /><path d="M9 13h6" /><path d="M9 17h6" /></>,
    export: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>,
    magic: <><path d="m15 4 1.5 3.5L20 9l-3.5 1.5L15 14l-1.5-3.5L10 9l3.5-1.5Z" /><path d="M4 20 20 4" /></>,
    check: <><path d="m20 6-11 11-5-5" /></>,
    warning: <><path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.3 4.8 2.8 18a1.5 1.5 0 0 0 1.3 2.2h15.8a1.5 1.5 0 0 0 1.3-2.2L13.7 4.8a1.5 1.5 0 0 0-2.6 0Z" /></>,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    trash: <><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="m19 6-1 14H6L5 6" /></>,
    arrowRight: <><path d="M5 12h14" /><path d="m13 5 7 7-7 7" /></>,
    lock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 1 1 8 0v3" /></>,
    bolt: <><path d="M13 2 4 14h6l-1 8 9-12h-6Z" /></>,
  };

  return (
    <svg {...iconProps} className={className} aria-hidden="true">
      {paths[name] || null}
    </svg>
  );
};
