import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-blue-800 text-white py-12 ">
      <div className="container mx-auto px-22">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Kolom Kiri - Logo */}
          <div className="flex justify-center md:justify-start">
            <div className="relative w-45 h-45">
              <Image
                src="https://res.cloudinary.com/dewi8c1ll/image/upload/v1765522604/sulut-icon_c9wme4.png"
                alt="Logo Sulawesi Utara"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Kolom Tengah - Links */}
          <div className="text-right space-y-4 mr-14 ">
            <h3 className="text-xl font-semibold mb-4">Link Terkait</h3>
            <div className="space-y-2">
              <Link
                href="https://sulutprov.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-blue-400 transition-colors duration-200"
              >
                Website Pemprov Sulut
              </Link>
              <Link
                href="https://diskominfo.sulutprov.go.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-blue-400 transition-colors duration-200"
              >
                Website DKIPS Sulut
              </Link>
            </div>
          </div>

          {/* Kolom Kanan - Alamat */}
          <div className="text-right space-y-3">
            <h3 className="text-xl font-semibold mb-4">Tentang Kami</h3>
            <div className="space-y-2 text-gray-300">
              <p className="text-sm">
                Dinas Komunikasi, Informatika, Persandian dan Statistik
              </p>
              <p className="text-sm">
                Provinsi Sulawesi UtaraJl. 17 Agustus No. 69
              </p>
              <p className="text-sm mt-3"></p>
              <p className="text-sm">Manado, Sulawesi Utara</p>
              <p className="text-sm">95111</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white mt-8 pt-6 text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} DKIPS Provinsi Sulawesi Utara. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
