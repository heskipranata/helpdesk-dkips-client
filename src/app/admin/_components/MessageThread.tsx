"use client";

import { useState } from "react";

type Message = {
  id: number;
  sender: string;
  role: "user" | "admin";
  message: string;
  timestamp: string;
  attachments?: string[];
};

type MessageThreadProps = {
  messages: Message[];
  onSendMessage: (message: string) => void;
};

export default function MessageThread({
  messages,
  onSendMessage,
}: MessageThreadProps) {
  const [newMessage, setNewMessage] = useState("");

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "selesai") return "text-green-400 font-semibold";
    if (statusLower === "diproses") return "text-blue-300 font-semibold";
    if (statusLower === "baru") return "text-yellow-600 font-semibold";
    if (statusLower === "tolak") return "text-red-600 font-semibold";
    return "text-gray-600";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col h-full">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex-shrink-0">
        <h3 className="text-sm font-semibold text-gray-700">
          Pesan & Komunikasi
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isStatusUpdate = msg.message.includes(
            "Status permintaan Anda telah diperbarui"
          );
          return (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === "admin" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.role === "admin"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <div className="flex flex-col items-left  mb-1">
                  <span className="text-xs font-semibold">{msg.sender}</span>
                  <span className="text-xs opacity-75">{msg.timestamp}</span>
                </div>
                <p className="text-sm whitespace-pre-wrap">
                  {msg.message.split(/(\*[^*]+\*)/).map((part, idx) => {
                    if (part.startsWith("*") && part.endsWith("*")) {
                      const status = part.slice(1, -1);
                      const isStatusUpdate = msg.message.includes(
                        "Status permintaan Anda telah diperbarui"
                      );
                      if (isStatusUpdate) {
                        return (
                          <span key={idx} className={getStatusColor(status)}>
                            {part}
                          </span>
                        );
                      }
                    }
                    return part;
                  })}
                </p>
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {msg.attachments.map((file, idx) => (
                      <a
                        key={idx}
                        href={file}
                        className="text-xs underline block"
                      >
                        Lampiran {idx + 1}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-200 p-4 flex space-x-2 flex-shrink-0"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Tulis pesan..."
          className="flex-1 border border-gray-300 text-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700"
        >
          Kirim
        </button>
      </form>
    </div>
  );
}
