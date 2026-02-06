import {z} from "zod";

export const CreateUserSchema = z.object({
    name:z.string().max(20),
    email:z.string(),
    password:z.string().min(8),
    photo:z.string().optional(),
})

export const SigninSchema= z.object({
    email:z.string().min(3).max(20),
    password:z.string().min(8),
})

export const CreateRoomSchema= z.object({
    roomname:z.string().min(3).max(20)
})

export const JoinRoomSchema = z.object({
    roomname: z.string().min(3).max(20)
})