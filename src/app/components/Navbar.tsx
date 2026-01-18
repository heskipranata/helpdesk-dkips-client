"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import AuthButton from "./AuthButton";

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Layanan", href: "/layanan" },
  { label: "Riwayat", href: "/riwayat" },
  { label: "Kontak", href: "#kontak" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-lg "
          : "bg-white/95 backdrop-blur-lg shadow-md"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Image
            src="https://res.cloudinary.com/dewi8c1ll/image/upload/v1765522604/sulut-icon_c9wme4.png"
            alt="Helpdesk DKIPS Logo"
            width={40}
            height={40}
          />
          <div className="leading-tight">
            <p className="text-sm font-bold text-blue-700 md:text-base">
              Helpdesk DKIPS
            </p>
            <p className="text-xs text-blue-600 md:text-sm">
              Provinsi Sulawesi Utara
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative inline-flex items-center px-1 py-2 text-gray-700 transition hover:text-blue-600"
            >
              <span className="absolute inset-x-0 -bottom-1 h-0.5 origin-left scale-x-0 bg-blue-600 transition-transform duration-200 ease-out hover:scale-x-100" />
              <span className="relative">{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex">
          <AuthButton className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 hover:shadow-lg" />
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setIsOpen((open) => !open)}
          className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-blue-200 text-blue-700 transition hover:border-blue-300 hover:bg-blue-50 md:hidden"
        >
          <span
            className={`block h-0.5 w-6 bg-blue-700 transition-transform duration-200 ${
              isOpen ? "translate-y-1.5 rotate-45" : "-translate-y-1.5"
            }`}
          />
          <span
            className={`absolute block h-0.5 w-6 bg-blue-700 transition-opacity duration-150 ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-blue-700 transition-transform duration-200 ${
              isOpen ? "-translate-y-1.5 -rotate-45" : "translate-y-1.5"
            }`}
          />
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="mx-4 mb-4 rounded-xl border border-blue-100 bg-white px-4 py-3 shadow-xl">
            <nav className="flex flex-col gap-2 text-sm font-medium">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-3 py-2 text-gray-700 transition hover:bg-blue-50 hover:text-blue-700"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-3">
              <AuthButton
                onNavigate={() => setIsOpen(false)}
                className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-700"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
