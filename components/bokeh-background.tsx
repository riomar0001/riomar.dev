'use client';

import { useEffect, useRef, useState } from 'react';

type Circle = {
  key: number;
  className: string;
  left: number;
  top: number;
  depth: number;
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
  const depths = [0.03, -0.02, 0.04, -0.025, 0.015];

  return Array.from({ length: count }, (_, i) => ({
    key: i,
    className: `bokeh-circle ${pick(sizes)} ${pick(COLORS)} ${pick(DELAYS)} absolute`,
    left: rand(5, 95),
    top: rand(5, 95),
    depth: depths[i % depths.length]
  }));
}

export default function BokehBackground() {
  const [circles, setCircles] = useState<Circle[] | null>(null);
  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseCurrent = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);
  const circlesRef = useRef<Circle[]>([]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const generated = generateCircles(isMobile);
    circlesRef.current = generated;
    setCircles(generated);
  }, []);

  useEffect(() => {
    if (!circles || window.innerWidth < 768) return;

    function onMouseMove(e: MouseEvent) {
      mouseTarget.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    function tick() {
      const lerp = 0.06;
      mouseCurrent.current.x += (mouseTarget.current.x - mouseCurrent.current.x) * lerp;
      mouseCurrent.current.y += (mouseTarget.current.y - mouseCurrent.current.y) * lerp;

      wrapperRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = circlesRef.current[i]?.depth ?? 0;
        const tx = mouseCurrent.current.x * d * window.innerWidth * 0.5;
        const ty = mouseCurrent.current.y * d * window.innerHeight * 0.5;
        el.style.transform = `translate(${tx}px, ${ty}px)`;
      });

      rafId.current = requestAnimationFrame(tick);
    }

    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, [circles]);

  if (!circles) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-x-clip overflow-y-visible">
      {circles.map(({ key, className, left, top }, i) => (
        // Outer wrapper receives parallax transform
        <div
          key={key}
          ref={(el) => { wrapperRefs.current[i] = el; }}
          className="absolute will-change-transform"
          style={{ left: `${left}%`, top: `${top}%` }}
        >
          {/* Inner div keeps the CSS float + pulse animation */}
          <div className={className} style={{ position: 'relative', left: 0, top: 0 }} />
        </div>
      ))}
    </div>
  );
}
