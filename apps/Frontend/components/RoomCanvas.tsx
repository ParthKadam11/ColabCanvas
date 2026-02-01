"use client"
import { WS_URL } from "@/config"
import { useEffect, useState } from "react"
import { Canvas } from "./Canvas"

export function RoomCanvas({roomId}:{roomId:string}){
    const [socket,setSocket] =useState<WebSocket|null>(null)

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiMDFjMjFjNy00OTU5LTQ0ZDAtYTZhZi1mNGRlMmQ1NTc5ZjYiLCJpYXQiOjE3Njk5Nzg5NzF9.Fd9HvcPGua9U8s-kuGNqt1jovzneDbFNis8D7RpiCb8"
    useEffect(()=>{
        const ws =new WebSocket(`${WS_URL}?token=${token}`)

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
    },[roomId])


    if(!socket){
        return <div>
            Connecting to the Server..
        </div>
    }

return <div className="w-screen h-screen">
        <Canvas roomId={roomId} socket={socket}/>
        <div className=" fixed bg-white text-black gap-2 bottom-0 right-0">
            <button>Rect</button>
            <button>Circle</button>
        </div>
    </div>
}