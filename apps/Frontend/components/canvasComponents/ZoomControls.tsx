import React from "react";
import { calculateZoomAndPan } from "@/draw/utils";

export function ZoomControls({
  zoom,
  setZoom,
  pan,
  setPan,
  zoomInput,
  setZoomInput,
  canvasRef,
}: {
  zoom: number;
  setZoom: (z: number) => void;
  pan: { x: number; y: number };
  setPan: (p: { x: number; y: number }) => void;
  zoomInput: string;
  setZoomInput: (s: string) => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}) {
  return (
    <div className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))] z-20 flex items-center gap-1 rounded-2xl border border-zinc-700 bg-zinc-900 p-1 text-zinc-100 shadow-lg">
      <button
        type="button"
        aria-label="Zoom out"
        onClick={() => {
          const val = Math.max(10, Math.round(zoom * 100) - 10);
          const newZoom = val / 100;
          const canvas = canvasRef.current;
          if (!canvas) return;
          const rect = canvas.getBoundingClientRect();
          const mouseX = rect.width / 2;
          const mouseY = rect.height / 2;
          const { zoom: z, pan: p } = calculateZoomAndPan(
            zoom,
            pan,
            newZoom,
            mouseX,
            mouseY
          );
          setZoom(z);
          setPan(p);
        }}
        className="grid size-8 place-items-center rounded-xl text-sm hover:bg-zinc-800"
      >
        -
      </button>
      <input
        type="number"
        min={10}
        max={500}
        aria-label="Zoom percent"
        value={zoomInput}
        onChange={(e) => {
          setZoomInput(e.target.value);
        }}
        onBlur={() => {
          let val = Number(zoomInput);
          if (isNaN(val)) val = 100;
          val = Math.max(10, Math.min(500, val));
          const newZoom = val / 100;
          const canvas = canvasRef.current;
          if (!canvas) return;
          const rect = canvas.getBoundingClientRect();
          const mouseX = rect.width / 2;
          const mouseY = rect.height / 2;
          const { zoom: z, pan: p } = calculateZoomAndPan(
            zoom,
            pan,
            newZoom,
            mouseX,
            mouseY
          );
          setZoom(z);
          setPan(p);
          setZoomInput(String(val));
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            let val = Number(zoomInput);
            if (isNaN(val)) val = 100;
            val = Math.max(10, Math.min(500, val));
            const newZoom = val / 100;
            const canvas = canvasRef.current;
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            const mouseX = rect.width / 2;
            const mouseY = rect.height / 2;
            const { zoom: z, pan: p } = calculateZoomAndPan(
              zoom,
              pan,
              newZoom,
              mouseX,
              mouseY
            );
            setZoom(z);
            setPan(p);
            setZoomInput(String(val));
          }
        }}
        className="w-14 bg-transparent px-2 py-1 text-center text-sm tabular-nums appearance-none focus:outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        aria-label="Zoom in"
        onClick={() => {
          const val = Math.min(500, Math.round(zoom * 100) + 10);
          const newZoom = val / 100;
          const canvas = canvasRef.current;
          if (!canvas) return;
          const rect = canvas.getBoundingClientRect();
          const mouseX = rect.width / 2;
          const mouseY = rect.height / 2;
          const { zoom: z, pan: p } = calculateZoomAndPan(
            zoom,
            pan,
            newZoom,
            mouseX,
            mouseY
          );
          setZoom(z);
          setPan(p);
        }}  
        className="grid size-8 place-items-center rounded-xl text-sm hover:bg-zinc-800">
        +
      </button>
    </div>
  );
}
