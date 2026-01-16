"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export type ViewMode = "chat" | "graph";

interface ChatContextType {
  chats: Chat[];
  currentChatId: string | null;
  currentChat: Chat | null;
  activeTab: "chat" | "code";
  selectedModel: string;
  isLoading: boolean;
  viewMode: ViewMode;
  createNewChat: () => void;
  selectChat: (chatId: string) => void;
  sendMessage: (content: string) => Promise<void>;
  setActiveTab: (tab: "chat" | "code") => void;
  setSelectedModel: (model: string) => void;
  setViewMode: (mode: ViewMode) => void;
  userName: string;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Sample recent chats for demo
const initialChats: Chat[] = [
  {
    id: "1",
    title: "Claude's mind mapping capabilit...",
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Claude's accessibility feature gaps",
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    title: "Mind map creation",
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    title: "Face tracking 3D collage sketch",
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    title: "LaTeX header alignment and for...",
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    title: "Cellular automata and Conway's ...",
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "7",
    title: "Standardizing bullet point font si...",
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "8",
    title: "Pre-PMF and post-PMF product ...",
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "9",
    title: "Creative projects",
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "10",
    title: "Expanding Digital Support & Op...",
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "11",
    title: "Yarn shader for three.js brush tool",
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "12",
    title: "Animating text with point cloud...",
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "13",
    title: "Productivity tools",
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "14",
    title: "Fibonacci sequence",
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "15",
    title: "Paper pull-off interaction canvas...",
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "16",
    title: "Interactive Japanese calendar ri...",
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Mock AI responses
const mockResponses = [
  "I'd be happy to help you with that! Let me think about the best approach...",
  "That's an interesting question. Here's what I can tell you...",
  "Great idea! Here's how we can approach this problem...",
  "I understand what you're looking for. Let me break this down for you...",
  "Thanks for sharing that context. Based on what you've told me...",
];

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"chat" | "code">("chat");
  const [selectedModel, setSelectedModel] = useState("Opus 4.5");
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("chat");
  const userName = "Jules";

  const currentChat = chats.find((chat) => chat.id === currentChatId) || null;

  const createNewChat = useCallback(() => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  }, []);

  const selectChat = useCallback((chatId: string) => {
    setCurrentChatId(chatId);
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      let chatId = currentChatId;

      // Create new chat if none selected
      if (!chatId) {
        const newChat: Chat = {
          id: Date.now().toString(),
          title: content.slice(0, 30) + (content.length > 30 ? "..." : ""),
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setChats((prev) => [newChat, ...prev]);
        chatId = newChat.id;
        setCurrentChatId(chatId);
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      // Add user message
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [...chat.messages, userMessage],
                title:
                  chat.messages.length === 0
                    ? content.slice(0, 30) + (content.length > 30 ? "..." : "")
                    : chat.title,
                updatedAt: new Date(),
              }
            : chat
        )
      );

      // Simulate AI response
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: mockResponses[Math.floor(Math.random() * mockResponses.length)],
        timestamp: new Date(),
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [...chat.messages, assistantMessage],
                updatedAt: new Date(),
              }
            : chat
        )
      );

      setIsLoading(false);
    },
    [currentChatId]
  );

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChatId,
        currentChat,
        activeTab,
        selectedModel,
        isLoading,
        viewMode,
        createNewChat,
        selectChat,
        sendMessage,
        setActiveTab,
        setSelectedModel,
        setViewMode,
        userName,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
