"use server"
import { LoginFormSchema,SignUpFormSchema } from "@/lib/rules"
import { supabase } from "@/lib/supabase-client";
import { redirect } from "next/navigation";
import * as z from "zod"

export async function SignUpForm(state,formData){
    const validatedFields = SignUpFormSchema.safeParse({
        name : formData.get('name'),
        email : formData.get('email'),
        password : formData.get('pass'),
        confirmPassword : formData.get('cpass')
    })
    if(!validatedFields.success){
        const flattened = z.flattenError(validatedFields.error);
        
        return {
            errors : flattened.fieldErrors,
            name : formData.get('name'),
            email : formData.get('email')
        }
    }

    const {name,email,password} = validatedFields.data;

    const {data,error} = await supabase.auth.signUp({
        email : email,
        password : password,
        options : {
            data : {
                name : name,
            },
        },
    })

    if(error){
        return {errors : {email : [error.message]}}
    }
    
    //check if user already exists
    if(data?.user?.identities?.length === 0){
        return {
            errors: { email: ["This email is already registered. Please log in instead."] }
        };
    }
    
    return {
        success : true,
        message : "Signup successful! Please check your email to verify your account.",
        user : data.user,
    }


}

export async function LoginForm(state,formData){
    const validatedFields = LoginFormSchema.safeParse({
        email : formData.get('email'),
        password : formData.get('pass')
    })
    if(!validatedFields.success){
        const flattened = z.flattenError(validatedFields.error);
        console.log(flattened.fieldErrors);
        
        return {
            errors : flattened.fieldErrors,
            email : formData.get('email')
        }
    }

    const {email,password} = validatedFields.data;

    const {data,error} = await supabase.auth.signInWithPassword({
        email : email,
        password : password,
    })

    if(error){
        return {errors : {email : [error.message]}}
    }
    // console.log(data.session);

    redirect('/dashboard');

}