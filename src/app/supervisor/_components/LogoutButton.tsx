"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      if (!API_URL) {
        document.cookie =
          "role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        router.push("/login");
        return;
      }

      await fetch(`${API_URL}/supervisor/logout`, {
        method: "POST",
        credentials: "include",
      });

      router.push("/supervisor/login");
    } catch (err) {
      router.push("/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
    >
      {isLoggingOut ? "Keluar..." : "Logout"}
    </button>
  );
}
