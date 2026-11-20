"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const mobileNavItems = [
  { href: "/dashboard",   label: "Inicio",       icon: "home" },
  { href: "/vecinos",     label: "Vecinos",      icon: "person" },
  { href: "/pagos",       label: "Pagos",        icon: "receipt_long" },
  { href: "/comunicados", label: "Avisos",       icon: "campaign" },
  { href: "/asambleas",   label: "Asambleas",    icon: "event" },
  { href: "/asistencias", label: "Asistencias",  icon: "how_to_reg" },
  { href: "/reportes",    label: "Reportes",     icon: "assessment" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <>
      {/* Top Bar (all screen sizes) */}
      <header className="bg-white w-full sticky top-0 z-50 shadow-sm border-b border-[#c4c5d5]">
        <div className="flex justify-between items-center px-6 py-3 max-w-[1280px] mx-auto">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-[#00288e]">
              Comunidad Gestión
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
              <span className="material-symbols-outlined text-[#444653]">
                notifications
              </span>
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-red-50 transition-colors"
              title="Cerrar sesión"
            >
              <span className="material-symbols-outlined text-[#444653]">
                account_circle
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Navigation Bar (mobile only) */}
      <nav className="fixed bottom-0 w-full lg:hidden z-50 bg-white border-t border-[#c4c5d5] shadow-lg flex justify-around items-center h-16 px-1">
        {mobileNavItems.map(({ href, label, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center transition-transform active:scale-90 px-1 ${
                isActive
                  ? "text-[#00288e]"
                  : "text-[#444653]"
              }`}
            >
              <span
                className={`material-symbols-outlined ${isActive ? "bg-[#dde1ff] rounded-full px-3 py-0.5" : ""}`}
                style={isActive ? { fontVariationSettings: '"FILL" 1' } : {}}
              >
                {icon}
              </span>
              <span className="text-[9px] font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
