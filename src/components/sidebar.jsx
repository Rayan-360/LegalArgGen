import { useEffect, useState } from "react";
import LogoImg from "./logoimg";

export default function Sidebar({chats,activeChat,setActiveChat,user}) {
  const [isOpen, setIsOpen] = useState(true);

  const handleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  


  return (
    <aside
      className={`h-screen transition-all duration-300 lg:relative lg:flex-shrink-0 fixed top-0 left-0 z-40 lg:z-auto ${
        isOpen ? "w-64 sm:w-56 lg:w-64" : "w-16"
      }`}
    >
      <nav className="h-full flex flex-col dark:bg-[#161618] bg-[#F8F7F6] border-r dark:border-[#242426] border-gray-300 shadow-sm relative">
        {/* Logo */}
        <div className="flex items-center w-12 h-12 ml-2 justify-center mt-4 hover:bg-[#28282A] rounded-lg cursor-pointer">
          <LogoImg height={35} width={35} />
        </div>

        {/* Menu */}
        <div className="flex flex-col h-full justify-between mt-8">
          <div className="flex flex-col gap-2">
            {/* New Chat */}
            <div
              className={`flex items-center h-10  rounded-lg dark:hover:bg-[#28282A] hover:bg-[#bcbcbc] cursor-pointer transition mx-3 ${
                isOpen ? "justify-start gap-3 px-3" : "justify-center w-10"
              }`}
              onClick={()=>setActiveChat(null)}
            >
              <i className="ri-edit-box-line text-black dark:text-white text-xl"></i>
              {isOpen && <span className="text-sm text-black dark:text-white whitespace-nowrap">New Chat</span>}
            </div>

            {/* Chat History */}
            <div>
              <div
                className={`flex items-center  h-10 rounded-lg dark:hover:bg-[#28282A] hover:bg-[#bcbcbc] cursor-pointer transition mx-3 ${
                  isOpen ? "justify-start gap-3 px-3" : "justify-center w-10"
                }`}
              >
                <i className="ri-history-line text-black dark:text-white text-xl"></i>
                {isOpen && (
                  <span className="text-sm text-black dark:text-white whitespace-nowrap">Chat History</span>
                )}
              </div>

            {/* Only render chat history if sidebar is open */}
            {isOpen && (
              <div className="flex flex-col gap-1 mt-2">
                {chats.map((chat, index) => (
                  <div
                    key={chat._id}
                    className={`group flex items-center justify-between h-10 rounded-lg dark:hover:bg-[#28282A] hover:bg-[#bcbcbc] cursor-pointer transition mx-3 px-3
                                ${activeChat?._id === chat._id ? "dark:bg-[#303030] bg-[#a5a5a4]":""}`}
                    onClick={()=> setActiveChat(chat)}
                  >
                    <span className="text-sm text-black dark:text-white truncate text-nowrap">{chat.title}</span>
                    <i className="ri-more-fill text-black dark:text-white opacity-0 group-hover:opacity-100 transition-opacity text-xl"></i>
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>

          {/* Toggle Button */}
          <div className="flex justify-end mb-4 px-3">
            <div
              className="rounded-full h-10 w-10 dark:hover:bg-[#28282A] hover:bg-[#bcbcbc] flex items-center justify-center text-xl cursor-pointer"
              onClick={handleSidebar}
            >
              <i
                className={`${
                  isOpen
                    ? "ri-arrow-left-double-fill"
                    : "ri-arrow-right-double-fill"
                } text-black dark:text-white`}
              ></i>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}
