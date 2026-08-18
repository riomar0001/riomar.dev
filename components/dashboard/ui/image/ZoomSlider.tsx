export const MIN_ZOOM = 1;
export const MAX_ZOOM = 3;

export function ZoomSlider({ zoom, onChange }: { zoom: number; onChange: (zoom: number) => void }) {
  return (
    <div className="mt-2 flex items-center gap-3">
      <span className="font-mono text-[11px] tracking-wider uppercase opacity-50">Zoom</span>
      <input
        type="range"
        min={MIN_ZOOM}
        max={MAX_ZOOM}
        step={0.05}
        value={zoom}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="h-1 flex-1 cursor-pointer accent-black dark:accent-white"
      />
      <span className="w-12 text-right font-mono text-[11px] tabular-nums opacity-60">{zoom.toFixed(2)}×</span>
    </div>
  );
}
