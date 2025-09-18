"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const formatDateLabel = (date: Date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Got it! (mock bot reply)",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1000);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Group messages by date
  const groupedMessages = messages.reduce(
    (acc: Record<string, Message[]>, msg) => {
      const dateLabel = formatDateLabel(msg.timestamp);
      if (!acc[dateLabel]) acc[dateLabel] = [];
      acc[dateLabel].push(msg);
      return acc;
    },
    {}
  );

  return (
    <div className="flex flex-col h-[80vh] w-full max-w-lg mx-auto border rounded-2xl shadow-lg bg-white">
      {/* Message List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-6">
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            {/* Date Separator */}
            <div className="text-center text-sm text-gray-500 mb-2">{date}</div>
            {msgs.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div className="flex items-end">
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
                {/* Timestamp */}
                <span className="text-xs text-gray-400 mt-1 px-2">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            ))}
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
