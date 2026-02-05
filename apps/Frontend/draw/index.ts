import axios from "axios"
import { HTTP_BACKEND } from "@/config";

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
}

export async function initDraw(
    canvas: HTMLCanvasElement,
    roomId: string,
    socket: WebSocket,
) {
    const ctx =canvas.getContext("2d")
    
    const existingShapes: Shape[] = await getExistingShapes(roomId)

    if(!ctx){
        return 
    }

    const getRelativePos = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect()
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
    }

    const handleMessage = (event: MessageEvent) => {
        const message = JSON.parse(event.data)

        if (message.type == "chat") {
            const parsedMessage = JSON.parse(message.message)
            const shape = parsedMessage.shape || parsedMessage
            existingShapes.push(shape)
            clearCanvas(existingShapes,ctx,canvas)
        }
    }

    socket.removeEventListener("message", handleMessage)
    socket.addEventListener("message", handleMessage)

    clearCanvas(existingShapes,ctx,canvas)
    let clicked=false
    let startX=0
    let startY=0

    const handleMouseDown = (e: MouseEvent) => {
        clicked =true
        const pos = getRelativePos(e)
        startX=pos.x
        startY=pos.y
    }

    const handleMouseUp = (e: MouseEvent) => {
        clicked = false
        const pos = getRelativePos(e)
        const width= pos.x-startX
        const height= pos.y-startY
        const shape:Shape={
            type:"rect",
            x:startX,
            y:startY,
            width:width,
            height:height
        }

        existingShapes.push(shape)
        socket.send(JSON.stringify({
            type:"chat",
            message:JSON.stringify(shape),
            roomId
        }))
        
        clearCanvas(existingShapes,ctx,canvas)
    }
    
    const handleMouseMove = (e: MouseEvent) => {
        if(clicked){
            const pos = getRelativePos(e)
            const width= pos.x-startX
            const height= pos.y-startY
            clearCanvas(existingShapes,ctx,canvas)
            ctx.strokeStyle="rgba(255, 255, 255)"
            ctx.strokeRect(startX,startY,width,height)
        }
    }

    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mouseup", handleMouseUp)
    canvas.addEventListener("mousemove", handleMouseMove)

    return () => {
        canvas.removeEventListener("mousedown", handleMouseDown)
        canvas.removeEventListener("mouseup", handleMouseUp)
        canvas.removeEventListener("mousemove", handleMouseMove)
        socket.removeEventListener("message", handleMessage)
    }
    

}

function clearCanvas(existingShapes:Shape[],ctx:CanvasRenderingContext2D,canvas:HTMLCanvasElement){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    ctx.fillStyle="rgba(0,0,0)"
    ctx.fillRect(0,0,canvas.width,canvas.height)

    if (!existingShapes || !Array.isArray(existingShapes)) {
        return
    }

    existingShapes.map((shape)=>{
        if(shape.type=="rect"){
            ctx.strokeStyle="rgba(255, 255, 255)"
            ctx.strokeRect(shape.x,shape.y,shape.width,shape.height)  
        }
    })
}

async function getExistingShapes(roomId: string) {
    try {
        const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`)
        
        const messages = res.data.messages || res.data.message || []

        if (!messages || !Array.isArray(messages)) {
            return []  
        }

        const shapes = messages.map((x: { message: string }) => {
            const messageData = JSON.parse(x.message)
            return messageData.shape || messageData
        }).filter(Boolean)

        return shapes
    } catch (error) {
        console.error("[API] Error fetching shapes:", error)
        return [] 
    }
}

