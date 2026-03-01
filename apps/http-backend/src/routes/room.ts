import express, { Router } from "express";
import { prismaClient } from "@repo/db/clients";
import { CreateRoomSchema, JoinRoomSchema } from "@repo/common/types.ts";
import { middleware } from "../middleware.js";
import { Room } from "@repo/db/clients";

const router: Router = express.Router();

router.post("/room", middleware, async (req, res) => {
  const result = CreateRoomSchema.safeParse(req.body);
  if (!result.success) {
    res.json({
      message: "Incorrect Input",
    });
    return;
  }
  const userId = req.userId;
  try {
    const room = await prismaClient.room.create({
      data: {
        slug: result.data.roomname,
        adminId: userId as string,
      },
    });
    res.json({
      roomId: room.id,
    });
  } catch (e) {
    res.status(411).json({
      message: "Room Already Exists",
      e,
    });
  }
});

router.get("/rooms", middleware, async (req, res) => {
  const userId = req.userId as string | undefined;
  if (!userId) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  const rooms = await prismaClient.room.findMany({
    where: { adminId: userId },
    orderBy: { createdAt: "desc" },
  });

  const roomsWithCounts = await Promise.all(
    rooms.map(async (room: Room) => {
      const chats = await prismaClient.chat.findMany({
        where: { roomId: room.id },
        select: { userId: true },
      });
      const memberIds = new Set(chats.map((chat) => chat.userId));
      memberIds.add(room.adminId);

      return {
        id: room.id,
        slug: room.slug,
        createdAt: room.createdAt,
        memberCount: memberIds.size,
      };
    }),
  );

  res.json({ rooms: roomsWithCounts });
});

router.post("/room/join", middleware, async (req, res) => {
  const result = JoinRoomSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: "Invalid input", details: result.error });
    return;
  }

  const room = await prismaClient.room.findUnique({
    where: { slug: result.data.roomname },
  });

  if (!room) {
    res.status(404).json({ message: "Room not found" });
    return;
  }

  res.json({ roomId: room.id, slug: room.slug });
});

router.delete("/room/:roomId", middleware, async (req, res) => {
  const userId = req.userId as string | undefined;
  const roomId = Number(req.params.roomId);
  if (!userId || Number.isNaN(roomId)) {
    res.status(400).json({ message: "Invalid input" });
    return;
  }

  const room = await prismaClient.room.findUnique({ where: { id: roomId } });
  if (!room) {
    res.status(404).json({ message: "Room not found" });
    return;
  }

  if (room.adminId !== userId) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  await prismaClient.chat.deleteMany({ where: { roomId } });
  await prismaClient.room.delete({ where: { id: roomId } });
  res.json({ message: "Room deleted" });
});

router.get("/room/:roomId", async (req, res) => {
  const roomId = Number(req.params.roomId);
  const messages = await prismaClient.chat.findMany({
    where: {
      roomId: roomId,
    },
    orderBy: {
      id: "desc",
    },
    take: 50,
  });
  res.json({
    messages,
  });
});

export default router;
