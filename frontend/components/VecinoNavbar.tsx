"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const mobileNavItems = [
  { href: "/vecino/dashboard",   label: "Inicio",      icon: "home" },
  { href: "/vecino/pagos",       label: "Pagos",       icon: "receipt_long" },
  { href: "/vecino/comunicados", label: "Avisos",      icon: "campaign" },
  { href: "/vecino/asambleas",   label: "Asambleas",   icon: "groups" },
  { href: "/vecino/mapa",        label: "Mapa OTB",    icon: "map" },
];

export default function VecinoNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <>
      {/* Top Bar */}
      <header className="bg-white w-full sticky top-0 z-50 shadow-sm border-b border-[#c4c5d5]">
        <div className="flex justify-between items-center px-6 py-3 max-w-[1280px] mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-[#00288e]">
              Comunidad Gestión
            </span>
            <span className="hidden sm:inline-block text-xs font-bold text-[#166534] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full">
              Portal del Vecino
            </span>
          </div>

          {/* Desktop Top Links */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex gap-4 text-sm font-semibold">
              <Link
                href="/vecino/dashboard"
                className={`py-1 transition-colors ${
                  pathname === "/vecino/dashboard"
                    ? "text-[#00288e] border-b-2 border-[#00288e]"
                    : "text-[#444653] hover:text-[#00288e]"
                }`}
              >
                Inicio
              </Link>
              <Link
                href="/vecino/pagos"
                className={`py-1 transition-colors ${
                  pathname === "/vecino/pagos"
                    ? "text-[#00288e] border-b-2 border-[#00288e]"
                    : "text-[#444653] hover:text-[#00288e]"
                }`}
              >
                Mis Pagos
              </Link>
              <Link
                href="/vecino/comunicados"
                className={`py-1 transition-colors ${
                  pathname === "/vecino/comunicados"
                    ? "text-[#00288e] border-b-2 border-[#00288e]"
                    : "text-[#444653] hover:text-[#00288e]"
                }`}
              >
                Cartelera
              </Link>
              <Link
                href="/vecino/asambleas"
                className={`py-1 transition-colors ${
                  pathname === "/vecino/asambleas"
                    ? "text-[#00288e] border-b-2 border-[#00288e]"
                    : "text-[#444653] hover:text-[#00288e]"
                }`}
              >
                Asambleas
              </Link>
              <Link
                href="/vecino/mapa"
                className={`py-1 transition-colors ${
                  pathname === "/vecino/mapa"
                    ? "text-[#00288e] border-b-2 border-[#00288e]"
                    : "text-[#444653] hover:text-[#00288e]"
                }`}
              >
                Mapa OTB
              </Link>
            </nav>

            <div className="flex items-center gap-2 border-l border-[#c4c5d5] pl-4">
              <button
                onClick={() => router.push("/vecino/comunicados")}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors text-[#444653]"
                title="Notificaciones"
              >
                <span className="material-symbols-outlined text-xl">
                  notifications
                </span>
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-red-50 transition-colors text-[#444653]"
                title="Cerrar sesión"
              >
                <span className="material-symbols-outlined text-xl">
                  account_circle
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Right */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={handleLogout}
              className="p-1.5 text-xs text-[#ba1a1a] font-bold"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Navigation Bar (Mobile) */}
      <nav className="fixed bottom-0 w-full lg:hidden z-50 bg-white border-t border-[#c4c5d5] shadow-lg flex justify-around items-center h-16 px-1">
        {mobileNavItems.map(({ href, label, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center transition-transform active:scale-90 px-2 ${
                isActive ? "text-[#00288e]" : "text-[#444653]"
              }`}
            >
              <span
                className={`material-symbols-outlined text-xl ${
                  isActive ? "bg-[#dde1ff] rounded-full px-3 py-0.5" : ""
                }`}
                style={isActive ? { fontVariationSettings: '"FILL" 1' } : {}}
              >
                {icon}
              </span>
              <span className="text-[10px] font-semibold mt-0.5">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
