"use client";

import Link from "next/link";

type Service = {
  id: string | number;
  tanggal: string;
  jam: string;
  instansi: string;
  jenis_permintaan: string;
  status: "baru" | "diproses" | "selesai" | "tolak";
  deskripsi?: string;
  prioritas?: string;
};

type ServiceTableProps = {
  services: Service[];
};

export default function ServiceTable({ services }: ServiceTableProps) {
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

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tanggal
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jam
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama Instansi
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jenis Permintaan
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {services.map((service) => (
            <tr key={service.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-700">
                {service.tanggal}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">{service.jam}</td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                {service.instansi}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {service.jenis_permintaan}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    service.status
                  )}`}
                >
                  {service.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/admin/layanan/${service.id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Lihat Detail
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {services.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Tidak ada layanan ditemukan
        </div>
      )}
    </div>
  );
}
