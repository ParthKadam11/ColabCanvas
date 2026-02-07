import "@repo/types"
import express from "express";
import jwt from "jsonwebtoken"
import { middleware } from "./middleware.js";
import { CreateRoomSchema, CreateUserSchema, JoinRoomSchema, SigninSchema } from "@repo/common/types.ts";
import {prismaClient} from "@repo/db/clients"
import cors from "cors"
import bcrypt from "bcrypt"
import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"

const JWT_SECRET =process.env.JWT_SECRET
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const UPLOADS_DIR = path.join(__dirname, "..", "uploads")

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname || "");
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, uniqueName);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (
    _req,
    file,
    cb: (error: Error | null, acceptFile?: boolean) => void
  ) => {
    const isImage = file.mimetype.startsWith("image/");
    cb(isImage ? null : new Error("Only image uploads are allowed."), isImage);
  }
})

const app=express()
app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(UPLOADS_DIR))

app.post("/signup", upload.single("photo"), async (req,res)=>{
    const photoFilename = req.file ? req.file.filename : undefined
    const result = CreateUserSchema.safeParse({
        ...req.body,
        ...(photoFilename && { photo: photoFilename })
    });
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

app.get("/users/:userId/photo", middleware, async (req, res) => {
    const userIdParam = req.params.userId
    const userId = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam
    if (!userId) {
        res.status(400).json({ message: "Invalid user" })
        return
    }

    const user = await prismaClient.user.findUnique({
        where: { id: userId },
        select: { photo: true }
    })

    if (!user?.photo) {
        res.status(404).json({ message: "Photo not found" })
        return
    }

    let filename = user.photo
    if (user.photo.startsWith("http://") || user.photo.startsWith("https://")) {
        try {
            const parsedUrl = new URL(user.photo)
            filename = path.basename(parsedUrl.pathname)
        } catch {
            res.status(400).json({ message: "Invalid photo URL" })
            return
        }
    }

    const filePath = path.join(UPLOADS_DIR, filename)
    res.sendFile(filePath)
})

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (err instanceof multer.MulterError || err instanceof Error) {
        res.status(400).json({ error: err.message })
        return
    }

    res.status(500).json({ error: "Unexpected server error" })
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


  setTimeout(() => {
    console.error("[HTTP] Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
})

