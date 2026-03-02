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
// Set this to your deployed frontend URL, e.g., https://colabcanvas.vercel.app
const DEPLOYED_FRONTEND = process.env.Frontend_URL;
const Frontend_URLS = [DEPLOYED_FRONTEND]
  .concat(CLOUDINARY_DOMAINS);
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const UPLOADS_DIR = path.join(__dirname, "..", "uploads")



const app = express();
app.use(cookieParser());

app.use(helmet());



const corsOptions: CorsOptions = {
  origin: DEPLOYED_FRONTEND,
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
