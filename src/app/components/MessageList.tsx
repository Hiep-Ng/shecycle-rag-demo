"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@/app/context/ChatContext";
import { ActionMessage, Message } from "@/app/types/message";
import { Avatar } from "@mui/material"; // or replace with your own icon/img
import { Button } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

export default function MessageList() {
  const { messages } = useChat();
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

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

  const groupedMessages = messages.reduce(
    (groups: Record<string, Message[]>, msg) => {
      const day = new Date(msg.timestamp).toDateString();
      if (!groups[day]) groups[day] = [];
      groups[day].push(msg);
      return groups;
    },
    {}
  );

  const handleAction = (msg: ActionMessage) => {
    switch (msg.action) {
      case "openCamera":
        console.log("📸 Opening camera…");
        // simplest version: trigger hidden <input type="file" capture="environment" />
        document.getElementById("cameraInput")?.click();
        break;
      default:
        console.warn("Unknown action:", msg.action);
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-4 p-4 pb-3 overflow-y-auto h-[70vh] bg-gray-50 rounded-lg"
    >
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

                {msg.type === "typing" && (
                  <div className="flex gap-1 items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                )}

                {msg.type === "action" && msg.action === "openCamera" && (
                  <label htmlFor={`cameraInput-${msg.id}`}>
                    <input
                      id={`cameraInput-${msg.id}`}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          console.log("📷 Got photo:", file);
                          // TODO: push to context as a new message
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      component="span"
                      color="success"
                      startIcon={<PhotoCamera />}
                    >
                      {msg.label}
                    </Button>
                  </label>
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
