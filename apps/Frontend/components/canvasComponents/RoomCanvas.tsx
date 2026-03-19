"use client"
import { useEffect, useState,useRef } from "react"
import { Canvas } from "./Canvas"
import LoadingSpinner from "@/components/roomComponents/LoadingSpinner"
import { useSearchParams } from "next/navigation"

const WS_URL=process.env.NEXT_PUBLIC_WS_URL

export function RoomCanvas({roomId}:{roomId:string}){
    const [socket,setSocket] =useState<WebSocket|null>(null)
    const wsRef = useRef<WebSocket | null>(null)

    const url = useSearchParams();
    const token = url.get("token");
    console.log("RoomCanvas: roomId=", roomId, "token=", token);

    useEffect(()=>{
        const data = JSON.stringify({
            type: "join_room",
            roomId
        });
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            console.log("WebSocket already open, sending join_room...");
            wsRef.current.send(data);
            return;
        }
        if (!token || !roomId) {
            console.warn("RoomCanvas: Missing token or roomId, skipping WebSocket connection.", { token, roomId });
            return;
        }
        console.log("RoomCanvas: Attempting WebSocket connection to", `${WS_URL}?token=${token}`);
        const ws = new WebSocket(`${WS_URL}?token=${token}`);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("WebSocket connection opened.");
            setSocket(ws);
            ws.send(JSON.stringify({
                type: "join_room",
                roomId
            }));
        };

        ws.onerror = (err) => {
            console.error("WebSocket error:", err);
        };

        ws.onclose = (event) => {
            console.warn("WebSocket closed:", event);
        };

        return () => {
            ws.close();
        };
    }, [token, roomId]);



    if(!socket){
        return <div className="flex justify-center items-center h-full w-full">
            <LoadingSpinner message="Connecting to the server..." />
        </div>
    }

return <div className="w-screen h-screen overflow:hidden">
        <Canvas roomId={roomId} socket={socket} token={token ?? ""} />
    </div>
}