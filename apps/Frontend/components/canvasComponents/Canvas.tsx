"use client";
import { useRef, useState } from "react";
import { Draw } from "@/draw/draw";
import { ActiveUser } from "./ActiveUser";
import { Toolbar } from "./Toolbar";
import { BackIcon } from "./BackIcon";
import type { Shape } from "@/draw/utils";
import { TextSettingsPanel } from "./TextSettingsPanel";
import { ZoomControls } from "./ZoomControls";
import { useCanvasLogic } from "@/draw/useCanvasLogic";
import { TextInputOverlay } from "./TextInputOverlay";

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
  const [selectedTool, setSelectedTool] = useState<Shape["type"]>("rect");
  const [textInput, setTextInput] = useState<{
    x: number;
    y: number;
    value: string;
  } | null>(null);
  const [draw, setDraw] = useState<Draw>();
  const [textColor, setTextColor] = useState<string>("#000000");
  const [textSize, setTextSize] = useState<number>(18);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoomInput, setZoomInput] = useState("100");
  const [canvasSize, setCanvasSize] = useState(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }));

  useCanvasLogic({
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
  });

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#1e1e1e] bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[length:14px_24px]">
      {selectedTool === "text" && (
        <TextSettingsPanel
          textColor={textColor}
          setTextColor={setTextColor}
          textSize={textSize}
          setTextSize={setTextSize}
        />
      )}
      <ZoomControls
        zoom={zoom}
        setZoom={setZoom}
        pan={pan}
        setPan={setPan}
        zoomInput={zoomInput}
        setZoomInput={setZoomInput}
        canvasRef={canvasRef}
      />
      <BackIcon />
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        {...(selectedTool === "text"
          ? {
              onClick: (e: React.MouseEvent<HTMLCanvasElement>) => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const rect = canvas.getBoundingClientRect();
                const x = (e.clientX - rect.left - pan.x) / zoom;
                const y = (e.clientY - rect.top - pan.y) / zoom;
                setTextInput({ x, y, value: "" });
              },
            }
          : {})}
      />
      {textInput && (
        <TextInputOverlay
          x={textInput.x}
          y={textInput.y}
          value={textInput.value}
          zoom={zoom}
          pan={pan}
          textColor={textColor}
          textSize={textSize}
          onChange={val => setTextInput({ ...textInput, value: val })}
          onBlur={() => {
            if (textInput.value.trim() && draw) {
              if (typeof draw.addTextShape === "function") {
                draw.addTextShape(textInput.x, textInput.y, textInput.value, textColor, textSize);
              }
            }
            setTextInput(null);
          }}
          onEnter={() => {
            if (textInput.value.trim() && draw) {
              if (typeof draw.addTextShape === "function") {
                draw.addTextShape(textInput.x, textInput.y, textInput.value, textColor, textSize);
              }
            }
            setTextInput(null);
          }}
        />
      )}
      <ActiveUser roomId={roomId} token={token} />
      <Toolbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
    </div>
  );
}
