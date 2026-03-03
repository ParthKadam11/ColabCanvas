import "@repo/types";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import helmet from "helmet";
import { fileURLToPath } from "url";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import { CorsOptions } from "cors";
import multer from "multer";
import roomRouter from "./routes/room.js";

const CLOUDINARY_DOMAINS = [
  "https://res.cloudinary.com",
  "https://api.cloudinary.com"
];

const DEPLOYED_FRONTEND = process.env.Frontend_URL?.split(",").map(url => url.trim()) ?? [];
const Frontend_URLS = DEPLOYED_FRONTEND.concat(CLOUDINARY_DOMAINS);
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const UPLOADS_DIR = path.join(__dirname, "..", "uploads")

const app = express();
app.use(cookieParser());

app.use(helmet());

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const requestTime = new Date().toISOString();
    if (!origin) {
      console.log(`[CORS][${requestTime}] No origin header (non-browser or same-origin request) - allowed.`);
      return callback(null, true);
    }
    const cleanOrigin = origin.replace(/\/$/, "").toLowerCase();
    if (Frontend_URLS.includes("*")) {
      console.log(`[CORS][${requestTime}] '*' in allowed origins. Allowing: ${origin}`);
      return callback(null, true);
    }
    if (Frontend_URLS.includes(cleanOrigin)) {
      console.log(`[CORS][${requestTime}] Allowed exact match: ${origin}`);
      return callback(null, true);
    }
    
    if (/\.vercel\.app$/.test(cleanOrigin.replace(/^https?:\/\//, ""))) {
      console.log(`[CORS][${requestTime}] Allowed Vercel subdomain: ${origin}`);
      return callback(null, true);
    }
    if (/\.cloudinary\.com$/.test(cleanOrigin.replace(/^https?:\/\//, ""))) {
      console.log(`[CORS][${requestTime}] Allowed Cloudinary subdomain: ${origin}`);
      return callback(null, true);
    }
    if (/^http:\/\/localhost(:\d+)?$/.test(cleanOrigin)) {
      console.log(`[CORS][${requestTime}] Allowed localhost: ${origin}`);
      return callback(null, true);
    }
    console.warn(`[CORS][${requestTime}] Blocked origin: ${origin} (normalized: ${cleanOrigin}). Allowed:`, Frontend_URLS);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
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

const PORT = Number(process.env.PORT ?? 3001);
const server = app.listen(PORT, () => {
  console.log(`HTTP backend running on port ${PORT}`);
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
