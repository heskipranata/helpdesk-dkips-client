"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import StatCard from "../_components/StatCard";

type Service = {
  id: string | number;
  tanggal: string;
  jam: string;
  instansi: string;
  jenis_permintaan: string;
  status: "baru" | "diproses" | "selesai" | "tolak";
  deskripsi?: string;
  prioritas?: string;
  kontak?: string;
  email?: string;
  catatan?: string;
  file_surat?: string;
};

type Task = Service;

type TechnicianTasksClientProps = {
  services: Service[];
  statsSummary?: {
    total: number;
    baru: number;
    diproses: number;
    selesai: number;
    tolak: number;
  };
};

const statusLabels: Record<string, string> = {
  baru: "Baru",
  diproses: "Diproses",
  selesai: "Selesai",
  tolak: "Tolak",
};

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

function buildInitialTasks(services: Service[]): Task[] {
  return services.map((service) => ({
    ...service,
    status: service.status ?? "baru",
  }));
}

function calculateStats(tasks: Task[]) {
  const total = tasks.length;
  const baru = tasks.filter((t) => t.status === "baru").length;
  const diproses = tasks.filter((t) => t.status === "diproses").length;
  const selesai = tasks.filter((t) => t.status === "selesai").length;
  const tolak = tasks.filter((t) => t.status === "tolak").length;
  return { total, baru, diproses, selesai, tolak };
}

export default function TechnicianTasksClient({
  services,
  statsSummary,
}: TechnicianTasksClientProps) {
  const [tasks, setTasks] = useState<Task[]>(() => buildInitialTasks(services));
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const didMountRef = useRef(false);

  const [stats, setStats] = useState(
    () => statsSummary ?? calculateStats(tasks),
  );

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    setStats(calculateStats(tasks));
  }, [tasks]);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.instansi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.jenis_permintaan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 px-8">
      <section>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Teknisi</h1>
        <p className="text-sm text-gray-500 mt-1">
          Kelola dan perbarui status layanan yang telah ditugaskan kepada Anda.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Tugas"
          value={stats.total}
          subtitle="Semua status"
          trend="up"
          color="blue"
        />
        <StatCard
          title="Tugas Baru"
          value={stats.baru}
          subtitle="Status baru"
          trend="up"
          color="green"
        />
        <StatCard
          title="Sedang Diproses"
          value={stats.diproses}
          subtitle="Butuh tindak lanjut"
          trend="up"
          color="purple"
        />
        <StatCard
          title="Selesai"
          value={stats.selesai}
          subtitle="Sudah selesai"
          trend="up"
          color="orange"
        />
        <StatCard
          title="Ditolak"
          value={stats.tolak}
          subtitle="Perlu evaluasi"
          trend="down"
          color="blue"
        />
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            type="text"
            placeholder="Cari instansi atau jenis layanan..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="border border-gray-300 rounded px-4 py-2 text-sm w-full md:w-80 text-gray-700"
          />
          <select
            value={filterStatus}
            onChange={(event) => setFilterStatus(event.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700"
          >
            <option value="all">Semua Status</option>
            <option value="baru">Baru</option>
            <option value="diproses">Diproses</option>
            <option value="selesai">Selesai</option>
            <option value="tolak">Tolak</option>
          </select>
        </div>
        <div className="text-xs text-gray-500">
          Menampilkan {filteredTasks.length} dari {tasks.length} tugas
        </div>
      </section>

      <section className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
            Belum ada tugas yang sesuai dengan filter.
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-600">
                  <th className="px-4 py-3 font-semibold">Instansi</th>
                  <th className="px-4 py-3 font-semibold">Layanan</th>
                  <th className="px-4 py-3 font-semibold">Masuk</th>
                  <th className="px-4 py-3 font-semibold text-center">
                    Status
                  </th>
                  <th className="px-4 py-3 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="border-t border-gray-100 bg-white"
                  >
                    <td className="px-4 py-3 text-gray-800 font-medium">
                      {task.instansi}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {task.jenis_permintaan}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {task.tanggal} {task.jam}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          task.status,
                        )}`}
                      >
                        {statusLabels[task.status] ?? task.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        href={`/technician/layanan/${task.id}`}
                        className="inline-flex px-3 py-1.5 rounded text-xs font-medium bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Lihat Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
