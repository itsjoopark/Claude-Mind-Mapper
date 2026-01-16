"use client";

import { Pencil, GraduationCap, Code, Coffee, Lightbulb } from "lucide-react";
import { useChat } from "@/context/ChatContext";

const actions = [
  { icon: Pencil, label: "Write" },
  { icon: GraduationCap, label: "Learn" },
  { icon: Code, label: "Code" },
  { icon: Coffee, label: "Life stuff" },
  { icon: Lightbulb, label: "Claude's choice" },
];

export default function QuickActions() {
  const { sendMessage } = useChat();

  const handleAction = (label: string) => {
    // Send a contextual message based on the action
    const prompts: Record<string, string> = {
      Write: "Help me write something creative",
      Learn: "Teach me something interesting",
      Code: "Help me with a coding project",
      "Life stuff": "I need advice on life matters",
      "Claude's choice": "Surprise me with something interesting!",
    };
    sendMessage(prompts[label] || label);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5">
      {actions.map(({ icon: Icon, label }) => (
        <button
          key={label}
          onClick={() => handleAction(label)}
          className="flex items-center gap-[5px] px-3 py-2 bg-white rounded-lg border border-[#d8d7d3] text-[15px] text-primary hover:bg-sidebar/50 transition-colors"
        >
          <Icon size={16} className="text-secondary" strokeWidth={1.5} />
          {label}
        </button>
      ))}
    </div>
  );
}
