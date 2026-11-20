"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/vecino/dashboard",   label: "Inicio",      icon: "dashboard" },
  { href: "/vecino/pagos",       label: "Mis Pagos",   icon: "payments" },
  { href: "/vecino/comunicados", label: "Cartelera",   icon: "campaign" },
  { href: "/vecino/asambleas",   label: "Asambleas",   icon: "groups" },
  { href: "/vecino/mapa",        label: "Mapa OTB",    icon: "map" },
];

export default function VecinoSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 hidden lg:flex flex-col bg-white border-r border-[#c4c5d5] p-4 z-40">
      {/* OTB Brand */}
      <div className="flex items-center gap-3 px-2 py-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#00288e] flex items-center justify-center text-white shrink-0 shadow-md">
          <span
            className="material-symbols-outlined text-2xl"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            shield
          </span>
        </div>
        <div>
          <h2 className="font-bold text-base text-[#00288e] leading-tight">
            OTB Villa Calama
          </h2>
          <p className="text-[11px] text-[#444653] font-medium">
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
              className={`flex items-center gap-4 p-3 rounded-xl transition-all font-semibold text-sm ${
                isActive
                  ? "bg-[#00288e] text-white shadow-sm"
                  : "text-[#444653] hover:bg-[#f2f4f6] hover:text-[#00288e]"
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
      <div className="pt-4 border-t border-[#c4c5d5] mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 text-[#ba1a1a] hover:bg-red-50 rounded-xl transition-all font-semibold text-sm cursor-pointer"
        >
          <span className="material-symbols-outlined">logout</span>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
