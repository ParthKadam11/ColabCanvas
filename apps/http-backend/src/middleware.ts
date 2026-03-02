import "@repo/types"
import { Request, Response, NextFunction } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"

export function middleware(req: Request, res: Response, next: NextFunction) {
    let token = "";
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers["authorization"]) {
        const authHeader = req.headers["authorization"];
        if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
            token = authHeader.slice(7);
        } else if (typeof authHeader === "string") {
            token = authHeader;
        }
    }
    const JWT_SECRET = process.env.JWT_SECRET as string;
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        if (decoded.userId) {
            req.userId = decoded.userId;
            next();
        } else {
            res.status(403).json({
                message: "Unauthorized"
            });
        }
    } catch (e) {
        res.status(403).json({
            message: "Invalid or missing token",
            error: `${e}`
        });
    }
}