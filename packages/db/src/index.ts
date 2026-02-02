import { PrismaClient } from './generated/prisma/client.js'
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

console.log("[db] DATABASE_URL loaded:", databaseUrl.substring(0, 50) + "...");

const pool = new pg.Pool({ 
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);

export const prismaClient = new PrismaClient({
  adapter,
});

console.log("[db] PrismaClient initialized");
