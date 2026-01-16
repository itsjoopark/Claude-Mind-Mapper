"use client";

import Sidebar from "@/components/Sidebar/Sidebar";
import ChatArea from "@/components/Chat/ChatArea";
import GraphView from "@/components/Graph/GraphView";
import { useChat } from "@/context/ChatContext";

export default function Home() {
  const { viewMode } = useChat();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-hidden relative">
        {viewMode === "chat" ? <ChatArea /> : <GraphView />}
      </main>
    </div>
  );
}
