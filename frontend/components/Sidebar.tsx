"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard",   label: "Inicio",       icon: "dashboard" },
  { href: "/vecinos",     label: "Vecinos",      icon: "group" },
  { href: "/pagos",       label: "Pagos",        icon: "payments" },
  { href: "/comunicados", label: "Comunicados",  icon: "campaign" },
  { href: "/asambleas",   label: "Asambleas",    icon: "event" },
  { href: "/asistencias", label: "Asistencias",  icon: "how_to_reg" },
  { href: "/reportes",    label: "Reportes",     icon: "assessment" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 hidden lg:flex flex-col bg-white border-r border-[#c4c5d5] p-4 z-40">
      {/* Logo / Branding */}
      <div className="flex items-center gap-3 px-2 py-4 mb-4">
        <div className="w-10 h-10 rounded-lg bg-[#1e40af] flex items-center justify-center text-[#a8b8ff] shrink-0">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            account_balance
          </span>
        </div>
        <div>
          <h2 className="font-semibold text-lg text-[#00288e] leading-tight">
            Gestión OTB
          </h2>
          <p className="text-[10px] text-[#444653] uppercase tracking-widest">
            Cochabamba, Bolivia
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, label, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-4 p-3 rounded-lg transition-all font-semibold text-sm ${
                isActive
                  ? "bg-[#1e40af] text-[#a8b8ff]"
                  : "text-[#444653] hover:bg-[#e6e8ea] hover:text-[#00288e]"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: '"FILL" 1' } : {}}
              >
                {icon}
              </span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="pt-4 border-t border-[#c4c5d5] mt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 text-[#ba1a1a] hover:bg-red-50 rounded-lg transition-all font-semibold text-sm"
        >
          <span className="material-symbols-outlined">logout</span>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
