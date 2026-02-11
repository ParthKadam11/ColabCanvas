    
import { getExistingShapes } from "./http"
import { eraseShapes} from "./eraser"
import { Shape } from "./utis";

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
                this.existingShapes.push(shape)
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

        this.existingShapes.map((shape)=>{
            if(shape.type=="rect"){
                this.ctx.strokeStyle="rgba(255, 255, 255)"
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(shape.x,shape.y,shape.width,shape.height)  
            }else if(shape.type==="circle"){
                this.ctx.strokeStyle="rgba(255, 255, 255)"
                this.ctx.lineWidth = 2;
                this.ctx.beginPath()
                this.ctx.arc(shape.centerX,shape.centerY,shape.radius,0,Math.PI*2)
                this.ctx.stroke()
                this.ctx.closePath()
            }else if(shape.type==="penline"){
                this.ctx.strokeStyle="rgba(255, 255, 255)"
                this.ctx.lineWidth = 2;
                this.ctx.beginPath()
                this.ctx.moveTo(shape.startX, shape.startY)
                this.ctx.lineTo(shape.endX, shape.endY)
                this.ctx.stroke()
                this.ctx.closePath()
            }else if(shape.type==="pencil"){
                if (!Array.isArray(shape.points) || shape.points.length < 2) return
                this.ctx.beginPath()
                this.ctx.strokeStyle="rgba(255, 255, 255)"
                this.ctx.lineWidth = 2;
                this.ctx.moveTo(shape.points[0].x, shape.points[0].y)
                for (let i = 1; i < shape.points.length; i++) {
                    this.ctx.lineTo(shape.points[i].x, shape.points[i].y)
                    this.ctx.stroke()
                }
                this.ctx.closePath()
            }
        })
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
        const getRelativePos = (e: MouseEvent) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left - this.pan.x) / this.zoom;
            const y = (e.clientY - rect.top - this.pan.y) / this.zoom;
            return { x, y };
        };

        this.handleMouseDown = (e: MouseEvent) => {
            this.clicked = true
            const pos = getRelativePos(e)
            this.startX = pos.x
            this.startY = pos.y
            if (this.selectedTool === "pencil") {
                this.currentPencilPoints = [{ x: pos.x, y: pos.y }]
            }
            if (this.selectedTool === "eraser") {
                this.eraseAtPoint(pos.x, pos.y)
            }
        }

        this.handleMouseUp = (e: MouseEvent) => {
            if (!this.clicked) return
            this.clicked = false
            const pos = getRelativePos(e)
            const width = pos.x - this.startX
            const height = pos.y - this.startY

            let shape: Shape | null = null

            if (this.selectedTool === "rect") {
                shape = {
                    type: "rect",
                    x: this.startX,
                    y: this.startY,
                    width,
                    height
                }
            } else if (this.selectedTool === "circle") {
                shape = {
                    type: "circle",
                    centerX: this.startX + width / 2,
                    centerY: this.startY + height / 2,
                    radius: Math.max(Math.abs(width), Math.abs(height)) / 2
                }
            } else if (this.selectedTool === "penline") {
                shape = {
                    type: "penline",
                    startX: this.startX,
                    startY: this.startY,
                    endX: pos.x,
                    endY: pos.y
                }
            } else if (this.selectedTool==="pencil"){
                if (this.currentPencilPoints && this.currentPencilPoints.length >= 2) {
                    shape = {
                        type:"pencil",
                        points:this.currentPencilPoints
                    }
                }
                this.currentPencilPoints = null
            }

            if (!shape) return

            this.existingShapes.push(shape)
            this.socket.send(JSON.stringify({
                type:"chat",
                message:JSON.stringify(shape),
                roomId:this.roomId
            }))

            this.clearCanvas()
        }

        this.handleMouseMove = (e: MouseEvent) => {
            if (!this.clicked) return;
            const pos = getRelativePos(e);
            const width = pos.x - this.startX;
            const height = pos.y - this.startY;


            if (this.selectedTool === "pencil") {
                if (!this.currentPencilPoints) {
                    this.currentPencilPoints = [{ x: pos.x, y: pos.y }];
                } else {
                    this.currentPencilPoints.push({ x: pos.x, y: pos.y });
                }
            }

            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.save();
            this.ctx.translate(this.pan.x, this.pan.y);
            this.ctx.scale(this.zoom, this.zoom);

            if (this.existingShapes && Array.isArray(this.existingShapes)) {
                this.existingShapes.forEach((shape) => {
                    if (shape.type == "rect") {
                        this.ctx.strokeStyle = "rgba(255, 255, 255)";
                        this.ctx.lineWidth = 2;
                        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
                    } else if (shape.type === "circle") {
                        this.ctx.strokeStyle = "rgba(255, 255, 255)";
                        this.ctx.lineWidth = 2;
                        this.ctx.beginPath();
                        this.ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
                        this.ctx.stroke();
                        this.ctx.closePath();
                    } else if (shape.type === "penline") {
                        this.ctx.strokeStyle = "rgba(255, 255, 255)";
                        this.ctx.lineWidth = 2;
                        this.ctx.beginPath();
                        this.ctx.moveTo(shape.startX, shape.startY);
                        this.ctx.lineTo(shape.endX, shape.endY);
                        this.ctx.stroke();
                        this.ctx.closePath();
                    } else if (shape.type === "pencil") {
                        if (!Array.isArray(shape.points) || shape.points.length < 2) return;
                        this.ctx.beginPath();
                        this.ctx.strokeStyle = "rgba(255, 255, 255)";
                        this.ctx.lineWidth = 2;
                        this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
                        for (let i = 1; i < shape.points.length; i++) {
                            this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
                        }
                        this.ctx.stroke();
                        this.ctx.closePath();
                    }
                });
            }

            this.ctx.strokeStyle = "rgba(255, 255, 255)";
            this.ctx.lineWidth = 2;
            if (this.selectedTool === "rect") {
                this.ctx.strokeRect(this.startX, this.startY, width, height);
            } else if (this.selectedTool === "circle") {
                const centerX = this.startX + width / 2;
                const centerY = this.startY + height / 2;
                const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();
            } else if (this.selectedTool === "penline") {
                this.ctx.beginPath();
                this.ctx.moveTo(this.startX, this.startY);
                this.ctx.lineTo(pos.x, pos.y);
                this.ctx.stroke();
                this.ctx.closePath();
            } else if (this.selectedTool === "pencil") {
                if (this.currentPencilPoints && this.currentPencilPoints.length >= 2) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = "rgba(255, 255, 255)";
                    this.ctx.lineWidth = 2;
                    this.ctx.lineCap = "round";
                    this.ctx.lineJoin = "round";
                    this.ctx.moveTo(this.currentPencilPoints[0].x, this.currentPencilPoints[0].y);
                    for (let i = 1; i < this.currentPencilPoints.length; i++) {
                        this.ctx.lineTo(this.currentPencilPoints[i].x, this.currentPencilPoints[i].y);
                    }
                    this.ctx.stroke();
                    this.ctx.closePath();
                }
            } else if (this.selectedTool === "eraser") {
                this.eraseAtPoint(pos.x, pos.y);
                this.ctx.restore();
                return;
            }
            this.ctx.restore();
        }

        this.canvas.addEventListener("mousedown", this.handleMouseDown)
        this.canvas.addEventListener("mouseup", this.handleMouseUp)
        this.canvas.addEventListener("mousemove", this.handleMouseMove)
    }    

    setSelectedTool(tool:Shape["type"]){
        this.selectedTool = tool
    }
}
