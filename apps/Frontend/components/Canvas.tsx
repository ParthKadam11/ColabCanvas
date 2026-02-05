"use client";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, PenLineIcon, RectangleHorizontal } from "lucide-react";
import { Draw } from "@/draw/draw";

type Shape = "circle" | "rect" | "Penline";

export function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Shape>("rect");
  const [draw, setDraw] = useState<Draw>();

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

  return (
    <div className="overflow:hidden">
      <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
      <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
    </div>
  );
}

function Topbar({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: Shape;
  setSelectedTool: (s: Shape) => void;
}) {
  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 flex gap-2 p-2 text-white pointer-events-none">
      <div className="pointer-events-auto">
        <IconButton activated={selectedTool === "Penline"} icon={<PenLineIcon />} onClick={()=>{setSelectedTool("Penline")}}/>
      </div>
      <div className="pointer-events-auto">
        <IconButton activated={selectedTool === "rect"} icon={<RectangleHorizontal/>} onClick={()=>{setSelectedTool("rect")}}/>
      </div>
      <div className="pointer-events-auto">
        <IconButton activated={selectedTool === "circle"} icon={<Circle />} onClick={()=>{setSelectedTool("circle")}}/>
      </div>
    </div>
  );
}
