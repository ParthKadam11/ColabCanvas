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
}