import express from "express";
import jwt from "jsonwebtoken"
import { middleware } from "./middleware";

const JWT_SECRET =process.env.JWT_SECRET

const app=express()

app.use(express.json())
app.post("/",(req,res)=>{
    res.json("Hello World")
})

app.post("/signup",(req,res)=>{
    const {username,password} = req.body
    
})

app.post("/signin",(req,res)=>{
    const {username,password} =req.body
    const token=jwt.sign(username,JWT_SECRET as string)

    res.json({
        token
    })
})

app.post("/room", middleware ,(req,res)=>{
    res.json({
        RoomId:"123"
    })
})

app.listen(3000) 