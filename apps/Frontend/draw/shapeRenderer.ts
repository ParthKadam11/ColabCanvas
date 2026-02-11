import type { Shape } from "./utils";

export function renderShape(ctx: CanvasRenderingContext2D, shape: Shape) {
  if (shape.type === "rect") {
    ctx.strokeStyle = "rgba(255, 255, 255)";
    ctx.lineWidth = 2;
    ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
  } else if (shape.type === "circle") {
    ctx.strokeStyle = "rgba(255, 255, 255)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
  } else if (shape.type === "penline") {
    ctx.strokeStyle = "rgba(255, 255, 255)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(shape.startX, shape.startY);
    ctx.lineTo(shape.endX, shape.endY);
    ctx.stroke();
    ctx.closePath();
  } else if (shape.type === "pencil") {
    if (!Array.isArray(shape.points) || shape.points.length < 2) return;
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255, 255, 255)";
    ctx.lineWidth = 2;
    ctx.moveTo(shape.points[0].x, shape.points[0].y);
    for (let i = 1; i < shape.points.length; i++) {
      ctx.lineTo(shape.points[i].x, shape.points[i].y);
      ctx.stroke();
    }
    ctx.closePath();
  } else if (shape.type === "text") {
    ctx.save();
    const fontSize = typeof shape.size === "number" ? shape.size : 18;
    const fontColor = shape.color ? shape.color : "#000000";
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillStyle = fontColor;
    ctx.fillText(shape.text, shape.x, shape.y);
    ctx.restore();
  }
}
