"use client";

import { useState } from "react";
import { useChat } from "@/app/context/ChatContext";

export default function InputBox() {
  const { sendMessage } = useChat();
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const isDisabled = !input.trim();

  return (
    <div className="flex items-center gap-2 p-3 border-t bg-gray-50">
      <input
        className="flex-1 px-4 py-2 rounded-full bg-white shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-400
                   placeholder-gray-400 text-sm"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Nhập tin nhắn..."
      />
      <button
        className={`px-5 py-2 rounded-full shadow-sm transition-all duration-200 
          ${
            isDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed scale-90"
              : "bg-blue-500 text-white hover:bg-blue-600 scale-100"
          }`}
        onClick={handleSend}
        disabled={isDisabled}
      >
        Gửi
      </button>
    </div>
  );
}
