import "@repo/types"
import { Request, Response, NextFunction } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"

export function middleware(req:Request,res:Response,next:NextFunction){
    const token =req.headers["authorization"] ?? ""
    const JWT_SECRET = process.env.JWT_SECRET as string   
    const decoded=jwt.verify(token,JWT_SECRET) as JwtPayload

    if(decoded.userId ){
        req.userId =decoded.userId;
        next();
    }else{
        res.status(403).json({
            message:"Unauthorized"
        })
    }

}