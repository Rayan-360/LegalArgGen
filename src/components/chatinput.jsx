import { addMessage } from "@/actions/chats";
import { useRef, useState } from "react";

const ChatInput = ({setChats,activeChat,setActiveChat,user}) => {
  const textareaRef = useRef(null);
  const [isMultiline, setIsMultiline] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const [message, setMessage] = useState("");

  const handleInput = () => {
    const textarea = textareaRef.current;

    // Reset height so shrinking works
    textarea.style.height = "auto";

    // Limit the auto-resize height (e.g. 160px ~ 5 lines)
    const maxHeight = 160;
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;

    // Multiline check
    setIsMultiline(textarea.scrollHeight > 48);

    // Scrollbar only if content exceeds maxHeight
    setIsScrollable(textarea.scrollHeight > maxHeight);
    setMessage(textarea.value);
  };

  const handleSend = async () => {
    const message = textareaRef.current.value.trim();
    if(!message) return;

    const updatedChat = await addMessage({
      userId:user.id,
      chatId:activeChat?._id,
      title:message.slice(0,30),
      text:message,
      sender:"user"
    })
    if(!updatedChat) {
      console.error("Failed to send message");
      return;
    }

    if(!activeChat){
      setChats(prev => [updatedChat,...prev]);
    }
    else{
        setChats(prev => {
          // update that chat’s data
          const updated = prev.map(chat =>
            chat._id === updatedChat._id ? updatedChat : chat
          );

          // move updated chat to the top
          const movedToTop = [
            updated.find(chat => chat._id === updatedChat._id),
            ...updated.filter(chat => chat._id !== updatedChat._id),
          ];

          return movedToTop;
        });
    }
    setActiveChat(updatedChat);
    textareaRef.current.value = "";
    handleInput();

  }

  const handleKeyDown = (e) => {
    if(e.key === "Enter" && !e.shiftKey){
      handleSend();
      e.preventDefault();
    }
  }



  return (
    <div className="relative w-full sm:w-[600px] ml-6 sm:ml-0 md:w-[700px] lg:w-[800px]">
      <textarea
        ref={textareaRef}
        rows={1}
        placeholder="Ask Anything"
        onInput={handleInput}
        className={`dark:border-none border border-gray-400 dark:bg-[#303030] bg-[#FCFCFC] 
          w-full px-6 pr-14 py-4 dark:text-white placeholder-gray-400 resize-none transition-all duration-200
          ${isMultiline ? "rounded-2xl" : "rounded-full"}`}
        style={{
          overflowY: isScrollable ? "auto" : "hidden",
          maxHeight: "160px",
          boxSizing: "border-box", // fixes scrollbar alignment
        }}
        onKeyDown={handleKeyDown}
      />

      {/* Send button */}
      <button
        onClick={handleSend}
        className={`w-10 h-10 rounded-full dark:bg-white bg-gray-600 flex items-center justify-center absolute right-3 bottom-3.5 cursor-pointer
          ${message.trim() ? "opacity-100" : "opacity-50 cursor-not-allowed"}`}
      >
        <i className="ri-arrow-up-line dark:text-black text-white text-2xl font-semibold"></i>
      </button>

      {/* Custom scrollbar styling */}
      <style jsx>{`
        textarea::-webkit-scrollbar {
          width: 6px;
        }
        textarea::-webkit-scrollbar-thumb {
          background-color: rgba(100, 100, 100, 0.4); /* visible in light mode */
          border-radius: 10px;
        }
        textarea::-webkit-scrollbar-thumb:hover {
          background-color: rgba(100, 100, 100, 0.6);
        }
        textarea::-webkit-scrollbar-track {
          background: transparent;
        }
        /* Dark mode fix */
        :global(.dark) textarea::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.3);
        }
        :global(.dark) textarea::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default ChatInput;
