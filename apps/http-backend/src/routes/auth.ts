import express, { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prismaClient } from "@repo/db/clients";
import upload from "../utils/multer.js";
import cloudinary from "../utils/cloudinary.js";
import { middleware } from "../middleware.js";
import { CreateUserSchema, SigninSchema } from "@repo/common/types.ts";


const router: Router = express.Router();

router.post("/signup", upload.single("photo"), async (req, res) => {
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
    res.json({
      message: "User created successfully",
      userId: user.id,
    });
  } catch (e) {
    res.json({
      message: "User Already Exists",
      e: `${e}`,
    });
  }
});

router.post("/signin", async (req, res) => {
  const result = SigninSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: "Invalid input", details: result.error });
  }
  const { email, password } = result.data;

  const user = await prismaClient.user.findFirst({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "Not Authorized" });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: "Not Authorized" });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/"
  });
  res.json({ message: "Signed in successfully" });
});

router.get("/profile", middleware, async (req, res) => {
  const userId = req.userId as string | undefined;
  if (!userId) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, photo: true },
  });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json({
    user,
  });
});

export default router;