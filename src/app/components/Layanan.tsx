"use client";

import { useState, useEffect } from "react";

interface JenisLayanan {
  id: number;
  nama_layanan: string;
}

export default function Layanan() {
  const [formData, setFormData] = useState({
    jenis_layanan_id: "",
    deskripsi: "",
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [jenisLayanan, setJenisLayanan] = useState<JenisLayanan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch jenis layanan dan user data
    const loadData = async () => {
      try {
        // Ambil jenis layanan
        try {
          const jenisResponse = await fetch(
            "http://localhost:3001/api/jenis-layanan"
          );

          if (jenisResponse.ok) {
            const jenisText = await jenisResponse.text();

            try {
              const jenisData = JSON.parse(jenisText);
              setJenisLayanan(
                Array.isArray(jenisData) ? jenisData : jenisData.data || []
              );
            } catch (parseErr) {
              setJenisLayanan([]);
            }
          }
        } catch (err) {
          // Error silently handled
        }

        // Tidak perlu fetch user data - backend akan ambil dari req.user
      } catch (err) {
        // Error silently handled
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setError("File harus berformat PDF");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran file maksimal 5MB");
        return;
      }
      setPdfFile(file);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    // Validasi field wajib
    if (!formData.jenis_layanan_id) {
      setError("Kategori layanan harus dipilih");
      setIsSubmitting(false);
      return;
    }
    if (!formData.deskripsi) {
      setError("Deskripsi tidak boleh kosong");
      setIsSubmitting(false);
      return;
    }
    if (!pdfFile) {
      setError("File PDF harus dipilih");
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("jenis_layanan_id", formData.jenis_layanan_id);
      formDataToSend.append("deskripsi", formData.deskripsi);
      if (pdfFile) {
        formDataToSend.append("file_surat", pdfFile);
      }

      const response = await fetch("http://localhost:3001/api/layanan/", {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
      });

      if (!response.ok) {
        let errorMessage = "Gagal mengirim permintaan";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseErr) {
          const errorText = await response.text();
          errorMessage = `Server Error (${
            response.status
          }): ${errorText.substring(0, 100)}`;
        }
        throw new Error(errorMessage);
      }

      const successData = await response.json();

      setSuccess("Permintaan service berhasil diajukan!");
      setFormData({
        jenis_layanan_id: "",
        deskripsi: "",
      });
      setPdfFile(null);

      // Reset file input
      const fileInput = document.getElementById(
        "file_surat"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="layanan"
      className="py-40 bg-linear-to-b from-gray-50 to-white"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Ajukan Permintaan Layanan atau Laporan Masalah
          </h2>
          <p className="text-gray-600 text-lg">
            Isi formulir di bawah ini untuk mengajukan permintaan layanan
            bantuan teknis
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {isLoading && (
            <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Memuat data...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="kategori"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Kategori Layanan <span className="text-red-500">*</span>
              </label>
              <select
                id="kategori"
                name="jenis_layanan_id"
                value={formData.jenis_layanan_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 text-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Pilih kategori</option>
                {jenisLayanan.map((jenis) => (
                  <option key={jenis.id} value={jenis.id}>
                    {jenis.nama_layanan}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="deskripsi"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Deskripsi Lanjutan <span className="text-red-500">*</span>
              </label>
              <textarea
                id="deskripsi"
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Masukkan penjelasan lebih detail"
              />
            </div>

            <div>
              <label
                htmlFor="file_surat"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Lampiran Surat Permohonan{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="file_surat"
                accept="application/pdf"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {pdfFile && (
                <p className="mt-2 text-sm text-gray-600">
                  File terpilih: {pdfFile.name} (
                  {(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Format: PDF, Maksimal 5MB
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all transform hover:scale-[1.02] ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Mengirim...
                  </span>
                ) : (
                  "Kirim Permintaan"
                )}
              </button>
            </div>
          </form>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Catatan:</strong> Setelah menyampaikan permintaan dari
              instansi Anda, kami akan segera meninjau dan menindaklanjuti
              permintaan tersebut.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
