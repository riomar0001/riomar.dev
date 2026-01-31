'use client';

export default function ScrollIndication() {
  return (
    <div className="animate-fade-in animate-on-load absolute left-1/2 hidden -translate-x-1/2 delay-700 sm:block lg:bottom-20">
      <a
        href="#about"
        className="group flex flex-col items-center gap-2 text-neutral-400 transition-colors duration-300 hover:text-neutral-600 dark:text-neutral-600 dark:hover:text-neutral-400"
        aria-label="Scroll to about"
      >
        <span className="text-[10px] font-medium tracking-widest uppercase">Scroll</span>
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-neutral-300 pt-2 dark:border-neutral-700">
          <span className="animate-gentle-float h-2 w-1 rounded-full bg-neutral-400 dark:bg-neutral-500" />
        </div>
      </a>
    </div>
  );
}
