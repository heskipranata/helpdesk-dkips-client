import AdminShell from "../_components/AdminShell";
import Sidebar from "../_components/Sidebar";
import OpdClient from "./OpdClient";
import { fetchWithAuth } from "@/lib/cookies";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

async function getAllOpd() {
  if (!API_URL) {
    return [];
  }

  try {
    const res = await fetchWithAuth(`${API_URL}/opd`);

    if (res.status === 401 || res.status === 403) {
      redirect("/admin/login");
    }

    if (!res.ok) {
      return [];
    }

    const json = await res.json();
    return Array.isArray(json) ? json : (json.data ?? []);
  } catch (error) {
    return [];
  }
}

export default async function OpdPage() {
  const opdData = await getAllOpd();

  return (
    <AdminShell>
      <Sidebar />
      <div className="flex-1 p-8">
        <OpdClient initialData={opdData} />
      </div>
    </AdminShell>
  );
}
