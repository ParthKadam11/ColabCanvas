import { useMemo, useRef } from "react";

interface TextInputOverlayProps {
  x: number;
  y: number;
  value: string;
  zoom: number;
  pan: { x: number; y: number };
  textColor: string;
  textSize: number;
  onChange: (val: string) => void;
  onBlur: () => void;
  onEnter: () => void;
}

export function TextInputOverlay({
  x,
  y,
  value,
  zoom,
  pan,
  textColor,
  textSize,
  onChange,
  onBlur,
  onEnter,
}: TextInputOverlayProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const textWidth = useMemo(() => {
      if (typeof window !== "undefined") {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.font = `${textSize}px sans-serif`;
          return ctx.measureText(value || " ").width;
        }
      }
      return 0;
    }, [value, textSize]);

  return (
    <textarea
      ref={textareaRef}
      style={{
        left: `${x * zoom + pan.x}px`,
        top: `${y * zoom + pan.y}px`,
        minWidth: `${Math.max(textWidth + 24, textSize + 24)}px`,
        width: `${Math.max(textWidth + 24, textSize + 24)}px`,
        height: `${textSize + 8}px`,
        fontSize: `${textSize}px`,
        color: textColor,
      }}
      className="absolute z-30 bg-transparent rounded border-2 border-white px-1 py-0.5 outline-none resize-none box-border overflow-hidden"
      autoFocus
      value={value}
      onChange={e => onChange(e.target.value)}
      onBlur={onBlur}
      onKeyDown={e => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          onEnter();
        }
      }}
    />
  );
}
