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
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    // Ambil profil user dari GET /auth/me
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("/api/auth/me", {
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
          if (userData.username) {
            setUsername(userData.username);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <div>
          <h1 className="text-3xl md:text-2xl font-bold text-gray-900 mb-2">
            Riwayat Permintaan
          </h1>
          <p className="text-gray-600 text-base">
            Lihat status dan riwayat permintaan layanan instansi Anda
          </p>
        </div>

        <div className="mt-12">
          {namaOPD && (
            <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-baseline gap-3 mb-2">
                <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
                  {namaOPD}
                </h2>
              </div>
              {username && (
                <p className="text-sm text-blue-700 font-medium">@{username}</p>
              )}
            </div>
          )}
        </div>

        {/* Filter & Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-5 mb-8">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredLayanan.map((item) => (
              <RiwayatCard key={item.id} layanan={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
