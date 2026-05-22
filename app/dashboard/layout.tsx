import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardGuard } from "@/components/dashboard/DashboardGuard";
import { AdminStatusBanner } from "@/components/dashboard/AdminStatusBanner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardGuard>
      <div className="flex min-h-screen pt-0">
        <Sidebar />
        <div className="flex-1 p-6 lg:p-8 overflow-auto">
          <AdminStatusBanner />
          {children}
        </div>
      </div>
    </DashboardGuard>
  );
}
