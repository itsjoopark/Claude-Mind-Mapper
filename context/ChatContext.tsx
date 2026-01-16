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
  dyslexiaMode: boolean;
  createNewChat: () => void;
  selectChat: (chatId: string) => void;
  sendMessage: (content: string) => Promise<void>;
  setActiveTab: (tab: "chat" | "code") => void;
  setSelectedModel: (model: string) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleDyslexiaMode: () => void;
  userName: string;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const now = Date.now();
const makeMessage = (role: Message["role"], content: string, offsetMinutes: number) => ({
  id: `${now + offsetMinutes * 60000}`,
  role,
  content,
  timestamp: new Date(now + offsetMinutes * 60000),
});

const seededMessagesByTitle: Record<string, Message[]> = {
  "Cellular automata and Conway's ...": [
    makeMessage(
      "user",
      "what is cellular automata and conway's game of life",
      -120
    ),
    makeMessage(
      "assistant",
      "Cellular automata are grid-based systems where each cell follows a few simple rules to update its state over time. Conway’s Game of Life is the most famous example: each cell is either alive or dead, and the next step depends on the number of live neighbors.",
      -118
    ),
    makeMessage(
      "assistant",
      "What makes it fascinating is how simple local rules produce complex, emergent behavior—patterns that look alive even though the system is fully deterministic.",
      -116
    ),
    makeMessage(
      "assistant",
      "Conway’s rules are just four lines:\n1. Live cell with fewer than 2 neighbors dies\n2. Live cell with 2–3 neighbors survives\n3. Live cell with more than 3 neighbors dies\n4. Dead cell with exactly 3 neighbors becomes alive",
      -114
    ),
    makeMessage(
      "assistant",
      "From these rules you get still lifes, oscillators, and moving patterns like the glider. People even built logic gates and computers inside the Game of Life.",
      -112
    ),
    makeMessage("user", "give a example", -110),
    makeMessage(
      "assistant",
      "Here’s a simple example using a 3‑cell “blinker.” It flips between vertical and horizontal every step.\n\nStarting pattern:\n. . . . .\n. . ■ . .\n. . ■ . .\n. . ■ . .\n. . . . .",
      -108
    ),
    makeMessage(
      "assistant",
      "Step 1 — apply the rules:\nThe center cell has 2 neighbors so it survives; the top and bottom die. Dead cells to the left/right of the center now have 3 neighbors, so they turn on.\n\nResult:\n. . . . .\n. . . . .\n. ■ ■ ■ .\n. . . . .\n. . . . .",
      -106
    ),
    makeMessage(
      "assistant",
      "That horizontal line flips back to vertical on the next step, so it oscillates forever.",
      -104
    ),
  ],
  "Claude's mind mapping capabilit...": [
    makeMessage("user", "Can you map a complex topic into a mind map?", -90),
    makeMessage(
      "assistant",
      "Yes — I can break a topic into themes, subtopics, and supporting ideas, then connect them into a structured map.",
      -88
    ),
  ],
  "Claude's accessibility feature gaps": [
    makeMessage("user", "What accessibility gaps should we prioritize?", -86),
    makeMessage(
      "assistant",
      "Top gaps are keyboard navigation, color contrast, and screen reader semantics. We can audit and rank by impact.",
      -84
    ),
  ],
  "Mind map creation": [
    makeMessage("user", "How do you structure a mind map?", -82),
    makeMessage(
      "assistant",
      "Start with a central theme, branch into categories, then expand each branch with supporting details.",
      -80
    ),
  ],
  "Face tracking 3D collage sketch": [
    makeMessage("user", "Could we prototype a face‑tracking collage?", -78),
    makeMessage(
      "assistant",
      "Yes — we can use a lightweight face mesh to drive layered textures in 3D space.",
      -76
    ),
  ],
  "LaTeX header alignment and for...": [
    makeMessage("user", "My LaTeX header alignment is off.", -74),
    makeMessage(
      "assistant",
      "We can fix it by adjusting the header box and matching baseline offsets across sections.",
      -72
    ),
  ],
  "Standardizing bullet point font si...": [
    makeMessage("user", "How should we standardize bullets?", -70),
    makeMessage(
      "assistant",
      "Define size tokens for bullets and line height to keep spacing consistent across components.",
      -68
    ),
  ],
  "Pre-PMF and post-PMF product ...": [
    makeMessage("user", "What changes post‑PMF?", -66),
    makeMessage(
      "assistant",
      "You move from exploration to optimization: growth loops, metrics, and process scale.",
      -64
    ),
  ],
  "Creative projects": [
    makeMessage("user", "How do you manage many creative threads?", -62),
    makeMessage(
      "assistant",
      "Use a lightweight backlog with themes, then timebox weekly focus to avoid context overload.",
      -60
    ),
  ],
  "Expanding Digital Support & Op...": [
    makeMessage("user", "How can we expand digital support?", -58),
    makeMessage(
      "assistant",
      "Layer self‑serve documentation, chat deflection, and guided flows for high‑volume issues.",
      -56
    ),
  ],
  "Yarn shader for three.js brush tool": [
    makeMessage("user", "How would a yarn shader work?", -54),
    makeMessage(
      "assistant",
      "Model it as anisotropic strands with a subtle weave normal and thin specular highlights.",
      -52
    ),
  ],
  "Animating text with point cloud...": [
    makeMessage("user", "Can we animate type using point clouds?", -50),
    makeMessage(
      "assistant",
      "Yes — sample glyph outlines into points and morph between states with easing.",
      -48
    ),
  ],
  "Productivity tools": [
    makeMessage("user", "What’s a simple productivity system?", -46),
    makeMessage(
      "assistant",
      "Capture → clarify → schedule. Keep tasks small and review weekly.",
      -44
    ),
  ],
  "Fibonacci sequence": [
    makeMessage("user", "Why does Fibonacci show up in design?", -42),
    makeMessage(
      "assistant",
      "It creates pleasing ratios and spiral growth patterns that feel natural to the eye.",
      -40
    ),
  ],
  "Paper pull-off interaction canvas...": [
    makeMessage("user", "How would a paper peel interaction feel?", -38),
    makeMessage(
      "assistant",
      "Use a curved peel mask, easing, and subtle shadow to mimic depth.",
      -36
    ),
  ],
  "Interactive Japanese calendar ri...": [
    makeMessage("user", "How should we visualize lunar dates?", -34),
    makeMessage(
      "assistant",
      "Overlay seasonal markers and show phases with soft gradients for quick scanning.",
      -32
    ),
  ],
  "Devouring Details Summary": [
    makeMessage("user", "Can you summarize Devouring Details?", -30),
    makeMessage(
      "assistant",
      "Rauno Freiberg (designer at Vercel) wrote \"Devouring Details\" as a piece about his approach to obsessive attention to micro-interactions and interface details. It's become a bit of a cult read in the design engineering community.\n\nThe core idea is about noticing and caring deeply about the small things — hover states, timing curves, pixel-level alignment, the feel of transitions — that most people won't consciously register but that collectively create the sense of polish and craft in an interface. He argues these details are worth obsessing over even if they're \"invisible\" to most users because they contribute to an overall feeling of quality.\n\nIt lives on his personal site at rauno.me — I believe it's under his writing section. He also shares a lot of these detail breakdowns on Twitter/X where he dissects specific interactions.\n\nGiven your work in design engineering and creative coding, it's very much in your wheelhouse — the mindset maps well to the kind of interactive experiences you build. Have you come across his other writing or just this piece?",
      -28
    ),
  ],
};

