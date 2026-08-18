'use client';

import { handleFilePick } from '@/lib/dashboard/api';
import { uploadBtnCls } from '../styles';
import { ImageDropzone } from './ImageDropzone';
import { ImagePreview } from './ImagePreview';
import { ZoomSlider } from './ZoomSlider';

/**
 * Large image picker shown at the top of a form. Picking a file only creates a
 * local preview (via handleFilePick → object URL); the actual upload is deferred
 * until the form's Save handler calls uploadFile. `isPending` surfaces that the
 * shown image is an unsaved preview.
 *
 * Pass `position` + `onPositionChange` to make the preview draggable: dragging
 * the image inside the frame sets its focal point ("X% Y%" object-position),
 * i.e. which part stays visible when the frame crops it. Pass `zoom` +
 * `onZoomChange` to also show a zoom slider (1–3×) below the preview.
 */
export function ImagePicker({
  label,
  value,
  isPending,
  onPick,
  onRemove,
  frameClass = 'aspect-[16/9] w-full',
  fit = 'cover',
  grayscale = false,
  position,
  onPositionChange,
  zoom,
  onZoomChange
}: {
  label?: string;
  value?: string | null;
  isPending?: boolean;
  onPick: (file: File, previewUrl: string) => void;
  onRemove: () => void;
  frameClass?: string;
  fit?: 'cover' | 'contain';
  grayscale?: boolean;
  position?: string | null;
  onPositionChange?: (position: string) => void;
  zoom?: number | null;
  onZoomChange?: (zoom: number) => void;
}) {
  const pick = () => handleFilePick(onPick);
  const activePosition = position ?? '50% 50%';
  const activeZoom = zoom && zoom > 1 ? zoom : 1;
  const draggable = !!onPositionChange && fit === 'cover';

  return (
    <div>
      {label && <label className="mb-2 block font-mono text-[11px] tracking-wider uppercase opacity-60">{label}</label>}

      {value ? (
        <ImagePreview
          src={value}
          frameClass={frameClass}
          fit={fit}
          grayscale={grayscale}
          isPending={isPending}
          position={activePosition}
          zoom={activeZoom}
          draggable={draggable}
          onPick={pick}
          onPositionChange={onPositionChange}
        />
      ) : (
        <ImageDropzone frameClass={frameClass} onPick={pick} />
      )}

      {value && (
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <div className="flex items-center gap-3">
            <button type="button" onClick={pick} className={uploadBtnCls}>Change</button>
            <button type="button" onClick={onRemove} className="font-mono text-[11px] uppercase tracking-wider text-red-500 hover:underline">
              Remove
            </button>
          </div>
          {draggable && (
            <span className="font-mono text-[11px] tracking-wider uppercase opacity-40">
              Drag image to reposition
            </span>
          )}
        </div>
      )}

      {value && draggable && onZoomChange && <ZoomSlider zoom={activeZoom} onChange={onZoomChange} />}
    </div>
  );
}
