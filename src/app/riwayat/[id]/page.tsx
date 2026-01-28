import Navbar from "../../components/Navbar";
import AuthGuard from "../../components/AuthGuard";
import RiwayatDetailClient from "./RiwayatDetailClient";
import { cookies } from "next/headers";

const API_URL = "http://localhost:3001/api";

async function getServiceDetail(id: string) {
  try {
    const cookieHeader = (await cookies()).toString();

    // Fetch service detail menggunakan endpoint /my/:id untuk user
    const resService = await fetch(`${API_URL}/layanan/my/${id}`, {
      headers: { cookie: cookieHeader },
      cache: "no-store",
      credentials: "include",
    });

    if (!resService.ok) {
      return null;
    }

    const rawData = await resService.json();

    const date = rawData?.created_at ? new Date(rawData.created_at) : null;

    // Fetch OPD name if we have opd_id
    let namaOpd = "-";
    if (rawData?.opd_id) {
      try {
        // Try multiple endpoints
        let resOpd = await fetch(`${API_URL}/opd/${rawData.opd_id}`, {
          headers: { cookie: cookieHeader },
          cache: "no-store",
        });

        if (!resOpd.ok) {
          // Try alternative endpoint
          resOpd = await fetch(`${API_URL}/opd`, {
            headers: { cookie: cookieHeader },
            cache: "no-store",
          });
        }

        if (resOpd.ok) {
          const opdData = await resOpd.json();
          // Handle array response
          if (Array.isArray(opdData)) {
            const opd = opdData.find((o: any) => o.id === rawData.opd_id);
            namaOpd = opd?.nama_opd ?? opd?.name ?? "-";
          } else {
            namaOpd = opdData?.nama_opd ?? opdData?.name ?? "-";
          }
        }
      } catch (err) {
        // Fallback: Jika API gagal, gunakan ID sebagai placeholder
        namaOpd = `OPD ${rawData.opd_id}`;
      }
    }

    const fileSurat = rawData?.file_surat ?? "";

    const service = {
      id: rawData?.id ?? id,
      tanggal: date
        ? `${String(date.getDate()).padStart(2, "0")}/${String(
            date.getMonth() + 1
          ).padStart(2, "0")}/${date.getFullYear()}`
        : "-",
      jam: date
        ? `${String(date.getHours()).padStart(2, "0")}:${String(
            date.getMinutes()
          ).padStart(2, "0")}`
        : "-",
      nama_instansi: namaOpd,
      jenis_permintaan: rawData?.nama_layanan ?? "-",
      status: rawData?.status ?? "-",
      deskripsi: rawData?.deskripsi ?? "-",
      kontak: rawData?.kontak ?? "",
      email: rawData?.email ?? "",
      file_surat: fileSurat,
    };

    // Fetch chat messages
    const resChat = await fetch(`${API_URL}/layanan/${id}/chat`, {
      headers: { cookie: cookieHeader },
      cache: "no-store",
      credentials: "include",
    });

    let chatMessages = [];
    if (resChat.ok) {
      const chatData = await resChat.json();
      const rows = Array.isArray(chatData)
        ? chatData
        : chatData?.messages ?? [];

      chatMessages = rows.map((m: any) => {
        const ts = m.created_at ? new Date(m.created_at) : null;
        return {
          id: m.id,
          sender: m.sender_nama ?? m.sender_username ?? "User",
          role:
            m.sender_username === "admin" || m.role === "admin"
              ? "admin"
              : "user",
          message: m.message ?? "",
          timestamp: ts ? ts.toLocaleString("id-ID") : m.created_at ?? "",
        };
      });
    }

    // Fetch progress/status history
    const resProgress = await fetch(`${API_URL}/layanan/${id}/progress`, {
      headers: { cookie: cookieHeader },
      cache: "no-store",
      credentials: "include",
    });

    let progress = [];
    if (resProgress.ok) {
      const progData = await resProgress.json();
      progress = Array.isArray(progData) ? progData : progData?.progress ?? [];
    }

    return {
      service,
      messages: chatMessages,
      progress,
    };
  } catch (err) {
    return null;
  }
}

export default async function RiwayatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getServiceDetail(id);

  if (!data) {
    return (
      <>
        <Navbar />
        <AuthGuard requireAuth={true}>
          <div className="min-h-screen bg-gray-50 py-24">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="text-center py-12">
                <p className="text-gray-500">Data tidak ditemukan</p>
              </div>
            </div>
          </div>
        </AuthGuard>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <AuthGuard requireAuth={true}>
        <div className="min-h-screen bg-gray-50 py-24">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Detail Permintaan
              </h1>
            </div>
            <RiwayatDetailClient
              initialService={data.service}
              initialMessages={data.messages}
              initialProgress={data.progress}
              layananId={id}
            />
          </div>
        </div>
      </AuthGuard>
    </>
  );
}
