"use client";

import { useChat } from "@/app/context/ChatContext";
import { Message } from "@/app/types/message";
import { Avatar } from "@mui/material"; // or replace with your own icon/img

export default function MessageList() {
  const { messages } = useChat();

  // Simple date formatter like in chat.tsx
  const formatDate = (dateValue: string | number) => {
    const date = new Date(dateValue);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateValue: string | number) => {
    const date = new Date(dateValue);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Group messages by day
  const groupedMessages = messages.reduce(
    (groups: Record<string, Message[]>, msg) => {
      const day = new Date(msg.timestamp).toDateString();
      if (!groups[day]) groups[day] = [];
      groups[day].push(msg);
      return groups;
    },
    {}
  );

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto h-[70vh] bg-gray-50 rounded-lg">
      {Object.entries(groupedMessages).map(([day, dayMessages]) => (
        <div key={day}>
          {/* Date separator */}
          <div className="text-center text-gray-500 text-sm my-2">
            {formatDate(day)}
          </div>

          {dayMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 mb-2 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {/* Avatar */}
              {msg.sender === "bot" && (
                <Avatar sx={{ width: 28, height: 28 }}>🤖</Avatar>
              )}

              <div
                className={`p-2 rounded-lg max-w-xs relative ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.type === "text" && <span>{msg.content}</span>}

                {msg.type === "action" && (
                  <button className="px-3 py-1 bg-green-500 text-white rounded">
                    {msg.label}
                  </button>
                )}

                {/* Timestamp */}
                <div className="text-[10px] text-gray-400 mt-1 text-right">
                  {formatTime(msg.timestamp)}
                </div>
              </div>

              {msg.sender === "user" && (
                <Avatar sx={{ width: 28, height: 28 }}>🧑</Avatar>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
