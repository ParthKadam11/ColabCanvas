import "@repo/types";
import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { prismaClient } from "@repo/db/clients";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import http from "http";

const JWT_SECRET = process.env.JWT_SECRET;
const PORT = Number(process.env.PORT ?? 8080);

const CLOUDINARY_DOMAINS = [
  "https://res.cloudinary.com",
  "https://api.cloudinary.com",
];

const Frontend_URLS = (process.env.Frontend_URL || "*")
  .split(",")
  .map((url) => url.trim().replace(/\/$/, "").toLowerCase())
  .concat(CLOUDINARY_DOMAINS);

const app = express();
app.set("trust proxy", 1);

app.use(helmet());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use(apiLimiter);
app.use(
  cors({
    origin: (origin, callback) => {
      const requestTime = new Date().toISOString();
      if (!origin) {
        console.log(
          `[CORS][${requestTime}] No origin header (non-browser or same-origin request) - allowed.`,
        );
        return callback(null, true);
      }
      const cleanOrigin = origin.replace(/\/$/, "").toLowerCase();
      if (Frontend_URLS.includes("*")) {
        console.log(
          `[CORS][${requestTime}] '*' in allowed origins. Allowing: ${origin}`,
        );
        return callback(null, true);
      }
      if (Frontend_URLS.includes(cleanOrigin)) {
        console.log(`[CORS][${requestTime}] Allowed exact match: ${origin}`);
        return callback(null, true);
      }
      if (/\.vercel\.app$/.test(cleanOrigin.replace(/^https?:\/\//, ""))) {
        console.log(
          `[CORS][${requestTime}] Allowed Vercel subdomain: ${origin}`,
        );
        return callback(null, true);
      }
      if (/\.cloudinary\.com$/.test(cleanOrigin.replace(/^https?:\/\//, ""))) {
        console.log(
          `[CORS][${requestTime}] Allowed Cloudinary subdomain: ${origin}`,
        );
        return callback(null, true);
      }
      if (/^http:\/\/localhost(:\d+)?$/.test(cleanOrigin)) {
        console.log(`[CORS][${requestTime}] Allowed localhost: ${origin}`);
        return callback(null, true);
      }
      console.warn(
        `[CORS][${requestTime}] Blocked origin: ${origin} (normalized: ${cleanOrigin}). Allowed:`,
        Frontend_URLS,
      );
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(cookieParser());

const server = http.createServer(app);

const wss = new WebSocketServer({ server });
console.log(`WebSocket and HTTP server running on port ${PORT}`);

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);

    if (typeof decoded == "string") return null;
    if (!decoded || !decoded.userId) return null;

    return decoded.userId;
  } catch (e) {
    return null;
  }
}

wss.on("connection", function connection(ws, request) {
  const url = request.url;
  console.log("[WS] New connection request:", url);
  console.log("[WS] Request headers:", request.headers);
  ws.on("open", () => {
    console.log("[WS] Connection opened.");
  });
  ws.on("close", () => {
    console.log("[WS] Connection closed.");
  });
  ws.on("error", (err) => {
    console.error("[WS] Connection error:", err);
  });
  if (!url) {
    console.warn("[WS] No URL in request, closing.");
    ws.close();
    return;
  }
  let token = "";
  // Extract token from URL query parameter
  const host = request.headers.host || "localhost";
  const urlString = request.url || "/";
  const urlObj = new URL(urlString, `http://${host}`);
  token = urlObj.searchParams.get("token") || "";
  console.log("[WS] Parsed token from URL query:", token);
  // If still no token, wait for join_room message and check token there
  let userId: string | null = null;
  if (token) {
    userId = checkUser(token);
    if (userId == null) {
      console.warn("[WS] Invalid or missing token, closing connection.");
      ws.close();
      return;
    }
    console.log("[WS] Authenticated userId:", userId);
    users.push({
      userId,
      rooms: [],
      ws,
    });
  }

  ws.on("message", async function message(data) {
    let parsedData;
    console.log("[WS] Received message:", data);
    try {
      if (typeof data != "string") {
        parsedData = JSON.parse(data.toString());
      } else {
        parsedData = JSON.parse(data);
      }
    } catch (err) {
      console.error("[WS] Failed to parse message:", err, data);
      return;
    }
    console.log("[WS] Parsed message:", parsedData);
    console.log(`[WS] userId: ${userId}, message type: ${parsedData.type}`);
    // If userId not set, check token in join_room message
    if (!userId && parsedData.type === "join_room" && parsedData.token) {
      userId = checkUser(parsedData.token);
      if (!userId) {
        console.warn("[WS] Invalid or missing token in join_room, closing connection.");
        ws.close();
        return;
      }
      users.push({
        userId,
        rooms: [],
        ws,
      });
      console.log("[WS] Authenticated userId from join_room:", userId);
    }
    if (parsedData.type === "join_room") {
      const user = users.find((x) => x.ws == ws);
      console.log("[WS] Adding user to room:", parsedData.roomId, user);
      if (!user) {
        console.warn("[WS] No user found for join_room.");
      }
      user?.rooms.push(parsedData.roomId);
      console.log(`[WS] User rooms after join: ${user?.rooms}`);
    }

    if (parsedData.type === "leave_room") {
      const user = users.find((x) => x.ws == ws);
      console.log("[WS] Removing user from room:", parsedData.room, user);
      if (!user) {
        return;
      }
      user.rooms = user?.rooms.filter((x) => x == parsedData.room);
    }

    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;
      console.log("[WS] Broadcasting chat message:", roomId, message);
      let sentCount = 0;
      users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          console.log(`Sending chat to userId: ${user.userId}, rooms: ${user.rooms}`);
          user.ws.send(
            JSON.stringify({
              type: "chat",
              message: message,
              roomId,
            }),
          );
          sentCount++;
        }
      });
      console.log(`[WS] Chat message sent to ${sentCount} users in room ${roomId}`);

      try {
        const userIdString = typeof userId === "string" ? userId : "";
        if (!userIdString) {
          console.warn("[DB] Missing userId, skipping chat save.");
          return;
        }
        await prismaClient.chat.create({
          data: {
            roomId: Number(roomId),
            message,
            userId: userIdString,
          },
        });
        console.log("[DB] Chat saved:", roomId, userIdString);
      } catch (e) {
        console.error(`[DB] ERROR saving chat:`, e);
      }
    }
  });

  ws.on("close", () => {
    const index = users.findIndex((user) => user.ws === ws);
    if (index > -1) {
      users.splice(index, 1);
    }
    console.log("[WS] Connection closed for user.", { index });
  });
});

process.on("SIGINT", () => {
  wss.close(() => {
    console.log("[WS] WebSocket server closed");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("[WS] Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
});

app.get(
  "/rooms/:roomId/active-users",
  async (req: express.Request, res: express.Response) => {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization || "";
      const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
      const userId = checkUser(token);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const roomIdParam = req.params.roomId;
      const roomId = Array.isArray(roomIdParam) ? roomIdParam[0] : roomIdParam;
      if (!roomId) {
        return res.status(400).json({ message: "Invalid room" });
      }
      const activeUserIds = Array.from(
        new Set(
          users.filter((u) => u.rooms.includes(roomId)).map((u) => u.userId),
        ),
      );

      if (activeUserIds.length === 0) {
        return res.status(200).json({ users: [] });
      }

      const activeUsers = await prismaClient.user.findMany({
        where: { id: { in: activeUserIds } },
        select: { id: true, name: true, photo: true },
      });
      return res.status(200).json({ users: activeUsers });
    } catch (e) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },
);

server.listen(PORT, () => {
  console.log(`[HTTP/WS] Server running on port ${PORT}`);
});
