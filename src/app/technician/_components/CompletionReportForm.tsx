"use client";

import { useState, useRef, type FormEvent } from "react";

export type CompletionReport = {
  id: number;
  layanan_id: number;
  technician_id: number;
  status: string;
  summary: string;
  photo_path: string;
  completed_at: string;
  created_at: string;
};

type CompletionReportFormProps = {
  serviceId: string | number;
  onSuccess: (report: CompletionReport) => void;
  onError?: (error: string) => void;
};

const maxNotesChars = 5000;
const maxFileSize = 5 * 1024 * 1024; // 5MB

const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_ORIGIN ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001"
).replace(/\/$/, "");
const API_PREFIX = API_ORIGIN.endsWith("/api")
  ? API_ORIGIN
  : `${API_ORIGIN}/api`;

export default function CompletionReportForm({
  serviceId,
  onSuccess,
  onError,
}: CompletionReportFormProps) {
  const [notes, setNotes] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar (jpg, png, gif, dll)");
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      setError("Ukuran file maksimal 5MB");
      return;
    }

    setPhotoFile(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    // Validate notes
    if (notes.trim().length === 0) {
      setError("Catatan laporan penyelesaian wajib diisi.");
      return;
    }

    if (notes.trim().length > maxNotesChars) {
      setError("Catatan maksimal 5000 karakter.");
      return;
    }

    // Validate photo
    if (!photoFile) {
      setError("Gambar/foto laporan wajib diunggah.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("status", "selesai");
      formData.append("notes", notes.trim());
      formData.append("photo", photoFile);

      const response = await fetch(
        `${API_PREFIX}/technician/layanan/${serviceId}/report`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (!response.ok) {
        let message = "Gagal mengirim laporan penyelesaian.";
        try {
          const text = await response.text();
          try {
            const json = JSON.parse(text);
            message = json.message || json.error || json.detail || message;
          } catch {
            message = text || message;
          }
        } catch {
          message = "Gagal mengirim laporan penyelesaian.";
        }
        setError(message);
        onError?.(message);
        return;
      }

      const data = (await response.json()) as CompletionReport;
      
      // Reset form
      setNotes("");
      handleRemovePhoto();
      
      // Call success callback
      onSuccess(data);
    } catch (err) {
      const errorMessage = "Terjadi kesalahan jaringan.";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const notesCharsRemaining = maxNotesChars - notes.length;

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-gray-200 rounded-lg p-4 space-y-4"
    >
      <div>
        <h3 className="text-sm font-semibold text-gray-700">
          Laporan Penyelesaian
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Kirim foto bukti dan catatan hasil pekerjaan untuk menandai layanan selesai.
        </p>
      </div>

      {/* Photo Upload Section */}
      <div>
        <label className="text-sm font-medium text-gray-600 block mb-2">
          Foto/Gambar Laporan <span className="text-red-500">*</span>
        </label>
        
        {photoPreview ? (
          <div className="space-y-2">
            <div className="relative inline-block">
              <img
                src={photoPreview}
                alt="Preview"
                className="max-w-xs max-h-48 rounded border border-gray-200"
              />
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
              >
                ✕
              </button>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Ubah Foto
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
          >
            <div className="text-gray-500 text-sm">
              <p className="font-medium">Klik untuk memilih gambar</p>
              <p className="text-xs mt-1">atau drag & drop gambar</p>
              <p className="text-xs text-gray-400 mt-1">Maksimal 5MB</p>
            </div>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="hidden"
        />
      </div>

      {/* Notes Section */}
      <div>
        <label className="text-sm font-medium text-gray-600 block mb-1">
          Catatan Penyelesaian <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Tuliskan ringkasan penyelesaian pekerjaan..."
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700"
        />
        <div className="text-xs text-gray-500 mt-1">
          {notesCharsRemaining} karakter tersisa
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 text-xs text-red-600">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition"
      >
        {loading ? "Mengirim..." : "Kirim Laporan Penyelesaian"}
      </button>

      {/* Info */}
      <div className="text-xs text-gray-500 bg-gray-50 rounded p-2">
        Setelah dikirim, status layanan otomatis menjadi selesai.
      </div>
    </form>
  );
}
