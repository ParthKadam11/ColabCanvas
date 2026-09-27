import { Circle, Eraser, Pencil, RectangleHorizontal, Ruler, Type } from "lucide-react";
import { IconButton } from "../../../../packages/ui/src/IconButton";
export type Shape = "penline" | "rect" | "circle" | "pencil" | "eraser" | "text";

export function Toolbar({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: Shape;
  setSelectedTool: (s: Shape) => void;
}) {
  return (
    <nav className="pointer-events-none fixed top-[max(4.25rem,calc(env(safe-area-inset-top)+3.75rem))] left-1/2 z-40 flex w-full max-w-[92vw] -translate-x-1/2 justify-center md:top-[max(0.5rem,env(safe-area-inset-top))] md:w-auto md:max-w-none">
      <ul className="flex flex-nowrap items-center gap-1 overflow-x-auto rounded-2xl border border-zinc-700 bg-zinc-900 p-2 shadow-lg">
        {[
          { label: "Line", icon: <Ruler />, tool: "penline" },
          { label: "Rectangle", icon: <RectangleHorizontal />, tool: "rect" },
          { label: "Circle", icon: <Circle />, tool: "circle" },
          { label: "Pencil", icon: <Pencil />, tool: "pencil" },
          { label: "Text", icon: <Type />, tool: "text" },
          { label: "Eraser", icon: <Eraser />, tool: "eraser" },
        ].map(({ label, icon, tool }) => (
          <li
            key={tool}
            className="pointer-events-auto flex min-w-14 flex-col items-center justify-center"
          >
            <IconButton
              activated={selectedTool === tool}
              icon={icon}
              onClick={() => setSelectedTool(tool as Shape)}
              aria-label={label}
            />
            <span className="mt-1 text-xs font-medium text-zinc-400">{label}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
