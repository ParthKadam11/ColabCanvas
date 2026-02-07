"use client";
import { useEffect, useRef, useState } from "react";
import { Draw } from "@/draw/draw";
import { ActiveUser } from "./ActiveUser";
import { Toolbar } from "./Toolbar";
import { BackIcon } from "./BackIcon";


export type Shape = "circle" | "rect" | "penline" | "pencil";

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
    <div className="absolute inset-0 overflow-hidden bg-[#1e1e1e] bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[length:14px_24px]">
      <BackIcon/>
      <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} className="block" />
      <ActiveUser roomId={roomId} token={token} />
      <Toolbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
    </div>
  );
}
