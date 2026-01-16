"use client";

import { useChat } from "@/context/ChatContext";
import Image from "next/image";
import { Copy, ThumbsUp, ThumbsDown, RotateCcw } from "lucide-react";

export default function MessageList() {
  const { currentChat, isLoading } = useChat();

  if (!currentChat) return null;

  const renderMessage = (content: string) => {
    const parts: React.ReactNode[] = [];
    const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = linkRegex.exec(content)) !== null) {
      const [full, label, url] = match;
      const start = match.index;
      if (start > lastIndex) {
        parts.push(content.slice(lastIndex, start));
      }
      parts.push(
        <a
          key={`${url}-${start}`}
          href={url}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-primary no-underline"
        >
          {label}
        </a>
      );
      lastIndex = start + full.length;
    }

    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    return parts.length ? parts : content;
  };

  return (
    <div className="max-w-4xl mx-auto pt-20 pb-8 px-4">
      {currentChat.messages.map((message, index) => (
        <div
          key={message.id}
          className={`mb-8 ${message.role === "user" ? "text-right" : "text-left"}`}
        >
          {message.role === "user" ? (
            <div className="inline-flex items-center gap-2 rounded-2xl bg-[#EFECE6] px-4 py-2 text-[15px] text-primary shadow-sm">
              {message.content}
            </div>
          ) : (
            <div className="max-w-[80%]">
              <p className="text-[18px] leading-relaxed text-primary whitespace-pre-wrap">
                {renderMessage(message.content)}
              </p>
              {index === currentChat.messages.length - 1 && (
                <div className="mt-6">
                  <div className="flex items-center gap-4 text-secondary mb-6">
                    <button className="hover:text-primary transition-colors" aria-label="Copy">
                      <Copy size={18} />
                    </button>
                    <button className="hover:text-primary transition-colors" aria-label="Thumbs up">
                      <ThumbsUp size={18} />
                    </button>
                    <button className="hover:text-primary transition-colors" aria-label="Thumbs down">
                      <ThumbsDown size={18} />
                    </button>
                    <button className="hover:text-primary transition-colors" aria-label="Regenerate">
                      <RotateCcw size={18} />
                    </button>
                  </div>
                  <Image
                    src="/e89f77f86b85eb2032b833bd37071deb9f6ec7d5.png"
                    alt="Claude logo"
                    width={44}
                    height={44}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Loading indicator */}
      {isLoading && (
        <div className="mb-8 text-left">
          <p className="text-[18px] leading-relaxed text-primary">...</p>
          <div className="mt-8">
            <Image
              src="/e89f77f86b85eb2032b833bd37071deb9f6ec7d5.png"
              alt="Claude logo"
              width={44}
              height={44}
            />
          </div>
        </div>
      )}
    </div>
  );
}
