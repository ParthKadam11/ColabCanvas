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
    const controller = new AbortController()

    if(canvasRef.current){
        initDraw(canvasRef.current,roomId,socket).then((fn) => {
            if (!cancelled) cleanup = fn
        })
    }

    return () => {
        cancelled = true
        controller.abort()
        if (cleanup) cleanup()
    }
},[roomId, socket])

return <div className="overflow:hidden">
    <div className="text-white flex justify-center items-start">
        Hello
    </div>
    <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
</div>

}