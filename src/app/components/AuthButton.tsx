"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AuthButtonProps {
  className?: string;
  onNavigate?: () => void;
}

export default function AuthButton({ className, onNavigate }: AuthButtonProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const cookies = document.cookie.split(";");
    const hasAuthCookie = cookies.some(
      (cookie) =>
        cookie.trim().startsWith("role=") ||
        cookie.trim().startsWith("token=") ||
        cookie.trim().startsWith("connect.sid=")
    );
    setIsAuthenticated(hasAuthCookie);
    setIsLoading(false);
  };

  const handleLogout = async () => {
    try {
      // Hapus semua cookies
      document.cookie.split(";").forEach((cookie) => {
        const [name] = cookie.split("=");
        document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });

      // Panggil API logout jika ada
      try {
        await fetch("http://localhost:3001/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
      } catch (error) {
        // Ignore error, tetap lakukan logout di client
      }

      setIsAuthenticated(false);

      // Redirect ke home
      router.push("/");
      router.refresh();

      if (onNavigate) {
        onNavigate();
      }
    } catch (error) {
      // Error silently handled
    }
  };

  if (isLoading) {
    return (
      <div className={className}>
        <div className="h-10 w-20 animate-pulse rounded-lg bg-gray-200"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <button
        onClick={handleLogout}
        className={
          className ||
          "rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 hover:shadow-lg"
        }
      >
        Logout
      </button>
    );
  }

  return (
    <Link
      href="/login"
      onClick={onNavigate}
      className={
        className ||
        "rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 hover:shadow-lg"
      }
    >
      Login
    </Link>
  );
}
