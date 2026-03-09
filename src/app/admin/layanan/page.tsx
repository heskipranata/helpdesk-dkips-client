import AdminShell from "../_components/AdminShell";
import Sidebar from "../_components/Sidebar";
import LayananClient from "./LayananClient";
import { redirect } from "next/navigation";

type Cookies = {
  [key: string]: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

async function getAllLayanan() {
  if (!API_URL) {
    return [];
  }

  try {
    // Get cookies from headers for server-side fetch
    const cookieHeader = (await (await import("next/headers")).cookies())
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const res = await fetch(`${API_URL}/layanan/all`, {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (res.status === 401 || res.status === 403) {
      redirect("/admin/login");
    }

    if (!res.ok) {
      return [];
    }

    const json = await res.json();
    const servicesRaw = Array.isArray(json)
      ? json
      : (json.services ?? json.data ?? json.layanan ?? []);

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
        teknisi_id: s.teknisi_id || null,
      };
    });

    return services;
  } catch {
    return [];
  }
}

export default async function LayananPage() {
  const services = await getAllLayanan();

  return (
    <AdminShell>
      <Sidebar />
      <div className="flex-1 p-6 space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-gray-800">Kelola Layanan</h1>
          <p className="text-sm text-gray-500 mt-1">
            Daftar semua permintaan layanan helpdesk
          </p>
        </header>
        <LayananClient services={services} />
      </div>
    </AdminShell>
  );
}
