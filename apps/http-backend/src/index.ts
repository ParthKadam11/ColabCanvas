import "@repo/types"
import express from "express";
import jwt from "jsonwebtoken"
import { middleware } from "./middleware.js";
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common/types.ts";
import {prismaClient} from "@repo/db/clients"

const JWT_SECRET =process.env.JWT_SECRET

const app=express()
app.use(express.json())

app.listen(3001, () => {
    console.log("HTTP backend running on port 3001")}) 

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
            e
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
    //TODO : compare hashed passwords
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
    const token=jwt.sign({email:email},JWT_SECRET as string)
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
    await prismaClient.room.create({
        data:{
         slug:result.data.roomname,
         adminId: userId as string 
        }
    })
    res.json({
        RoomId:"123"
    })
})

