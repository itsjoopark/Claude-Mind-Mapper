"use client";

import { ChevronUp } from "lucide-react";
import { useChat } from "@/context/ChatContext";

export default function UserProfile() {
  const { userName } = useChat();

  return (
    <div className="p-3 border-t border-border">
      <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-white/60 transition-colors">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
          {userName.charAt(0)}
        </div>
        
        {/* User Info */}
        <div className="flex-1 text-left">
          <div className="text-sm font-medium text-primary">{userName}</div>
          <div className="text-xs text-secondary">Pro plan</div>
        </div>
        
        {/* Chevron */}
        <ChevronUp size={16} className="text-secondary" />
      </button>
    </div>
  );
}
