import "@repo/types"
import express from "express";
import jwt from "jsonwebtoken"
import { middleware } from "./middleware.js";
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common/types.ts";
import {prismaClient} from "@repo/db/clients"

const JWT_SECRET =process.env.JWT_SECRET

const app=express()
app.use(express.json())

app.post("/signup",async (req,res)=>{
    const result = CreateUserSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ error: "Invalid input", details: result.error });
        return;
    }
    const { email, password, name, photo } = result.data;
    //TODO: hasing password
    try {
        const user = await prismaClient.user.create({
            data: { 
                email, 
                password, 
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
    const user = await prismaClient.user.findFirst({
        where:{
            email:email,
            password:password
        }
    })
    if(!user){
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

app.get("/chats/:roomId",async (req,res )=>{
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

app.listen(3002, () => {
    console.log("HTTP backend running on port 3002")
})

