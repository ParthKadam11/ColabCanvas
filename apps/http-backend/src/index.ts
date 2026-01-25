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
    }catch(e: any){
        res.json({
            e
        })
    }
    
})

app.post("/signin",(req,res)=>{
    const result = SigninSchema.safeParse(req.body);
    if (!result.success) {
    res.json({
        message: "Incorrect Credentials",
    });
    return;
    }    
    const {username} = result.data 
    const token=jwt.sign({username:username},JWT_SECRET as string)
    res.json({
        token
    })
})

app.post("/room", middleware ,(req,res)=>{
    const result = CreateRoomSchema.safeParse(req.body)
    if(!result.success){
        res.json({
            message:"Incorrect Input"
        })
        return
    }
    res.json({
        RoomId:"123"
    })
})

app.listen(3001, () => {
    console.log("HTTP backend running on port 3001")
}) 