"use client";

import { useState } from "react";

type StatusHistoryItem = {
  status: string;
  timestamp: string;
  admin: string;
  note?: string;
};

type StatusUpdateFormProps = {
  currentStatus: string;
  history: StatusHistoryItem[];
  onUpdateStatus: (status: string, note: string) => void;
};

export default function StatusUpdateForm({
  currentStatus,
  history,
  onUpdateStatus,
}: StatusUpdateFormProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [note, setNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStatus(selectedStatus, note);
    setNote("");
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

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">
          Status & Timeline
        </h3>
      </div>
      <div className="p-4 space-y-4">
        {/* Current Status */}
        <div>
          <label className="text-sm font-medium text-gray-500 block mb-2">
            Status Saat Ini
          </label>
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
              currentStatus
            )}`}
          >
            {currentStatus}
          </span>
        </div>

        {/* Update Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Update Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="baru">Baru</option>
              <option value="diproses">Diproses</option>
              <option value="selesai">Selesai</option>
              <option value="tolak">Tolak</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Catatan
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Tambahkan catatan untuk perubahan status..."
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700"
          >
            Update Status
          </button>
        </form>

        {/* Timeline */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Riwayat Status
          </h4>
          <div className="space-y-3">
            {history.map((item, idx) => (
              <div key={idx} className="flex space-x-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      idx === 0 ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                  {idx < history.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200 mt-1" />
                  )}
                </div>
                <div className="flex-1 pb-3">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      oleh {item.admin}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{item.timestamp}</p>
                  {item.note && (
                    <p className="text-sm text-gray-700 mt-1">{item.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
