import ServiceCard from "./ServiceCard";

type Service = {
  id: string | number;
  name: string;
  description?: string;
  status?: string;
};

export default function ServiceList({
  services = [],
}: {
  services: Service[];
}) {
  if (!services.length) {
    return (
      <div className="border border-blue-200 rounded p-4 bg-blue-50 text-blue-700">
        Tidak ada layanan.
      </div>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s) => (
        <ServiceCard key={s.id} service={s} />
      ))}
    </div>
  );
}
