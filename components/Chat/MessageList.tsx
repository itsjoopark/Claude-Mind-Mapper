"use client";

import { useChat } from "@/context/ChatContext";
import { User, Sparkles } from "lucide-react";

export default function MessageList() {
  const { currentChat, isLoading, userName } = useChat();

  if (!currentChat) return null;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {currentChat.messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-4 mb-6 ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {message.role === "assistant" && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
              <Sparkles size={16} className="text-accent" />
            </div>
          )}
          
          <div
            className={`max-w-[80%] px-4 py-3 rounded-2xl ${
              message.role === "user"
                ? "bg-primary text-white"
                : "bg-white border border-border text-primary"
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>

          {message.role === "user" && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-medium">
              {userName.charAt(0)}
            </div>
          )}
        </div>
      ))}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex gap-4 mb-6">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
            <Sparkles size={16} className="text-accent" />
          </div>
          <div className="bg-white border border-border rounded-2xl px-4 py-3">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-secondary/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-secondary/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-secondary/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
