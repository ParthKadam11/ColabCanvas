import { useEffect, RefObject } from "react";
import { Draw } from "@/draw/draw";
import type { Shape } from "@/draw/utils";

export function useCanvasLogic({
  canvasRef,
  roomId,
  socket,
  token,
  selectedTool,
  zoom,
  pan,
  setZoom,
  setPan,
  setZoomInput,
  canvasSize,
  setCanvasSize,
  draw,
  setDraw,
}: {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  roomId: string;
  socket: WebSocket;
  token: string;
  selectedTool: Shape["type"];
  zoom: number;
  pan: { x: number; y: number };
  setZoom: (z: number) => void;
  setPan: (p: { x: number; y: number }) => void;
  setZoomInput: (s: string) => void;
  canvasSize: { width: number; height: number };
  setCanvasSize: (s: { width: number; height: number }) => void;
  draw: Draw | undefined;
  setDraw: (d: Draw) => void;
}) {

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!draw && canvas && roomId && token) {
      setDraw(new Draw(canvas, roomId, socket, undefined));
    }
  }, [draw, roomId, token, socket, canvasRef, setDraw]);

  useEffect(() => {
    if (draw) {
      draw.setSelectedTool(selectedTool);
      if (selectedTool !== "text") {
        draw.initMouseHandler();
      }
    }
  }, [selectedTool, draw]);

  useEffect(() => {
    if (draw) {
      draw.setZoomAndPan(zoom, pan);
      draw.clearCanvas();
    }
  }, [zoom, pan, draw, canvasSize]);

  useEffect(() => {
    setZoomInput(String(Math.round(zoom * 100)));
  }, [zoom, setZoomInput]);

  useEffect(() => {
    const handleResize = () => {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setCanvasSize]);

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
  }, [zoom, pan, draw, setZoom, setPan, canvasRef]);
}
