"use client"
import LogoImg from "@/components/logoimg";
import Sidebar from "@/components/sidebar";
import { useAuth } from "@/lib/AuthContext";
import Image from "next/image";
import UserProfile from "@/components/user_info";
import { useEffect, useRef, useState } from "react";
import ChatInput from "@/components/chatinput";


export default function DashBoard() {

    const [open,setOpen] = useState(false);

    const { user } = useAuth();

    const dropdownRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(e){
            if(dropdownRef.current && !dropdownRef.current.contains(e.target)){
                setOpen(false);
            }
        }
        document.addEventListener('mousedown',handleClickOutside);
        return () => {
            document.removeEventListener('mousedown',handleClickOutside);
        }
    },[])

    

    return (
        <div className="flex h-screen w-full">
            <Sidebar />
            <div className="flex-1 relative bg-[#F8F7F6] dark:bg-[#161618] dark:text-white">
                
                <div className="absolute top-4 right-4 flex gap-2" >
                    {user && (
                        <div className="w-10 h-10 overflow-hidden rounded-full cursor-pointer" onClick={() => setOpen((prev) => !prev)}>
                            <Image src={user.user_metadata?.avatar_url || "/user.png"} alt="avatar" width={40} height={40} className="object-cover w-full h-full"/>
                        </div>

                    )}
                </div>

                <div className="absolute top-16 right-4 z-50" ref={dropdownRef}>
                    {open && <UserProfile/>}
                </div>
                
                <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                        <div className="flex flex-col gap-5 items-center justify-center mb-4">
                            <div className="flex items-center justify-center">
                                <LogoImg width={70} height={70}/>
                                <h1 className="text-4xl font-semibold">ArguMentor</h1>
                            </div>
                            <ChatInput/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
