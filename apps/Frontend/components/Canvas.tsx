"use client"
import { initDraw } from "@/draw"
import { useEffect, useRef } from "react"

export function Canvas({
    roomId,
    socket
}:{
    roomId:string,
    socket:WebSocket
}){

const canvasRef =useRef<HTMLCanvasElement>(null)

useEffect(()=>{
    let cleanup: void | (() => void)
    let cancelled = false

    if(canvasRef.current && socket){
        initDraw(canvasRef.current,roomId,socket).then((fn) => {
            if (!cancelled) cleanup = fn
        })
    }

    return () => {
        cancelled = true
        if (cleanup) cleanup()
    }
},[roomId, socket])

return <div>
    <canvas ref={canvasRef} width={1536} height={735}></canvas>
</div>

}