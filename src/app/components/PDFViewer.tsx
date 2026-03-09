"use client";

type PDFViewerProps = {
  fileUrl: string;
  fileName?: string;
};

export default function PDFViewer({ fileUrl, fileName }: PDFViewerProps) {
  const sanitizedPath = fileUrl.replace(/\\/g, "/");
  const filePart = sanitizedPath.split("/").pop() || sanitizedPath;
  const displayUrl = sanitizedPath.startsWith("http")
    ? sanitizedPath
    : `/uploads/${filePart}`;

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
          href={displayUrl}
          download={fileName}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Unduh PDF
        </a>
      </div>
      <div className="flex-1 bg-white flex items-center justify-center overflow-hidden">
        <iframe
          src={`${displayUrl}#toolbar=0&navpanes=0&scrollbar=0&page=1`}
          className="w-full h-full border-0"
          style={{ backgroundColor: "white" }}
          title={fileName || "PDF Viewer"}
        />
      </div>
    </div>
  );
}
