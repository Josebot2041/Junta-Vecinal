"use client";

import React, { useState } from "react";

export default function ControlAsistenciaPage() {
  const [isFinesModalOpen, setIsFinesModalOpen] = useState(false);

  const toggleFinesModal = () => {
    setIsFinesModalOpen(!isFinesModalOpen);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans antialiased lg:pl-64 pb-20 lg:pb-0">
      {/* Google Material Symbols Link Injection */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      {/* SideNavBar (Desktop Only) */}
      <aside className="h-screen w-64 fixed left-0 top-0 hidden lg:flex flex-col bg-white border-r border-slate-200 p-4 space-y-2 z-40">
        <div className="flex items-center gap-3 px-2 py-4 mb-2">
          <div className="w-10 h-10 rounded-lg bg-[#1e40af] flex items-center justify-center text-white">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              account_balance
            </span>
          </div>
          <div>
            <h2 className="font-bold text-sm text-[#00288e]">Gestión OTB</h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">
              Cochabamba, Bolivia
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <a
            className="flex items-center gap-3 px-3 py-3 text-slate-600 hover:bg-slate-100 rounded-lg transition-all group"
            href="#"
          >
            <span className="material-symbols-outlined group-hover:text-[#00288e]">
              dashboard
            </span>
            <span className="font-medium text-sm">Inicio</span>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-3 text-slate-600 hover:bg-slate-100 rounded-lg transition-all group"
            href="#"
          >
            <span className="material-symbols-outlined group-hover:text-[#00288e]">
              group
            </span>
            <span className="font-medium text-sm">Vecinos</span>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-3 text-slate-600 hover:bg-slate-100 rounded-lg transition-all group"
            href="#"
          >
            <span className="material-symbols-outlined group-hover:text-[#00288e]">
              payments
            </span>
            <span className="font-medium text-sm">Pagos</span>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-3 bg-[#1e40af] text-white font-bold rounded-lg transition-all"
            href="#"
          >
            <span className="material-symbols-outlined">construction</span>
            <span className="font-medium text-sm">Proyectos</span>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-3 text-slate-600 hover:bg-slate-100 rounded-lg transition-all group"
            href="#"
          >
            <span className="material-symbols-outlined group-hover:text-[#00288e]">
              assessment
            </span>
            <span className="font-medium text-sm">Reportes</span>
          </a>
        </nav>

        <div className="pt-4 border-t border-slate-200">
          <button className="w-full bg-[#00288e] text-white text-sm font-medium py-3 px-4 rounded-lg shadow-sm hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">add</span>
            Registrar Pago
          </button>
        </div>
      </aside>

      {/* TopNavBar */}
      <header className="w-full sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm flex justify-between items-center px-6 py-3 max-w-[1280px] mx-auto">
        <div className="flex items-center gap-3">
          <span className="lg:hidden material-symbols-outlined text-[#00288e] cursor-pointer">
            menu
          </span>
          <h1 className="text-xl font-bold text-[#00288e]">
            Comunidad Gestión
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-[#f2f4f6] rounded-full px-4 py-1.5 border border-slate-200">
            <span className="material-symbols-outlined text-slate-500 text-sm mr-2">
              search
            </span>
            <input
              className="bg-transparent border-none focus:outline-none text-sm w-48 text-slate-800"
              placeholder="Buscar asamblea..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
              <span className="material-symbols-outlined text-slate-600">
                notifications
              </span>
            </button>
            <div className="w-8 h-8 rounded-full bg-[#dde1ff] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#00288e] text-lg">
                account_circle
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="max-w-[1280px] mx-auto p-4 lg:p-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[#00288e] text-xs font-bold uppercase tracking-wider">
              Control de Eventos
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mt-1">
              Asambleas y Asistencia
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Gestione las reuniones de la OTB y verifique la presencia de los
              vecinos en tiempo real.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleFinesModal}
              className="flex items-center gap-2 bg-[#ba1a1a] text-white text-sm font-medium px-5 py-2.5 rounded-lg shadow-sm hover:brightness-110 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">gavel</span>
              Generar Multas Automáticas
            </button>
          </div>
        </div>

        {/* Layout Grid: Form and List */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left Column: Meeting Configuration */}
          <section className="xl:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <span
                  className="material-symbols-outlined text-[#00288e]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  event
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Programar Asamblea
                </h3>
              </div>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Tipo de Reunión
                  </label>
                  <select className="w-full border border-slate-200 rounded-lg p-3 bg-white focus:ring-2 focus:ring-[#00288e] outline-none text-sm">
                    <option>Asamblea General Ordinaria</option>
                    <option>Asamblea Extraordinaria</option>
                    <option>Reunión de Directorio</option>
                    <option>Mesa de Trabajo Proyectos</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Fecha
                    </label>
                    <input
                      className="w-full border border-slate-200 rounded-lg p-3 bg-white focus:ring-2 focus:ring-[#00288e] outline-none text-sm"
                      type="date"
                      defaultValue="2023-11-15"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Hora
                    </label>
                    <input
                      className="w-full border border-slate-200 rounded-lg p-3 bg-white focus:ring-2 focus:ring-[#00288e] outline-none text-sm"
                      type="time"
                      defaultValue="19:00"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Lugar
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      location_on
                    </span>
                    <input
                      className="w-full border border-slate-200 rounded-lg p-3 pl-10 bg-white focus:ring-2 focus:ring-[#00288e] outline-none text-sm"
                      placeholder="Sede Social OTB"
                      type="text"
                    />
                  </div>
                </div>
                <button
                  className="w-full bg-[#00288e] text-white text-sm font-medium py-3 rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  type="submit"
                >
                  <span className="material-symbols-outlined">save</span>
                  Guardar y Empezar
                </button>
              </form>
            </div>

            {/* Stats Card */}
            <div className="bg-[#1e40af] text-white rounded-xl p-6 flex flex-col gap-4 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider opacity-80">
                Quorum Actual
              </h4>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold leading-none">64%</span>
                <span className="text-xs mb-1 opacity-90">
                  32 de 50 vecinos
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <div className="bg-[#6ffbbe] h-full w-[64%]"></div>
              </div>
              <p className="text-xs opacity-90">
                Se requiere el 51% para validar la asamblea.
              </p>
            </div>
          </section>

          {/* Right Column: Attendance List */}
          <section className="xl:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Listado de Asistencia
                </h3>
                <p className="text-xs text-slate-500">
                  Marque el estado de cada vecino en tiempo real
                </p>
              </div>
              <div className="flex items-center bg-[#f2f4f6] rounded-lg px-3 py-2 border border-slate-200 w-full md:w-64">
                <span className="material-symbols-outlined text-slate-400 text-sm mr-2">
                  search
                </span>
                <input
                  className="bg-transparent border-none focus:outline-none text-sm w-full text-slate-800"
                  placeholder="Filtrar por nombre o casa..."
                  type="text"
                />
              </div>
            </div>

            {/* Attendance Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#f2f4f6] text-slate-600 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 font-semibold">
                      Vecino / Propiedad
                    </th>
                    <th className="px-4 py-3 font-semibold text-center">
                      Presente
                    </th>
                    <th className="px-4 py-3 font-semibold text-center">
                      Ausente
                    </th>
                    <th className="px-4 py-3 font-semibold text-center">
                      Licencia
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {/* Row 1 */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#00288e] font-bold text-xs">
                          CA
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            Carlos Arana
                          </p>
                          <p className="text-xs text-slate-500">
                            Lote 45 - Calle Los Álamos
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <input
                        defaultChecked
                        className="w-5 h-5 text-[#006c49] focus:ring-[#006c49] border-slate-300 rounded-full cursor-pointer"
                        name="att_1"
                        type="radio"
                      />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <input
                        className="w-5 h-5 text-[#ba1a1a] focus:ring-[#ba1a1a] border-slate-300 rounded-full cursor-pointer"
                        name="att_1"
                        type="radio"
                      />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <input
                        className="w-5 h-5 text-[#00288e] focus:ring-[#00288e] border-slate-300 rounded-full cursor-pointer"
                        name="att_1"
                        type="radio"
                      />
                    </td>
                  </tr>
                  {/* Row 2 */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#00288e] font-bold text-xs">
                          MV
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            Martha Villarroel
                          </p>
                          <p className="text-xs text-slate-500">
                            Casa 12 - Pasaje B
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <input
                        className="w-5 h-5 text-[#006c49] focus:ring-[#006c49] border-slate-300 rounded-full cursor-pointer"
                        name="att_2"
                        type="radio"
                      />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <input
                        defaultChecked
                        className="w-5 h-5 text-[#ba1a1a] focus:ring-[#ba1a1a] border-slate-300 rounded-full cursor-pointer"
                        name="att_2"
                        type="radio"
                      />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <input
                        className="w-5 h-5 text-[#00288e] focus:ring-[#00288e] border-slate-300 rounded-full cursor-pointer"
                        name="att_2"
                        type="radio"
                      />
                    </td>
                  </tr>
                  {/* Row 3 */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#00288e] font-bold text-xs">
                          JR
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            Jorge Rojas
                          </p>
                          <p className="text-xs text-slate-500">
                            Lote 08 - Av. Principal
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <input
                        className="w-5 h-5 text-[#006c49] focus:ring-[#006c49] border-slate-300 rounded-full cursor-pointer"
                        name="att_3"
                        type="radio"
                      />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <input
                        className="w-5 h-5 text-[#ba1a1a] focus:ring-[#ba1a1a] border-slate-300 rounded-full cursor-pointer"
                        name="att_3"
                        type="radio"
                      />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <input
                        defaultChecked
                        className="w-5 h-5 text-[#00288e] focus:ring-[#00288e] border-slate-300 rounded-full cursor-pointer"
                        name="att_3"
                        type="radio"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-[#f2f4f6] border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
              <span>Mostrando 3 de 50 registros</span>
              <div className="flex gap-1">
                <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-300 bg-white hover:bg-slate-100">
                  <span className="material-symbols-outlined text-sm">
                    chevron_left
                  </span>
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded border border-[#00288e] bg-[#00288e] text-white font-bold text-xs">
                  1
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-300 bg-white hover:bg-slate-100 text-xs">
                  2
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-300 bg-white hover:bg-slate-100 text-xs">
                  3
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-300 bg-white hover:bg-slate-100">
                  <span className="material-symbols-outlined text-sm">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#eceef0] border border-slate-200 p-6 rounded-xl flex items-start gap-4">
            <div className="bg-[#6cf8bb] p-2 rounded-lg text-[#002113]">
              <span className="material-symbols-outlined">shield</span>
            </div>
            <div>
              <h5 className="font-bold text-sm text-slate-900">
                Privacidad de Datos
              </h5>
              <p className="text-xs text-slate-600 mt-1">
                Toda la información recolectada cumple con las normas de
                transparencia comunitaria.
              </p>
            </div>
          </div>
          <div className="bg-[#eceef0] border border-slate-200 p-6 rounded-xl flex items-start gap-4">
            <div className="bg-[#ffdad7] p-2 rounded-lg text-[#410004]">
              <span className="material-symbols-outlined">
                notifications_active
              </span>
            </div>
            <div>
              <h5 className="font-bold text-sm text-slate-900">
                Alertas de Quorum
              </h5>
              <p className="text-xs text-slate-600 mt-1">
                Notificaciones automáticas al alcanzar el quorum legal para
                decisiones oficiales.
              </p>
            </div>
          </div>
          <div className="bg-[#eceef0] border border-slate-200 p-6 rounded-xl flex items-start gap-4">
            <div className="bg-[#dde1ff] p-2 rounded-lg text-[#00288e]">
              <span className="material-symbols-outlined">description</span>
            </div>
            <div>
              <h5 className="font-bold text-sm text-slate-900">
                Acta Automática
              </h5>
              <p className="text-xs text-slate-600 mt-1">
                La lista de asistencia se adjunta automáticamente al borrador
                del acta de reunión.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="fixed bottom-0 w-full lg:hidden z-50 bg-white border-t border-slate-200 shadow-lg flex justify-around items-center h-16 px-2">
        <a
          className="flex flex-col items-center justify-center text-slate-500"
          href="#"
        >
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px]">Inicio</span>
        </a>
        <a
          className="flex flex-col items-center justify-center text-slate-500"
          href="#"
        >
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px]">Vecinos</span>
        </a>
        <a
          className="flex flex-col items-center justify-center bg-[#6cf8bb] text-[#002113] rounded-full px-4 py-1"
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
          className="flex flex-col items-center justify-center text-slate-500"
          href="#"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px]">Ajustes</span>
        </a>
      </nav>

      {/* Modal for Fines */}
      {isFinesModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-[#ba1a1a] mb-4">
              <span className="material-symbols-outlined text-3xl">
                warning
              </span>
              <h3 className="text-xl font-bold">¿Generar Multas?</h3>
            </div>
            <p className="text-slate-600 text-sm mb-6">
              Esta acción aplicará una multa automática de{" "}
              <strong>Bs. 50</strong> a todos los vecinos marcados como
              "Ausente" sin licencia justificada. ¿Desea continuar?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={toggleFinesModal}
                className="w-full bg-[#ba1a1a] text-white text-sm font-medium py-3 rounded-lg shadow-sm hover:brightness-110 active:scale-95 transition-all"
              >
                Confirmar y Aplicar Multas
              </button>
              <button
                onClick={toggleFinesModal}
                className="w-full bg-slate-100 text-slate-700 text-sm font-medium py-3 rounded-lg hover:bg-slate-200 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
