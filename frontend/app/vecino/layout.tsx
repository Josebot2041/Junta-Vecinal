import VecinoSidebar from "@/components/VecinoSidebar";
import VecinoNavbar from "@/components/VecinoNavbar";
import AuthGuard from "@/components/AuthGuard";

export default function VecinoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#F8FAFC] text-[#191c1e] font-sans antialiased">
        {/* Sidebar Vecino (Desktop) */}
        <VecinoSidebar />

        {/* Top bar + Mobile bottom nav */}
        <VecinoNavbar />

        {/* Main content */}
        <div className="lg:pl-64 pb-20 lg:pb-0">
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}
