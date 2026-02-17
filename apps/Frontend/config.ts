// Centralized config for frontend
// Add your environment URLs and other config here

export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";
export const HTTP_BACKEND = process.env.NEXT_PUBLIC_HTTP_BACKEND || "http://localhost:3001";
export const PRESENCE_URL = process.env.NEXT_PUBLIC_PRESENCE_URL || "ws://localhost:8081";
