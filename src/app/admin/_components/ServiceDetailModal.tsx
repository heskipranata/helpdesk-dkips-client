"use client";

import PDFViewer from "./PDFViewer";

type Service = {
  id: string | number;
  tanggal: string;
  instansi: string;
  jenis_permintaan: string;
  status: string;
  deskripsi?: string;
  prioritas?: string;
  kontak?: string;
  email?: string;
  catatan?: string;
  file_surat?: string;
};

type ServiceDetailModalProps = {
  service: Service | null;
  onClose: () => void;
};

export default function ServiceDetailModal({
  service,
  onClose,
}: ServiceDetailModalProps) {
  if (!service) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Detail Layanan</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          {/* PDF Viewer */}
          {service.file_surat ? (
            <PDFViewer
              fileUrl={`http://localhost:3001/${service.file_surat.replace(
                /\\/g,
                "/"
              )}`}
              fileName={`Lampiran-${service.id}.pdf`}
            />
          ) : null}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">ID</label>
              <p className="mt-1 text-gray-900">{service.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Tanggal
              </label>
              <p className="mt-1 text-gray-900">{service.tanggal}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Nama Instansi
            </label>
            <p className="mt-1 text-gray-900">{service.instansi}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Jenis Permintaan
            </label>
            <p className="mt-1 text-gray-900">{service.jenis_permintaan}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <p className="mt-1">
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                {service.status}
              </span>
            </p>
          </div>
          {service.prioritas && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Prioritas
              </label>
              <p className="mt-1 text-gray-900">{service.prioritas}</p>
            </div>
          )}
          {service.kontak && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Kontak
              </label>
              <p className="mt-1 text-gray-900">{service.kontak}</p>
            </div>
          )}
          {service.email && (
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="mt-1 text-gray-900">{service.email}</p>
            </div>
          )}
          {service.deskripsi && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Deskripsi
              </label>
              <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                {service.deskripsi}
              </p>
            </div>
          )}
          {service.catatan && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Catatan
              </label>
              <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                {service.catatan}
              </p>
            </div>
          )}
        </div>
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Tutup
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
