import { Circle, Pencil, RectangleHorizontal, Ruler } from "lucide-react";
import type { Shape } from "./Canvas";
import { IconButton } from "../../../../packages/ui/src/IconButton";

export function Toolbar({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: Shape;
  setSelectedTool: (s: Shape) => void;
}) {
  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 flex flex-wrap gap-2 p-2 m-2 pointer-events-none text-slate-900 bg-white rounded-full max-w-[92vw]">
      <div className="pointer-events-auto">
        <IconButton activated={selectedTool === "penline"} icon={<Ruler />} onClick={()=>{setSelectedTool("penline")}}/>
      </div>
      <div className="pointer-events-auto">
        <IconButton activated={selectedTool === "rect"} icon={<RectangleHorizontal/>} onClick={()=>{setSelectedTool("rect")}}/>
      </div>
      <div className="pointer-events-auto">
        <IconButton activated={selectedTool === "circle"} icon={<Circle />} onClick={()=>{setSelectedTool("circle")}}/>
      </div>
      <div className="pointer-events-auto">
        <IconButton activated={selectedTool === "pencil"} icon={<Pencil />} onClick={()=>{setSelectedTool("pencil")}}/>
      </div>
    </div>
  );
}