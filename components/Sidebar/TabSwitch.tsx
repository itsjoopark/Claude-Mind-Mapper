"use client";

import { useChat } from "@/context/ChatContext";

export default function TabSwitch() {
  const { activeTab, setActiveTab } = useChat();

  return (
    <div className="flex bg-white rounded-lg p-1 shadow-sm">
      <button
        onClick={() => setActiveTab("chat")}
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
          activeTab === "chat"
            ? "bg-background text-primary shadow-sm"
            : "text-secondary hover:text-primary"
        }`}
      >
        Chat
      </button>
      <button
        onClick={() => setActiveTab("code")}
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
          activeTab === "code"
            ? "bg-background text-primary shadow-sm"
            : "text-secondary hover:text-primary"
        }`}
      >
        Code
      </button>
    </div>
  );
}
