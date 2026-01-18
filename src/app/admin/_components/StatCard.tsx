type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down";
  color?: "blue" | "green" | "purple" | "orange";
};

export default function StatCard({
  title,
  value,
  subtitle,
  trend,
  color = "blue",
}: StatCardProps) {
  const colorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className={`text-2xl font-bold ${colorClasses[color]}`}>
            {value}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{title}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className="w-20 h-12">
          {/* Mini chart placeholder - bisa diganti dengan chart library */}
          <svg
            className="w-full h-full"
            viewBox="0 0 80 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 40 L20 35 L40 25 L60 30 L80 20"
              stroke={trend === "up" ? "#10b981" : "#3b82f6"}
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