// Sample recent chats for demo
const initialChats: Chat[] = [
  "Claude's mind mapping capabilit...",
  "Claude's accessibility feature gaps",
  "Devouring Details Summary",
  "Mind map creation",
  "Face tracking 3D collage sketch",
  "LaTeX header alignment and for...",
  "Cellular automata and Conway's ...",
  "Standardizing bullet point font si...",
  "Pre-PMF and post-PMF product ...",
  "Creative projects",
  "Expanding Digital Support & Op...",
  "Yarn shader for three.js brush tool",
  "Animating text with point cloud...",
  "Productivity tools",
  "Fibonacci sequence",
  "Paper pull-off interaction canvas...",
  "Interactive Japanese calendar ri...",
].map((title, index) => {
  const messages = seededMessagesByTitle[title] || [];
  return {
    id: `${index + 1}`,
    title,
    messages,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
});

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
  const [dyslexiaMode, setDyslexiaMode] = useState(false);
  const userName = "Jules";
  const toggleDyslexiaMode = useCallback(() => {
    setDyslexiaMode((prev) => !prev);
  }, []);

  React.useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.classList.toggle("dyslexia-mode", dyslexiaMode);
  }, [dyslexiaMode]);

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

      const normalized = content
        .trim()
        .toLowerCase()
        .replace(/[?.!]/g, "")
        .replace(/\s+/g, " ");
      const shawarmaQuestion =
        normalized.includes("shawarma") &&
        normalized.includes("toronto") &&
        normalized.includes("best");
      const shawarmaToppingsQuestion =
        normalized.includes("shawarma") &&
        (normalized.includes("toppings") || normalized.includes("topping"));
      const shawarmaResponse =
        "The best shawarma in toronto can be found at Shawarma Empire, Ghadir, Shawarma Frenzy, and Flaming Stove according to this source on the internet: [www.reddit.com/askTO](https://www.reddit.com/r/askTO/comments/dkspr8/which_shawarma_place_is_the_bestout_of_shawarma/)";

      const shawarmaToppingsResponse =
        "Really depends on whether you're going for classic or building your own thing, but here are the hits:\n\n" +
        "Essentials\n\n" +
        "• Pickled turnips (the pink ones) — tangy, crunchy, iconic\n" +
        "• Garlic sauce (toum) — the creamy, pungent stuff that makes it\n" +
        "• Tahini or tahini-based sauces\n" +
        "• Pickles (cucumber or mixed)\n" +
        "• Fresh tomatoes and onions\n\n" +
        "Fresh stuff\n\n" +
        "• Parsley or mixed herb salad\n" +
        "• Shredded lettuce or cabbage\n" +
        "• Sumac onions (red onion with sumac and lemon)\n" +
        "• Fresh mint\n\n" +
        "Heat\n\n" +
        "• Hot sauce or chili garlic paste\n" +
        "• Pickled chilies\n" +
        "• Shatta (Middle Eastern hot pepper sauce)\n\n" +
        "Extras that elevate it\n\n" +
        "• Hummus spread inside the wrap\n" +
        "• French fries tucked in (classic move)\n" +
        "• Fried eggplant slices\n" +
        "• Fattoush-style toppings with crispy pita bits\n" +
        "• A squeeze of lemon at the end\n\n" +
        "Underrated additions\n\n" +
        "• Pomegranate molasses drizzle for sweetness\n" +
        "• Amba (mango pickle sauce) if you like Iraqi-style\n\n" +
        "Given you're in Toronto, you've got solid shawarma spots everywhere — any favorites you're trying to recreate or improve on?\n\n" +
        "Claude is AI and can make mistakes. Please double-check responses.";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: shawarmaQuestion
          ? shawarmaResponse
          : shawarmaToppingsQuestion
            ? shawarmaToppingsResponse
            : mockResponses[Math.floor(Math.random() * mockResponses.length)],
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
        dyslexiaMode,
        createNewChat,
        selectChat,
        sendMessage,
        setActiveTab,
        setSelectedModel,
        setViewMode,
        toggleDyslexiaMode,
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
