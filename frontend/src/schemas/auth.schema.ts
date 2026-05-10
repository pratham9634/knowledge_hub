import {z} from "zod"

export const signupSchema = z.object({
    name: z.string(),
    email: z.email(),  
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
}).refine((data)=> data.password === data.confirmPassword,{
    message: "Passwords do not match",
})

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
})

