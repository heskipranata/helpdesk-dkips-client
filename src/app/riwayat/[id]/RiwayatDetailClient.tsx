"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StatusBadge from "../../components/StatusBadge";
import PDFViewer from "../../components/PDFViewer";

type Progress = {
  id: number;
  status: string;
  catatan?: string;
  created_at: string;
  admin_name?: string;
};

type Message = {
  id: number;
  sender: string;
  role: "user" | "admin";
  message: string;
  timestamp: string;
};

type Service = {
  id: string | number;
  tanggal: string;
  jam?: string;
  nama_instansi: string;
  jenis_permintaan: string;
  status: string;
  deskripsi?: string;
  kontak?: string;
  email?: string;
  file_surat?: string;
};

type RiwayatDetailClientProps = {
  layananId: string | number;
  initialService: Service;
  initialMessages: Message[];
  initialProgress: Progress[];
};

export default function RiwayatDetailClient({
  layananId,
  initialService,
  initialMessages,
  initialProgress,
}: RiwayatDetailClientProps) {
  const router = useRouter();
  const [service, setService] = useState<Service>(initialService);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [progress, setProgress] = useState<Progress[]>(initialProgress);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const isStatusMessage = (message: string) => {
    return message.includes("Status permintaan Anda telah diperbarui menjadi:");
  };

  const renderStatusMessage = (message: string) => {
    const prefix = "Status permintaan Anda telah diperbarui menjadi:";
    if (!message.includes(prefix)) {
      return message;
    }
    const parts = message.split(prefix);
    const statusPart = parts[1]?.trim() || "";

    const getStatusColor = (status: string) => {
      const cleanStatus = status.toLowerCase().replace(/[*:.,\s]/g, "");

      if (cleanStatus.includes("baru")) {
        return "text-blue-700 font-bold";
      } else if (cleanStatus.includes("diproses")) {
        return "text-orange-600 font-bold";
      } else if (cleanStatus.includes("selesai")) {
        return "text-green-700 font-bold";
      } else if (cleanStatus.includes("tolak")) {
        return "text-red-700 font-bold";
      }
      return "text-amber-700 font-bold";
    };

    return (
      <>
        {parts[0]}
        {prefix}
        <span className={`${getStatusColor(statusPart)} text-base`}>
          {statusPart}
        </span>
      </>
    );
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const messageText = newMessage;
    const tempId = Date.now();
    const optimisticMessage: Message = {
      id: tempId,
      sender: "Anda",
      role: "user",
      message: messageText,
      timestamp: new Date().toLocaleString("id-ID"),
    };

    setMessages([...messages, optimisticMessage]);
    setNewMessage("");

    try {
      setSending(true);
      const res = await fetch(
        `http://localhost:3001/api/layanan/${layananId}/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ message: messageText }),
        },
      );

      if (!res.ok) {
        // Rollback jika gagal
        setMessages(messages.filter((m) => m.id !== tempId));
        setNewMessage(messageText);
      }
    } catch (err) {
      // Rollback jika error
      setMessages(messages.filter((m) => m.id !== tempId));
      setNewMessage(messageText);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {service.nama_instansi}
            </h2>
            <p className="text-sm text-gray-500 mt-1">ID: {service.id}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={service.status} />
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-800 transition"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Tanggal</label>
            <p className="mt-1 text-gray-900">{service.tanggal}</p>
          </div>
          {service.jam && (
            <div>
              <label className="text-sm font-medium text-gray-500">Jam</label>
              <p className="mt-1 text-gray-900">{service.jam}</p>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-500">
              Jenis Permintaan
            </label>
            <p className="mt-1 text-gray-900">{service.jenis_permintaan}</p>
          </div>

          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-500">
              Deskripsi
            </label>
            <p className="mt-1 text-gray-900 whitespace-pre-wrap">
              {service.deskripsi || "-"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[850px]">
        {/* Left Column - PDF (2/3 width) */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
          {service.file_surat ? (
            <div className="flex-1 overflow-y-auto">
              <PDFViewer
                fileUrl={`http://localhost:3001/${service.file_surat.replace(
                  /\\/g,
                  "/",
                )}`}
                fileName={`Lampiran-${service.id}.pdf`}
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-500">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-sm">Tidak ada lampiran dokumen</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Chat (1/3 width) */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700">
              Pesan & Komunikasi
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className="text-gray-500 text-sm">Belum ada pesan</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "admin" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[85%] ${
                      msg.role === "admin"
                        ? "bg-gray-100"
                        : "bg-blue-600 text-white"
                    } rounded-lg p-3`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-semibold text-gray-900">
                        {msg.sender}
                      </span>
                      <span
                        className={`text-xs ${
                          msg.role === "admin"
                            ? "text-gray-500"
                            : "text-blue-200"
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                    <p
                      className={`text-sm whitespace-pre-wrap ${
                        msg.role === "admin" ? "text-gray-900" : ""
                      }`}
                    >
                      {msg.role === "admin" && isStatusMessage(msg.message)
                        ? renderStatusMessage(msg.message)
                        : msg.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <form
            onSubmit={handleSendMessage}
            className="border-t border-gray-200 p-4 flex gap-2"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Tulis pesan..."
              disabled={sending}
              className="flex-1 border border-gray-300 text-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {sending ? "..." : "Kirim"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
