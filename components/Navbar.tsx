'use client';

import { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'Awards', href: '#awards' },
  { label: 'Certs', href: '#certifications' },
  { label: 'Contact', href: '#contact' }
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 z-20 border-b border-black/15 dark:border-white/15 bg-white/70 dark:bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="max-w-[1160px] mx-auto flex items-center justify-between gap-4 px-6 py-4">
        <a href="#top" className="font-mono text-[15px] tracking-wide font-medium shrink-0">
          riomar.dev_
        </a>

        {/* Desktop nav */}
        <div id="nav-links" className="hidden md:flex items-center gap-5 overflow-x-auto min-w-0">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="font-mono text-xs tracking-wider uppercase opacity-75 hover:opacity-100 whitespace-nowrap shrink-0"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="border border-black dark:border-white p-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            )}
          </button>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="md:hidden border border-black dark:border-white p-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          >
            {open ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-black/15 dark:border-white/15 bg-white/95 dark:bg-black/95">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block px-6 py-3.5 font-mono text-xs tracking-wider uppercase opacity-75 hover:opacity-100 border-b border-black/10 dark:border-white/10 last:border-b-0"
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
