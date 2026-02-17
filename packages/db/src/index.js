import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config({ path: process.cwd() + "/.env" });
let databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    console.warn("Warning: DATABASE_URL environment variable is not set. Using fallback value.");
    databaseUrl = "postgres://user:password@localhost:5432/db"; // fallback dummy value
}
const pool = new pg.Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
export const prismaClient = new PrismaClient({
    adapter,
});
