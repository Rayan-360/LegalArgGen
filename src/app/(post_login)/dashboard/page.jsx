"use client"
import LogoImg from "@/components/logoimg";
import Sidebar from "@/components/sidebar";
import { useAuth } from "@/lib/AuthContext";
import Image from "next/image";
import UserProfile from "@/components/user_info";
import { useEffect, useRef, useState } from "react";
import ChatInput from "@/components/chatinput";
import { fetchAllChats } from "@/actions/chats";


export default function DashBoard() {

    const [open,setOpen] = useState(false);
    const [chats,setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);

    const { user } = useAuth();
    // const userId = user?.id;
    

    const dropdownRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(e){
            if(dropdownRef.current && !dropdownRef.current.contains(e.target)){
                setOpen(false);
            }
        }
        document.addEventListener('mousedown',handleClickOutside);
        async function getChats(){
            const chats = await fetchAllChats();
            setChats(chats);
        }
        getChats();
        return () => {
            document.removeEventListener('mousedown',handleClickOutside);
        }

    },[])


    

    return (
        <div className="flex h-screen w-full">
            <Sidebar chats={chats} activeChat={activeChat} setActiveChat={setActiveChat} user={user}/>
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
                <div className="flex h-full flex-col">
                    {activeChat ? (
                        
                        <div className="flex flex-col h-full justify-between">
                            <div className="flex-1 overflow-y-auto px-10 py-6 space-y-4 flex justify-center mb-2">
                                <div className="w-full max-w-[850px] px-6 space-y-4">
                                    {activeChat.messages.map((msg,idx) => (
                                        <div
                                            key={idx}
                                            className={`flex ${msg.sender === 'user'?'justify-end':'justify-start'}`}>
                                                <div className={`px-4 py-4 rounded-2xl max-w-[80%] whitespace-pre-wrap break-words ${msg.sender === 'user' ? 'bg-[#e9e7e5] dark:bg-[#2F2F2F]':""}`}>
                                                    {msg.text}
                                                </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="w-full flex justify-center mb-4">
                                <div className="">
                                    <ChatInput
                                    activeChat={activeChat}
                                    setActiveChat={setActiveChat}
                                    setChats={setChats}
                                    user = {user}
                                    />
                                </div>
                            </div>
                        </div>
                    ) :(
                    <div className="flex h-full items-center justify-center">
                        <div className="text-center">
                            <div className="flex flex-col gap-5 items-center justify-center mb-4 ml-6 sm:ml-0">
                                <div className="flex items-center justify-center gap-2">
                                    <LogoImg width={70} height={70}/>
                                    <h1 className="text-4xl font-semibold ">ArguMentor</h1>
                                </div>
                                <ChatInput  activeChat={activeChat} setActiveChat={setActiveChat} setChats={setChats} user = {user}/>
                            </div>
                        </div>
                    </div>

                    )}
                </div>
            </div>
        </div>
    )
}
