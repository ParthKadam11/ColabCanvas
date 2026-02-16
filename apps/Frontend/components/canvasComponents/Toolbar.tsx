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
    <nav className="fixed top-2 left-1/2 -translate-x-1/2 flex w-full sm:w-auto justify-center items-center bg-white rounded-2xl shadow-lg border border-slate-200 z-40 p-2 sm:p-3 max-w-[92vw] sm:max-w-none mx-auto pointer-events-none">
      <ul className="flex flex-row gap-2 sm:gap-4 w-full sm:w-auto overflow-x-auto flex-nowrap">
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
          <li
            key={tool}
            className="pointer-events-auto flex flex-col items-center justify-center min-w-[44px] sm:min-w-[56px] text-black"
          >
            <IconButton
              activated={selectedTool === tool}
              icon={icon}
              onClick={() => setSelectedTool(tool as Shape)}
              aria-label={label}
            />
            <span className="text-[10px] sm:text-xs mt-0.5 sm:mt-1 select-none font-medium text-center">
              {label}
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
}