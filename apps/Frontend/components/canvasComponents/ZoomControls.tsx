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
    <div className="absolute bottom-4 left-4 z-20 flex gap-2 text-black">
      <button
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
        className="px-2 py-1 bg-white rounded-full"
      >
        -
      </button>
      <input
        type="number"
        min={10}
        max={500}
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
        className="w-16 px-2 py-1 bg-white rounded-full text-center appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0 focus:outline-none"
      />
      <button
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
        className="px-2 py-1 bg-white rounded-full">
        +
      </button>
    </div>
  );
}
