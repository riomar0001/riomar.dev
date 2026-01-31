"use client";

import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="mx-auto max-w-5xl py-4">
        {/* Liquid Glass Container */}
        <nav className="liquid-glass backdrop-blur- relative flex items-center justify-between rounded-2xl px-5 py-3">
          {/* Gradient border overlay */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/20 dark:border-white/10" />
          <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" />

          {/* Logo */}
          <a
            href="#"
            className="relative z-10 text-[15px] font-semibold tracking-tight text-neutral-800 transition-all duration-300 hover:text-neutral-600 dark:text-white dark:hover:text-neutral-300"
          >
            riomar.dev
          </a>

          {/* Navigation */}
          <div className="flex items-center gap-1">
            <ul className="hidden items-center gap-0.5 sm:flex">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="relative rounded-xl px-4 py-2 text-[13px] font-medium text-neutral-600 transition-all duration-300 hover:bg-white/50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Divider */}
            <div className="mx-2 hidden h-5 w-px bg-neutral-300/50 dark:bg-white/10 sm:block" />

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
