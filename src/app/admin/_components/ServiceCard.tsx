type Service = {
  id: string | number;
  name: string;
  description?: string;
  status?: string;
};

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="service-card border border-blue-200 rounded p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-blue-700">{service.name}</h3>
        {service.status && (
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
            {service.status}
          </span>
        )}
      </div>
      {service.description && (
        <p className="mt-2 text-sm opacity-80">{service.description}</p>
      )}
      <div className="mt-3 text-xs opacity-60">ID: {service.id}</div>
    </div>
  );
}
