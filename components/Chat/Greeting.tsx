"use client";

import { useChat } from "@/context/ChatContext";
import Image from "next/image";

export default function Greeting() {
  const { userName } = useChat();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="text-center mb-2">
      <h1 className="text-[50px] font-signifier font-normal text-primary flex items-center justify-center gap-[15px] leading-normal">
        <Image
          src="/e89f77f86b85eb2032b833bd37071deb9f6ec7d5.png"
          alt="Claude logo"
          width={43}
          height={43}
          className="shrink-0"
        />
        <span>
          {getGreeting()}, {userName}
        </span>
      </h1>
    </div>
  );
}
