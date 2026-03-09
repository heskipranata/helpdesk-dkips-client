"use client";

import Link from "next/link";
import { useState } from "react";
import MessageThread from "./MessageThread";
import CompletionReportForm, {
  type CompletionReport,
} from "./CompletionReportForm";
import CompletionReportHistory, {
  type CompletionReportRecord,
} from "./CompletionReportHistory";

type Service = {
  id: string | number;
  tanggal: string;
  jam: string;
  instansi: string;
  jenis_permintaan: string;
  status: "baru" | "diproses" | "selesai" | "tolak" | string;
  deskripsi?: string;
  kontak?: string;
  email?: string;
};

type ChatMessage = {
  id: number;
  sender: string;
  role: "user" | "admin" | "teknisi";
  message: string;
  timestamp: string;
  attachments?: string[];
};

type StatusHistory = {
  status: string;
  timestamp: string;
  actor: string;
  note?: string;
};

type DetailClientProps = {
  service: Service;
  initialMessages: ChatMessage[];
  initialHistory: StatusHistory[];
  initialReports?: CompletionReportRecord[];
};

const statusLabels: Record<string, string> = {
  baru: "Baru",
  diproses: "Diproses",
  selesai: "Selesai",
  tolak: "Tolak",
};

const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_ORIGIN ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001"
).replace(/\/$/, "");
const API_PREFIX = API_ORIGIN.endsWith("/api")
  ? API_ORIGIN
  : `${API_ORIGIN}/api`;

const getStatusColor = (status: string) => {
  switch (status) {
    case "selesai":
      return "bg-green-100 text-green-700";
    case "diproses":
      return "bg-blue-100 text-blue-700";
    case "baru":
      return "bg-yellow-100 text-yellow-700";
    case "tolak":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function TechnicianServiceDetailClient({
  service,
  initialMessages,
  initialHistory,
  initialReports = [],
}: DetailClientProps) {
  const [currentStatus, setCurrentStatus] = useState(service.status);
  const [history, setHistory] = useState<StatusHistory[]>(initialHistory);
  const [chatMessages, setChatMessages] =
    useState<ChatMessage[]>(initialMessages);
  const [reports, setReports] =
    useState<CompletionReportRecord[]>(initialReports);

  const handleCompletionReportSuccess = (report: CompletionReport) => {
    const timestamp = report.completed_at
      ? new Date(report.completed_at).toLocaleString("id-ID")
      : new Date().toLocaleString("id-ID");

    setCurrentStatus(report.status);
    setHistory((prev) => [
      {
        status: report.status,
        timestamp,
        actor: "Teknisi",
        note: report.summary,
      },
      ...prev,
    ]);

    // Tambahkan ke daftar laporan penyelesaian
    const newReport: CompletionReportRecord = {
      id: report.id,
      layanan_id: report.layanan_id,
      technician_id: report.technician_id,
      status: report.status,
      summary: report.summary,
      photo_path: report.photo_path,
      completed_at: report.completed_at,
      created_at: report.created_at,
      technician_nama: "Anda",
    };
    setReports((prev) => [newReport, ...prev]);
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const optimistic: ChatMessage = {
      id: Date.now(),
      sender: "Anda",
      role: "teknisi",
      message,
      timestamp: new Date().toLocaleString("id-ID"),
    };

    setChatMessages((prev) => [...prev, optimistic]);

    try {
      await fetch(`${API_PREFIX}/layanan/${service.id}/chat/tech`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message }),
      });
    } catch {
      return;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {service.jenis_permintaan}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{service.deskripsi}</p>
        </div>
        <Link
          href="/technician/dashboard"
          className="px-3 py-2 text-sm rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
        >
          Kembali ke Tabel
        </Link>
      </div>

      <article className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {service.instansi}
                  </h2>
                </div>
                <p className="text-sm text-gray-600 mt-1"></p>
                <div className="mt-3 text-xs text-gray-500 space-y-1">
                  <div>
                    Tanggal: {service.tanggal} {service.jam}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden min-h-105">
            <MessageThread
              messages={chatMessages}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {reports.length > 0 && <CompletionReportHistory reports={reports} />}
          <CompletionReportForm
            serviceId={service.id}
            onSuccess={handleCompletionReportSuccess}
          />
        </div>
      </article>
    </div>
  );
}
