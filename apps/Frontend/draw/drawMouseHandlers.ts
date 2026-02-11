import type { Shape } from "./utils";
import type { Draw } from "./draw";
import { renderShape } from "./shapeRenderer";

export function getRelativePos(
  canvas: HTMLCanvasElement,
  pan: { x: number; y: number },
  zoom: number,
  e: MouseEvent,
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left - pan.x) / zoom;
  const y = (e.clientY - rect.top - pan.y) / zoom;
  return { x, y };
}

export function handleMouseDownFactory(draw: Draw) {
  return (e: MouseEvent) => {
    draw["clicked"] = true;
    const pos = getRelativePos(draw["canvas"], draw.pan, draw.zoom, e);
    draw["startX"] = pos.x;
    draw["startY"] = pos.y;
    if (draw["selectedTool"] === "pencil") {
      draw["currentPencilPoints"] = [{ x: pos.x, y: pos.y }];
    }
    if (draw["selectedTool"] === "eraser") {
      draw.eraseAtPoint(pos.x, pos.y);
    }
  };
}

export function handleMouseUpFactory(draw: Draw) {
  return (e: MouseEvent) => {
    if (!draw["clicked"]) return;
    draw["clicked"] = false;

    const pos = getRelativePos(draw["canvas"], draw.pan, draw.zoom, e);
    const width = pos.x - draw["startX"];
    const height = pos.y - draw["startY"];

    let shape: Shape | null = null;
    if (draw["selectedTool"] === "rect") {
      shape = {
        type: "rect",
        x: draw["startX"],
        y: draw["startY"],
        width,
        height,
      };
    } else if (draw["selectedTool"] === "circle") {
      shape = {
        type: "circle",
        centerX: draw["startX"] + width / 2,
        centerY: draw["startY"] + height / 2,
        radius: Math.max(Math.abs(width), Math.abs(height)) / 2,
      };
    } else if (draw["selectedTool"] === "penline") {
      shape = {
        type: "penline",
        startX: draw["startX"],
        startY: draw["startY"],
        endX: pos.x,
        endY: pos.y,
      };
    } else if (draw["selectedTool"] === "pencil") {
      if (
        draw["currentPencilPoints"] &&
        draw["currentPencilPoints"].length >= 2
      ) {
        shape = { type: "pencil", points: draw["currentPencilPoints"] };
      }
      draw["currentPencilPoints"] = null;
    }

    if (!shape) return;
    draw["existingShapes"].push(shape);
    draw["socket"].send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify(shape),
        roomId: draw["roomId"],
      }),
    );
    draw.clearCanvas();
  };
}

export function handleMouseMoveFactory(draw: Draw) {
  return (e: MouseEvent) => {
    if (!draw["clicked"]) return;
    const pos = getRelativePos(draw["canvas"], draw.pan, draw.zoom, e);
    const width = pos.x - draw["startX"];
    const height = pos.y - draw["startY"];

    if (draw["selectedTool"] === "pencil") {
      if (!draw["currentPencilPoints"]) {
        draw["currentPencilPoints"] = [{ x: pos.x, y: pos.y }];
      } else {
        draw["currentPencilPoints"].push({ x: pos.x, y: pos.y });
      }
    }
    draw["ctx"].setTransform(1, 0, 0, 1, 0, 0);
    draw["ctx"].clearRect(0, 0, draw["canvas"].width, draw["canvas"].height);
    draw["ctx"].save();
    draw["ctx"].translate(draw.pan.x, draw.pan.y);
    draw["ctx"].scale(draw.zoom, draw.zoom);

    if (draw["existingShapes"] && Array.isArray(draw["existingShapes"])) {
      draw["existingShapes"].forEach((shape: Shape) => {
        renderShape(draw["ctx"], shape);
      });
    }
    draw["ctx"].strokeStyle = "rgba(255, 255, 255)";
    draw["ctx"].lineWidth = 2;
    if (draw["selectedTool"] === "rect") {
      draw["ctx"].strokeRect(draw["startX"], draw["startY"], width, height);
    } else if (draw["selectedTool"] === "circle") {
      const centerX = draw["startX"] + width / 2;
      const centerY = draw["startY"] + height / 2;
      const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
      draw["ctx"].beginPath();
      draw["ctx"].arc(centerX, centerY, radius, 0, Math.PI * 2);
      draw["ctx"].stroke();
      draw["ctx"].closePath();
    } else if (draw["selectedTool"] === "penline") {
      draw["ctx"].beginPath();
      draw["ctx"].moveTo(draw["startX"], draw["startY"]);
      draw["ctx"].lineTo(pos.x, pos.y);
      draw["ctx"].stroke();
      draw["ctx"].closePath();
    } else if (draw["selectedTool"] === "pencil") {
      if (
        draw["currentPencilPoints"] &&
        draw["currentPencilPoints"].length >= 2
      ) {
        draw["ctx"].beginPath();
        draw["ctx"].strokeStyle = "rgba(255, 255, 255)";
        draw["ctx"].lineWidth = 2;
        draw["ctx"].lineCap = "round";
        draw["ctx"].lineJoin = "round";
        draw["ctx"].moveTo(
          draw["currentPencilPoints"][0].x,
          draw["currentPencilPoints"][0].y,
        );
        for (let i = 1; i < draw["currentPencilPoints"].length; i++) {
          draw["ctx"].lineTo(
            draw["currentPencilPoints"][i].x,
            draw["currentPencilPoints"][i].y,
          );
        }
        draw["ctx"].stroke();
        draw["ctx"].closePath();
      }
    } else if (draw["selectedTool"] === "eraser") {
      draw.eraseAtPoint(pos.x, pos.y);
      draw["ctx"].restore();
      return;
    }
    draw["ctx"].restore();
  };
}
