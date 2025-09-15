// context/ChatContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";
import { Message } from "@/app/types/message";
import { detectIntent } from "@/lib/intent";

type ChatContextType = {
  messages: Message[];
  sendMessage: (text: string) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = (text: string) => {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      sender: "user",
      type: "text",
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);

    // Detect intent
    const intent = detectIntent(text);
    console.log("User text:", text, "Intent detected:", intent);
    if (intent === "input_data") {
      const botMsg: Message = {
        id: crypto.randomUUID(),
        sender: "bot",
        type: "action",
        action: "openCamera",
        label: "📷 Mở Camera",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } else {
      const botMsg: Message = {
        id: crypto.randomUUID(),
        sender: "bot",
        type: "text",
        content: "Bot đã nhận: " + text,
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
