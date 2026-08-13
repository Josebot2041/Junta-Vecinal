"use client";

import React, { useState } from "react";

export default function PagosPage() {
  const [selectedStatus, setSelectedStatus] = useState<"Pagado" | "Pendiente">(
    "Pagado",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  // Simulación de envío de formulario interactivo
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage(true);

      setTimeout(() => {
        setSuccessMessage(false);
      }, 2000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans antialiased lg:pl-64 pb-24 lg:pb-0">
      {/* Importación de Google Material Symbols */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      {/* SideNavBar (Escritorio) */}
      <aside className="h-screen w-64 fixed left-0 top-0 hidden lg:flex flex-col bg-white border-r border-[#c4c5d5] p-4 space-y-2 z-40 pt-24">
        <div className="flex items-center gap-3 p-2 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#1e40af] flex items-center justify-center text-white shrink-0">
            <span className="material-symbols-outlined">account_balance</span>
          </div>
          <div>
            <div className="font-semibold text-sm text-[#191c1e]">
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
            className="flex items-center gap-4 p-3 bg-[#1e40af] text-[#a8b8ff] font-bold rounded-lg transition-all"
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
            className="flex items-center gap-4 p-3 text-[#444653] hover:bg-[#e6e8ea] rounded-lg transition-all"
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
                className="text-[#00288e] font-bold border-b-2 border-[#00288e] px-3 py-2"
                href="#"
              >
                Pagos
              </a>
              <a
                className="text-[#444653] font-medium hover:bg-[#f2f4f6] transition-colors px-3 py-2 rounded-lg"
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
        {/* Header Title */}
        <div>
          <h1 className="text-3xl font-bold text-[#191c1e] mb-1">
            Gestión Financiera
          </h1>
          <p className="text-[#444653] text-base">
            Registro manual de cobros y control de tesorería.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Registration Form Panel */}
          <section className="xl:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#c4c5d5]">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-[#00288e]">
                  add_circle
                </span>
                <h2 className="text-xl font-bold text-[#191c1e]">
                  Registrar Cobro
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#191c1e] mb-1">
                    Vecino / Propietario
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#757684]">
                      person
                    </span>
                    <select className="w-full pl-10 pr-4 py-2.5 bg-[#f2f4f6] border border-[#c4c5d5] rounded-xl focus:border-[#00288e] focus:ring-1 focus:ring-[#00288e] outline-none text-sm cursor-pointer">
                      <option>Seleccionar vecino...</option>
                      <option>Carlos Mendoza - Casa 12</option>
                      <option>Maria Rodriguez - Casa 45</option>
                      <option>Jorge Villaroel - Casa 08</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#191c1e] mb-1">
                      Concepto
                    </label>
                    <select className="w-full px-3 py-2.5 bg-[#f2f4f6] border border-[#c4c5d5] rounded-xl focus:border-[#00288e] focus:ring-1 focus:ring-[#00288e] outline-none text-sm cursor-pointer">
                      <option>Cuota Mensual</option>
                      <option>Multa</option>
                      <option>Aporte Extraordinario</option>
                      <option>Alquiler de Salón</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#191c1e] mb-1">
                      Monto (BOB)
                    </label>
                    <input
                      className="w-full px-3 py-2.5 bg-[#f2f4f6] border border-[#c4c5d5] rounded-xl focus:border-[#00288e] focus:ring-1 focus:ring-[#00288e] outline-none text-sm"
                      placeholder="0.00"
                      type="number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#191c1e] mb-1">
                    Estado inicial
                  </label>
                  <div className="flex gap-4">
                    <label
                      className={`flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded-xl cursor-pointer transition-all ${selectedStatus === "Pagado" ? "border-[#6cf8bb] bg-[#6cf8bb]/10" : "border-[#c4c5d5]"}`}
                    >
                      <input
                        type="radio"
                        name="status"
                        checked={selectedStatus === "Pagado"}
                        onChange={() => setSelectedStatus("Pagado")}
                        className="text-[#006c49] focus:ring-[#006c49]"
                      />
                      <span className="text-sm font-semibold text-[#002113]">
                        Pagado
                      </span>
                    </label>
                    <label
                      className={`flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded-xl cursor-pointer transition-all ${selectedStatus === "Pendiente" ? "border-[#00288e] bg-[#dde1ff]/30" : "border-[#c4c5d5]"}`}
                    >
                      <input
                        type="radio"
                        name="status"
                        checked={selectedStatus === "Pendiente"}
                        onChange={() => setSelectedStatus("Pendiente")}
                        className="text-[#00288e] focus:ring-[#00288e]"
                      />
                      <span className="text-sm font-semibold text-[#444653]">
                        Pendiente
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#00288e] text-white py-3 rounded-xl font-bold hover:bg-[#1e40af] transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-md"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="material-symbols-outlined animate-spin">
                          sync
                        </span>
                        Procesando...
                      </>
                    ) : successMessage ? (
                      <>
                        <span className="material-symbols-outlined">
                          check_circle
                        </span>
                        ¡Registrado!
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">save</span>
                        Confirmar Registro
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Summary Bento Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#6cf8bb]/20 p-5 rounded-2xl border border-[#6cf8bb] flex flex-col justify-between shadow-sm">
                <span className="material-symbols-outlined text-[#00714d] mb-2">
                  trending_up
                </span>
                <div>
                  <p className="text-xs text-[#00714d] font-bold uppercase tracking-wider">
                    Cobrado Hoy
                  </p>
                  <p className="text-xl font-bold text-[#002113]">1,250 BOB</p>
                </div>
              </div>
              <div className="bg-[#dde1ff]/50 p-5 rounded-2xl border border-[#b8c4ff] flex flex-col justify-between shadow-sm">
                <span className="material-symbols-outlined text-[#00288e] mb-2">
                  account_balance_wallet
                </span>
                <div>
                  <p className="text-xs text-[#00288e] font-bold uppercase tracking-wider">
                    Caja General
                  </p>
                  <p className="text-xl font-bold text-[#00288e]">45,800 BOB</p>
                </div>
              </div>
            </div>
          </section>

          {/* History & Table Panel */}
          <section className="xl:col-span-7 bg-white rounded-2xl shadow-sm border border-[#c4c5d5] overflow-hidden flex flex-col justify-between">
            <div>
              {/* Filters Header */}
              <div className="p-6 border-b border-[#c4c5d5] bg-[#f2f4f6]/50 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-xl font-bold text-[#191c1e]">
                    Historial de Ingresos
                  </h2>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 border border-[#c4c5d5] rounded-xl flex items-center gap-2 text-sm text-[#444653] hover:bg-white transition-colors bg-white">
                      <span className="material-symbols-outlined text-sm">
                        filter_list
                      </span>
                      Filtros
                    </button>
                    <button className="px-4 py-2 border border-[#c4c5d5] rounded-xl flex items-center gap-2 text-sm text-[#444653] hover:bg-white transition-colors bg-white">
                      <span className="material-symbols-outlined text-sm">
                        download
                      </span>
                      Exportar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#757684] text-sm">
                      search
                    </span>
                    <input
                      className="w-full pl-9 pr-3 py-2 bg-white border border-[#c4c5d5] rounded-xl text-sm outline-none focus:border-[#00288e]"
                      placeholder="Buscar por vecino..."
                      type="text"
                    />
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#757684] text-sm">
                      calendar_today
                    </span>
                    <input
                      className="w-full pl-9 pr-3 py-2 bg-white border border-[#c4c5d5] rounded-xl text-sm outline-none focus:border-[#00288e]"
                      type="date"
                    />
                  </div>
                  <select className="w-full px-3 py-2 bg-white border border-[#c4c5d5] rounded-xl text-sm outline-none cursor-pointer">
                    <option>Todos los conceptos</option>
                    <option>Cuotas</option>
                    <option>Multas</option>
                  </select>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#f2f4f6] border-b border-[#c4c5d5]">
                    <tr>
                      <th className="px-6 py-3 text-xs font-bold text-[#444653] uppercase tracking-wider">
                        Vecino
                      </th>
                      <th className="px-6 py-3 text-xs font-bold text-[#444653] uppercase tracking-wider">
                        Concepto
                      </th>
                      <th className="px-6 py-3 text-xs font-bold text-[#444653] uppercase tracking-wider text-right">
                        Monto
                      </th>
                      <th className="px-6 py-3 text-xs font-bold text-[#444653] uppercase tracking-wider text-center">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-xs font-bold text-[#444653] uppercase tracking-wider">
                        Fecha
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c4c5d5]">
                    <tr className="hover:bg-[#f2f4f6]/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-sm text-[#191c1e]">
                          Roberto Claros
                        </p>
                        <p className="text-xs text-[#444653]">Casa 23</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#444653]">
                        Cuota Mensual
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-sm text-[#191c1e]">
                        150 BOB
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-[#DCFCE7] text-[#166534] text-xs font-bold rounded-full">
                          Al día
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#444653]">
                        24/10/2023
                      </td>
                    </tr>
                    <tr className="hover:bg-[#f2f4f6]/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-sm text-[#191c1e]">
                          Alicia Torres
                        </p>
                        <p className="text-xs text-[#444653]">Casa 05</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#444653]">
                        Multa Limpieza
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-sm text-[#191c1e]">
                        50 BOB
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-[#FEE2E2] text-[#991B1B] text-xs font-bold rounded-full">
                          Moroso
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#444653]">
                        22/10/2023
                      </td>
                    </tr>
                    <tr className="hover:bg-[#f2f4f6]/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-sm text-[#191c1e]">
                          Luis Mendez
                        </p>
                        <p className="text-xs text-[#444653]">Casa 11</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#444653]">
                        Aporte Extraord.
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-sm text-[#191c1e]">
                        300 BOB
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full">
                          Pendiente
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#444653]">
                        20/10/2023
                      </td>
                    </tr>
                    <tr className="hover:bg-[#f2f4f6]/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-sm text-[#191c1e]">
                          Sandra Vargas
                        </p>
                        <p className="text-xs text-[#444653]">Casa 33</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#444653]">
                        Cuota Mensual
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-sm text-[#191c1e]">
                        150 BOB
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-[#DCFCE7] text-[#166534] text-xs font-bold rounded-full">
                          Al día
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#444653]">
                        19/10/2023
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Footer */}
            <div className="px-6 py-3 border-t border-[#c4c5d5] bg-[#f2f4f6]/50 flex items-center justify-between">
              <span className="text-xs text-[#444653]">
                Mostrando 4 de 128 registros
              </span>
              <div className="flex gap-1">
                <button className="p-1.5 border border-[#c4c5d5] rounded-lg hover:bg-white transition-colors bg-white">
                  <span className="material-symbols-outlined text-sm">
                    chevron_left
                  </span>
                </button>
                <button className="border border-[#c4c5d5] rounded-lg bg-[#00288e] text-white text-xs px-3 font-bold">
                  1
                </button>
                <button className="border border-[#c4c5d5] rounded-lg hover:bg-white transition-colors text-xs px-3 bg-white text-[#444653]">
                  2
                </button>
                <button className="p-1.5 border border-[#c4c5d5] rounded-lg hover:bg-white transition-colors bg-white">
                  <span className="material-symbols-outlined text-sm">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </section>
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
          className="flex flex-col items-center justify-center bg-[#6cf8bb] text-[#002113] rounded-full px-4 py-1 transition-transform active:scale-90"
          href="#"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            receipt_long
          </span>
          <span className="text-[10px] font-bold">Pagos</span>
        </a>
        <a
          className="flex flex-col items-center justify-center text-[#444653] transition-transform active:scale-90"
          href="#"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px]">Ajustes</span>
        </a>
      </nav>
    </div>
  );
}
