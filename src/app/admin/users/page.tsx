import AdminShell from "../_components/AdminShell";
import Sidebar from "../_components/Sidebar";
import UsersClient from "./UsersClient";
import { fetchWithAuth } from "@/lib/cookies";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

async function getAllUsers() {
  if (!API_URL) {
    return [];
  }

  try {
    const res = await fetchWithAuth(`${API_URL}/admin/users`);

    if (res.status === 401 || res.status === 403) {
      redirect("/admin/login");
    }

    if (!res.ok) {
      return [];
    }

    const json = await res.json();
    const users = Array.isArray(json) ? json : json.data ?? json.users ?? [];

    return users;
  } catch {
    return [];
  }
}

export default async function UsersPage() {
  const users = await getAllUsers();

  return (
    <AdminShell>
      <Sidebar />
      <div className="flex-1 p-6 space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-gray-800">Kelola User</h1>
          <p className="text-sm text-gray-500 mt-1">
            Daftar semua user yang terdaftar dalam sistem
          </p>
        </header>
        <UsersClient users={users} />
      </div>
    </AdminShell>
  );
}
