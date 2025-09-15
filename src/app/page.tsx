"use client";

import { ChatProvider } from "@/app/context/ChatContext";
import MessageList from "@/app/components/MessageList";
import InputBox from "@/app/components/InputBox";

export default function Home() {
  return (
    <ChatProvider>
      <main className="flex flex-col items-center justify-center h-screen">
        <div className="w-full max-w-md flex flex-col border rounded-lg shadow bg-white">
          <MessageList />
          <InputBox />
        </div>
      </main>
    </ChatProvider>
  );
}
