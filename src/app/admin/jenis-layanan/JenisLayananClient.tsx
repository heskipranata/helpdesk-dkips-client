"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [jenisLayanan, setJenisLayanan] = useState<JenisLayanan[]>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | number | null>(null);
  const [formData, setFormData] = useState({
    nama_layanan: "",
    deskripsi: "",
  });

  const fetchJenisLayanan = async () => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
      const res = await fetch(`${API_URL}/jenis-layanan`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        console.log("API Response:", data);
        const items = Array.isArray(data) ? data : data.data ?? [];
        setJenisLayanan(items);
      } else {
        console.error("API Error:", res.status, res.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama_layanan.trim()) {
      alert("Nama jenis layanan harus diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
      const res = await fetch(`${API_URL}/jenis-layanan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({
          nama_layanan: "",
          deskripsi: "",
        });
        await fetchJenisLayanan();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Yakin ingin menghapus jenis layanan ini?")) return;

    setIsDeleting(id);
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
      const res = await fetch(`${API_URL}/jenis-layanan/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        await fetchJenisLayanan();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Jenis Layanan</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
        >
          + Tambah Jenis Layanan
        </button>
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
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Aksi
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
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={isDeleting === item.id}
                      className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting === item.id ? "Menghapus..." : "Hapus"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Tambah Jenis Layanan</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nama *
                </label>
                <input
                  type="text"
                  name="nama_layanan"
                  value={formData.nama_layanan}
                  onChange={handleInputChange}
                  placeholder="Nama jenis layanan"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Deskripsi
                </label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleInputChange}
                  placeholder="Deskripsi (opsional)"
                  rows={3}
                  className="w-full border border-gray-300 rounded text-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-400 text-white px-4 py-2 rounded text-sm hover:bg-gray-500"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
