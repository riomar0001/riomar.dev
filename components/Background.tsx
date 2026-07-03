export default function Background() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <svg width="100%" height="100%" className="absolute inset-0 opacity-[0.06] stroke-black dark:stroke-white">
        <defs>
          <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <svg
        viewBox="0 0 400 400"
        className="absolute -top-[120px] -right-[140px] w-[min(560px,80vw)] h-[min(560px,80vw)] opacity-[0.18] animate-rotate-slow stroke-black dark:stroke-white"
      >
        <polygon points="200,20 360,110 360,290 200,380 40,290 40,110" fill="none" stroke="currentColor" strokeWidth="1" />
        <polygon points="200,20 200,380" fill="none" stroke="currentColor" strokeWidth="1" />
        <polygon points="40,110 360,290" fill="none" stroke="currentColor" strokeWidth="1" />
        <polygon points="360,110 40,290" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="200" cy="200" r="120" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="0.5" />
      </svg>

      <svg
        viewBox="0 0 300 300"
        className="absolute -bottom-[100px] -left-[120px] w-[min(420px,70vw)] h-[min(420px,70vw)] opacity-[0.14] animate-rotate-slow-rev stroke-black dark:stroke-white"
      >
        <rect x="60" y="60" width="180" height="180" fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(15 150 150)" />
        <rect x="90" y="90" width="120" height="120" fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(45 150 150)" />
        <line x1="150" y1="0" x2="150" y2="300" stroke="currentColor" strokeWidth="0.5" />
        <line x1="0" y1="150" x2="300" y2="150" stroke="currentColor" strokeWidth="0.5" />
      </svg>

      <div className="absolute top-[30%] left-[8%] w-[5px] h-[5px] rounded-full bg-black dark:bg-white opacity-20 animate-drift" />
      <div className="absolute top-[65%] left-[88%] w-1 h-1 rounded-full bg-black dark:bg-white opacity-[0.16] animate-drift-2" />
      <div className="absolute top-[85%] left-[20%] w-1 h-1 rounded-full bg-black dark:bg-white opacity-[0.12] animate-drift-3" />
    </div>
  );
}
