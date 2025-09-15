"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // Mock bot reply after 1s
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Got it! (mock bot reply)",
          sender: "bot",
        },
      ]);
      setIsTyping(false);
    }, 1000);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[80vh] w-full max-w-lg mx-auto border rounded-2xl shadow-lg bg-white">
      {/* Message List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "bot" && (
              <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white mr-2">
                🤖
              </div>
            )}
            <div
              className={`px-4 py-2 rounded-2xl max-w-[75%] shadow ${
                msg.sender === "user"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              {msg.text}
            </div>
            {msg.sender === "user" && (
              <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white ml-2">
                😊
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="text-sm text-gray-500 italic">Bot is typing...</div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Box */}
      <div className="flex border-t p-3 bg-gray-50">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 border rounded-2xl px-4 py-2 mr-2 outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-5 py-2 rounded-2xl hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
