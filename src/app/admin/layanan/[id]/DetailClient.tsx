"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PDFViewer from "../../_components/PDFViewer";
import MessageThread from "../../_components/MessageThread";

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
  technician_nama?: string | null;
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

type Technician = {
  id: string | number;
  nama?: string;
  username?: string;
};

const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_ORIGIN ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001"
).replace(/\/$/, "");
const API_PREFIX = API_ORIGIN.endsWith("/api")
  ? API_ORIGIN
  : `${API_ORIGIN}/api`;

export default function DetailClient({
  service,
  messages: initialMessages,
}: DetailClientProps) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [currentStatus, setCurrentStatus] = useState(service.status);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [techLoading, setTechLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [techError, setTechError] = useState<string | null>(null);
  const [assignError, setAssignError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isActive = true;
    const fetchTechnicians = async () => {
      setTechLoading(true);
      setTechError(null);
      try {
        const res = await fetch(`${API_PREFIX}/admin/technicians`, {
          credentials: "include",
        });
        if (res.status === 401 || res.status === 403) {
          router.push("/admin/login");
          return;
        }
        if (!res.ok) {
          throw new Error("Gagal memuat daftar teknisi");
        }
        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : (data.technicians ?? data.data ?? []);
        if (isActive) {
          setTechnicians(Array.isArray(list) ? list : []);
        }
      } catch (err) {
        if (isActive) {
          setTechError("Gagal memuat daftar teknisi");
        }
      } finally {
        if (isActive) {
          setTechLoading(false);
        }
      }
    };

    fetchTechnicians();
    return () => {
      isActive = false;
    };
  }, [router]);

  const getAssignedTechnicianName = (technicianId?: string | null) => {
    if (!technicianId) return null;
    const tech = technicians.find((t) => String(t.id) === String(technicianId));
    return tech ? tech.nama || tech.username || `Teknisi ${tech.id}` : null;
  };

  const handleAssignTechnician = async () => {
    if (!selectedTechnician) {
      setAssignError("Pilih teknisi terlebih dahulu.");
      return;
    }

    setAssignLoading(true);
    setAssignError(null);
    try {
      const res = await fetch(
        `${API_PREFIX}/admin/layanan/${service.id}/assign`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ technician_id: selectedTechnician }),
        },
      );

      if (res.status === 401 || res.status === 403) {
        router.push("/admin/login");
        return;
      }

      if (!res.ok) {
        let message = "Gagal menugaskan teknisi";
        try {
          const text = await res.text();
          try {
            const json = JSON.parse(text);
            message = json.message || json.error || json.detail || message;
          } catch {
            message = text || message;
          }
        } catch {
          message = "Gagal menugaskan teknisi";
        }
        setAssignError(message);
        return;
      }

      setSelectedTechnician("");
    } catch (err) {
      setAssignError("Terjadi kesalahan jaringan.");
    } finally {
      setAssignLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "Admin",
      role: "admin" as const,
      message,
      timestamp: new Date().toLocaleString("id-ID"),
    };
    setMessages([...messages, newMessage]);

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
      await fetch(`${API_URL}/layanan/${service.id}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message }),
      });
    } catch (error) {
      // Error silently handled
    }
  };

  const handleUpdateStatus = async (
    newStatusValue: string,
    note: string = "",
  ) => {
    setIsUpdatingStatus(true);
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

      const res = await fetch(`${API_URL}/layanan/${service.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatusValue, catatan: note }),
      });

      if (res.ok) {
        setCurrentStatus(newStatusValue);

        const statusMessage = `Status permintaan Anda telah diperbarui menjadi: *${newStatusValue}*${
          note ? `\n\nCatatan: ${note}` : ""
        }`;

        const newMessage = {
          id: Date.now(),
          sender: "System",
          role: "admin" as const,
          message: statusMessage,
          timestamp: new Date().toLocaleString("id-ID"),
        };
        setMessages([...messages, newMessage]);

        try {
          await fetch(`${API_URL}/layanan/${service.id}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ message: statusMessage }),
          });
        } catch (error) {
          // Error silently handled
        }

        router.refresh();
      }
    } catch (error) {
      // Error silently handled
    } finally {
      setIsUpdatingStatus(false);
    }
  };

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

  const handleDeleteService = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`${API_PREFIX}/admin/layanan/${service.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.status === 401 || res.status === 403) {
        router.push("/admin/login");
        return;
      }

      if (!res.ok) {
        let message = "Gagal menghapus layanan";
        try {
          const text = await res.text();
          if (text) {
            try {
              const json = JSON.parse(text);
              message = json.message || json.error || json.detail || message;
            } catch {
              message = text;
            }
          }
        } catch {
          message = "Gagal menghapus layanan";
        }
        alert(message);
        return;
      }

      alert("Layanan berhasil dihapus");
      router.push("/admin/layanan");
      router.refresh();
    } catch {
      alert("Terjadi kesalahan saat menghapus layanan");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-2">{service.instansi}</h2>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={currentStatus}
              onChange={(e) => {
                setCurrentStatus(e.target.value);
                handleUpdateStatus(e.target.value, "");
              }}
              disabled={isUpdatingStatus}
              className={`px-4 py-2 text-sm font-semibold rounded-full border-2 cursor-pointer hover:opacity-80 transition disabled:opacity-50 disabled:cursor-not-allowed appearance-none ${getStatusColor(
                currentStatus,
              )}`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 8px center",
                paddingRight: "28px",
              }}
            >
              <option value="baru">Baru</option>
              <option value="diproses">Diproses</option>
              <option value="selesai">Selesai</option>
              <option value="tolak">Tolak</option>
            </select>
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-2 rounded-full border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition"
              title="Hapus layanan"
              aria-label="Hapus layanan"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-7 0h8"
                />
              </svg>
            </button>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Deskripsi
          </h3>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {service.deskripsi || "Tidak ada deskripsi"}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg shadow p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Assign Teknisi
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Pilih teknisi yang akan menangani layanan ini.
            </p>
          </div>
          <div className="space-y-2">
            <select
              value={selectedTechnician}
              onChange={(event) => setSelectedTechnician(event.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700"
              disabled={techLoading || technicians.length === 0}
            >
              <option value="">
                {techLoading ? "Memuat teknisi..." : "Pilih teknisi"}
              </option>
              {technicians.map((tech) => (
                <option key={tech.id} value={tech.id}>
                  {tech.nama || tech.username || `Teknisi ${tech.id}`}
                </option>
              ))}
            </select>
            {techError && <p className="text-xs text-red-600">{techError}</p>}
          </div>
          <button
            type="button"
            onClick={handleAssignTechnician}
            disabled={assignLoading || techLoading || !selectedTechnician}
            className="w-full bg-gray-900 text-white rounded px-3 py-2 text-sm font-medium hover:bg-black disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {assignLoading ? "Menugaskan..." : "Assign Teknisi"}
          </button>
          {assignError && <p className="text-xs text-red-600">{assignError}</p>}

          {/* Teknisi yang Ditugaskan */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Teknisi Ditugaskan
            </h4>
            {service.technician_nama ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 text-lg">✓</span>
                  <div className="flex-1">
                    <p className="text-xs text-green-700 font-semibold">
                      Sudah Ditugaskan
                    </p>
                    <p className="text-sm font-medium text-green-900">
                      {getAssignedTechnicianName(service.technician_nama)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-600 text-lg">⚠</span>
                  <p className="text-sm font-medium text-yellow-800">
                    Belum Ada
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 min-h-[600px] h-[80vh] flex flex-col">
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

        <div className="h-[95vh] flex flex-col rounded-xl border-2 border-blue-400 p-4 overflow-y-auto shadow-md bg-gradient-to-b from-purple-50 to-pink-50">
          <MessageThread
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="border-b border-gray-200 px-5 py-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Konfirmasi Hapus Layanan
              </h3>
            </div>
            <div className="px-5 py-4 space-y-2">
              <p className="text-sm text-gray-700">
                Yakin ingin menghapus layanan ini?
              </p>
              <p className="text-xs text-gray-500">
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-4">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteService}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
