import LogoutButton from "./LogoutButton";
import Image from "next/image";

export default function TopBar() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
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
        <button className="text-sm text-gray-600 hover:text-gray-800">
          Settings
        </button>
        <button className="text-sm text-gray-600 hover:text-gray-800">
          Analytic
        </button>
        <button className="text-sm text-gray-600 hover:text-gray-800">
          Premium
        </button>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <span className="text-sm font-medium">Admin User</span>
          </div>
          <span className="text-gray-300">|</span>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
