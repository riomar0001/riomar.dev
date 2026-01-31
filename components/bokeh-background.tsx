"use client";

import { useState } from "react";

type Circle = {
  key: number;
  className: string;
  left: number;
  top: number;
};

function generateCircles(): Circle[] {
  const sizes = ["bokeh-lg", "bokeh-xl"];
  const colors = [
    "bokeh-green-1",
    "bokeh-green-2",
    "bokeh-green-3",
    "bokeh-teal-1",
  ];
  const delays = [
    "bokeh-delay-1",
    "bokeh-delay-2",
    "bokeh-delay-3",
    "bokeh-delay-4",
  ];

  return Array.from({ length: 5 }).map((_, i) => {
    const sizeIndex = Math.floor(Math.random() * sizes.length);
    const colorIndex = Math.floor(Math.random() * colors.length);
    const delayIndex = Math.floor(Math.random() * delays.length);
    const left = Math.random() * 80 + 10;
    const top = Math.random() * 80 + 10;

    return {
      key: i,
      className: `bokeh-circle ${sizes[sizeIndex]} ${colors[colorIndex]} ${delays[delayIndex]} absolute`,
      left,
      top,
    };
  });
}

export default function BokehBackground() {
  const [circles] = useState<Circle[]>(() => generateCircles());

  return (
    <div 
      className="pointer-events-none absolute inset-0 z-0 overflow-y-visible overflow-x-clip"
      suppressHydrationWarning
    >
      {circles.map((circle) => (
        <div
          key={circle.key}
          className={circle.className}
          suppressHydrationWarning
          style={{
            left: `${circle.left}%`,
            top: `${circle.top}%`,
          }}
        />
      ))}
    </div>
  );
}
