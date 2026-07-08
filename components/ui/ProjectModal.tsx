'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { imageCropStyle } from '@/lib/image';

type Project = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  imagePosition?: string | null;
  imageZoom?: number | null;
  tags: string[];
  link?: string | null;
  github?: string | null;
};

export default function ProjectModal({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group/rm inline-flex items-center gap-1 font-mono text-[11px] opacity-70 hover:opacity-100 active:opacity-100 border-b border-transparent hover:border-current cursor-pointer transition-all self-start mb-[14px]"
      >
        Read more
        <span className="transition-transform duration-200 group-hover/rm:translate-x-1">&rarr;</span>
      </button>

      {mounted && open && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-black border border-black/20 dark:border-white/20 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center border border-black/20 dark:border-white/20 bg-white dark:bg-black font-mono text-base opacity-70 hover:opacity-100 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black active:scale-90 cursor-pointer transition-all"
            >
              &times;
            </button>

            {project.imageUrl && (
              <div className="w-full aspect-[16/9] overflow-hidden border-b border-black/15 dark:border-white/15">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  style={imageCropStyle(project.imagePosition, project.imageZoom, 'center top')}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-semibold tracking-tight mb-4">{project.title}</h3>
              <p className="text-sm leading-relaxed opacity-80 whitespace-pre-line mb-6">{project.description}</p>

              {project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[11px] opacity-60 border border-black/20 dark:border-white/20 px-2 py-0.5 leading-[18px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-black/15 dark:border-white/15 flex items-center gap-4">
                {project.github && project.github !== '#' && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-xs opacity-70 hover:opacity-100 border-b border-transparent hover:border-current transition-all"
                  >
                    <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor" aria-hidden="true">
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                    View on GitHub
                  </a>
                )}
                {project.link && project.link !== '#' && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-xs opacity-70 hover:opacity-100 border-b border-transparent hover:border-current transition-all"
                  >
                    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M6 3H3v10h10v-3M9.5 2.5h4v4M13 3L7 9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
