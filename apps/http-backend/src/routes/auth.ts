import express, { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prismaClient } from "@repo/db/clients";
import upload from "../utils/multer.js";
import cloudinary from "../utils/cloudinary.js";
import { middleware } from "../middleware.js";
import { CreateUserSchema, SigninSchema } from "@repo/common/types.ts";
import rateLimit from "express-rate-limit";


const router: Router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." }
});

router.post("/signup", authLimiter, upload.single("photo"), async (req, res) => {
  let photoUrl: string | undefined = undefined;
  if (req.file) {
    try {
      const stream = await import("stream");
      photoUrl = await new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "colabcanvas-users", resource_type: "image" },
          (error: any, result: any) => {
            if (error || !result)
              return reject(error || new Error("Cloudinary upload failed"));
            resolve(result.secure_url);
          },
        );
        
        const bufferStream = new stream.PassThrough();
        bufferStream.end(req.file!.buffer);
        bufferStream.pipe(uploadStream);
      });
    } catch (e) {
      return res.status(500).json({ error: "Failed to upload image to Cloudinary", details: e });
    }
  }
  const result = CreateUserSchema.safeParse({
    ...req.body,
    ...(photoUrl && { photo: photoUrl }),
  });
  if (!result.success) {
    return res.status(400).json({ error: "Invalid input", details: result.error });
  }
  const { email, password, name, photo } = result.data;
  const hashedPassword = await bcrypt.hash(password, 5);
  try {
    const user = await prismaClient.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        ...(photo && { photo }),
      },
    });
    return res.status(201).json({
      message: "User created successfully",
      userId: user.id,
    });
  } catch (e: any) {
    if (e.code === 'P2002') {
      return res.status(409).json({ message: "User already exists" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/signin", authLimiter, async (req, res) => {
  try {
    const result = SigninSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid input", details: result.error });
    }
    const { email, password } = result.data;

    const user = await prismaClient.user.findFirst({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/"
    });
    return res.status(200).json({ message: "Signed in successfully" });
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/profile", middleware, async (req, res) => {
  try {
    const userId = req.userId as string | undefined;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, photo: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;