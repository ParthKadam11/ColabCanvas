export function calculateZoomAndPan(
    zoom: number,
    pan: { x: number; y: number },
    newZoom: number,
    mouseX: number,
    mouseY: number
): { zoom: number; pan: { x: number; y: number } } {
    const wx = (mouseX - pan.x) / zoom;
    const wy = (mouseY - pan.y) / zoom;
    const newPan = {
        x: mouseX - wx * newZoom,
        y: mouseY - wy * newZoom,
    };
    return { zoom: newZoom, pan: newPan };
}

export type Shape = {
    type: "rect"
    x: number
    y: number
    width: number
    height: number
} | {
    type: "circle"
    centerX: number
    centerY: number
    radius: number
} | {
    type: "penline"
    startX: number
    startY: number
    endX: number
    endY: number
} | {
    type: "pencil"
    points: { x: number; y: number }[]
} | {
    type: "eraser"
    x: number
    y: number
    size: number
} | {
    type: "text",
    x: number,
    y: number,
    text: string,
    color?: string,
    size?: number
}