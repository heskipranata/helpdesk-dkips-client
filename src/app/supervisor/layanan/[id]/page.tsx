import AdminShell from "../../_components/AdminShell";
import Sidebar from "../../_components/Sidebar";
import DetailClient from "./DetailClient";
import { fetchWithAuth } from "@/lib/cookies";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

async function getServiceDetail(id: string) {
  if (!API_URL) {
    return { service: null, messages: [], statusHistory: [] };
  }

  const res = await fetchWithAuth(`${API_URL}/layanan/${id}`);

  if (res.status === 401 || res.status === 403) {
    redirect("/supervisor/login");
  }

  if (!res.ok) {
    throw new Error("Gagal memuat detail layanan");
  }

  const data = await res.json();
  const raw = (data?.service ?? data) as any;

  const date = raw?.created_at ? new Date(raw.created_at) : null;

  const service = {
    id: raw?.id ?? id,
    tanggal: date
      ? `${String(date.getDate()).padStart(2, "0")}/${String(
          date.getMonth() + 1,
        ).padStart(2, "0")}/${date.getFullYear()}`
      : "-",
    jam: date
      ? `${String(date.getHours()).padStart(2, "0")}:${String(
          date.getMinutes(),
        ).padStart(2, "0")}`
      : "-",
    instansi: raw?.nama_opd ?? raw?.instansi ?? "-",
    jenis_permintaan: raw?.nama_layanan ?? raw?.jenis_permintaan ?? "-",
    status: raw?.status ?? "-",
    deskripsi: raw?.deskripsi ?? raw?.catatan ?? raw?.judul ?? "-",
    prioritas: raw?.prioritas ?? raw?.priority,
    kontak: raw?.kontak ?? raw?.contact,
    email: raw?.email ?? raw?.email_pemohon,
    catatan: raw?.note ?? raw?.catatan,
    pdf_url:
      raw?.pdf_url ?? raw?.file_surat ?? raw?.lampiran ?? raw?.attachment_url,
  };

  console.log("📄 PDF URL mapped:", service.pdf_url);
  console.log("📋 Full service object:", service);

  // Fetch chat messages
  const chatRes = await fetchWithAuth(`${API_URL}/layanan/${id}/chat`);
  let chatMessages = [];

  if (chatRes.ok) {
    const chatData = await chatRes.json();
    const rows = Array.isArray(chatData)
      ? chatData
      : (chatData?.messages ?? []);

    chatMessages = rows.map((m: any) => {
      const ts = m.created_at ? new Date(m.created_at) : null;
      return {
        id: m.id,
        sender: m.sender_nama ?? m.sender_username ?? "User",
        role:
          m.sender_username === "admin" || m.role === "admin"
            ? "admin"
            : "user",
        message: m.message ?? "",
        timestamp: ts ? ts.toLocaleString("id-ID") : (m.created_at ?? ""),
      };
    });
  }

  return {
    service,
    messages: chatMessages,
    statusHistory: data?.statusHistory ?? data?.riwayat_status ?? [],
  };
}

export default async function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { service, messages, statusHistory } = await getServiceDetail(id);

  if (!service) {
    redirect("/supervisor/layanan");
  }

  return (
    <AdminShell>
      <div className="flex h-screen w-screen">
        <Sidebar />
        <main className="flex-1 bg-gray-50 overflow-y-auto">
          <div className="p-6 w-full">
            <DetailClient service={service} messages={messages} />
          </div>
        </main>
      </div>
    </AdminShell>
  );
}
