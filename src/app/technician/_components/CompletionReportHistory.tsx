"use client";

export type CompletionReportRecord = {
  id: number;
  layanan_id: number;
  technician_id: number;
  status: string;
  summary: string;
  photo_path: string;
  completed_at: string;
  created_at: string;
  technician_nama?: string;
  technician_username?: string;
};

type CompletionReportHistoryProps = {
  reports: CompletionReportRecord[];
};

export default function CompletionReportHistory({
  reports,
}: CompletionReportHistoryProps) {
  if (!reports || reports.length === 0) {
    return null;
  }

  return (
    <div className=" rounded-lg p-0 space-y-4">
      <div className="space-y-4">
        {reports.slice(0, 1).map((report) => {
          const completedDate = new Date(report.completed_at).toLocaleString(
            "id-ID",
            {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            },
          );

          return (
            <div
              key={report.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Photo Section - 2/3 width */}
                {report.photo_path && (
                  <div className="lg:w-2/3 w-full">
                    <img
                      src={report.photo_path}
                      alt={`Laporan ${report.id}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Chat/Summary Section - 1/3 width */}
                <div className="lg:w-1/3 w-full p-4 bg-white space-y-3 flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">
                        {completedDate}
                      </div>
                      {report.technician_nama && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          oleh {report.technician_nama}
                        </div>
                      )}
                    </div>
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
                      {report.status}
                    </span>
                  </div>

                  {/* Summary Section */}
                  {report.summary && (
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-600 mb-1">
                        Catatan:
                      </p>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {report.summary}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
