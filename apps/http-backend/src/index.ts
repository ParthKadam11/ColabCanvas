import "@repo/types"
import express from "express";
import jwt from "jsonwebtoken"
import { middleware } from "./middleware";
import { CreateRoomSchema, SigninSchema } from "@repo/common/types.ts";

const JWT_SECRET =process.env.JWT_SECRET

const app=express()
app.use(express.json())

app.post("/",(req,res)=>{
    res.json("Hello World")
})

app.post("/signup",(req,res)=>{
    const result = CreateRoomSchema.safeParse(req.body)
    if(!result.success){
        res.json({
            message:"Incorrect Input"
        })
        return
    }
    //dbcall
    res.json({
        userId:"123"
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