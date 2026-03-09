import { redirect } from "next/navigation";
import AdminShell from "../../_components/AdminShell";
import TopBar from "../../_components/TopBar";
import TechnicianServiceDetailClient from "../../_components/TechnicianServiceDetailClient";
import { fetchWithAuth } from "@/lib/cookies";

const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_ORIGIN ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001"
).replace(/\/$/, "");
const API_PREFIX = API_ORIGIN.endsWith("/api")
  ? API_ORIGIN
  : `${API_ORIGIN}/api`;

type Message = {
  id: number;
  sender: string;
  role: "user" | "admin";
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

type CompletionReport = {
  id: number;
  layanan_id: number;
  technician_id: number;
  status: string;
  summary: string;
  photo_path: string;
  completed_at: string;
  created_at: string;
  technician_nama?: string;
  technician_username?: string;
};

async function getServiceDetail(id: string) {
  if (!API_PREFIX) {
    return { service: null, messages: [], history: [], reports: [] };
  }

  const res = await fetchWithAuth(`${API_PREFIX}/technician/layanan/${id}`);

  if (res.status === 401 || res.status === 403) {
    redirect("/technician/login");
  }

  if (!res.ok) {
    return { service: null, messages: [], history: [], reports: [] };
  }

  const data = await res.json();
  const raw = (data?.service ?? data) as any;
  const createdDate = raw?.created_at ? new Date(raw.created_at) : null;

  const service = {
    id: raw?.id ?? id,
    tanggal: createdDate
      ? `${String(createdDate.getDate()).padStart(2, "0")}/${String(
          createdDate.getMonth() + 1,
        ).padStart(2, "0")}/${createdDate.getFullYear()}`
      : "-",
    jam: createdDate
      ? `${String(createdDate.getHours()).padStart(2, "0")}:${String(
          createdDate.getMinutes(),
        ).padStart(2, "0")}`
      : "-",
    instansi: raw?.nama_opd ?? raw?.instansi ?? "-",
    jenis_permintaan: raw?.nama_layanan ?? raw?.jenis_permintaan ?? "-",
    status: raw?.status ?? "baru",
    deskripsi: raw?.deskripsi ?? raw?.catatan ?? "",
    kontak: raw?.kontak ?? "",
    email: raw?.email ?? raw?.email_pemohon ?? "",
  };

  const rawHistory = data?.statusHistory ?? data?.riwayat_status ?? [];
  const history: StatusHistory[] = Array.isArray(rawHistory)
    ? rawHistory.map((item: any) => {
        const ts = item.created_at
          ? new Date(item.created_at).toLocaleString("id-ID")
          : (item.timestamp ?? "-");
        return {
          status: item.status ?? service.status,
          timestamp: ts,
          actor: item.actor ?? item.updated_by ?? "System",
          note: item.note ?? item.catatan ?? undefined,
        };
      })
    : [];

  if (history.length === 0) {
    history.push({
      status: service.status,
      timestamp: createdDate ? createdDate.toLocaleString("id-ID") : "-",
      actor: "Admin",
    });
  }

  const chatRes = await fetchWithAuth(`${API_PREFIX}/layanan/${id}/chat/tech`);
  let messages: Message[] = [];

  if (chatRes.ok) {
    const chatData = await chatRes.json();
    const rows = Array.isArray(chatData)
      ? chatData
      : (chatData?.messages ?? []);

    messages = rows.map((item: any) => {
      const ts = item.created_at ? new Date(item.created_at) : null;
      return {
        id: Number(item.id ?? Date.now()),
        sender: item.sender_nama ?? item.sender_username ?? "User",
        role:
          item.sender_role ??
          item.role ??
          (item.sender_username === "admin" ? "admin" : "user"),
        message: item.message ?? "",
        timestamp: ts ? ts.toLocaleString("id-ID") : (item.created_at ?? ""),
        attachments: Array.isArray(item.attachments)
          ? item.attachments
          : undefined,
      };
    });
  }

  // Fetch completion reports
  let reports: CompletionReport[] = [];
  const reportsRes = await fetchWithAuth(
    `${API_PREFIX}/technician/layanan/${id}/reports`,
  );

  if (reportsRes.ok) {
    const reportsData = await reportsRes.json();
    reports = Array.isArray(reportsData)
      ? reportsData
      : (reportsData?.reports ?? []);
  }

  return { service, messages, history, reports };
}

export default async function TechnicianServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { service, messages, history, reports } = await getServiceDetail(id);

  if (!service) {
    redirect("/technician/dashboard");
  }

  return (
    <AdminShell>
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1  bg-gray-50">
          <TechnicianServiceDetailClient
            service={service}
            initialMessages={messages}
            initialHistory={history}
            initialReports={reports}
          />
        </main>
      </div>
    </AdminShell>
  );
}
