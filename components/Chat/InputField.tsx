"use client";

import { useState } from "react";
import { Plus, Clock, ChevronDown, ArrowUp } from "lucide-react";
import { useChat } from "@/context/ChatContext";

export default function InputField() {
  const [input, setInput] = useState("");
  const { sendMessage, selectedModel, setSelectedModel, isLoading } = useChat();
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const models = ["Opus 4.5", "Sonnet 3.5", "Haiku 3.0"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const message = input;
    setInput("");
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white rounded-3xl shadow-sm border border-border/60">
        {/* Text Input Area */}
        <div className="px-5 pt-5 pb-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="How can I help you today?"
            className="w-full resize-none outline-none text-primary placeholder:text-secondary/50 text-[17px] min-h-[60px] leading-relaxed"
            rows={2}
            disabled={isLoading}
          />
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between px-4 pb-4">
          {/* Left Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 rounded-xl hover:bg-sidebar transition-colors text-secondary"
            >
              <Plus size={22} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              className="p-2.5 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
            >
              <Clock size={18} strokeWidth={2} />
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Model Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="flex items-center gap-1.5 px-2 py-1 text-[15px] text-secondary hover:text-primary transition-colors"
              >
                {selectedModel}
                <ChevronDown size={16} strokeWidth={2} />
              </button>

              {showModelDropdown && (
                <div className="absolute bottom-full right-0 mb-2 bg-white rounded-xl shadow-lg border border-border py-1.5 min-w-[150px] z-10">
                  {models.map((model) => (
                    <button
                      key={model}
                      type="button"
                      onClick={() => {
                        setSelectedModel(model);
                        setShowModelDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-sidebar transition-colors ${
                        model === selectedModel
                          ? "text-primary font-medium"
                          : "text-secondary"
                      }`}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`p-2.5 rounded-xl transition-colors ${
                input.trim() && !isLoading
                  ? "bg-accent text-white hover:bg-accent/90"
                  : "bg-accent/80 text-white/80"
              }`}
            >
              <ArrowUp size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
