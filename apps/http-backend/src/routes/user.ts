import express, { Router } from "express";
import { prismaClient } from "@repo/db/clients";
import { middleware } from "../middleware.js";

const router: Router = express.Router();

router.get("/users/:userId/photo", middleware, async (req, res) => {
  const userIdParam = req.params.userId;
  const userId = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam;
  if (!userId) {
    res.status(400).json({ message: "Invalid user" });
    return;
  }
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: { photo: true },
  });
  if (!user?.photo) {
    res.status(404).json({ message: "Photo not found" });
    return;
  }
  if (user.photo.startsWith("http://") || user.photo.startsWith("https://")) {
    return res.redirect(user.photo);
  }
  res.status(410).json({ message: "Legacy local photo not supported. Please re-upload your profile photo." });
});

export default router;
