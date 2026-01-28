import Navbar from "../components/Navbar";
import RiwayatClient from "../components/RiwayatClient";
import AuthGuard from "../components/AuthGuard";
import { cookies } from "next/headers";

const API_URL = "http://localhost:3001/api";

async function getRiwayatLayanan() {
  try {
    const cookieHeader = (await cookies()).toString();
    const res = await fetch(`${API_URL}/layanan/my`, {
      headers: { cookie: cookieHeader },
      cache: "no-store",
      credentials: "include",
    });

    if (!res.ok) {
      return [];
    }

    const json = await res.json();

    // Handle berbagai format response
    let rawData = [];
    if (Array.isArray(json)) {
      rawData = json;
    } else if (json.data && Array.isArray(json.data)) {
      rawData = json.data;
    } else if (json.layanan && Array.isArray(json.layanan)) {
      rawData = json.layanan;
    }

    // Transform data ke format yang diharapkan RiwayatClient
    const transformedData = rawData.map((item: any) => ({
      id: item.id,
      tanggal: item.created_at
        ? new Date(item.created_at).toISOString().split("T")[0]
        : "",
      nama_opd: item.nama_opd || "",
      nama_instansi: item.nama_instansi || item.nama_opd || "OPD",
      jenis_permintaan: item.nama_layanan || item.jenis_layanan || "",
      status: item.status,
      deskripsi: item.deskripsi || "",
      pdf_url: item.file_surat || "",
    }));

    return transformedData;
  } catch (err) {
    return [];
  }
}

export default async function RiwayatPage() {
  const layanan = await getRiwayatLayanan();

  return (
    <>
      <Navbar />
      <AuthGuard requireAuth={true}>
        <RiwayatClient layanan={layanan} />
      </AuthGuard>
    </>
  );
}
