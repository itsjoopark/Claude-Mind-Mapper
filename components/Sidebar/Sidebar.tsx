"use client";

import { useState } from "react";
import { PanelLeftClose, PanelLeft } from "lucide-react";
import TabSwitch from "./TabSwitch";
import NavMenu from "./NavMenu";
import RecentChats from "./RecentChats";
import UserProfile from "./UserProfile";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="relative flex">
      <aside
        className={`h-screen bg-sidebar border-r border-border flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-0 overflow-hidden" : "w-[280px]"
        }`}
      >
        <div className={`w-[280px] h-full flex flex-col`}>
        {/* Tab Switch */}
        <div className="p-3 pt-12">
            <TabSwitch />
          </div>

          {/* Navigation Menu */}
          <NavMenu />

          {/* Recent Chats */}
          <div className="flex-1 overflow-y-auto">
            <RecentChats />
          </div>

          {/* User Profile */}
          <UserProfile />
        </div>
      </aside>

      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-3 left-3 z-10 p-1.5 bg-white border border-border rounded-full shadow-sm hover:bg-sidebar transition-colors"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <PanelLeft size={16} className="text-secondary" />
        ) : (
          <PanelLeftClose size={16} className="text-secondary" />
        )}
      </button>
    </div>
  );
}
