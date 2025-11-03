import {
  addUserOnlyMessage,
  generateAndAppendBotMessage,
} from "@/actions/chats";
import { useRef, useState } from "react";

const ChatInput = ({ setChats, activeChat, setActiveChat, user }) => {
  const textareaRef = useRef(null);
  const [isMultiline, setIsMultiline] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const [message, setMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const abortControllerRef = useRef(null);

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
    const inputText = textareaRef.current.value.trim();
    if (!inputText || isGenerating) return;

    setIsGenerating(true);
    abortControllerRef.current = new AbortController();

    // 1) Immediately persist the user message (no waiting for bot)
    const updatedChat = await addUserOnlyMessage({
      userId: user.id,
      chatId: activeChat?._id,
      title: inputText.slice(0, 30),
      text: inputText,
    });

    if (!updatedChat) {
      console.error("Failed to persist user message");
      setIsGenerating(false);
      return;
    }

    // Clear input right away for snappy UX
    textareaRef.current.value = "";
    handleInput();

    // 2) Optimistically show a temporary bot placeholder
    const placeholderBot = {
      text: "Generating...",
      sender: "bot",
      createdAt: new Date(),
      _temp: true,
    };
    const updatedWithPlaceholder = {
      ...updatedChat,
      messages: [...(updatedChat.messages || []), placeholderBot],
    };

    if (!activeChat) {
      // New chat path
      setChats((prev) => [updatedWithPlaceholder, ...prev]);
    } else {
      // Existing chat path: replace and move to top
      setChats((prev) => {
        const updated = prev.map((chat) =>
          chat._id === updatedWithPlaceholder._id
            ? updatedWithPlaceholder
            : chat
        );
        const movedToTop = [
          updated.find((chat) => chat._id === updatedWithPlaceholder._id),
          ...updated.filter((chat) => chat._id !== updatedWithPlaceholder._id),
        ];
        return movedToTop;
      });
    }
    setActiveChat(updatedWithPlaceholder);

    // 3) Generate and append the real bot message, then refresh chat state
    try {
      const finalChat = await generateAndAppendBotMessage({
        userId: user.id,
        chatId: updatedChat._id,
        userText: inputText,
      });

      if (!finalChat) {
        console.error("Failed to generate bot response");
        return;
      }

      setChats((prev) => {
        const updated = prev.map((chat) =>
          chat._id === finalChat._id ? finalChat : chat
        );
        const movedToTop = [
          updated.find((chat) => chat._id === finalChat._id),
          ...updated.filter((chat) => chat._id !== finalChat._id),
        ];
        return movedToTop;
      });
      setActiveChat(finalChat);
    } catch (err) {
      console.error("Generation error:", err);
      // Remove placeholder on error
      setChats((prev) => {
        const updated = prev.map((chat) => {
          if (chat._id === updatedChat._id) {
            return {
              ...chat,
              messages: chat.messages.filter((m) => !m._temp),
            };
          }
          return chat;
        });
        return updated;
      });
      setActiveChat((prev) => ({
        ...prev,
        messages: prev.messages.filter((m) => !m._temp),
      }));
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
      abortControllerRef.current = null;

      // Remove the "Generating..." placeholder
      setChats((prev) => {
        const updated = prev.map((chat) => {
          if (chat._id === activeChat?._id) {
            return {
              ...chat,
              messages: chat.messages.filter((m) => !m._temp),
            };
          }
          return chat;
        });
        return updated;
      });
      setActiveChat((prev) => ({
        ...prev,
        messages: prev.messages.filter((m) => !m._temp),
      }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSend();
      e.preventDefault();
    }
  };

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

      {/* Send/Stop button */}
      {isGenerating ? (
        <button
          onClick={handleStop}
          className="w-10 h-10 rounded-full dark:bg-white bg-gray-600 flex items-center justify-center absolute right-3 bottom-3.5 cursor-pointer"
        >
          <i className="ri-stop-circle-line dark:text-black text-white text-2xl font-semibold"></i>
        </button>
      ) : (
        <button
          onClick={handleSend}
          className={`w-10 h-10 rounded-full dark:bg-white bg-gray-600 flex items-center justify-center absolute right-3 bottom-3.5 cursor-pointer
            ${
              message.trim() ? "opacity-100" : "opacity-50 cursor-not-allowed"
            }`}
        >
          <i className="ri-arrow-up-line dark:text-black text-white text-2xl font-semibold"></i>
        </button>
      )}

      {/* Custom scrollbar styling */}
      <style jsx>{`
        textarea::-webkit-scrollbar {
          width: 6px;
        }
        textarea::-webkit-scrollbar-thumb {
          background-color: rgba(
            100,
            100,
            100,
            0.4
          ); /* visible in light mode */
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
