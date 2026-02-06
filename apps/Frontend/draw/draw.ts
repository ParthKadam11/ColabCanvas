import { getExistingShapes } from "./http"

type Shape={
    type:"rect"
    x:number
    y:number
    width:number
    height:number
} | {
    type:"circle"
    centerX:number
    centerY:number
    radius:number
} |{
    type:"penline",
    startX:number,
    startY:number,
    endX:number,
    endY:number
} |{
    type:"pencil",
    points:{x:number;y:number}[]
}


export class Draw{
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
            this.existingShapes.push(shape)
            this.clearCanvas()
        }}
        
        this.socket.addEventListener("message", this.handleMessage)
    }

    clearCanvas(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.ctx.fillStyle="rgba(0,0,0)"
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)

        if (!this.existingShapes || !Array.isArray(this.existingShapes)) {
            return
        }

        this.existingShapes.map((shape)=>{
            if(shape.type=="rect"){
                this.ctx.strokeStyle="rgba(255, 255, 255)"
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(shape.x,shape.y,shape.width,shape.height)  
            }else if(shape.type==="circle"){
                this.ctx.beginPath()
                this.ctx.arc(shape.centerX,shape.centerY,shape.radius,0,Math.PI*2)
                this.ctx.stroke()
                this.ctx.strokeStyle="rgba(255, 255, 255)"
                this.ctx.lineWidth = 2;
                this.ctx.closePath()
            }else if(shape.type==="penline"){
                this.ctx.beginPath()
                this.ctx.moveTo(shape.startX, shape.startY)
                this.ctx.lineTo(shape.endX, shape.endY)
                this.ctx.stroke()
                this.ctx.strokeStyle="rgba(255, 255, 255)"
                this.ctx.lineWidth = 2;
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
    }

    initMouseHandler(){
        const getRelativePos = (e: MouseEvent) => {
            const rect = this.canvas.getBoundingClientRect()
            const x= e.clientX - rect.left
            const y= e.clientY - rect.top

            return {x,y}
        }

        this.handleMouseDown = (e: MouseEvent) => {
            this.clicked = true
            const pos = getRelativePos(e)
            this.startX = pos.x
            this.startY = pos.y
            if (this.selectedTool === "pencil") {
                this.currentPencilPoints = [{ x: pos.x, y: pos.y }]
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
            if (!this.clicked) return
            const pos = getRelativePos(e)
            const width = pos.x - this.startX
            const height = pos.y - this.startY

            if (this.selectedTool === "pencil") {
                if (!this.currentPencilPoints) {
                    this.currentPencilPoints = [{ x: pos.x, y: pos.y }]
                    return
                }
                const lastPoint = this.currentPencilPoints[this.currentPencilPoints.length - 1]
                this.currentPencilPoints.push({ x: pos.x, y: pos.y })
                this.ctx.beginPath()
                this.ctx.strokeStyle="rgba(255, 255, 255)"
                this.ctx.lineWidth = 2;
                this.ctx.lineCap = "round"
                this.ctx.lineJoin = "round"
                this.ctx.moveTo(lastPoint.x, lastPoint.y)
                this.ctx.lineTo(pos.x, pos.y)
                this.ctx.stroke()
                this.ctx.closePath()
                return
            }

            this.clearCanvas()
            this.ctx.strokeStyle="rgba(255, 255, 255)"

            if (this.selectedTool === "rect") {
                this.ctx.strokeRect(this.startX, this.startY, width, height)
            } else if (this.selectedTool === "circle") {
                const centerX = this.startX + width / 2
                const centerY = this.startY + height / 2
                const radius = Math.max(Math.abs(width), Math.abs(height)) / 2
                this.ctx.beginPath()
                this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
                this.ctx.stroke()
                this.ctx.closePath()
            } else if (this.selectedTool === "penline") {
                this.ctx.beginPath()
                this.ctx.moveTo(this.startX, this.startY)
                this.ctx.lineTo(pos.x, pos.y)
                this.ctx.stroke()
                this.ctx.closePath()
            }
        }

        this.canvas.addEventListener("mousedown", this.handleMouseDown)
        this.canvas.addEventListener("mouseup", this.handleMouseUp)
        this.canvas.addEventListener("mousemove", this.handleMouseMove)
    }    

    setSelectedTool(tool:Shape["type"]){
        this.selectedTool = tool
    }
}
