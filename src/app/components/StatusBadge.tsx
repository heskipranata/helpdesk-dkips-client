"use client";

type StatusBadgeProps = {
  status: string;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "selesai":
        return "bg-green-100 text-green-700 border-green-200";
      case "diproses":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "baru":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "tolak":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusStyle(
        status
      )}`}
    >
      {status}
    </span>
  );
}
