"use client";

import { useChat } from "@/context/ChatContext";

export default function RecentChats() {
  const { chats, currentChatId, selectChat } = useChat();

  return (
    <div className="px-3 py-2">
      <h3 className="px-3 py-2 text-xs font-medium text-secondary uppercase tracking-wider">
        Recents
      </h3>
      <div className="space-y-0.5">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => selectChat(chat.id)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors truncate ${
              currentChatId === chat.id
                ? "bg-white/80 text-primary"
                : "text-primary hover:bg-white/50"
            }`}
          >
            {chat.title}
          </button>
        ))}
      </div>
    </div>
  );
}
