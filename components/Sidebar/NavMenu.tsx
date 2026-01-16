"use client";

import { Plus, MessageSquare, FolderOpen, Sparkles, Share2 } from "lucide-react";
import { useChat } from "@/context/ChatContext";

export default function NavMenu() {
  const { createNewChat, viewMode, setViewMode } = useChat();

  const menuItems = [
    { icon: MessageSquare, label: "Chats", onClick: () => setViewMode("chat"), isActive: viewMode === "chat" },
    { icon: FolderOpen, label: "Projects", onClick: () => {}, isActive: false },
    { icon: Sparkles, label: "Artifacts", onClick: () => {}, isActive: false },
    { icon: Share2, label: "Graph", onClick: () => setViewMode("graph"), isActive: viewMode === "graph" },
  ];

  return (
    <nav className="px-3 py-2 space-y-1">
      {/* New Chat Button */}
      <button
        onClick={() => {
          setViewMode("chat");
          createNewChat();
        }}
        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-primary hover:bg-white/60 transition-colors"
      >
        <Plus size={18} />
        <span className="text-sm font-medium">New chat</span>
      </button>

      {/* Menu Items */}
      {menuItems.map((item) => (
        <button
          key={item.label}
          onClick={item.onClick}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors ${
            item.isActive
              ? "bg-white/80 text-primary font-medium"
              : "text-primary hover:bg-white/60"
          }`}
        >
          <item.icon size={18} />
          <span className="text-sm">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
