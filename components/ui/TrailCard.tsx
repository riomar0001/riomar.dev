interface TrailCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function TrailCard({ children, className = '' }: TrailCardProps) {
  return (
    <div className={`relative trail-parent ${className}`}>
      {children}
      <svg className="trail-group absolute inset-0 w-full h-full pointer-events-none stroke-black dark:stroke-white">
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="trail-rect"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
