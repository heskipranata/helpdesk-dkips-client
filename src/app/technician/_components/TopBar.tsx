import LogoutButton from "./LogoutButton";

export default function TopBar() {
  return (
    <header className="bg-white border-b border-gray-200 px-20 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
          <span className="text-white font-bold text-sm">HD</span>
        </div>
        <span className="font-semibold text-gray-800">Helpdesk</span>
      </div>
      <div className="flex items-center space-x-4">
        <LogoutButton />
      </div>
    </header>
  );
}
