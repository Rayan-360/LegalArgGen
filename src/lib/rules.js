import * as z from "zod";

export const SignUpFormSchema = z.object({
    name : z.string()
            .min(1,{message:"This field is required"})
            .trim(),
    email : z.email({message:"Please enter a valid email"}).trim(),
    password : z.string()
                .min(1,{message:"This field is required"})
                .min(8,{message:"Password must be atleast 8 characters"})
                .regex(/[a-zA-Z]/,{message:"must contain atleast one character"})
                .regex(/[0-9]/,{message:"must contain atleast one number"})
                .regex(/[^a-z0-9A-Z]/,{message:"must contain atleast one special character"})
                .trim(),
    confirmPassword:z.string().trim(),
}).refine((data) => data.password === data.confirmPassword,{
    message:"Passwords do not match",
    path:["confirmPassword"],
})

export const LoginFormSchema = z.object({
    email : z.email({message:"Please enter a valid email"}).trim(),
    password:z.string()
              .min(1,{message:"Password is required"}).trim(),
})