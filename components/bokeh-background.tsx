'use client';

import { useSyncExternalStore, useMemo } from 'react';

type Circle = {
  key: number;
  className: string;
  left: number;
  top: number;
};

// Stable random values to avoid hydration mismatch
const stableRandoms = [
  { left: 15, top: 25, sizeIdx: 0, colorIdx: 0, delayIdx: 0 },
  { left: 75, top: 60, sizeIdx: 1, colorIdx: 1, delayIdx: 1 },
  { left: 45, top: 80, sizeIdx: 0, colorIdx: 2, delayIdx: 2 },
  { left: 85, top: 15, sizeIdx: 1, colorIdx: 3, delayIdx: 3 },
  { left: 25, top: 55, sizeIdx: 0, colorIdx: 1, delayIdx: 0 }
];

function generateCircles(isMobile: boolean): Circle[] {
  const sizes = isMobile ? ['bokeh-md', 'bokeh-lg'] : ['bokeh-lg', 'bokeh-xl'];
  const colors = ['bokeh-green-1', 'bokeh-green-2', 'bokeh-green-3', 'bokeh-teal-1'];
  const delays = ['bokeh-delay-1', 'bokeh-delay-2', 'bokeh-delay-3', 'bokeh-delay-4'];
  const count = isMobile ? 2 : 5;

  return stableRandoms.slice(0, count).map((r, i) => ({
    key: i,
    className: `bokeh-circle ${sizes[r.sizeIdx % sizes.length]} ${colors[r.colorIdx]} ${delays[r.delayIdx]} absolute`,
    left: r.left,
    top: r.top
  }));
}

// Hook to safely check if we're on mobile (client-side only)
function useIsMobile() {
  return useSyncExternalStore(
    () => () => {},
    () => window.innerWidth < 768,
    () => false // Server snapshot - assume desktop
  );
}

export default function BokehBackground() {
  const isMobile = useIsMobile();
  const circles = useMemo(() => generateCircles(isMobile), [isMobile]);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-x-clip overflow-y-visible">
      {circles.map((circle) => (
        <div
          key={circle.key}
          className={circle.className}
          style={{
            left: `${circle.left}%`,
            top: `${circle.top}%`
          }}
        />
      ))}
    </div>
  );
}
