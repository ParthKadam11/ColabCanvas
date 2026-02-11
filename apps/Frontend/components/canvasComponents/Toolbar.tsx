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
    <div className="fixed top-2 left-1/2 -translate-x-1/2 flex flex-wrap gap-3 p-3 m-2 pointer-events-none text-slate-900 bg-white rounded-full max-w-[92vw] shadow-lg border border-slate-200">
      {[{
        label: "Line",
        icon: <Ruler />,
        tool: "penline"
      }, {
        label: "Rectangle",
        icon: <RectangleHorizontal />,
        tool: "rect"
      }, {
        label: "Circle",
        icon: <Circle />,
        tool: "circle"
      }, {
        label: "Pencil",
        icon: <Pencil />,
        tool: "pencil"
      }, {
        label: "Text",
        icon: <Type />,
        tool: "text"
      }, {
        label: "Eraser",
        icon: <Eraser />,
        tool: "eraser"
      }].map(({ label, icon, tool }) => (
        <div
          key={tool}
          className="pointer-events-auto flex flex-col items-center justify-center min-w-[56px]"
        >
          <IconButton
            activated={selectedTool === tool}
            icon={icon}
            onClick={() => setSelectedTool(tool as Shape)}
            aria-label={label}
          />
          <span className="text-xs mt-1 select-none font-medium text-center">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}