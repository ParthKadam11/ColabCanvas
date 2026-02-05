import { HTTP_BACKEND } from "@/config"
import axios from "axios"

export async function getExistingShapes(roomId: string) {
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