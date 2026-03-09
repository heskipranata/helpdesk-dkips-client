import AdminShell from "../_components/AdminShell";
import TopBar from "../_components/TopBar";
import TechnicianTasksClient from "./TechnicianTasksClient";
import { redirect } from "next/navigation";
import { fetchWithAuth } from "@/lib/cookies";

const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_ORIGIN ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001"
).replace(/\/$/, "");
const API_PREFIX = API_ORIGIN.endsWith("/api")
  ? API_ORIGIN
  : `${API_ORIGIN}/api`;

async function getAllServices() {
  if (!API_PREFIX) {
    return {
      services: [],
      message: "Setel NEXT_PUBLIC_API_URL untuk memanggil API Express",
    };
  }

  const res = await fetchWithAuth(`${API_PREFIX}/technician/layanan`);

  if (res.status === 401 || res.status === 403) {
    redirect("/technician/login");
  }

  if (!res.ok) {
    return { services: [], message: "Gagal memuat layanan" };
  }
  const json = await res.json();
  const servicesRaw = Array.isArray(json) ? json : (json.services ?? []);

  const services = servicesRaw.map((s: any) => {
    const date = s.created_at ? new Date(s.created_at) : null;
    return {
      id: s.id,
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
      instansi: s.nama_opd || "-",
      jenis_permintaan: s.nama_layanan || "-",
      status: s.status || "baru",
      deskripsi: s.deskripsi || "",
      kontak: s.kontak || "",
      email: s.email || "",
      catatan: s.catatan || "",
      file_surat: s.file_surat || "",
    };
  });
  return { services };
}

type StatsSummary = {
  total: number;
  baru: number;
  diproses: number;
  selesai: number;
  tolak: number;
};

async function getDashboardStats(): Promise<StatsSummary> {
  if (!API_PREFIX) {
    return {
      total: 0,
      baru: 0,
      diproses: 0,
      selesai: 0,
      tolak: 0,
    };
  }

  const res = await fetchWithAuth(`${API_PREFIX}/technician/dashboard`);

  if (res.status === 401 || res.status === 403) {
    redirect("/technician/login");
  }

  if (!res.ok) {
    return {
      total: 0,
      baru: 0,
      diproses: 0,
      selesai: 0,
      tolak: 0,
    };
  }

  const data = await res.json();

  return {
    total: Number(data.total ?? 0),
    baru: Number(data.baru ?? 0),
    diproses: Number(data.diproses ?? 0),
    selesai: Number(data.selesai ?? 0),
    tolak: Number(data.tolak ?? 0),
  };
}

export default async function AdminDashboardPage() {
  const { services } = await getAllServices();
  const stats = await getDashboardStats();
  return (
    <AdminShell>
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 p-6">
          <TechnicianTasksClient services={services} statsSummary={stats} />
        </main>
      </div>
    </AdminShell>
  );
}
