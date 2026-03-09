"use client";

import { useState, useEffect } from "react";
import ServiceTable from "../_components/ServiceTable";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

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
  teknisi_id?: string | null;
};

type Technician = {
  id: string;
  nama?: string;
  username?: string;
};

export default function LayananClient({
  services: initialServices,
}: {
  services: Service[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [services, setServices] = useState<Service[]>(initialServices);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [techLoading, setTechLoading] = useState(true);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        setTechLoading(true);
        const res = await fetch(`${API_BASE}/users/role/teknisi`, {
          credentials: "include",
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          const techs = Array.isArray(data) ? data : (data.data ?? []);
          setTechnicians(techs);
        }
      } catch (error) {
        console.error("Gagal memuat teknisi:", error);
      } finally {
        setTechLoading(false);
      }
    };

    fetchTechnicians();
  }, []);

  const handleAssignTechnician = async (
    serviceId: string | number,
    technicianId: string,
  ) => {
    try {
      const res = await fetch(`${API_BASE}/layanan/${serviceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          teknisi_id: technicianId,
        }),
      });

      if (!res.ok) {
        throw new Error("Gagal mengupdate layanan");
      }

      // Update local state
      setServices((prevServices) =>
        prevServices.map((svc) =>
          svc.id === serviceId
            ? {
                ...svc,
                teknisi_id: technicianId,
              }
            : svc,
        ),
      );
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("Gagal menugaskan teknisi");
    }
  };

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
            <option className="text-gray-600" value="all">
              Semua Status
            </option>
            <option className="text-gray-600" value="baru">
              Baru
            </option>
            <option className="text-gray-600" value="diproses">
              Diproses
            </option>
            <option className="text-gray-600" value="selesai">
              Selesai
            </option>
            <option className="text-gray-600" value="tolak">
              Tolak
            </option>
          </select>
        </div>
      </div>

      <ServiceTable
        services={filteredServices}

      />
    </>
  );
}
