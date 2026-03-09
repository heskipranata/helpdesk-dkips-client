"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="sidebar w-64 bg-blue-700 text-white min-h-screen flex flex-col">
      <div className="p-6 flex-1">
        <div className="mb-8 flex items-center gap-3">
          <Image
            src="https://res.cloudinary.com/dewi8c1ll/image/upload/v1765522604/sulut-icon_c9wme4.png"
            alt="Helpdesk DKIPS Logo"
            width={48}
            height={48}
            className="bg-white rounded-lg p-1"
          />
          <div className="leading-tight">
            <h2 className="text-base font-bold">Helpdesk DKIPS</h2>
            <p className="text-xs text-blue-200">Admin Panel</p>
          </div>
        </div>
        <nav className="space-y-1">
          <Link
            href="/admin/dashboard"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              isActive("/admin/dashboard") ? "bg-blue-600" : "hover:bg-blue-600"
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
            href="/admin/layanan"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              isActive("/admin/layanan") ? "bg-blue-600" : "hover:bg-blue-600"
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

          <Link
            href="/admin/jenis-layanan"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              isActive("/admin/jenis-layanan")
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
            href="/admin/opd"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              isActive("/admin/opd") ? "bg-blue-600" : "hover:bg-blue-600"
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span className="font-medium">OPD</span>
          </Link>

          <Link
            href="/admin/users"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              isActive("/admin/users") ? "bg-blue-600" : "hover:bg-blue-600"
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span className="font-medium">Users</span>
          </Link>
        </nav>
      </div>

      <div className="p-6 border-t border-blue-600">
        <LogoutButton fullWidth />
      </div>
    </aside>
  );
}
