"use client";

type User = {
  id: string | number;
  nama: string;
  username: string;
  role: string;
  opd_id: string | number;
  nama_opd?: string;
};

type DeleteConfirmModalProps = {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteConfirmModal({
  user,
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Konfirmasi Hapus
              </h3>
              <p className="text-sm text-gray-600">
                Tindakan ini tidak dapat dibatalkan
              </p>
            </div>
          </div>
          <div className="bg-gray-50 rounded p-4 mb-4">
            <p className="text-sm text-gray-700">
              Apakah Anda yakin ingin menghapus user:
            </p>
            <p className="font-semibold text-gray-900 mt-2">{user.nama}</p>
            <p className="text-sm text-gray-600">OPD: {user.nama_opd || "-"}</p>
            <p className="text-sm text-gray-600">Username: {user.username}</p>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
