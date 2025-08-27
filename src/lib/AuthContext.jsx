"use client"

import { supabase } from "./supabase-client";
import { createContext,useContext,useEffect,useState } from "react"

const AuthContext = createContext();

export function AuthProvider({children}){
    const [session,setSession] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({data}) => {
            setSession(data.session);
        })
        console.log(session);
        
        const {data : listener} = supabase.auth.onAuthStateChange((e,newSession) => {
            setSession(newSession);
        })
    
        return () => {
            listener.subscription.unsubscribe();
        }
    },[])

    return (
        <AuthContext.Provider value={{session,user : session?.user}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    return useContext(AuthContext);
}