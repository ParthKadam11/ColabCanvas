import "@repo/types"
import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import {prismaClient} from "@repo/db/clients"
import express from "express"
import cors from "cors"

const JWT_SECRET = process.env.JWT_SECRET;
const PORT = Number(process.env.PORT ?? 8080);

const app = express();
app.use(cors());

import http from 'http';
const server = http.createServer(app);

const wss = new WebSocketServer({ server });
console.log(`WebSocket and HTTP server running on port ${PORT}`);

interface User{
  ws:WebSocket,
  rooms:string[],
  userId:string
}

const users:User[]=[]

function checkUser(token:string):string |null{
  try{
  const decoded = jwt.verify(token,JWT_SECRET as string)

  if(typeof decoded == "string") return null
  if( !decoded || !decoded.userId) return null
  
  return decoded.userId
  }catch(e){
    return null 
  }
}

wss.on("connection", function connection(ws, request) {
  const url = request.url;
  if (!url) return
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") ?? "";
  const userId = checkUser(token);
  if (userId == null) {
    ws.close();
    return;
  }
  users.push({
    userId,
    rooms: [],
    ws,
  });

  ws.on("message", async function message(data) {
    let parsedData;    
    if(typeof data != "string"){
      parsedData = JSON.parse(data.toString())
    }else{
      parsedData=JSON.parse(data)
    }

    if (parsedData.type === "join_room") {
      const user = users.find((x) =>x.ws == ws);
      user?.rooms.push(parsedData.roomId);
    }

    if (parsedData.type === "leave_room") {
      const user = users.find((x) => x.ws == ws);
      if (!user) {
        return;
      }
      user.rooms = user?.rooms.filter((x) => x == parsedData.room);
    }

    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;


      users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(
            JSON.stringify({
              type: "chat",
              message: message,
              roomId,
            }),
          );
        }
      });

      try {
         await prismaClient.chat.create({
          data: {
            roomId: Number(roomId),
            message,
            userId,
          },
        });
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

app.get("/rooms/:roomId/active-users", async (req: express.Request, res: express.Response) => {
  console.log(`[DEBUG] Received active-users request for room: ${req.params.roomId}`);
  console.log(`[DEBUG] Current users array:`, users);
  const authHeader = req.headers["authorization"]
  const token = Array.isArray(authHeader) ? authHeader[0] : authHeader ?? ""
  const userId = checkUser(token)
  if (!userId) {
    res.status(403).json({ message: "Unauthorized" })
    return
  }

  const roomIdParam = req.params.roomId
  const roomId = Array.isArray(roomIdParam) ? roomIdParam[0] : roomIdParam
  if (!roomId) {
    res.status(400).json({ message: "Invalid room" })
    return
  }
  const activeUserIds = Array.from(
    new Set(users.filter((u) => u.rooms.includes(roomId)).map((u) => u.userId))
  )

  if (activeUserIds.length === 0) {
    res.json({ users: [] })
    return
  }

  const activeUsers = await prismaClient.user.findMany({
    where: { id: { in: activeUserIds } },
    select: { id: true, name: true, photo: true }
  })

  res.json({ users: activeUsers })
})

// Start the unified HTTP+WebSocket server
server.listen(PORT, () => {
  console.log(`[HTTP/WS] Server running on port ${PORT}`);
  console.log(`[DEBUG] Access REST API at: http://localhost:${PORT}/rooms/<roomId>/active-users`);
});