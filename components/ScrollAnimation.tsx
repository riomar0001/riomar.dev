'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'fade';
  delay?: number;
  threshold?: number;
  once?: boolean;
}

export function ScrollAnimation({ children, className = '', animation = 'fade-up', delay = 0, threshold = 0.1, once = true }: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      element.classList.add('scroll-visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Use requestAnimationFrame for smoother animation triggering
            requestAnimationFrame(() => {
              setTimeout(() => {
                entry.target.classList.add('scroll-visible');
              }, delay);
            });
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            entry.target.classList.remove('scroll-visible');
          }
        });
      },
      { threshold, rootMargin: '50px' }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay, threshold, once]);

  return (
    <div ref={ref} className={`scroll-animation scroll-${animation} ${className}`}>
      {children}
    </div>
  );
}
