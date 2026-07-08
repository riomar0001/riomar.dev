'use client';
import { useState } from 'react';
import Typewriter from '@/components/ui/Typewriter';
import { imageCropStyle } from '@/lib/image';

type PersonalInfo = { name: string; tagline: string; photoUrl?: string | null; photoPosition?: string | null; photoZoom?: number | null };

export default function Hero({ personalInfo }: { personalInfo: PersonalInfo }) {
  const [nameComplete, setNameComplete] = useState(false);

  const words = personalInfo.name.trim().split(/\s+/);
  const nameLines = words.length > 1 ? [words.slice(0, -1).join(' '), words[words.length - 1]] : [words[0] ?? ''];

  return (
    <div id="top" className="relative z-10 border-b border-black/15 dark:border-white/15">
      <div className="max-w-[1160px] mx-auto w-full px-6 pt-[120px] pb-20">
        <div className="flex items-start gap-20 flex-wrap md:flex-nowrap">
          {/* Image */}
          <div className="w-full md:w-[240px] md:h-[280px] shrink-0 overflow-hidden animate-fade-in-up">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={personalInfo.photoUrl ?? '/profile.jpg'}
              alt={personalInfo.name}
              style={imageCropStyle(personalInfo.photoPosition, personalInfo.photoZoom, 'center top')}
              className="w-full h-auto md:h-full object-cover grayscale hover:grayscale-0 transition-[filter] duration-500"
            />
          </div>

          {/* Text */}
          <div className="flex flex-col justify-between gap-8 flex-1 md:pt-2">
            <div>
              <div className="font-mono text-xs tracking-widest uppercase opacity-60 mb-5 flex items-center gap-2.5 animate-fade-in-up">
                <span className="w-[7px] h-[7px] bg-black dark:bg-white inline-block animate-blink" />
                Available for opportunities
              </div>
              <h1 className="text-[24px] sm:text-5xl md:text-6xl lg:text-[68px] leading-[0.98] font-bold tracking-tight animate-fade-in-up delay-1">
                <Typewriter text={nameLines.join('\n').toUpperCase()} speed={60} delay={400} onComplete={() => setNameComplete(true)} />
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 animate-fade-in-up delay-3">
              <p className="text-base max-w-[480px] opacity-75 leading-relaxed sm:h-[84px]">
                {nameComplete && <Typewriter text={personalInfo.tagline} speed={28} />}
              </p>
              <a
                href="#work"
                className="shrink-0 border border-black dark:border-white px-6 py-3 font-mono text-xs tracking-wider uppercase whitespace-nowrap hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
              >
                View Work &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
