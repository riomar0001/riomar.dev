'use client';

import { useEffect, useState } from 'react';

type Circle = {
  key: number;
  className: string;
  left: number;
  top: number;
};

const SIZES = {
  mobile: ['bokeh-md', 'bokeh-lg'],
  desktop: ['bokeh-lg', 'bokeh-xl']
};

const COLORS = [
  'bokeh-green-1',
  'bokeh-green-2',
  'bokeh-green-3',
  'bokeh-teal-1'
];

const DELAYS = [
  'bokeh-delay-1',
  'bokeh-delay-2',
  'bokeh-delay-3',
  'bokeh-delay-4'
];

function rand(min = 0, max = 1) {
  return Math.random() * (max - min) + min;
}

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateCircles(isMobile: boolean): Circle[] {
  const count = isMobile ? 2 : 5;
  const sizes = isMobile ? SIZES.mobile : SIZES.desktop;

  return Array.from({ length: count }, (_, i) => ({
    key: i,
    className: `bokeh-circle ${pick(sizes)} ${pick(COLORS)} ${pick(DELAYS)} absolute`,
    left: rand(5, 95),
    top: rand(5, 95)
  }));
}

export default function BokehBackground() {
  const [circles, setCircles] = useState<Circle[] | null>(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCircles(generateCircles(isMobile));
  }, []);

  if (!circles) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-x-clip overflow-y-visible">
      {circles.map(({ key, className, left, top }) => (
        <div
          key={key}
          className={className}
          style={{ left: `${left}%`, top: `${top}%` }}
        />
      ))}
    </div>
  );
}
