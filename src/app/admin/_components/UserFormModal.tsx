"use client";

import { useState, useEffect, FormEvent } from "react";

type Opd = {
  id: string | number;
  nama_opd?: string;
  name?: string;
  nama?: string;
};

type User = {
  id: string | number;
  nama: string;
  username: string;
  role: string;
  opd_id: string | number;
  nama_opd?: string;
};

type UserFormData = {
  nama: string;
  username: string;
  password?: string;
  role: string;
  opd_id: string | number;
};

type UserFormModalProps = {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: UserFormData) => void;
};

export default function UserFormModal({
  user,
  isOpen,
  onClose,
  onSubmit,
}: UserFormModalProps) {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
  const [formData, setFormData] = useState<UserFormData>({
    nama: "",
    username: "",
    password: "",
    role: "user",
    opd_id: "",
  });
  const [opdOptions, setOpdOptions] = useState<Opd[]>([]);
  const [loadingOpd, setLoadingOpd] = useState(false);
  const [opdError, setOpdError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        nama: user.nama,
        username: user.username,
        password: "",
        role: user.role,
        opd_id: user.opd_id,
      });
    } else {
      setFormData({
        nama: "",
        username: "",
        password: "",
        role: "user",
        opd_id: "",
      });
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchOpd = async () => {
      setLoadingOpd(true);
      setOpdError("");
      try {
        const candidates = [`${API_URL}/opd`, `${API_URL}/admin/opd`];
        let found: Opd[] | null = null;
        let lastStatus = 0;
        let lastStatusText = "";

        for (const url of candidates) {
          try {
            const res = await fetch(url, {
              credentials: "include",
              cache: "no-store",
            });
            lastStatus = res.status;
            lastStatusText = res.statusText;
            if (!res.ok) {
              continue;
            }
            const data = await res.json();
            const list = Array.isArray(data)
              ? data
              : (data?.data ?? data?.opd ?? []);
            if (Array.isArray(list)) {
              found = list as Opd[];
              break;
            }
          } catch (innerErr) {
            // Error silently handled
          }
        }

        if (!found) {
          throw new Error(
            `Gagal memuat data OPD (status ${lastStatus} ${lastStatusText})`,
          );
        }

        setOpdOptions(found);
      } catch (err) {
        setOpdError("Gagal memuat daftar OPD");
      } finally {
        setLoadingOpd(false);
      }
    };

    fetchOpd();
  }, [API_URL, isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const submitData: UserFormData = {
      ...formData,
      opd_id: formData.opd_id === "" ? "" : Number(formData.opd_id),
    };
    // Remove password if empty (for edit mode)
    if (!submitData.password || submitData.password.trim() === "") {
      delete submitData.password;
    }
    onSubmit(submitData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {user ? "Edit User" : "Tambah User Baru"}
          </h2>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.nama}
              onChange={(e) =>
                setFormData({ ...formData, nama: e.target.value })
              }
              placeholder="Contoh: Admin Kominfo"
              className="w-full border border-gray-300 text-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pilih OPD
            </label>
            <select
              required
              value={formData.opd_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  opd_id: e.target.value ? Number(e.target.value) : "",
                })
              }
              className="w-full border border-gray-300 text-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                {loadingOpd ? "Memuat OPD..." : "Pilih OPD"}
              </option>
              {!loadingOpd &&
                opdOptions.length === 0 &&
                formData.opd_id !== "" && (
                  <option
                    value={formData.opd_id}
                  >{`OPD ${formData.opd_id}`}</option>
                )}
              {opdOptions.map((opd) => (
                <option key={opd.id} value={opd.id}>
                  {opd.nama_opd || opd.name || opd.nama || `OPD ${opd.id}`}
                </option>
              ))}
            </select>
            {opdError && (
              <p className="mt-1 text-xs text-red-600">{opdError}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Username untuk login"
              className="w-full border border-gray-300 text-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password {!user && <span className="text-red-500">*</span>}
              {user && (
                <span className="text-gray-500 text-xs">
                  (Kosongkan jika tidak ingin mengubah)
                </span>
              )}
            </label>
            <input
              type="password"
              required={!user}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder={
                user ? "Masukkan password baru" : "Masukkan password"
              }
              className="w-full border border-gray-300 text-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full border border-gray-300 text-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="pic">PIC</option>
              <option value="supervisor">Supervisor</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
            >
              {user ? "Simpan Perubahan" : "Tambah User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
