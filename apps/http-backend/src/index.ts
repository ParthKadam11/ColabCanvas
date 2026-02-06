import "@repo/types"
import express from "express";
import jwt from "jsonwebtoken"
import { middleware } from "./middleware.js";
import { CreateRoomSchema, CreateUserSchema, JoinRoomSchema, SigninSchema } from "@repo/common/types.ts";
import {prismaClient} from "@repo/db/clients"
import cors from "cors"
import bcrypt from "bcrypt"

const JWT_SECRET =process.env.JWT_SECRET

const app=express()
app.use(cors())
app.use(express.json())

app.post("/signup",async (req,res)=>{
    const result = CreateUserSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: "Invalid input", details: result.error });
        return;
    }
    const { email, password, name, photo } = result.data;
    const hashedPassword = await bcrypt.hash(password,5)
    try {
        const user = await prismaClient.user.create({
            data: { 
                email, 
                password:hashedPassword, 
                name,
                ...(photo && { photo })
            }
        });
        res.json({
            message: "User created successfully",
            userId: user.id
        });
    }catch(e){
        res.json({
            message:"User Already Exists",
            e:`${e}`
        })
    }
    
})

app.post("/signin",async (req,res)=>{
    const result = SigninSchema.safeParse(req.body);
    if (!result.success) {
    res.json({
        message: "Incorrect Credentials",
    });
    return    
}    
    const {email,password} = result.data
    
    const user = await prismaClient.user.findFirst({where:{email}})
    if(!user){
        res.json({
            message:"Not Authorized"
        })
        return 
    }
    
    const isValid = await bcrypt.compare(password,user.password)
    if(!isValid){
        res.json({
            message:"Not Authorized"
        })
        return
    }

    const token=jwt.sign({userId: user.id},JWT_SECRET as string)
    res.json({
        token
    })
})

app.post("/room", middleware ,async (req,res)=>{
    const result = CreateRoomSchema.safeParse(req.body)
    if(!result.success){
        res.json({
            message:"Incorrect Input"
        })
        return
    }
    const userId= req.userId
    try{
        const room = await prismaClient.room.create({
        data:{
            slug:result.data.roomname,
            adminId: userId as string 
        }
        })
        res.json({
            roomId:room.id
        })
    }catch(e){
        res.status(411).json({
            message:"Room Already Exists",
            e
        })
    }
})

app.get("/rooms", middleware, async (req, res) => {
    const userId = req.userId as string | undefined
    if (!userId) {
        res.status(403).json({ message: "Unauthorized" })
        return
    }

    const rooms = await prismaClient.room.findMany({
        where: { adminId: userId },
        orderBy: { createdAt: "desc" }
    })

    const roomsWithCounts = await Promise.all(
        rooms.map(async (room) => {
            const chats = await prismaClient.chat.findMany({
                where: { roomId: room.id },
                select: { userId: true }
            })
            const memberIds = new Set(chats.map((chat) => chat.userId))
            memberIds.add(room.adminId)

            return {
                id: room.id,
                slug: room.slug,
                createdAt: room.createdAt,
                memberCount: memberIds.size
            }
        })
    )

    res.json({ rooms: roomsWithCounts })
})

app.post("/room/join", middleware, async (req, res) => {
    const result = JoinRoomSchema.safeParse(req.body)
    if (!result.success) {
        res.status(400).json({ error: "Invalid input", details: result.error })
        return
    }

    const room = await prismaClient.room.findUnique({
        where: { slug: result.data.roomname }
    })

    if (!room) {
        res.status(404).json({ message: "Room not found" })
        return
    }

    res.json({ roomId: room.id, slug: room.slug })
})

app.delete("/room/:roomId", middleware, async (req, res) => {
    const userId = req.userId as string | undefined
    const roomId = Number(req.params.roomId)
    if (!userId || Number.isNaN(roomId)) {
        res.status(400).json({ message: "Invalid input" })
        return
    }

    const room = await prismaClient.room.findUnique({ where: { id: roomId } })
    if (!room) {
        res.status(404).json({ message: "Room not found" })
        return
    }

    if (room.adminId !== userId) {
        res.status(403).json({ message: "Forbidden" })
        return
    }

    await prismaClient.room.delete({ where: { id: roomId } })
    res.json({ message: "Room deleted" })
})

app.get("/room/:roomId",async (req,res )=>{
    const roomId =Number(req.params.roomId)
    const messages = await prismaClient.chat.findMany({
        where:{
            roomId:roomId
        },orderBy:{
            id:"desc"
        },
        take:50
    })
    res.json({
        messages
    })

})

const server = app.listen(3001, () => {
    console.log("HTTP backend running on port 3001")
})

process.on("SIGINT", () => {
  console.log("\n[HTTP] Shutting down Express server...");
  server.close(() => {
    console.log("[HTTP] Express server closed");
    process.exit(0);
  });

  // Force exit after 10 seconds
  setTimeout(() => {
    console.error("[HTTP] Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
})

