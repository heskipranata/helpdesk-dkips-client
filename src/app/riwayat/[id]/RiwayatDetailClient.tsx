"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StatusBadge from "../../components/StatusBadge";
import PDFViewer from "../../components/PDFViewer";
import ChatTabs from "../../components/ChatTabs";
import CompletionReportHistory, {
  CompletionReportRecord,
} from "../../technician/_components/CompletionReportHistory";

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
  role: "user" | "admin" | "teknisi";
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
  initialAdminMessages: Message[];
  initialTechMessages: Message[];
  initialProgress: Progress[];
  initialReports?: CompletionReportRecord[];
};

export default function RiwayatDetailClient({
  layananId,
  initialService,
  initialAdminMessages,
  initialTechMessages,
  initialProgress,
  initialReports,
}: RiwayatDetailClientProps) {
  const router = useRouter();
  const [service, setService] = useState<Service>(initialService);
  const [adminMessages, setAdminMessages] =
    useState<Message[]>(initialAdminMessages);
  const [techMessages, setTechMessages] =
    useState<Message[]>(initialTechMessages);
  const [progress, setProgress] = useState<Progress[]>(initialProgress);
  const [reports, setReports] = useState<CompletionReportRecord[]>(
    initialReports || [],
  );

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

  const handleSendAdminMessage = async (message: string) => {
    if (!message.trim()) return;
    try {
      await fetch(`http://localhost:3001/api/layanan/${layananId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message }),
      });
    } catch (err) {
      console.error("Failed to send admin message", err);
    }
  };

  const handleSendTechMessage = async (message: string) => {
    if (!message.trim()) return;
    try {
      await fetch(`http://localhost:3001/api/layanan/${layananId}/chat/tech`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message }),
      });
    } catch (err) {
      console.error("Failed to send tech message", err);
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
                fileUrl={`/uploads/${service.file_surat
                  .replace(/\\/g, "/")
                  .replace(/^\/+/, "")
                  .split("/")
                  .pop()}`}
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

        {/* Right Column - Chat with Tabs (1/3 width) */}
        <ChatTabs
          adminMessages={adminMessages}
          techMessages={techMessages}
          onSendAdminMessage={handleSendAdminMessage}
          onSendTechMessage={handleSendTechMessage}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Laporan Penyelesaian
        </h3>
        {reports.length > 0 ? (
          <CompletionReportHistory reports={reports} />
        ) : (
          <p className="text-sm text-gray-500">Belum ada</p>
        )}
      </div>
    </div>
  );
}
