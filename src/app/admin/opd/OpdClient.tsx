"use client";

import { useState, useEffect } from "react";

type Opd = {
  id: string | number;
  nama_opd: string;
};

type OpdClientProps = {
  initialData: Opd[];
};

export default function OpdClient({ initialData }: OpdClientProps) {
  const [opdList, setOpdList] = useState<Opd[]>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | number | null>(null);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [formData, setFormData] = useState({
    nama_opd: "",
  });

  const tryOpdRequest = async (
    urls: string[],
    init: RequestInit,
  ): Promise<{
    ok: boolean;
    status: number;
    statusText: string;
    message: string;
  }> => {
    let lastStatus = 0;
    let lastStatusText = "";
    let lastMessage = "";

    for (const url of urls) {
      try {
        const res = await fetch(url, {
          credentials: "include",
          ...init,
        });

        if (res.ok) {
          return {
            ok: true,
            status: res.status,
            statusText: res.statusText,
            message: "",
          };
        }

        lastStatus = res.status;
        lastStatusText = res.statusText;

        try {
          const data = await res.json();
          lastMessage =
            data?.message ?? data?.error ?? data?.errors?.[0]?.msg ?? "";
        } catch {
          try {
            lastMessage = await res.text();
          } catch {
            lastMessage = "";
          }
        }
      } catch {
        // Try next candidate URL
      }
    }

    return {
      ok: false,
      status: lastStatus,
      statusText: lastStatusText,
      message: lastMessage,
    };
  };

  const fetchOpd = async () => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

      const candidates = [`${API_URL}/opd`, `${API_URL}/admin/opd`];
      let found: Opd[] | null = null;

      for (const url of candidates) {
        try {
          const res = await fetch(url, {
            credentials: "include",
            cache: "no-store",
          });

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

      if (found) {
        setOpdList(found);
      }
    } catch (error) {
      // Error silently handled
    }
  };

  useEffect(() => {
    fetchOpd();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama_opd.trim()) {
      alert("Nama OPD harus diisi");
      return;
    }

    setIsSubmitting(true);
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
      const method = editingId ? "PUT" : "POST";
      const urls = editingId
        ? [`${API_URL}/opd/${editingId}`, `${API_URL}/admin/opd/${editingId}`]
        : [`${API_URL}/opd`, `${API_URL}/admin/opd`];

      const result = await tryOpdRequest(urls, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (result.ok) {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({
          nama_opd: "",
        });
        await fetchOpd();
      } else {
        const statusInfo = result.status
          ? `(${result.status} ${result.statusText})`
          : "";
        alert(
          result.message
            ? `Gagal menyimpan OPD ${statusInfo}: ${result.message}`
            : `Gagal menyimpan OPD ${statusInfo}`,
        );
      }
    } catch (error) {
      alert("Terjadi kesalahan saat menyimpan OPD");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Yakin ingin menghapus OPD ini?")) return;

    setIsDeleting(id);
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
      const urls = [`${API_URL}/opd/${id}`, `${API_URL}/admin/opd/${id}`];
      const result = await tryOpdRequest(urls, {
        method: "DELETE",
      });

      if (result.ok) {
        await fetchOpd();
      } else {
        const statusInfo = result.status
          ? `(${result.status} ${result.statusText})`
          : "";
        alert(
          result.message
            ? `Gagal menghapus OPD ${statusInfo}: ${result.message}`
            : `Gagal menghapus OPD ${statusInfo}`,
        );
      }
    } catch (error) {
      alert("Terjadi kesalahan saat menghapus OPD");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (item: Opd) => {
    setEditingId(item.id);
    setFormData({
      nama_opd: item.nama_opd,
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      nama_opd: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">
          Organisasi Perangkat Daerah (OPD)
        </h1>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ nama_opd: "" });
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
        >
          + Tambah OPD
        </button>
      </div>

      {opdList.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500">Belum ada OPD</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Nama OPD
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {opdList.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {item.nama_opd}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={isDeleting === item.id}
                        className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDeleting === item.id ? "Menghapus..." : "Hapus"}
                      </button>
                    </div>
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
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Edit OPD" : "Tambah OPD"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nama OPD *
                </label>
                <input
                  type="text"
                  name="nama_opd"
                  value={formData.nama_opd}
                  onChange={handleInputChange}
                  placeholder="Nama OPD"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? "Menyimpan..."
                    : editingId
                      ? "Update"
                      : "Simpan"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
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
