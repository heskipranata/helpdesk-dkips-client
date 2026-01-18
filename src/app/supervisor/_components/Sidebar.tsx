"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === "/supervisor/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
      await fetch(`${API_URL}/supervisor/logout`, {
        method: "POST",
        credentials: "include",
      });
      router.push("/supervisor/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <aside className="sidebar w-64 bg-blue-700 text-white min-h-screen flex flex-col">
      <div className="p-6 flex-1">
        <div className="mb-8">
          <h2 className="text-xl font-bold">Helpdesk Supervisor</h2>
          <p className="text-xs text-blue-200 mt-1">Monitoring Panel</p>
        </div>
        <nav className="space-y-1">
          <Link
            href="/supervisor/dashboard"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              isActive("/supervisor/dashboard")
                ? "bg-blue-600"
                : "hover:bg-blue-600"
            }`}
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link
            href="/supervisor/jenis-layanan"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              isActive("/supervisor/jenis-layanan")
                ? "bg-blue-600"
                : "hover:bg-blue-600"
            }`}
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
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
            <span className="font-medium">Jenis Layanan</span>
          </Link>

          <Link
            href="/supervisor/layanan"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              isActive("/supervisor/layanan")
                ? "bg-blue-600"
                : "hover:bg-blue-600"
            }`}
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span className="font-medium">Layanan</span>
          </Link>
        </nav>
      </div>

      <div className="p-6 border-t border-blue-600">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm"
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
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
