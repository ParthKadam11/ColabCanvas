import { PrismaClient } from "./generated/prisma/client";

export const prismaClient = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], 
  accelerateUrl: 'your-accelerate-url-here',
})