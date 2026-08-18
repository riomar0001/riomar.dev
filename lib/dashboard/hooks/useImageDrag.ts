'use client';

import { useRef, useState } from 'react';

/** Pixels of image travel within which an axis snaps to dead centre. */
const SNAP_PX = 6;

const clampPct = (v: number) => Math.min(100, Math.max(0, v));

export function parsePosition(pos: string): { x: number; y: number } {
  const m = pos.match(/(-?[\d.]+)%\s+(-?[\d.]+)%/);
  return m ? { x: parseFloat(m[1]), y: parseFloat(m[2]) } : { x: 50, y: 50 };
}

/**
 * Drag-to-reposition for a cropped (object-cover) image preview.
 *
 * Dragging pans the focal point ("X% Y%" object-position) — which part of the
 * image stays visible when the frame crops it. Attach `frameRef` to the
 * overflow-hidden frame, `imgRef` to the img, and spread `handlers` on the frame.
 * `snap` reports which axes are currently centred so callers can draw guides.
 */
export function useImageDrag({
  position,
  zoom,
  enabled,
  onPositionChange
}: {
  position: string;
  zoom: number;
  enabled: boolean;
  onPositionChange?: (position: string) => void;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  // Pointer + focal point at drag start; deltas are applied against these.
  const drag = useRef<{ startX: number; startY: number; posX: number; posY: number } | null>(null);
  const [snap, setSnap] = useState({ x: false, y: false });

  function onPointerDown(e: React.PointerEvent) {
    if (!enabled) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const { x, y } = parsePosition(position);
    drag.current = { startX: e.clientX, startY: e.clientY, posX: x, posY: y };
  }

  function onPointerMove(e: React.PointerEvent) {
    const s = drag.current;
    const img = imgRef.current;
    const frame = frameRef.current;
    if (!s || !img || !frame || !img.naturalWidth) return;
    const rect = frame.getBoundingClientRect();
    // object-cover (× zoom): moving the focal point from 0% to 100% pans
    // across exactly the image's overflow beyond the frame on each axis.
    const scale = Math.max(rect.width / img.naturalWidth, rect.height / img.naturalHeight) * zoom;
    const overX = img.naturalWidth * scale - rect.width;
    const overY = img.naturalHeight * scale - rect.height;
    const dx = e.clientX - s.startX;
    const dy = e.clientY - s.startY;
    let x = overX > 0.5 ? clampPct(s.posX - (dx / overX) * 100) : s.posX;
    let y = overY > 0.5 ? clampPct(s.posY - (dy / overY) * 100) : s.posY;
    // Snap threshold is in actual image travel, so it feels the same at any zoom.
    const snapX = overX > 0.5 && Math.abs(((x - 50) / 100) * overX) <= SNAP_PX;
    const snapY = overY > 0.5 && Math.abs(((y - 50) / 100) * overY) <= SNAP_PX;
    if (snapX) x = 50;
    if (snapY) y = 50;
    setSnap({ x: snapX, y: snapY });
    onPositionChange?.(`${Math.round(x)}% ${Math.round(y)}%`);
  }

  function onPointerUp() {
    drag.current = null;
    setSnap({ x: false, y: false });
  }

  return {
    frameRef,
    imgRef,
    snap,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp
    }
  };
}
