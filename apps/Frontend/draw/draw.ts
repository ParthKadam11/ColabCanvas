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
    type:"pencil",
    startX:number,
    startY:number,
    endX:number,
    endY:number
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


    constructor(canvas:HTMLCanvasElement,roomId:string,socket:WebSocket,handleMessage?:(event:MessageEvent)=>void){
        this.canvas=canvas
        this.ctx=canvas.getContext("2d")!
        this.existingShapes= []
        this.roomId=roomId
        this.socket=socket
        this.init()
        if(handleMessage) this.handleMessage=handleMessage
        this.initHandlers()
        this.clicked=false
        this.selectedTool="rect"
        this.startX=0
        this.startY=0
    
    
    }

    async init(){
        this.existingShapes = await getExistingShapes(this.roomId)
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
                this.ctx.strokeRect(shape.x,shape.y,shape.width,shape.height)  
            }else if(shape.type==="circle"){
                this.ctx.beginPath()
                this.ctx.arc(shape.centerX,shape.centerY,shape.radius,0,Math.PI*2)
                this.ctx.stroke()
                this.ctx.closePath()
            }
        })
    }

    initMouseHandler(){
        const getRelativePos = (e: MouseEvent) => {
            const rect = this.canvas.getBoundingClientRect()
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            }
        }

        const handleMouseDown = (e: MouseEvent) => {
            this.clicked = true
            const pos = getRelativePos(e)
            this.startX = pos.x
            this.startY = pos.y
        }

        const handleMouseUp = (e: MouseEvent) => {
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
            } else if (this.selectedTool === "pencil") {
                shape = {
                    type: "pencil",
                    startX: this.startX,
                    startY: this.startY,
                    endX: pos.x,
                    endY: pos.y
                }
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

        const handleMouseMove = (e: MouseEvent) => {
            if (!this.clicked) return
            const pos = getRelativePos(e)
            const width = pos.x - this.startX
            const height = pos.y - this.startY

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
            } else if (this.selectedTool === "pencil") {
                this.ctx.beginPath()
                this.ctx.moveTo(this.startX, this.startY)
                this.ctx.lineTo(pos.x, pos.y)
                this.ctx.stroke()
                this.ctx.closePath()
            }
        }

        this.canvas.addEventListener("mousedown", handleMouseDown)
        this.canvas.addEventListener("mouseup", handleMouseUp)
        this.canvas.addEventListener("mousemove", handleMouseMove)

        return () => {
            this.canvas.removeEventListener("mousedown", handleMouseDown)
            this.canvas.removeEventListener("mouseup", handleMouseUp)
            this.canvas.removeEventListener("mousemove", handleMouseMove)
        }
    }    

    setSelectedTool(tool:Shape["type"]){
        this.selectedTool = tool
    }
}
