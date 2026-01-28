"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type LogoutButtonProps = {
  fullWidth?: boolean;
};

export default function LogoutButton({ fullWidth }: LogoutButtonProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

      const targets = ["/admin/logout", "/logout"]; // coba keduanya jika tersedia

      for (const path of targets) {
        try {
          await fetch(`${API_URL}${path}`, {
            method: "POST",
            credentials: "include",
          });
        } catch (err) {
          // Error silently handled
        }
      }

      // Bersihkan cookie role non-httpOnly yang dipakai AuthGuard
      document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";

      router.push("/admin/login");
    } catch (err) {
      // Error silently handled
      document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
      router.push("/admin/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`${
        fullWidth ? "w-full" : ""
      } flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm disabled:opacity-60`}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      <span>{isLoggingOut ? "Keluar..." : "Logout"}</span>
    </button>
  );
}
