import "@repo/types";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import { CorsOptions } from "cors";
import multer from "multer";
import roomRouter from "./routes/room.js";

const Frontend_URLS = (process.env.Frontend_URL || "*")
  .split(",")
  .map((url) => url.trim().replace(/\/$/, "").toLowerCase());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, "..", "uploads");



const app = express();

const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/$/, "").toLowerCase();
    if (Frontend_URLS.includes("*")) return callback(null, true);
    if (Frontend_URLS.includes(cleanOrigin)) return callback(null, true);
    console.warn(
      `[CORS] Blocked origin: ${origin} (normalized: ${cleanOrigin}). Allowed:`,
      Frontend_URLS,
    );
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.options(/^\/.*$/, cors(corsOptions));


app.use(express.json());
app.use("/uploads", express.static(UPLOADS_DIR));

app.use(authRouter);
app.use(userRouter);
app.use(roomRouter);

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    if (err instanceof multer.MulterError || err instanceof Error) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.status(500).json({ error: "Unexpected server error" });
  },
);

const server = app.listen(3001, () => {
  console.log("HTTP backend running on port 3001");
});

process.on("SIGINT", () => {
  console.log("\n[HTTP] Shutting down Express server...");
  server.close(() => {
    console.log("[HTTP] Express server closed");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("[HTTP] Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
});
