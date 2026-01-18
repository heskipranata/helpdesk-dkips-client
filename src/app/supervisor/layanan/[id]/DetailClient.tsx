"use client";

import { useRouter } from "next/navigation";
import PDFViewer from "../../_components/PDFViewer";

type Service = {
  id: string | number;
  tanggal: string;
  jam?: string;
  instansi: string;
  jenis_permintaan: string;
  status: string;
  deskripsi?: string;
  prioritas?: string;
  kontak?: string;
  email?: string;
  catatan?: string;
  pdf_url?: string;
};

type Message = {
  id: number;
  sender: string;
  role: "user" | "admin";
  message: string;
  timestamp: string;
};

type DetailClientProps = {
  service: Service;
  messages: Message[];
};

export default function DetailClient({
  service,
  messages: initialMessages,
}: DetailClientProps) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "selesai")
      return "bg-green-100 text-green-800 border-green-300";
    if (statusLower === "diproses")
      return "bg-blue-100 text-blue-800 border-blue-300";
    if (statusLower === "baru")
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    if (statusLower === "tolak")
      return "bg-red-100 text-red-800 border-red-300";
    return "bg-gray-100 text-gray-800 border-gray-300";
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-2">{service.instansi}</h2>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-4 py-2 text-sm font-semibold rounded-full border-2 ${getStatusColor(
                service.status,
              )}`}
            >
              {service.status}
            </span>
            <button
              onClick={() => router.back()}
              className="text-white hover:bg-white/20 rounded-full p-2 transition"
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-blue-400">
          <div>
            <p className="text-blue-100 text-xs uppercase tracking-wider">
              Tanggal
            </p>
            <p className="text-lg font-semibold mt-1">{service.tanggal}</p>
          </div>
          <div>
            <p className="text-blue-100 text-xs uppercase tracking-wider">
              Jam
            </p>
            <p className="text-lg font-semibold mt-1">{service.jam || "-"}</p>
          </div>
          <div className="lg:col-span-2">
            <p className="text-blue-100 text-xs uppercase tracking-wider">
              Jenis Permintaan
            </p>
            <p className="text-lg font-semibold mt-1">
              {service.jenis_permintaan}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Deskripsi</h3>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {service.deskripsi || "Tidak ada deskripsi"}
        </p>
      </div>

      <div className="min-h-[600px] h-[80vh] flex flex-col">
        {service.pdf_url ? (
          <PDFViewer
            fileUrl={service.pdf_url}
            fileName={`Lampiran-${service.id}.pdf`}
            serviceId={service.id}
          />
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-500 h-full flex flex-col items-center justify-center">
            <svg
              className="h-12 w-12 text-gray-400 mb-2"
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
      </div>
    </div>
  );
}
