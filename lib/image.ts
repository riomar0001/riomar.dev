import type { CSSProperties } from 'react';

/**
 * Inline style for a cropped (object-cover) image with a saved focal point and zoom.
 *
 * Zoom is rendered as `scale(z)` with `transform-origin` equal to the focal
 * point — with object-position set to the same point, the position percentage
 * spans the image's full pannable overflow at any zoom level, so drag + zoom
 * compose exactly. The img must sit inside an `overflow-hidden` frame.
 */
export function imageCropStyle(
  position?: string | null,
  zoom?: number | null,
  fallbackPosition = '50% 50%'
): CSSProperties {
  const pos = position ?? fallbackPosition;
  return zoom && zoom > 1
    ? { objectPosition: pos, transform: `scale(${zoom})`, transformOrigin: pos }
    : { objectPosition: pos };
}
