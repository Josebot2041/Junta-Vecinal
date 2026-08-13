"use client";

import React, { useState, useEffect } from "react";

export default function DashboardVecinosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isModalOpen]);

  // Cerrar modal con la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans antialiased">
      {/* Google Material Symbols Link Injection for safety */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      {/* TopNavBar */}
      <header className="bg-white w-full sticky top-0 z-50 border-b border-slate-200 shadow-sm">
        <div className="flex justify-between items-center px-6 py-3 max-w-[1280px] mx-auto">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-[#00288e]">
              Comunidad Gestión
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="#"
              className="text-slate-600 font-medium hover:bg-slate-100 transition-colors px-3 py-1.5 rounded-lg"
            >
              Inicio
            </a>
            <a
              href="#"
              className="text-[#00288e] font-bold border-b-2 border-[#00288e] px-3 py-1.5"
            >
              Vecinos
            </a>
            <a
              href="#"
              className="text-slate-600 font-medium hover:bg-slate-100 transition-colors px-3 py-1.5 rounded-lg"
            >
              Pagos
            </a>
            <a
              href="#"
              className="text-slate-600 font-medium hover:bg-slate-100 transition-colors px-3 py-1.5 rounded-lg"
            >
              Reportes
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-slate-100 transition-colors material-symbols-outlined text-slate-600">
              notifications
            </button>
            <button className="p-2 rounded-full hover:bg-slate-100 transition-colors material-symbols-outlined text-slate-600">
              account_circle
            </button>
          </div>
        </div>
      </header>

      {/* SideNavBar */}
      <aside className="h-screen w-64 fixed left-0 top-0 hidden lg:flex flex-col bg-white border-r border-slate-200 p-4 space-y-2 z-40">
        <div className="mb-8 px-2 pt-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1e40af] flex items-center justify-center text-white">
              <span className="material-symbols-outlined">apartment</span>
            </div>
            <div>
              <h2 className="font-semibold text-sm text-[#00288e]">
                Gestión OTB
              </h2>
              <p className="text-xs text-slate-500">Cochabamba, Bolivia</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-3 text-slate-600 hover:bg-slate-100 rounded-lg transition-all group"
          >
            <span className="material-symbols-outlined group-hover:text-[#00288e]">
              dashboard
            </span>
            <span className="font-medium text-sm">Inicio</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-3 bg-[#1e40af] text-white font-bold rounded-lg"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              group
            </span>
            <span className="font-medium text-sm">Vecinos</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-3 text-slate-600 hover:bg-slate-100 rounded-lg transition-all group"
          >
            <span className="material-symbols-outlined group-hover:text-[#00288e]">
              payments
            </span>
            <span className="font-medium text-sm">Pagos</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-3 text-slate-600 hover:bg-slate-100 rounded-lg transition-all group"
          >
            <span className="material-symbols-outlined group-hover:text-[#00288e]">
              construction
            </span>
            <span className="font-medium text-sm">Proyectos</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-3 text-slate-600 hover:bg-slate-100 rounded-lg transition-all group"
          >
            <span className="material-symbols-outlined group-hover:text-[#00288e]">
              assessment
            </span>
            <span className="font-medium text-sm">Reportes</span>
          </a>
        </nav>
        <button
          onClick={toggleModal}
          className="mt-auto w-full bg-[#00288e] text-white py-3 rounded-lg font-medium hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined">add</span>
          Registrar Pago
        </button>
      </aside>

      {/* Main Content Canvas */}
      <main className="lg:ml-64 min-h-screen pb-24 md:pb-8">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Directorio de Vecinos
              </h1>
              <p className="text-slate-600 mt-1">
                Administra la información de los residentes y sus estados de
                cuenta.
              </p>
            </div>
            <button
              onClick={toggleModal}
              className="bg-[#00288e] text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">person_add</span>
              Registrar Nuevo Vecino
            </button>
          </div>

          {/* Dashboard Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-[#dde1ff] text-[#00288e] flex items-center justify-center">
                <span className="material-symbols-outlined">groups</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">
                  Total Vecinos
                </p>
                <p className="text-xl font-bold text-slate-900">142</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-[#6cf8bb] text-[#002113] flex items-center justify-center">
                <span className="material-symbols-outlined">check_circle</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Al día</p>
                <p className="text-xl font-bold text-slate-900">118</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-[#ffdad6] text-[#93000a] flex items-center justify-center">
                <span className="material-symbols-outlined">warning</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">En Mora</p>
                <p className="text-xl font-bold text-slate-900">24</p>
              </div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="bg-white p-4 rounded-t-xl border-x border-t border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                search
              </span>
              <input
                type="text"
                placeholder="Buscar por nombre o CI..."
                className="w-full pl-12 pr-4 py-2 rounded-lg border border-slate-300 focus:border-[#00288e] focus:ring-1 focus:ring-[#00288e] outline-none transition-all text-sm"
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <select className="flex-1 md:flex-none py-2 px-4 rounded-lg border border-slate-300 text-sm bg-white outline-none">
                <option>Todas las Manzanas</option>
                <option>Manzano 1</option>
                <option>Manzano 2</option>
                <option>Manzano 3</option>
              </select>
              <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 hover:bg-slate-200 transition-colors">
                <span className="material-symbols-outlined text-sm">
                  filter_list
                </span>
                Filtros
              </button>
            </div>
          </div>

          {/* Interactive Table Container */}
          <div className="bg-white border border-slate-200 rounded-b-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Nombre Completo
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      CI / Documento
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Ubicación
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Estado de Cuenta
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Saldo
                    </th>
                    <th className="px-6 py-3 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {/* Row 1 */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#dde1ff] text-[#00288e] font-bold flex items-center justify-center text-xs">
                          AM
                        </div>
                        <div className="font-semibold text-slate-900">
                          Alejandro Morales
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">5928341 LP.</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        Manzano 4
                      </div>
                      <div className="text-xs text-slate-500">Lote 12</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-[#DCFCE7] text-[#166534] px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          check_circle
                        </span>
                        Al día
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#00288e]">
                      Bs. 0.00
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="material-symbols-outlined text-slate-400 hover:text-slate-700 transition-colors">
                        more_vert
                      </button>
                    </td>
                  </tr>
                  {/* Row 2 */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#6ffbbe] text-[#002113] font-bold flex items-center justify-center text-xs">
                          RC
                        </div>
                        <div className="font-semibold text-slate-900">
                          Rosa Cárdenas
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">4201988 CB.</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        Manzano 2
                      </div>
                      <div className="text-xs text-slate-500">
                        Calle Aroma #45
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-[#FEE2E2] text-[#991B1B] px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          error
                        </span>
                        Moroso
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#ba1a1a]">
                      Bs. 350.00
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="material-symbols-outlined text-slate-400 hover:text-slate-700 transition-colors">
                        more_vert
                      </button>
                    </td>
                  </tr>
                  {/* Row 3 */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#ffdad7] text-[#410004] font-bold flex items-center justify-center text-xs">
                          JP
                        </div>
                        <div className="font-semibold text-slate-900">
                          Juan Perez Garcia
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">7710322 LP.</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        Manzano 7
                      </div>
                      <div className="text-xs text-slate-500">
                        Pje. Olivos #3
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-[#FEF3C7] text-[#92400E] px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          schedule
                        </span>
                        Pendiente
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      Bs. 50.00
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="material-symbols-outlined text-slate-400 hover:text-slate-700 transition-colors">
                        more_vert
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-slate-50 px-6 py-3 flex items-center justify-between border-t border-slate-200">
              <p className="text-xs text-slate-500">
                Mostrando 4 de 142 vecinos
              </p>
              <div className="flex gap-1">
                <button
                  className="p-1 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-50"
                  disabled
                >
                  <span className="material-symbols-outlined text-sm">
                    chevron_left
                  </span>
                </button>
                <button className="px-3 py-1 rounded-lg border border-[#00288e] bg-[#00288e] text-white text-xs font-semibold">
                  1
                </button>
                <button className="px-3 py-1 rounded-lg border border-slate-300 hover:bg-slate-100 text-xs font-semibold">
                  2
                </button>
                <button className="px-3 py-1 rounded-lg border border-slate-300 hover:bg-slate-100 text-xs font-semibold">
                  3
                </button>
                <button className="p-1 rounded-lg border border-slate-300 hover:bg-slate-100">
                  <span className="material-symbols-outlined text-sm">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* BottomNavBar (Mobile) */}
      <nav className="fixed bottom-0 w-full lg:hidden z-50 bg-white border-t border-slate-200 shadow-lg flex justify-around items-center h-16 px-2">
        <a
          href="#"
          className="flex flex-col items-center justify-center text-slate-500"
        >
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px]">Inicio</span>
        </a>
        <a
          href="#"
          className="flex flex-col items-center justify-center bg-[#6cf8bb] text-[#002113] rounded-full px-4 py-1"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            person
          </span>
          <span className="text-[10px] font-bold">Vecinos</span>
        </a>
        <a
          href="#"
          className="flex flex-col items-center justify-center text-slate-500"
        >
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="text-[10px]">Pagos</span>
        </a>
        <a
          href="#"
          className="flex flex-col items-center justify-center text-slate-500"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="text-[10px]">Ajustes</span>
        </a>
      </nav>

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto" role="dialog">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={toggleModal}
            ></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-slate-200 relative z-10">
              <div className="px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#1e40af] flex items-center justify-center text-white">
                      <span className="material-symbols-outlined">
                        person_add
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        Registrar Nuevo Vecino
                      </h3>
                      <p className="text-sm text-slate-500">
                        Complete los datos para añadir un nuevo residente al
                        sistema.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleModal}
                    className="text-slate-400 hover:bg-slate-100 p-2 rounded-full"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    toggleModal();
                  }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Info */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-[#00288e] uppercase tracking-wider border-b border-slate-200 pb-1">
                        Datos Personales
                      </h4>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Nombre Completo
                        </label>
                        <input
                          type="text"
                          placeholder="Ej. Juan Pérez"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-[#00288e] focus:ring-1 focus:ring-[#00288e] outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Cédula de Identidad (CI)
                        </label>
                        <input
                          type="text"
                          placeholder="Ej. 7894561 LP."
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-[#00288e] focus:ring-1 focus:ring-[#00288e] outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Teléfono / Celular
                        </label>
                        <input
                          type="tel"
                          placeholder="Ej. 70123456"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-[#00288e] focus:ring-1 focus:ring-[#00288e] outline-none"
                        />
                      </div>
                    </div>

                    {/* Property Info */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-[#00288e] uppercase tracking-wider border-b border-slate-200 pb-1">
                        Ubicación de Vivienda
                      </h4>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Manzano
                        </label>
                        <select className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-[#00288e] outline-none bg-white">
                          <option>Seleccione un manzano</option>
                          <option>Manzano 1</option>
                          <option>Manzano 2</option>
                          <option>Manzano 3</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          N° de Lote / Puerta
                        </label>
                        <input
                          type="text"
                          placeholder="Ej. Lote 14"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-[#00288e] focus:ring-1 focus:ring-[#00288e] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Dirección Específica
                        </label>
                        <input
                          type="text"
                          placeholder="Ej. Av. Panamericana esq. Calle A"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-[#00288e] focus:ring-1 focus:ring-[#00288e] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#00288e] text-lg">
                      info
                    </span>
                    <p className="text-xs text-slate-600">
                      El vecino será registrado inicialmente con saldo cero.
                      Podrá configurar deudas anteriores desde el panel de
                      edición individual.
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={toggleModal}
                      className="px-5 py-2 rounded-lg text-sm font-medium text-[#00288e] border border-[#00288e] hover:bg-slate-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-[#00288e] shadow-md hover:brightness-110 active:scale-95 transition-all"
                    >
                      Guardar Vecino
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
