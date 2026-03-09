import LogoutButton from "./LogoutButton";
import Image from "next/image";

export default function TopBar() {
  return (
    <header className="w-full bg-white border-b border-gray-200 px-28 py-3 flex items-center justify-between mb-10">
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
      <div className="flex items-center space-x-4">
        <LogoutButton />
      </div>
    </header>
  );
}
