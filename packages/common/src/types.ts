import {z} from "zod";

const passwordComplexity = z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain an uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain a lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain a number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain a special character" });

export const CreateUserSchema = z.object({
        name: z.string().max(20),
        email: z.string(),
        password: passwordComplexity,
        photo: z.string().optional(),
});


export const SigninSchema = z.object({
    email: z.string().min(3).max(20),
    password: passwordComplexity,
});

export const CreateRoomSchema= z.object({
    roomname:z.string().min(3).max(20)
})

export const JoinRoomSchema = z.object({
    roomname: z.string().min(3).max(20)
})