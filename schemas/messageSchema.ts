import {z} from "zod"


export const messageSchema = z.object({
    content:z
    .string()
    .min(10,{message: 'Content must be at least of 10 char'})
    .max(300, {message:'Content must not exceed 300 characters'})
}) 