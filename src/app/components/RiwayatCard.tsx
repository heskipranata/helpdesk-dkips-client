"use client";

import Link from "next/link";
import StatusBadge from "./StatusBadge";

type Layanan = {
  id: string | number;
  tanggal: string;
  nama_instansi: string;
  jenis_permintaan: string;
  status: string;
  deskripsi?: string;
  pdf_url?: string;
};

export default function RiwayatCard({ layanan }: { layanan: Layanan }) {
  return (
    <Link href={`/riwayat/${layanan.id}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-gray-900">
                {layanan.nama_instansi}
              </h3>
              <StatusBadge status={layanan.status} />
            </div>
            <p className="text-sm text-gray-600">{layanan.jenis_permintaan}</p>
          </div>
          <span className="text-xs text-gray-500">{layanan.tanggal}</span>
        </div>

        {layanan.deskripsi && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {layanan.deskripsi}
          </p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            ID: {layanan.id}
          </div>
          <span className="text-sm font-medium text-blue-600 hover:text-blue-700 transition">
            Lihat Detail →
          </span>
        </div>
      </div>
    </Link>
  );
}
