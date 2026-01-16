"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Clock,
  ChevronDown,
  ArrowUp,
  Paperclip,
  FolderPlus,
  Search,
  Globe,
  Feather,
  Grid3X3,
  ChevronRight,
  Check,
} from "lucide-react";
import { useChat } from "@/context/ChatContext";

export default function InputField() {
  const [input, setInput] = useState("");
  const {
    sendMessage,
    selectedModel,
    setSelectedModel,
    isLoading,
    dyslexiaMode,
    toggleDyslexiaMode,
  } = useChat();
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);

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
          <div className="flex items-center gap-2 relative">
            <button
              type="button"
              onClick={() => setShowPlusMenu((prev) => !prev)}
              className="p-2 rounded-xl hover:bg-sidebar transition-colors text-secondary"
              aria-haspopup="menu"
              aria-expanded={showPlusMenu}
            >
              <Plus size={22} strokeWidth={1.5} />
            </button>
            {showPlusMenu && (
              <div className="absolute left-0 bottom-full mb-3 w-[260px] rounded-2xl border border-border bg-white shadow-lg z-20 p-2">
                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[15px] text-primary hover:bg-sidebar/50 transition-colors">
                  <Paperclip size={18} className="text-secondary" />
                  <span className="flex-1 text-left">Add files or photos</span>
                </button>
                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[15px] text-primary hover:bg-sidebar/50 transition-colors">
                  <FolderPlus size={18} className="text-secondary" />
                  <span className="flex-1 text-left">Add to project</span>
                  <ChevronRight size={16} className="text-secondary" />
                </button>
                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[15px] text-primary hover:bg-sidebar/50 transition-colors">
                  <Image
                    src="/notion_logo.png"
                    alt="Notion"
                    width={18}
                    height={18}
                    className="text-secondary"
                  />
                  <span className="flex-1 text-left">Add from Notion</span>
                  <ChevronRight size={16} className="text-secondary" />
                </button>
                <div className="my-2 h-px bg-border/70" />
                <button
                  type="button"
                  onClick={() => setShowAccessibilityMenu((prev) => !prev)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[15px] text-primary hover:bg-sidebar/50 transition-colors"
                >
                  <Image
                    src="/ada-accessibility-icon.png"
                    alt="Accessibility"
                    width={18}
                    height={18}
                    className="text-secondary"
                  />
                  <span className="flex-1 text-left">Accessibility</span>
                  <ChevronRight size={16} className="text-secondary" />
                </button>
                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[15px] text-primary hover:bg-sidebar/50 transition-colors">
                  <Search size={18} className="text-secondary" />
                  <span className="flex-1 text-left">Research</span>
                </button>
                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[15px] text-primary hover:bg-sidebar/50 transition-colors">
                  <Globe size={18} className="text-[#2B7CE9]" />
                  <span className="flex-1 text-left text-[#2B7CE9]">Web search</span>
                  <Check size={16} className="text-[#2B7CE9]" />
                </button>
                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[15px] text-primary hover:bg-sidebar/50 transition-colors">
                  <Feather size={18} className="text-secondary" />
                  <span className="flex-1 text-left">Use style</span>
                  <ChevronRight size={16} className="text-secondary" />
                </button>
                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[15px] text-primary hover:bg-sidebar/50 transition-colors">
                  <Grid3X3 size={18} className="text-secondary" />
                  <span className="flex-1 text-left">Connectors</span>
                  <ChevronRight size={16} className="text-secondary" />
                </button>
              </div>
            )}
            {showPlusMenu && showAccessibilityMenu && (
              <div className="absolute left-[222px] bottom-full mb-3 w-[220px] rounded-2xl border border-border bg-white shadow-lg z-30 p-2">
                <button
                  type="button"
                  onClick={toggleDyslexiaMode}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[15px] transition-colors ${
                    dyslexiaMode
                      ? "text-[#2B7CE9]"
                      : "text-primary hover:text-[#2B7CE9]"
                  }`}
                >
                  <span className="flex-1 text-left">Dyslexia-friendly</span>
                </button>
                {[
                  "Large text mode",
                  "High contrast",
                  "Reduced motion",
                  "Color-friendly",
                ].map((label) => (
                  <button
                    key={label}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[15px] text-primary hover:text-[#2B7CE9] transition-colors"
                  >
                    <span className="flex-1 text-left">{label}</span>
                  </button>
                ))}
              </div>
            )}
            <button
              type="button"
              className="p-2.5 rounded-full bg-background text-secondary hover:bg-sidebar transition-colors"
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
