'use client';

import { useImageDrag } from '@/lib/dashboard/hooks';
import { imageCropStyle } from '@/lib/image';

/**
 * The cropped preview frame. When `draggable`, pointer drags pan the image's
 * focal point and red guides appear as each axis snaps to centre; otherwise the
 * whole frame is a button that reopens the file picker.
 */
export function ImagePreview({
  src,
  frameClass,
  fit,
  grayscale,
  isPending,
  position,
  zoom,
  draggable,
  onPick,
  onPositionChange
}: {
  src: string;
  frameClass: string;
  fit: 'cover' | 'contain';
  grayscale: boolean;
  isPending?: boolean;
  position: string;
  zoom: number;
  draggable: boolean;
  onPick: () => void;
  onPositionChange?: (position: string) => void;
}) {
  const { frameRef, imgRef, snap, handlers } = useImageDrag({
    position,
    zoom,
    enabled: draggable,
    onPositionChange
  });

  return (
    <div
      ref={frameRef}
      role={draggable ? undefined : 'button'}
      tabIndex={draggable ? undefined : 0}
      onClick={draggable ? undefined : onPick}
      onKeyDown={draggable ? undefined : (e) => { if (e.key === 'Enter' || e.key === ' ') onPick(); }}
      {...handlers}
      title={draggable ? 'Drag to reposition' : 'Click to change'}
      className={`group relative block ${frameClass} overflow-hidden border border-black/20 dark:border-white/20 ${draggable ? 'cursor-grab touch-none select-none active:cursor-grabbing' : 'cursor-pointer'}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt=""
        draggable={false}
        style={imageCropStyle(position, zoom)}
        className={`h-full w-full ${fit === 'cover' ? 'object-cover' : 'object-contain'} ${grayscale ? 'grayscale transition-[filter] duration-500 group-hover:grayscale-0' : ''}`}
      />
      {/* Center guides while a drag is snapped: vertical line = horizontally centered, horizontal line = vertically centered */}
      {snap.x && <span className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-red-500" />}
      {snap.y && <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-red-500" />}
      {isPending && (
        <span className="absolute left-0 top-0 bg-black px-2 py-1 font-mono text-[10px] tracking-wider uppercase text-white dark:bg-white dark:text-black">
          Preview · uploads on save
        </span>
      )}
      {draggable ? (
        <span className="pointer-events-none absolute bottom-0 left-0 bg-black/60 px-2 py-1 font-mono text-[10px] tracking-wider uppercase text-white opacity-0 transition-opacity group-hover:opacity-100">
          Drag to reposition
        </span>
      ) : (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 font-mono text-[11px] tracking-wider uppercase text-white opacity-0 transition-all group-hover:bg-black/50 group-hover:opacity-100">
          Change image
        </span>
      )}
    </div>
  );
}
