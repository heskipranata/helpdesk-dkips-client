import LogoutButton from "./LogoutButton";

export default function TopBar() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
          <span className="text-white font-bold text-sm">HD</span>
        </div>
        <span className="font-semibold text-gray-800">Helpdesk</span>
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
