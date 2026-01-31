'use client';
import Image from 'next/image';

export default function ProfileImage() {
  return (
    <div className="animate-scale-in animate-on-load flex justify-center pl-0 lg:pl-20">
      <div className="relative flex items-center justify-center">
        {/* Breathing rings (shrink/grow effect) */}
        <div className="animate-ring-breathe absolute h-64 w-64 rounded-full border-2 border-emerald-400/50 sm:h-85 sm:w-85 md:h-72 md:w-72 lg:h-85 lg:w-85 dark:border-emerald-500/40" />
        <div className="animate-ring-breathe-slow absolute h-72 w-72 rounded-full border border-emerald-300/30 sm:h-100 sm:w-100 md:h-80 md:w-80 lg:h-100 lg:w-100 dark:border-emerald-600/25" />

        {/* Spinning dots container - dots rotate around the profile */}
        <div className="animate-spin-slow absolute h-64 w-64 sm:h-85 sm:w-85 md:h-72 md:w-72 lg:h-85 lg:w-85">
          <div className="absolute top-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50 sm:h-3 sm:w-3" />
          <div className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-teal-400 shadow-lg shadow-teal-400/50 sm:h-2.5 sm:w-2.5" />
        </div>

        <div className="animate-spin-reverse absolute h-56 w-56 sm:h-75 sm:w-75 md:h-64 md:w-64 lg:h-75 lg:w-75">
          <div className="absolute top-1/2 left-0 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-emerald-300 shadow-md shadow-emerald-300/50 sm:h-2 sm:w-2" />
          <div className="absolute top-1/2 right-0 h-2 w-2 -translate-y-1/2 rounded-full bg-teal-300 shadow-md shadow-teal-300/50 sm:h-2.5 sm:w-2.5" />
        </div>

        <div className="animate-spin-slower absolute h-68 w-68 sm:h-95 sm:w-95 md:h-76 md:w-76 lg:h-95 lg:w-95">
          <div className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-emerald-500/70 sm:top-4 sm:right-4 sm:h-2 sm:w-2" />
          <div className="absolute bottom-3 left-3 h-1 w-1 rounded-full bg-teal-500/70 sm:bottom-4 sm:left-4 sm:h-1.5 sm:w-1.5" />
        </div>

        {/* Main image container */}
        <div className="relative h-60 w-60 overflow-hidden rounded-full bg-linear-to-br from-emerald-400 via-teal-400 to-emerald-500 p-1.5 shadow-2xl shadow-emerald-500/30 sm:h-64 sm:w-64 lg:h-80 lg:w-80 dark:shadow-emerald-500/20">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
            {/* Placeholder icon - replace with actual image */}
            <Image src="/profile.jpg" alt="Profile Image" fill className="rounded-full border-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
