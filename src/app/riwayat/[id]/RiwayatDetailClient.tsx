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

  useEffect(() => {
    // Data sudah loaded dari server, tidak perlu fetch lagi
  }, []);

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
        }
      );

      if (!res.ok) {
        // Rollback jika gagal
        setMessages(messages.filter((m) => m.id !== tempId));
        setNewMessage(messageText);
      }
    } catch (err) {
      console.error("Error sending message:", err);
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - PDF & Messages */}
        <div className="lg:col-span-2 space-y-6">
          {/* PDF Viewer */}
          {service.file_surat ? (
            <PDFViewer
              fileUrl={`http://localhost:3001/${service.file_surat.replace(
                /\\/g,
                "/"
              )}`}
              fileName={`Lampiran-${service.id}.pdf`}
            />
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-500">
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
          )}

          {/* Messages */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700">
                Pesan & Komunikasi
              </h3>
            </div>
            <div className="h-[400px] overflow-y-auto p-4 space-y-4">
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
                      className={`max-w-[70%] ${
                        msg.role === "admin"
                          ? "bg-gray-100 text-gray-900"
                          : "bg-blue-600 text-white"
                      } rounded-lg p-3`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-semibold">
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
                      <p className="text-sm whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <form
              onSubmit={handleSendMessage}
              className="border-t border-gray-200 p-4 flex space-x-2"
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
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? "Mengirim..." : "Kirim"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column - Progress Timeline */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress</h3>
          {progress.length === 0 ? (
            <div className="text-center py-8">
              <svg
                className="w-12 h-12 text-gray-300 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-gray-500 text-xs">Belum ada update</p>
            </div>
          ) : (
            <div className="space-y-3">
              {progress.map((prog) => (
                <div
                  key={prog.id}
                  className="relative pl-4 pb-3 border-l-2 border-blue-300 last:pb-0"
                >
                  <div className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-blue-600"></div>
                  <div className="bg-gray-50 rounded p-3">
                    <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700 mb-1">
                      {prog.status}
                    </span>
                    {prog.admin_name && (
                      <p className="text-xs text-gray-600 mt-1">
                        {prog.admin_name}
                      </p>
                    )}
                    {prog.catatan && (
                      <p className="text-xs text-gray-700 mt-2">
                        {prog.catatan}
                      </p>
                    )}
                    <span className="text-xs text-gray-500 mt-2 block">
                      {new Date(prog.created_at).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
