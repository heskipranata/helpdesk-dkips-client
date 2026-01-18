"use client";

import { useState } from "react";
import ServiceTable from "../_components/ServiceTable";

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
};

export default function LayananClient({ services }: { services: Service[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.instansi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.jenis_permintaan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || service.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Cari instansi atau jenis permintaan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 text-sm w-80 text-gray-600"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-600"
          >
            <option className="text-gray-600" value="all">Semua Status</option>
            <option className="text-gray-600" value="baru">Baru</option>
            <option className="text-gray-600" value="diproses">Diproses</option>
            <option className="text-gray-600" value="selesai">Selesai</option>
            <option className="text-gray-600" value="tolak">Tolak</option>
          </select>
        </div>
      </div>

      <ServiceTable services={filteredServices} />
    </>
  );
}
