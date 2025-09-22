// context/ChatContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";
import { Message } from "@/app/types/message";

type ChatContextType = {
  messages: Message[];
  sendMessage: (text: string) => Promise<void>;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async (text: string) => {
    // 1. Add user message
    const userMsg: Message = {
      id: crypto.randomUUID(),
      sender: "user",
      type: "text",
      content: text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);

    const typingId = crypto.randomUUID();
    const typingMsg: Message = {
      id: typingId,
      sender: "bot",
      type: "typing",
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, typingMsg]);

    try {
      // 2. Call backend API (/api/chat) -> Ollama
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      // 4️⃣ Remove typing message
      setMessages((prev) => prev.filter((m) => m.id !== typingId));

      // 3. Add bot message
      const botMsg: Message = {
        id: crypto.randomUUID(),
        sender: "bot",
        type: "text",
        content: data.reply || "⚠️ Không nhận được phản hồi",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);

      // 4. 🔑 Nếu bot trả lời có nhắc tới "nhập liệu"
      if (data.reply && data.reply.toLowerCase().includes("nhập liệu")) {
        const actionMsg: Message = {
          id: crypto.randomUUID(),
          sender: "bot",
          type: "action",
          action: "openCamera",
          label: "📷 Mở Camera",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, actionMsg]);
      }
    } catch (err) {
      console.error("Error calling LLM:", err);
      const botMsg: Message = {
        id: crypto.randomUUID(),
        sender: "bot",
        type: "text",
        content: "❌ Có lỗi xảy ra khi gọi LLM.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
};
