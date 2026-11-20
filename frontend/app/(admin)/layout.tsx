import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans antialiased">
      {/* Sidebar - visible on desktop only */}
      <Sidebar />

      {/* Top bar + mobile bottom nav */}
      <Navbar />

      {/* Main content shifted right on desktop */}
      <div className="lg:pl-64 pb-20 lg:pb-0">
        {children}
      </div>
    </div>
  );
}
