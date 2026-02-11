import { HTTP_BACKEND } from "@/config"
import axios from "axios"
import { eraseShapes, type Shape } from "./eraser"

export async function getExistingShapes(roomId: string) {
    try {
        const res = await axios.get(`${HTTP_BACKEND}/room/${roomId}`)
        
        const messages = res.data.messages || res.data.message || []

        if (!messages || !Array.isArray(messages)) {
            return []  
        }

        const orderedMessages = [...messages].reverse()

        const shapes = orderedMessages.reduce((acc: Shape[], item: { message: string }) => {
            const messageData = JSON.parse(item.message)
            const shape = messageData.shape || messageData
            if (!shape || !shape.type) {
                return acc
            }
            if (shape.type === "eraser") {
                return eraseShapes(acc, shape.x, shape.y, shape.size)
            }
            acc.push(shape)
            return acc
        }, [])

        return shapes
    } catch (error) {
        console.error("[API] Error fetching shapes:", error)
        return [] 
    }
}