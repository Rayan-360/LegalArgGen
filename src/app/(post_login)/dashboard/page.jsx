"use client"
import { Logout } from "@/actions/auth"
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function DashBoard(){

    const router = useRouter();

    const handleLogout = () => {
        Logout();
    }
    const user = useAuth();
    useEffect(() => {
        if (!user) {
        router.push("/"); // client-side redirect if no user
        }
    }, [user, router]);
    
    
    return(
        <div className="min-h-screen flex items-center bg-gray-300 dark:bg-[#161618] justify-center dark:text-white">
            DashBoard
            <button className="bg-red-500 text-white p-3 rounded-md m-2" onClick={handleLogout}>Logout</button>
        </div>
    )
}