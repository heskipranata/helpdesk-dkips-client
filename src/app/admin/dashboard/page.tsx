import AdminShell from "../_components/AdminShell";
import Sidebar from "../_components/Sidebar";
import ServiceTable from "../_components/ServiceTable";
import StatCard from "../_components/StatCard";
import LogoutButton from "../_components/LogoutButton";
import { redirect } from "next/navigation";
import { fetchWithAuth } from "@/lib/cookies";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

async function getAllServices() {
  if (!API_BASE) {
    return {
      services: [],
      message: "Setel NEXT_PUBLIC_API_URL untuk memanggil API Express",
    };
  }

  // Mengambil data layanan terbaru
  const res = await fetchWithAuth(`${API_BASE}/layanan/latest`);

  if (!res.ok) {
    return { services: [], message: "Gagal memuat layanan" };
  }
  const json = await res.json();
  const servicesRaw = Array.isArray(json) ? json : json.services ?? [];

  const services = servicesRaw.map((s: any) => {
    const date = s.created_at ? new Date(s.created_at) : null;
    return {
      id: s.id,
      tanggal: date
        ? `${String(date.getDate()).padStart(2, "0")}/${String(
            date.getMonth() + 1
          ).padStart(2, "0")}/${date.getFullYear()}`
        : "-",
      jam: date
        ? `${String(date.getHours()).padStart(2, "0")}:${String(
            date.getMinutes()
          ).padStart(2, "0")}`
        : "-",
      instansi: s.nama_opd || "-",
      jenis_permintaan: s.nama_layanan || "-",
      status: s.status || "pending",
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
  bulan_ini: number;
};

async function getStatsSummary(): Promise<StatsSummary> {
  if (!API_BASE) {
    return {
      total: 0,
      baru: 0,
      diproses: 0,
      selesai: 0,
      tolak: 0,
      bulan_ini: 0,
    };
  }

  const res = await fetchWithAuth(`${API_BASE}/layanan/stats/summary`);

  if (res.status === 401 || res.status === 403) {
    redirect("/admin/login");
  }

  if (!res.ok) {
    console.error("Failed to fetch stats:", res.status);
    return {
      total: 0,
      baru: 0,
      diproses: 0,
      selesai: 0,
      tolak: 0,
      bulan_ini: 0,
    };
  }

  const data = await res.json();
  console.log("Stats data:", data);

  return {
    total: Number(data.total ?? 0),
    baru: Number(data.baru ?? 0),
    diproses: Number(data.diproses ?? 0),
    selesai: Number(data.selesai ?? 0),
    tolak: Number(data.tolak ?? 0),
    bulan_ini: Number(data.bulan_ini ?? 0),
  };
}

export default async function AdminDashboardPage() {
  const { services } = await getAllServices();
  const stats = await getStatsSummary();
  return (
    <AdminShell>
      <Sidebar />
      <div className="flex-1 p-6 space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-sm text-gray-500">
              Berikut statistik singkat layanan saat ini.
            </p>
          </div>
        </header>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Permintaan"
            value={stats.total}
            subtitle={"Semua status"}
            trend={"up"}
            color="blue"
          />
          <StatCard
            title="Permintaan Baru"
            value={stats.baru}
            subtitle={"Status baru"}
            trend={"up"}
            color="green"
          />
          <StatCard
            title="Dalam Proses"
            value={stats.diproses}
            subtitle={"Status diproses"}
            trend={"up"}
            color="purple"
          />
          <StatCard
            title="Layanan Bulan Ini"
            value={stats.bulan_ini}
            subtitle={"Bulan saat ini"}
            trend={"down"}
            color="orange"
          />
        </div>

        {/* Services Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Permintaan Layanan Terbaru
            </h2>
            <button className="text-blue-600 text-sm hover:underline">
              Statistik Lanjutan
            </button>
          </div>
          <ServiceTable services={services} />
        </div>
      </div>
    </AdminShell>
  );
}
