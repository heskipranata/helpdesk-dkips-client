"use client";

import { useState } from "react";
import MessageThread from "../technician/_components/MessageThread";

export type ChatMessage = {
  id: number;
  sender: string;
  role: "user" | "admin" | "teknisi";
  message: string;
  timestamp: string;
  attachments?: string[];
};

type ChatTabsProps = {
  adminMessages: ChatMessage[];
  techMessages: ChatMessage[];
  onSendAdminMessage: (message: string) => void;
  onSendTechMessage: (message: string) => void;
};

type TabType = "admin" | "teknisi";

export default function ChatTabs({
  adminMessages,
  techMessages,
  onSendAdminMessage,
  onSendTechMessage,
}: ChatTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("admin");

  const tabs: { id: TabType; label: string;  }[] = [
    { id: "admin", label: "Chat Admin",  },
    { id: "teknisi", label: "Chat Teknisi" },
  ];

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col h-full">
      {/* Tab Navigation */}
      <div className="bg-gray-50 border-b border-gray-200 flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition ${
              activeTab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "admin" && (
          <MessageThread
            messages={adminMessages}
            onSendMessage={onSendAdminMessage}
          />
        )}
        {activeTab === "teknisi" && (
          <MessageThread
            messages={techMessages}
            onSendMessage={onSendTechMessage}
          />
        )}
      </div>
    </div>
  );
}
