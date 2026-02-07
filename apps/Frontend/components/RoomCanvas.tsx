"use client"
import { WS_URL } from "@/config"
import { useEffect, useState,useRef } from "react"
import { Canvas } from "./Canvas"
import { useSearchParams } from "next/navigation"

export function RoomCanvas({roomId}:{roomId:string}){
    const [socket,setSocket] =useState<WebSocket|null>(null)
    const wsRef = useRef<WebSocket | null>(null)
    //const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ZTcxN2VkOS0wYmY5LTQ2NjMtYmVhYi0zY2U0MDRlOTE2YzQiLCJpYXQiOjE3NzAxMzI1MjF9.-SPJI1Z1BBLBac5fy0qu-zA93x8IBic7xSEJx76satw"

    const url =useSearchParams()
    const token = url.get("token")

    useEffect(()=>{
        const data=JSON.stringify({
            type:"join_room",
            roomId
        })
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(data)
            return
        }
        if (!token || !roomId) return
        
        const ws = new WebSocket(`${WS_URL}?token=${token}`)
        wsRef.current = ws

        ws.onopen=()=>{
            setSocket(ws)
            ws.send(JSON.stringify({
                type:"join_room",
                roomId
            })
        )}

        return () => {
            ws.close()
        }
    },[token,roomId])


    if(!socket){
        return <div>
            Connecting to the Server..
        </div>
    }

return <div className="w-screen h-screen overflow:hidden">
        <Canvas roomId={roomId} socket={socket} token={token ?? ""} />
    </div>
}