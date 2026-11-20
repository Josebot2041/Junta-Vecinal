"use client";

import React from "react";

export default function DashboardPage() {
  return (
    <main className="max-w-[1280px] mx-auto p-4 md:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Resumen General</h1>
          <p className="text-base text-slate-500 mt-1">
            Estado actual de la OTB al 24 de mayo, 2024
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 border border-blue-800 text-blue-800 font-bold rounded-lg hover:bg-blue-50 transition-colors text-sm">
            Descargar Reporte
          </button>
          <button className="px-5 py-2.5 bg-blue-800 text-white font-bold rounded-lg shadow-sm hover:bg-blue-700 transition-all text-sm">
            Nueva Notificación
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Recaudado */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-blue-800 bg-blue-50 p-2 rounded-lg">
              payments
            </span>
            <span className="text-emerald-600 font-bold text-xs">
              +12% vs mes ant.
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Monto Recaudado</p>
            <p className="text-2xl font-bold text-blue-800">15,420 BOB</p>
          </div>
        </div>

        {/* Asistencia */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-blue-800 bg-blue-50 p-2 rounded-lg">
              how_to_reg
            </span>
            <div className="w-16 h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-emerald-500 w-4/5"></div>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">% Asistencia Promedio</p>
            <p className="text-2xl font-bold text-slate-900">82%</p>
          </div>
        </div>

        {/* Total Vecinos */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-blue-800 bg-blue-50 p-2 rounded-lg">
              group
            </span>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-full">
              3 Nuevos
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Vecinos</p>
            <p className="text-2xl font-bold text-slate-900">148 Activos</p>
          </div>
        </div>

        {/* Eventos */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-blue-800 bg-blue-50 p-2 rounded-lg">
              event
            </span>
            <span className="text-red-600 font-bold text-xs">Urgente</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Eventos próximos</p>
            <p className="text-2xl font-bold text-slate-900">2 Pendientes</p>
          </div>
        </div>
      </div>

      {/* Main Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Central: Activity & Schedule */}
        <div className="lg:col-span-2 space-y-8">
          {/* Cronograma Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900">Cronograma de Asambleas</h2>
              <button className="text-blue-800 font-bold text-sm flex items-center gap-1 hover:underline">
                Ver todo{" "}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
            <div className="divide-y divide-slate-200">
              <div className="p-5 flex gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-800 text-white rounded-lg flex flex-col items-center justify-center font-bold">
                  <span className="text-[10px] leading-none mb-1">MAY</span>
                  <span className="text-lg leading-none">28</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-900">
                    Asamblea Extraordinaria: Proyecto Alcantarillado
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>{" "}
                    19:00 - Sede Social
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="px-3 py-1 bg-red-100 text-red-800 font-semibold text-xs rounded-full">
                    Obligatorio
                  </span>
                </div>
              </div>
              <div className="p-5 flex gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex-shrink-0 w-12 h-12 bg-slate-100 text-slate-600 rounded-lg flex flex-col items-center justify-center font-bold">
                  <span className="text-[10px] leading-none mb-1">JUN</span>
                  <span className="text-lg leading-none">05</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-900">
                    Reunión de Comité de Seguridad
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>{" "}
                    20:30 - Virtual (Zoom)
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-full">
                    Opcional
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900">Actividades Recientes</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex gap-4">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center z-10 relative">
                    <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                  </div>
                  <div className="absolute top-10 bottom-0 left-1/2 w-0.5 bg-slate-200 -translate-x-1/2 h-10"></div>
                </div>
                <div className="pb-2">
                  <p className="text-sm font-bold text-slate-900">Registro de Pago Completo</p>
                  <p className="text-sm text-slate-600 mt-0.5">Familia Quispe (Lote 45) pagó mantenimiento Mayo.</p>
                  <p className="text-xs font-semibold text-blue-700 mt-1">Hace 2 horas</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center z-10 relative">
                    <span className="material-symbols-outlined text-blue-700">engineering</span>
                  </div>
                  <div className="absolute top-10 bottom-0 left-1/2 w-0.5 bg-slate-200 -translate-x-1/2 h-10"></div>
                </div>
                <div className="pb-2">
                  <p className="text-sm font-bold text-slate-900">Inicio de Obra: Parque Infantil</p>
                  <p className="text-sm text-slate-600 mt-0.5">Se aprobó el presupuesto y comenzó la nivelación del terreno.</p>
                  <p className="text-xs font-semibold text-blue-700 mt-1">Hace 5 horas</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div>
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-orange-600">campaign</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Aviso de Corte de Agua</p>
                  <p className="text-sm text-slate-600 mt-0.5">SEMAPA informa mantenimiento este jueves de 8:00 a 12:00.</p>
                  <p className="text-xs font-semibold text-blue-700 mt-1">Ayer, 18:45</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Visual Highlights & Quick Stats */}
        <div className="space-y-8">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden group">
            <div className="h-48 overflow-hidden relative">
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt="Remodelación Parque"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXYWLl_oweffrDdLCWPnPaXn1-9CVB4FJao1YXNTZeH388zk-Idn5jOh5OIxqFDcojUv-XKzlYS5xY0G1nHOcvzNFNncTSs-odNEZf-K3FQ30igGk6QnZdd9HqQJn0XVrmGK6SvkFHUnwXCvzRZezIB_1GP5CPf5ne55xPBk-h5BU1c9G-Xt4bfw-5q9nWXIvIWiQ_d8qUD4nxctLtzma0JfFAqqCCarCKAiTv3gl4ZSpgitdU77KXmcQaZ2pnCvS-m_lxfHSTm4s"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="bg-blue-800 text-white text-[10px] uppercase font-bold px-2 py-1 rounded mb-2 inline-block">
                  Proyecto Destacado
                </span>
                <h3 className="text-white text-lg font-bold leading-tight">
                  Remodelación Parque Central
                </h3>
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-slate-700">Avance Financiero</span>
                <span className="font-bold text-blue-800 text-sm">65%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-5">
                <div className="h-full bg-blue-800 rounded-full" style={{ width: "65%" }}></div>
              </div>
              <button className="w-full py-2.5 border border-slate-300 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50 transition-colors">
                Ver Detalles
              </button>
            </div>
          </div>

          {/* Community Balance Card */}
          <div className="bg-blue-800 text-white rounded-xl p-6 shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-1">Balance de Tesorería</h3>
              <p className="text-blue-200 text-xs font-medium mb-6">Fondos disponibles para gestión</p>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-100">Caja Chica:</span>
                  <span className="font-bold">2,450 BOB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-100">Banco Unión:</span>
                  <span className="font-bold">45,800 BOB</span>
                </div>
                <div className="border-t border-blue-700/50 pt-4 mt-2 flex justify-between text-lg">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold">48,250 BOB</span>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 opacity-10 -translate-y-1/4 translate-x-1/4 pointer-events-none">
              <span className="material-symbols-outlined text-[160px]">account_balance_wallet</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
