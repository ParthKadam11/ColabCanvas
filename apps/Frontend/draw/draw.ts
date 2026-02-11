import { getExistingShapes } from "./http"
import { eraseShapes} from "./eraser"
import { Shape } from "./utils";
import { renderShape } from "./shapeRenderer";
import { handleMouseDownFactory, handleMouseUpFactory, handleMouseMoveFactory } from "./drawMouseHandlers";

export class Draw{
public zoom: number = 1;
public pan: { x: number; y: number } = { x: 0, y: 0 };
private roomId:string
private canvas:HTMLCanvasElement;
private ctx:CanvasRenderingContext2D
private existingShapes:Shape[]
private clicked:boolean
private handleMessage:((event: MessageEvent) => void) | undefined
private selectedTool:Shape["type"]
private socket:WebSocket
private startX:number
private startY:number
private handleMouseDown: ((e: MouseEvent) => void) | null = null
private handleMouseUp: ((e: MouseEvent) => void) | null = null
private handleMouseMove: ((e: MouseEvent) => void) | null = null
private currentPencilPoints:{x:number;y:number}[] | null = null
private eraserSize:number = 18


constructor(canvas:HTMLCanvasElement,roomId:string,socket:WebSocket,handleMessage?:(event:MessageEvent)=>void){
    this.canvas=canvas
    this.ctx=canvas.getContext("2d")!
    this.existingShapes= []
    this.roomId=roomId
    this.socket=socket
    this.clicked=false
    this.selectedTool="rect"
    this.startX=0
    this.startY=0
    this.clearCanvas()
    this.init()
    if(handleMessage) this.handleMessage=handleMessage
    this.initHandlers()
}

async init(){
    this.existingShapes = await getExistingShapes(this.roomId)
    this.clearCanvas()
}

setZoomAndPan(zoom: number, pan: { x: number; y: number }) {
    this.zoom = zoom;
    this.pan = pan;
}

addTextShape(x: number, y: number, text: string, color: string, size: number) {
    const shape: Shape = { type: "text", x, y, text, color, size };
    this.existingShapes.push(shape);
    this.socket.send(JSON.stringify({
        type: "chat",
        message: JSON.stringify(shape),
        roomId: this.roomId
    }));
    this.clearCanvas();
}

destroy(){
if(this.handleMouseDown) {
        this.canvas.removeEventListener("mousedown", this.handleMouseDown)
    }
    if(this.handleMouseUp) {
        this.canvas.removeEventListener("mouseup", this.handleMouseUp)
    }
    if(this.handleMouseMove) {
        this.canvas.removeEventListener("mousemove", this.handleMouseMove)
    }
    if(this.handleMessage) {
        this.socket.removeEventListener("message", this.handleMessage)
    }
}

initHandlers(){
    this.handleMessage = (event: MessageEvent) => {
    const message = JSON.parse(event.data)

    if (message.type == "chat") {
        const parsedMessage = JSON.parse(message.message)
        const shape = parsedMessage.shape || parsedMessage
        if (shape?.type === "eraser") {
            this.existingShapes = eraseShapes(this.existingShapes, shape.x, shape.y, shape.size)
        } else if (shape?.type) {
            if (shape.type === "text") {
                if (typeof shape.color === "string" && typeof shape.size === "number") {
                    this.existingShapes.push(shape)
                }
            } else {
                this.existingShapes.push(shape)
            }
        }
        this.clearCanvas()
    }}
    
    this.socket.addEventListener("message", this.handleMessage)
}

clearCanvas(){
    this.ctx.setTransform(1, 0, 0, 1, 0, 0); 
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
    this.ctx.save();
    this.ctx.translate(this.pan.x, this.pan.y);
    this.ctx.scale(this.zoom, this.zoom);

    if (!this.existingShapes || !Array.isArray(this.existingShapes)) {
        this.ctx.restore();
        return
    }

    this.existingShapes.forEach((shape) => {
        renderShape(this.ctx, shape);
    });
    this.ctx.restore();
}

eraseAtPoint(x:number, y:number){
    const updatedShapes = eraseShapes(this.existingShapes, x, y, this.eraserSize)

    if (updatedShapes.length !== this.existingShapes.length) {
        this.existingShapes = updatedShapes
        this.socket.send(JSON.stringify({
            type:"chat",
            message:JSON.stringify({
                type:"eraser",
                x,
                y,
                size:this.eraserSize
            }),
            roomId:this.roomId
        }))
        this.clearCanvas()
    }
}

initMouseHandler(){
    this.handleMouseDown = handleMouseDownFactory(this);
    this.handleMouseUp = handleMouseUpFactory(this);
    this.handleMouseMove = handleMouseMoveFactory(this);

    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
}    

setSelectedTool(tool:Shape["type"]){
    this.selectedTool = tool
}
}
