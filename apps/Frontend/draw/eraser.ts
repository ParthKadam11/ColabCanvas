import { Shape } from "./utils"

export const eraseShapes = (shapes: Shape[], x: number, y: number, size: number) => {
    const radius = size / 2;
    const radiusSq = radius * radius;

    const isPointNear = (px: number, py: number) => {
        const dx = px - x;
        const dy = py - y;
        return (dx * dx + dy * dy) <= radiusSq;
    };

    const hitTest = (shape: Shape) => {
        if (shape.type === "rect") {
            const minX = Math.min(shape.x, shape.x + shape.width);
            const maxX = Math.max(shape.x, shape.x + shape.width);
            const minY = Math.min(shape.y, shape.y + shape.height);
            const maxY = Math.max(shape.y, shape.y + shape.height);
            return x >= minX - radius && x <= maxX + radius && y >= minY - radius && y <= maxY + radius;
        }
        if (shape.type === "circle") {
            const dx = x - shape.centerX;
            const dy = y - shape.centerY;
            return (dx * dx + dy * dy) <= (shape.radius + radius) * (shape.radius + radius);
        }
        if (shape.type === "penline") {
            return isPointNear(shape.startX, shape.startY) || isPointNear(shape.endX, shape.endY);
        }
        if (shape.type === "pencil") {
            return shape.points.some((pt) => isPointNear(pt.x, pt.y));
        }
        if (shape.type === "text") {
            return isPointNear(shape.x, shape.y);
        }
        return false;
    };

    return shapes.filter((shape) => !hitTest(shape));
}

export type { Shape };
