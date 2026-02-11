"use client";
import { useEffect, useRef, useState } from "react";
import { Draw } from "@/draw/draw";
import { ActiveUser } from "./ActiveUser";
import { Toolbar } from "./Toolbar";
import { BackIcon } from "./BackIcon";

export type Shape = "circle" | "rect" | "penline" | "pencil" |"eraser";

export function Canvas({
  roomId,
  socket,
  token,
}: {
  roomId: string;
  socket: WebSocket;
  token: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Shape>("rect");
  const [draw, setDraw] = useState<Draw>();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  useEffect(() => {
    draw?.setSelectedTool(selectedTool);
  }, [selectedTool, draw]);

  useEffect(() => {
    if (canvasRef.current) {
      const drawing = new Draw(canvasRef.current, roomId, socket);
      drawing.initMouseHandler();
      setDraw(drawing);
      return () => {
        drawing.destroy();
      };
    }
  }, [roomId, socket, canvasRef]);

  const [canvasSize, setCanvasSize] = useState(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }));
  
  useEffect(() => {
    const handleResize = () => {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (draw) {
      draw.setZoomAndPan(zoom, pan);
      draw.clearCanvas();
    }
  }, [zoom, pan, draw, canvasSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleWheel = (e: WheelEvent) => {
      if (!draw) return;
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      const newZoom = Math.max(0.2, Math.min(zoom * zoomFactor, 3));
      
      const wx = (mouseX - pan.x) / zoom;
      const wy = (mouseY - pan.y) / zoom;
      
      const newPan = {
        x: mouseX - wx * newZoom,
        y: mouseY - wy * newZoom,
      };
      setZoom(newZoom);
      setPan(newPan);
    };
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", handleWheel);
  }, [zoom, pan, draw]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#1e1e1e] bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[length:14px_24px]">
      <div className="absolute bottom-4 left-4 z-20 flex gap-2 text-black">
        <button
          onClick={() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            const mouseX = rect.width / 2;
            const mouseY = rect.height / 2;
            const zoomFactor = 0.9;
            const newZoom = Math.max(0.2, zoom * zoomFactor);
            const wx = (mouseX - pan.x) / zoom;
            const wy = (mouseY - pan.y) / zoom;
            const newPan = {
              x: mouseX - wx * newZoom,
              y: mouseY - wy * newZoom,
            };
            setZoom(newZoom);
            setPan(newPan);
          }}
          className="px-2 py-1 bg-white rounded"
        >
          -
        </button>
        <input
          type="number"
          min={20}
          max={300}
          value={Math.round(zoom * 100)}
          onChange={e => {
            let val = Number(e.target.value);
            if (isNaN(val)) return;
            val = Math.max(20, Math.min(300, val));
            const newZoom = val / 100;
            // Keep center fixed
            const canvas = canvasRef.current;
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            const mouseX = rect.width / 2;
            const mouseY = rect.height / 2;
            const wx = (mouseX - pan.x) / zoom;
            const wy = (mouseY - pan.y) / zoom;
            const newPan = {
              x: mouseX - wx * newZoom,
              y: mouseY - wy * newZoom,
            };
            setZoom(newZoom);
            setPan(newPan);
          }}
          className="zoom-input w-16 px-2 py-1 bg-white rounded text-center"
        />
        <button
          onClick={() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            const mouseX = rect.width / 2;
            const mouseY = rect.height / 2;
            const zoomFactor = 1.1;
            const newZoom = Math.min(3, zoom * zoomFactor);
            const wx = (mouseX - pan.x) / zoom;
            const wy = (mouseY - pan.y) / zoom;
            const newPan = {
              x: mouseX - wx * newZoom,
              y: mouseY - wy * newZoom,
            };
            setZoom(newZoom);
            setPan(newPan);
          }}
          className="px-2 py-1 bg-white rounded"
        >
          +
        </button>
        <style jsx global>{`
          .zoom-input::-webkit-outer-spin-button,
          .zoom-input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          .zoom-input {
            -moz-appearance: textfield;
          }
        `}</style>
      </div>
      <BackIcon />
      <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height} />
      <ActiveUser roomId={roomId} token={token} />
      <Toolbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
    </div>
  );
}
