"use client";

import { useState } from "react";

type JenisLayanan = {
  id: string | number;
  nama_layanan: string;
  deskripsi?: string;
};

type JenisLayananClientProps = {
  initialData: JenisLayanan[];
};

export default function JenisLayananClient({
  initialData,
}: JenisLayananClientProps) {
  const [jenisLayanan, setJenisLayanan] = useState<JenisLayanan[]>(initialData);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Jenis Layanan</h1>
      </div>

      {jenisLayanan.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500">Belum ada jenis layanan</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Deskripsi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {jenisLayanan.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {item.nama_layanan}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.deskripsi || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
