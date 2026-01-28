"use client";

import { useState, useEffect } from "react";
import RiwayatCard from "./RiwayatCard";

type Layanan = {
  id: string | number;
  tanggal: string;
  nama_opd?: string;
  nama_instansi: string;
  jenis_permintaan: string;
  status: string;
  deskripsi?: string;
  pdf_url?: string;
};

export default function RiwayatClient({ layanan }: { layanan: Layanan[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [namaOPD, setNamaOPD] = useState<string>("");

  useEffect(() => {
    // Ambil profil user dari GET /auth/me
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/auth/me", {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const userData = await res.json();
          if (userData.nama_opd) {
            setNamaOPD(userData.nama_opd);
          }
        }
      } catch (err) {
        // Error silently handled
      }
    };

    fetchUserProfile();
  }, []);

  const filteredLayanan = layanan.filter((item) => {
    const matchesSearch =
      item.jenis_permintaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nama_instansi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      item.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          {namaOPD && (
            <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                Organisasi Perangkat Daerah
              </p>
              <h2 className="text-2xl font-bold text-blue-900">{namaOPD}</h2>
            </div>
          )}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Riwayat Permintaan
          </h1>
          <p className="text-gray-600">
            Lihat status dan riwayat permintaan layanan Anda
          </p>
        </div>

        {/* Filter & Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Cari berdasarkan jenis permintaan atau instansi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
              />
            </div>
            <div className="md:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Semua Status</option>
                <option value="baru">Baru</option>
                <option value="diproses">Diproses</option>
                <option value="selesai">Selesai</option>
                <option value="tolak">Tolak</option>
              </select>
            </div>
          </div>
        </div>

        {/* List */}
        {filteredLayanan.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
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
            <p className="text-gray-600 mb-2">Tidak ada riwayat ditemukan</p>
            <p className="text-sm text-gray-500">
              Permintaan layanan yang Anda ajukan akan muncul di sini
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLayanan.map((item) => (
              <RiwayatCard key={item.id} layanan={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
