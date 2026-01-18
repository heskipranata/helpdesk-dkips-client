import type { ReactNode } from "react";

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="admin-shell min-h-screen bg-gray-50 flex">{children}</div>
  );
}
