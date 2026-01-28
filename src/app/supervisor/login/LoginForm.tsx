"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Normalize origin to avoid double /api when env already includes it
      const API_ORIGIN = (
        process.env.NEXT_PUBLIC_API_ORIGIN ??
        process.env.NEXT_PUBLIC_API_URL ??
        "http://localhost:3001"
      ).replace(/\/$/, "");

      const endpoint = `${API_ORIGIN}/api/supervisor/login`;
      const response = await fetch(
        API_ORIGIN
          ? `${API_ORIGIN}/api/supervisor/login`
          : "/api/supervisor/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          mode: "cors",
          credentials: "include",
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        let serverMessage = "";
        try {
          const text = await response.text();
          // Try parse JSON, else use raw text
          serverMessage = (() => {
            try {
              const json = JSON.parse(text);
              return (
                json.message ||
                json.error ||
                json.detail ||
                text ||
                "Login gagal"
              );
            } catch {
              return text || "Login gagal";
            }
          })();
        } catch {
          serverMessage = "Login gagal";
        }

        setError(serverMessage);
        setIsLoading(false);
        return;
      }

      // Successful login - backend should set httpOnly auth cookie
      // Redirect to supervisor dashboard
      router.push("/supervisor/dashboard");
    } catch (err: any) {
      const msg =
        err?.message === "Failed to fetch"
          ? "Gagal terhubung ke server (CORS/jaringan). Pastikan API berjalan di localhost:3001 dan CORS mengizinkan credentials."
          : "Terjadi kesalahan jaringan, silakan coba lagi";
      setError(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-600 to-blue-800 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Image
              src="https://res.cloudinary.com/dewi8c1ll/image/upload/v1765522604/sulut-icon_c9wme4.png"
              alt="logo-pemprov-sulut"
              width={55}
              height={55}
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard Supervisor
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Masukkan username"
              className="w-full border text-gray-600 border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Masukkan password"
              className="w-full border text-gray-700 border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Gunakan username dan password khusus Supervisor</p>
        </div>
      </div>
    </div>
  );
}
