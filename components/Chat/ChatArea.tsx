"use client";

import { useChat } from "@/context/ChatContext";
import Greeting from "./Greeting";
import InputField from "./InputField";
import QuickActions from "./QuickActions";
import MessageList from "./MessageList";

export default function ChatArea() {
  const { currentChat } = useChat();

  const hasMessages = currentChat && currentChat.messages.length > 0;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Messages area or empty state */}
      {hasMessages ? (
        <>
          <div className="flex-1 overflow-y-auto">
            <MessageList />
          </div>
          {/* Input area at bottom when chatting */}
          <div className="px-4 pb-6">
            <div className="max-w-4xl mx-auto">
              <InputField />
            </div>
          </div>
        </>
      ) : (
        /* Landing page - centered content */
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-[680px] flex flex-col items-center">
            <Greeting />
            <div className="w-full mt-6">
              <InputField />
            </div>
            <QuickActions />
          </div>
        </div>
      )}
    </div>
  );
}
