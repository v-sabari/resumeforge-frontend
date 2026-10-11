import { useMemo } from 'react';

const SIZES = {
  sm: { box: 28, ring: 10, dot: 4, core: 3 },
  md: { box: 44, ring: 16, dot: 5, core: 4 },
  lg: { box: 64, ring: 22, dot: 7, core: 6 },
};

const DOT_COUNT = 10;
const INTERVAL = 0.14;

export const OrbitalBlink = ({ size = 'md', className = '' }) => {
  const s = SIZES[size] || SIZES.md;
  const center = s.box / 2;

  const dots = useMemo(
    () =>
      Array.from({ length: DOT_COUNT }, (_, i) => {
        const angle = (i / DOT_COUNT) * 360 - 90;
        const rad = (angle * Math.PI) / 180;
        const x = center + s.ring * Math.cos(rad);
        const y = center + s.ring * Math.sin(rad);
        return { x, y, delay: i * INTERVAL };
      }),
    [center, s.ring]
  );

  return (
    <div
      className={`orbital-blink ${className}`}
      style={{ width: s.box, height: s.box }}
      role="status"
      aria-label="Loading"
    >
      {/* Orbital ring trace */}
      <div
        className="orbital-ring"
        style={{
          width: s.ring * 2,
          height: s.ring * 2,
          top: center - s.ring,
          left: center - s.ring,
        }}
      />

      {/* Satellite dots */}
      {dots.map((d, i) => (
        <div
          key={i}
          className="orbital-dot"
          style={{
            width: s.dot,
            height: s.dot,
            top: d.y - s.dot / 2,
            left: d.x - s.dot / 2,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}

      {/* Central core */}
      <div
        className="orbital-core"
        style={{
          width: s.core,
          height: s.core,
          top: center - s.core / 2,
          left: center - s.core / 2,
        }}
      />

      {/* Outer glow halo */}
      <div
        className="orbital-halo"
        style={{
          width: s.ring * 2 + s.dot * 2,
          height: s.ring * 2 + s.dot * 2,
          top: center - (s.ring + s.dot),
          left: center - (s.ring + s.dot),
        }}
      />
    </div>
  );
};
