import "@repo/types"
import express from "express";
import jwt from "jsonwebtoken"
import { middleware } from "./middleware";
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common/types.ts";
import {prismaClient} from "@repo/db/src/"

const JWT_SECRET =process.env.JWT_SECRET

const app=express()
app.use(express.json())

app.post("/signup",async (req,res)=>{
    const result = CreateUserSchema.safeParse(req.body)
    if(!result.success){
        res.json({
            message:"Incorrect Input"
        })
        return
    }
    //dbcall
    await prismaClient.user.create({
        data: {
            name: result.data.name,
            email: result.data.email,
            password: result.data.password,
            photo: result.data.photo ?? "",
        }
    })
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

app.listen(3000) 