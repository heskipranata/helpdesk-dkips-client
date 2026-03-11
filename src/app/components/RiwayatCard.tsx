"use client";

import Link from "next/link";
import StatusBadge from "./StatusBadge";

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

export default function RiwayatCard({ layanan }: { layanan: Layanan }) {
  return (
    <Link href={`/riwayat/${layanan.id}`}>
      <div className="bg-blue-600 border border-blue-700 rounded-lg p-5 hover:shadow-lg hover:border-blue-800 hover:bg-blue-700 transition-all cursor-pointer h-full flex flex-col">
        <div className="flex items-start justify-between mb-3 flex-1">
          <div className="flex-1">
            {layanan.jenis_permintaan && (
              <h3 className="text-lg font-bold text-white mb-1">
                {layanan.jenis_permintaan}
              </h3>
            )}
            {layanan.deskripsi && (
              <p className="text-sm text-blue-100 line-clamp-2">
                {layanan.deskripsi}
              </p>
            )}
            <div className="mt-2">
              <StatusBadge status={layanan.status} />
            </div>
          </div>
          <span className="text-xs text-blue-200 ml-2">{layanan.tanggal}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-blue-500">
          <div className="text-xs text-blue-200">{layanan.nama_instansi}</div>
          <span className="text-sm font-medium text-white hover:text-blue-100 transition">
            Lihat Detail →
          </span>
        </div>
      </div>
    </Link>
  );
}
