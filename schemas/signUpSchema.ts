import {z} from "zod"

export const usernameValidation = z
  .string()
  .min(2, "Username must be at least 2 characters long")
  .max(15, "Username must not exceed 15 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username cannot contain special characters");


export const signUpSchema = z.object({
    username:usernameValidation,
    email:z.string().email({message:'Invalid email address'}),
    password:z.string().min(6,{message:"password must be at least 6 characters"})
})  
