export type Chat = {
    id: number;
    roomId: number;
    message: string;
    userId: string;
};
export type Room = {
    id: number;
    slug: string;
    createdAt: Date;
    adminId: string;
};
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
export declare const prismaClient: PrismaClient<{
    adapter: PrismaPg;
}, never, import("./generated/prisma/runtime/client.js").DefaultArgs>;
//# sourceMappingURL=index.d.ts.map