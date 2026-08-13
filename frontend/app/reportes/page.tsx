"use client";

import React, { useState } from "react";

export default function ReportesPage() {
  const [reportFormat, setReportFormat] = useState<"PDF" | "Excel">("PDF");
  const [includeAccounts, setIncludeAccounts] = useState(true);
  const [includeDebtors, setIncludeDebtors] = useState(true);
  const [includeMinutes, setIncludeMinutes] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      alert("¡Reporte generado y descargado con éxito!");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans antialiased lg:pl-64 pb-24 lg:pb-0">
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      {/* SideNavBar (Escritorio) - Corregido el espacio superior */}
      <aside className="h-screen w-64 fixed left-0 top-0 hidden lg:flex flex-col bg-white border-r border-[#c4c5d5] p-4 space-y-2 z-40">
        <div className="flex items-center gap-3 p-2 mb-2 pt-4">
          <div className="w-10 h-10 rounded-full bg-[#1e40af] flex items-center justify-center text-white shrink-0 overflow-hidden">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvkQwdujMNkcLeEYafr827VkOBZXC0DW2fM_Z1reYWLb7aoZlG5dqcUEpP_M8XMqp2Q7n1zXsQEU_39c3WT3oF9MoIqIx3VZo2lkqXbCiiD6IXQMYi-Hr2fLhOt0qNs9Wo5G_9eCAf83pJRprM135-7mvOVHT1BCWpTsEWZ_gnE-gMqpoG6N8Hc_T5U_T2CDfkVZHhHWmfZ9W86jmSTspgLT08RaXr2_7zN1UmZkBc-Pctnh8tsQno23kBUm4qjGO-MWuavmMCz2w"
              alt="Logo OTB"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-semibold text-sm text-[#1e40af]">
              Gestión OTB
            </div>
            <div className="text-xs text-[#444653]">Cochabamba, Bolivia</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <a
            className="flex items-center gap-4 p-3 text-[#444653] hover:bg-[#e6e8ea] rounded-lg transition-all"
            href="#"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-semibold text-sm">Inicio</span>
          </a>
          <a
            className="flex items-center gap-4 p-3 text-[#444653] hover:bg-[#e6e8ea] rounded-lg transition-all"
            href="#"
          >
            <span className="material-symbols-outlined">group</span>
            <span className="font-semibold text-sm">Vecinos</span>
          </a>
          <a
            className="flex items-center gap-4 p-3 text-[#444653] hover:bg-[#e6e8ea] rounded-lg transition-all"
            href="#"
          >
            <span className="material-symbols-outlined">payments</span>
            <span className="font-semibold text-sm">Pagos</span>
          </a>
          <a
            className="flex items-center gap-4 p-3 text-[#444653] hover:bg-[#e6e8ea] rounded-lg transition-all"
            href="#"
          >
            <span className="material-symbols-outlined">construction</span>
            <span className="font-semibold text-sm">Proyectos</span>
          </a>
          <a
            className="flex items-center gap-4 p-3 bg-[#1e40af] text-[#a8b8ff] font-bold rounded-lg transition-all"
            href="#"
          >
            <span className="material-symbols-outlined">assessment</span>
            <span className="font-semibold text-sm">Reportes</span>
          </a>
        </nav>

        <div className="mt-auto pb-4">
          <button className="w-full bg-[#00288e] text-white font-bold py-3 px-4 rounded-xl shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">add</span>
            Registrar Pago
          </button>
        </div>
      </aside>

      {/* TopNavBar */}
      <header className="bg-white w-full sticky top-0 z-50 shadow-sm border-b border-[#c4c5d5]">
        <div className="flex justify-between items-center px-6 py-3 max-w-[1280px] mx-auto">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-[#00288e]">
              Comunidad Gestión
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-3">
              <a
                className="text-[#444653] font-medium hover:bg-[#f2f4f6] transition-colors px-3 py-2 rounded-lg"
                href="#"
              >
                Inicio
              </a>
              <a
                className="text-[#444653] font-medium hover:bg-[#f2f4f6] transition-colors px-3 py-2 rounded-lg"
                href="#"
              >
                Vecinos
              </a>
              <a
                className="text-[#444653] font-medium hover:bg-[#f2f4f6] transition-colors px-3 py-2 rounded-lg"
                href="#"
              >
                Pagos
              </a>
              <a
                className="text-[#00288e] font-bold border-b-2 border-[#00288e] px-3 py-2"
                href="#"
              >
                Reportes
              </a>
            </nav>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-full hover:bg-[#f2f4f6] transition-colors active:scale-95">
                <span className="material-symbols-outlined text-[#444653]">
                  notifications
                </span>
              </button>
              <button className="p-2 rounded-full hover:bg-[#f2f4f6] transition-colors active:scale-95">
                <span className="material-symbols-outlined text-[#444653]">
                  account_circle
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 lg:p-8 max-w-[1280px] mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#191c1e] mb-1">
              Panel de Reportes
            </h1>
            <p className="text-[#444653] text-base">
              Analiza la gestión de tu comunidad en tiempo real.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#f2f4f6] p-2 rounded-xl border border-[#c4c5d5]">
            <span className="material-symbols-outlined text-[#757684]">
              calendar_today
            </span>
            <select className="bg-transparent border-none focus:ring-0 text-sm font-semibold text-[#191c1e] outline-none cursor-pointer">
              <option>Últimos 12 meses</option>
              <option>Año 2026</option>
              <option>Semestre Actual</option>
            </select>
          </div>
        </div>

        {/* Bento Grid Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* KPI Cards */}
          <div className="md:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-[#c4c5d5] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <span
                  className="material-symbols-outlined text-[#00288e] p-2 bg-[#dde1ff] rounded-lg"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  payments
                </span>
                <span className="text-[#006c49] text-xs font-bold bg-[#6cf8bb]/30 px-2.5 py-0.5 rounded-full">
                  +12%
                </span>
              </div>
              <div className="text-xs font-medium text-[#444653]">
                Recaudación Total
              </div>
              <div className="text-2xl font-bold text-[#191c1e] mt-1">
                Bs. 45.280
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#c4c5d5] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <span className="material-symbols-outlined text-[#006c49] p-2 bg-[#6cf8bb]/30 rounded-lg">
                  group
                </span>
                <span className="text-[#ba1a1a] text-xs font-bold bg-[#ffdad6] px-2.5 py-0.5 rounded-full">
                  -3%
                </span>
              </div>
              <div className="text-xs font-medium text-[#444653]">
                Asistencia Promedio
              </div>
              <div className="text-2xl font-bold text-[#191c1e] mt-1">84%</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#c4c5d5] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <span className="material-symbols-outlined text-[#70000c] p-2 bg-[#ffdad7] rounded-lg">
                  warning
                </span>
              </div>
              <div className="text-xs font-medium text-[#444653]">
                Morosidad Actual
              </div>
              <div className="text-2xl font-bold text-[#ba1a1a] mt-1">
                15.2%
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#c4c5d5] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <span className="material-symbols-outlined text-[#00288e] p-2 bg-[#dde1ff] rounded-lg">
                  task_alt
                </span>
              </div>
              <div className="text-xs font-medium text-[#444653]">
                Proyectos Ejecutados
              </div>
              <div className="text-2xl font-bold text-[#191c1e] mt-1">
                8 / 12
              </div>
            </div>
          </div>

          {/* Main Chart */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-[#c4c5d5] shadow-sm overflow-hidden relative flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[#191c1e]">
                Tendencia de Recaudación
              </h3>
              <button className="p-2 hover:bg-[#f2f4f6] rounded-lg transition-colors">
                <span className="material-symbols-outlined text-[#444653]">
                  more_vert
                </span>
              </button>
            </div>

            <div className="h-64 flex items-end justify-between relative px-2">
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                preserveAspectRatio="none"
                viewBox="0 0 100 100"
              >
                <path
                  className="opacity-80"
                  d="M0,80 Q10,75 20,60 T40,65 T60,40 T80,30 T100,10"
                  fill="none"
                  stroke="#1e40af"
                  strokeWidth="2"
                ></path>
                <path
                  className="opacity-10"
                  d="M0,80 Q10,75 20,60 T40,65 T60,40 T80,30 T100,10 V100 H0 Z"
                  fill="url(#grad1)"
                ></path>
                <defs>
                  <linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop
                      offset="0%"
                      style={{ stopColor: "#1e40af", stopOpacity: 1 }}
                    ></stop>
                    <stop
                      offset="100%"
                      style={{ stopColor: "#1e40af", stopOpacity: 0 }}
                    ></stop>
                  </linearGradient>
                </defs>
              </svg>

              {["Ene", "Feb", "Mar", "Abr", "May", "Jun"].map((month, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center group cursor-pointer h-full justify-end z-10"
                >
                  <span className="text-xs text-[#444653] font-medium">
                    {month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar: Export Reports */}
          <div className="bg-[#1e40af] text-white p-6 rounded-2xl border border-[#00288e] shadow-lg flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">
                Exportar Reportes
              </h3>
              <p className="text-xs text-[#a8b8ff]">
                Genera documentos oficiales para asambleas.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-white/90">
                Formato del Reporte
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setReportFormat("PDF")}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${reportFormat === "PDF" ? "bg-white/20 border-white font-bold" : "bg-white/10 border-white/20 hover:bg-white/15"}`}
                >
                  <span className="material-symbols-outlined text-white text-sm">
                    description
                  </span>
                  <span className="text-sm">PDF</span>
                </button>
                <button
                  onClick={() => setReportFormat("Excel")}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${reportFormat === "Excel" ? "bg-white/20 border-white font-bold" : "bg-white/10 border-white/20 hover:bg-white/15"}`}
                >
                  <span className="material-symbols-outlined text-white text-sm">
                    table_chart
                  </span>
                  <span className="text-sm">Excel</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-white/90">
                Incluir en el reporte
              </label>
              <div className="space-y-2.5">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={includeAccounts}
                    onChange={(e) => setIncludeAccounts(e.target.checked)}
                    className="rounded border-white/30 bg-white/10 text-[#006c49] focus:ring-[#006c49] w-4 h-4"
                  />
                  <span className="text-sm text-white group-hover:text-[#6cf8bb] transition-colors">
                    Estado de Cuentas
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={includeDebtors}
                    onChange={(e) => setIncludeDebtors(e.target.checked)}
                    className="rounded border-white/30 bg-white/10 text-[#006c49] focus:ring-[#006c49] w-4 h-4"
                  />
                  <span className="text-sm text-white group-hover:text-[#6cf8bb] transition-colors">
                    Lista de Morosos
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={includeMinutes}
                    onChange={(e) => setIncludeMinutes(e.target.checked)}
                    className="rounded border-white/30 bg-white/10 text-[#006c49] focus:ring-[#006c49] w-4 h-4"
                  />
                  <span className="text-sm text-white group-hover:text-[#6cf8bb] transition-colors">
                    Actas de Reunión
                  </span>
                </label>
              </div>
            </div>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full bg-[#006c49] text-white font-bold py-3 rounded-xl shadow-lg hover:bg-[#005236] transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {isDownloading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">
                    sync
                  </span>
                  Generando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">
                    download
                  </span>
                  Descargar Reporte
                </>
              )}
            </button>
          </div>

          {/* Secondary Chart */}
          <div className="md:col-span-3 bg-white p-6 rounded-2xl border border-[#c4c5d5] shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#191c1e]">
                  Asistencia Promedio por Mes
                </h3>
                <p className="text-xs text-[#444653]">
                  Porcentaje de vecinos presentes en asambleas ordinarias.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#006c49] rounded-full"></div>
                <span className="text-xs text-[#444653]">Asistencia</span>
              </div>
            </div>

            <div className="h-64 flex items-end gap-4 lg:gap-6 px-2">
              {[
                { month: "Jul", pct: "70%" },
                { month: "Ago", pct: "85%" },
                { month: "Sep", pct: "65%" },
                { month: "Oct", pct: "92%" },
                { month: "Nov", pct: "80%" },
                { month: "Dic", pct: "88%" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="w-full bg-[#6cf8bb]/20 rounded-t-lg relative group h-48">
                    <div
                      className="absolute bottom-0 left-0 w-full bg-[#006c49] rounded-t-lg transition-all duration-700 group-hover:brightness-110"
                      style={{ height: item.pct }}
                    ></div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#191c1e] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                      {item.pct}
                    </div>
                  </div>
                  <span className="text-xs font-medium text-[#444653]">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* BottomNavBar (Móvil) */}
      <nav className="fixed bottom-0 w-full lg:hidden z-50 bg-white border-t border-[#c4c5d5] shadow-lg flex justify-around items-center h-16 px-2">
        <a
          className="flex flex-col items-center justify-center text-[#444653] transition-transform active:scale-90"
          href="#"
        >
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px]">Inicio</span>
        </a>
        <a
          className="flex flex-col items-center justify-center text-[#444653] transition-transform active:scale-90"
          href="#"
        >
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px]">Vecinos</span>
        </a>
        <a
          className="flex flex-col items-center justify-center text-[#444653] transition-transform active:scale-90"
          href="#"
        >
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="text-[10px]">Pagos</span>
        </a>
        <a
          className="flex flex-col items-center justify-center bg-[#6cf8bb] text-[#002113] rounded-full px-4 py-1 transition-transform active:scale-90"
          href="#"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            assessment
          </span>
          <span className="text-[10px] font-bold">Reportes</span>
        </a>
      </nav>
    </div>
  );
}
