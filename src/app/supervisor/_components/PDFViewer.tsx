"use client";

import { useState, useEffect } from "react";

type PDFViewerProps = {
  fileUrl: string;
  fileName?: string;
  serviceId?: string | number;
};

export default function PDFViewer({
  fileUrl,
  fileName,
  serviceId,
}: PDFViewerProps) {
  const [blobUrl, setBlobUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        setLoading(true);
        setError("");

        // Try multiple paths
        const fileName_clean = fileUrl.split("/").pop()?.split("\\").pop();
        const API_BASE = "http://localhost:3001";

        // Build proper URL if fileUrl is a relative path
        const isRelativePath = !fileUrl.startsWith("http");

        const paths = [
          // Use Next.js proxy to avoid CORS
          isRelativePath
            ? `/api/proxy-pdf?url=${encodeURIComponent(
                `${API_BASE}/${fileUrl.replace(/\\/g, "/")}`
              )}`
            : `/api/proxy-pdf?url=${encodeURIComponent(fileUrl)}`,
        ].filter(Boolean) as string[];

        let response: Response | null = null;
        let lastError = "";

        for (const path of paths) {
          try {
            response = await fetch(path, {
              credentials: "include",
              headers: {
                Accept: "application/pdf",
              },
            });

            if (response.ok) {
              break;
            }
            lastError = `${response.status} ${response.statusText}`;
          } catch (err) {
            lastError = String(err);
          }
        }

        if (!response || !response.ok) {
          setError(`File tidak ditemukan. ${lastError}`);
          setLoading(false);
          return;
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        setLoading(false);
      } catch (err) {
        setError("Gagal memuat PDF. Silakan gunakan tombol Unduh.");
        setLoading(false);
      }
    };

    fetchPDF();

    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [fileUrl]);

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col h-full"
      style={{ colorScheme: "light" }}
    >
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-2">
          <svg
            className="w-5 h-5 text-red-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">
            {fileName || "Dokumen Lampiran"}
          </span>
        </div>
        <a
          href={fileUrl}
          download={fileName}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Unduh PDF
        </a>
      </div>
      <div className="flex-1 bg-white flex items-center justify-center overflow-hidden">
        {loading ? (
          <div className="text-center">
            <svg
              className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-gray-500 text-sm">Memuat PDF...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <svg
              className="w-12 h-12 text-red-400 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4v2m0-12a9 9 0 110 18 9 9 0 010-18z"
              />
            </svg>
            <p className="text-red-500 text-sm">{error}</p>
            <p className="text-gray-500 text-xs mt-1">
              Gunakan tombol Unduh untuk download file
            </p>
          </div>
        ) : blobUrl ? (
          <iframe
            src={`${blobUrl}#toolbar=0&navpanes=0&scrollbar=0&page=1`}
            className="w-full h-full border-0"
            style={{ backgroundColor: "white" }}
            title={fileName || "PDF Viewer"}
          />
        ) : null}
      </div>
    </div>
  );
}
