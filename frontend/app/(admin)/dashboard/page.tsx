"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Vecino {
  id: number;
  nombre: string;
  manzano?: string;
  lote?: string;
  estado_cuenta?: string;
}

interface Pago {
  id: number;
  vecino_id: number;
  vecino_nombre?: string;
  manzano?: string;
  lote?: string;
  concepto: string;
  monto: number;
  estado: string;
  fecha: string;
}

interface Evento {
  id: number;
  tipo: string;
  nombre: string;
  fecha: string;
  hora: string;
  lugar: string;
}

export default function DashboardPage() {
  const [vecinos, setVecinos] = useState<Vecino[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [asambleas, setAsambleas] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resVecinos, resPagos, resAsambleas] = await Promise.all([
          fetch(`${API_URL}/vecinos`).catch(() => null),
          fetch(`${API_URL}/pagos`).catch(() => null),
          fetch(`${API_URL}/asambleas`).catch(() => null),
        ]);

        if (resVecinos && resVecinos.ok) {
          const dataVecinos = await resVecinos.json();
          setVecinos(dataVecinos);
        }
        if (resPagos && resPagos.ok) {
          const dataPagos = await resPagos.json();
          setPagos(dataPagos);
        }
        if (resAsambleas && resAsambleas.ok) {
          const dataAsambleas = await resAsambleas.json();
          setAsambleas(dataAsambleas);
        }
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  // Cálculos dinámicos
  const totalRecaudado = pagos
    .filter((p) => p.estado?.toLowerCase() === "pagado")
    .reduce((acc, curr) => acc + Number(curr.monto || 0), 0);

  const totalPendiente = pagos
    .filter((p) => p.estado?.toLowerCase() === "pendiente")
    .reduce((acc, curr) => acc + Number(curr.monto || 0), 0);

  const pagosPendientesCount = pagos.filter(
    (p) => p.estado?.toLowerCase() === "pendiente",
  ).length;

  const totalFacturado = totalRecaudado + totalPendiente;
  const tasaCumplimiento =
    totalFacturado > 0 ? Math.round((totalRecaudado / totalFacturado) * 100) : 0;

  const fechaHoy = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="max-w-[1280px] mx-auto p-4 md:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[#00288e] font-semibold text-xs uppercase tracking-wider">
            Panel de Control OTB
          </span>
          <h1 className="text-3xl font-bold text-slate-900 mt-1">
            Resumen General
          </h1>
          <p className="text-base text-slate-500 capitalize">
            {fechaHoy}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/reportes"
            className="px-4 py-2.5 border border-blue-800 text-blue-800 font-bold rounded-lg hover:bg-blue-50 transition-colors text-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">assessment</span>
            Ver Reportes
          </Link>
          <Link
            href="/pagos"
            className="px-4 py-2.5 bg-blue-800 text-white font-bold rounded-lg shadow-sm hover:bg-blue-700 transition-all text-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Registrar Cobro
          </Link>
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
            <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded-full">
              {tasaCumplimiento}% cobrado
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Monto Recaudado</p>
            <p className="text-2xl font-bold text-blue-800">
              {loading ? "..." : `${totalRecaudado.toFixed(2)} BOB`}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {pagos.filter((p) => p.estado?.toLowerCase() === "pagado").length}{" "}
              cobros confirmados
            </p>
          </div>
        </div>

        {/* Vecinos */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-blue-800 bg-blue-50 p-2 rounded-lg">
              group
            </span>
            <Link
              href="/vecinos"
              className="text-blue-800 font-semibold text-xs hover:underline flex items-center"
            >
              Gestionar <span className="material-symbols-outlined text-xs">chevron_right</span>
            </Link>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Padrón de Vecinos</p>
            <p className="text-2xl font-bold text-slate-900">
              {loading ? "..." : `${vecinos.length} Registrados`}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Vecinos con lote asignado
            </p>
          </div>
        </div>

        {/* Asambleas */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-blue-800 bg-blue-50 p-2 rounded-lg">
              event
            </span>
            <Link
              href="/asambleas"
              className="text-blue-800 font-semibold text-xs hover:underline flex items-center"
            >
              Ver todas <span className="material-symbols-outlined text-xs">chevron_right</span>
            </Link>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Asambleas y Reuniones</p>
            <p className="text-2xl font-bold text-slate-900">
              {loading ? "..." : `${asambleas.length} Totales`}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Con control de asistencia
            </p>
          </div>
        </div>

        {/* Pagos Pendientes / Mora */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-amber-700 bg-amber-50 p-2 rounded-lg">
              pending_actions
            </span>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-semibold text-xs rounded-full">
              {pagosPendientesCount} pendiente{pagosPendientesCount !== 1 ? "s" : ""}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Por Cobrar / Multas</p>
            <p className="text-2xl font-bold text-amber-700">
              {loading ? "..." : `${totalPendiente.toFixed(2)} BOB`}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Cuotas y multas pendientes
            </p>
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
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-800">event_note</span>
                <h2 className="text-lg font-bold text-slate-900">Cronograma de Asambleas</h2>
              </div>
              <Link
                href="/asambleas"
                className="text-blue-800 font-bold text-sm flex items-center gap-1 hover:underline"
              >
                Programar nueva{" "}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
            <div className="divide-y divide-slate-200">
              {loading ? (
                <div className="p-6 text-center text-slate-400">Cargando eventos...</div>
              ) : asambleas.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">event_busy</span>
                  <p>No hay asambleas registradas todavía.</p>
                  <Link
                    href="/asambleas"
                    className="inline-block mt-3 text-sm text-blue-800 font-semibold underline"
                  >
                    Crear la primera asamblea
                  </Link>
                </div>
              ) : (
                asambleas.slice(0, 3).map((ev) => {
                  const fechaObj = new Date(ev.fecha + "T12:00:00");
                  const dia = isNaN(fechaObj.getDate()) ? "01" : fechaObj.getDate();
                  const mes = isNaN(fechaObj.getMonth())
                    ? "EVT"
                    : fechaObj.toLocaleString("es-ES", { month: "short" }).toUpperCase();

                  return (
                    <div key={ev.id} className="p-5 flex gap-4 hover:bg-slate-50 transition-colors items-center">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-800 text-white rounded-lg flex flex-col items-center justify-center font-bold">
                        <span className="text-[10px] leading-none mb-1">{mes}</span>
                        <span className="text-lg leading-none">{dia}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-slate-900">
                          {ev.nombre || ev.tipo}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px]">schedule</span>{" "}
                            {ev.hora || "19:00"}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px]">location_on</span>{" "}
                            {ev.lugar || "Sede Social OTB"}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-blue-50 text-blue-800 font-semibold text-xs rounded-full">
                          {ev.tipo}
                        </span>
                        <Link
                          href="/asistencias"
                          className="p-1.5 text-slate-400 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Tomar Asistencia"
                        >
                          <span className="material-symbols-outlined text-lg">how_to_reg</span>
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-800">history</span>
                <h2 className="text-lg font-bold text-slate-900">Últimos Pagos Registrados</h2>
              </div>
              <Link
                href="/pagos"
                className="text-blue-800 font-bold text-sm flex items-center gap-1 hover:underline"
              >
                Ver todos{" "}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
            <div className="p-5">
              {loading ? (
                <div className="p-4 text-center text-slate-400">Cargando pagos...</div>
              ) : pagos.length === 0 ? (
                <div className="p-6 text-center text-slate-500">
                  No se han registrado cobros aún.
                </div>
              ) : (
                <div className="space-y-4">
                  {pagos.slice(0, 5).map((pago) => {
                    const isPagado = pago.estado?.toLowerCase() === "pagado";
                    return (
                      <div
                        key={pago.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                              isPagado
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            <span className="material-symbols-outlined text-base">
                              {isPagado ? "check" : "schedule"}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {pago.vecino_nombre || `Vecino #${pago.vecino_id}`}
                            </p>
                            <p className="text-xs text-slate-500">
                              {pago.concepto} • {new Date(pago.fecha).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-900">
                            {Number(pago.monto).toFixed(2)} BOB
                          </p>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isPagado
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {pago.estado}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick Actions & Balance */}
        <div className="space-y-8">
          {/* Community Balance Card */}
          <div className="bg-[#00288e] text-white rounded-xl p-6 shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-1">Caja y Tesorería</h3>
              <p className="text-blue-200 text-xs font-medium mb-6">
                Balance en tiempo real conectado a PostgreSQL
              </p>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-100">Total Recaudado:</span>
                  <span className="font-bold">{totalRecaudado.toFixed(2)} BOB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-100">Por Cobrar (Pendientes):</span>
                  <span className="font-bold text-amber-300">
                    {totalPendiente.toFixed(2)} BOB
                  </span>
                </div>
                <div className="border-t border-blue-700/60 pt-4 mt-2 flex justify-between text-lg">
                  <span className="font-medium">Total Facturado:</span>
                  <span className="font-bold">{totalFacturado.toFixed(2)} BOB</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-6">
                <div className="flex justify-between text-xs text-blue-200 mb-1">
                  <span>Cumplimiento de Cobro</span>
                  <span className="font-bold">{tasaCumplimiento}%</span>
                </div>
                <div className="w-full bg-blue-900 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#6cf8bb] h-full transition-all duration-500"
                    style={{ width: `${tasaCumplimiento}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 opacity-10 -translate-y-1/4 translate-x-1/4 pointer-events-none">
              <span className="material-symbols-outlined text-[160px]">
                account_balance_wallet
              </span>
            </div>
          </div>

          {/* Quick Access Nav Cards */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Accesos Rápidos
            </h3>
            <Link
              href="/vecinos"
              className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-blue-800 p-2 bg-blue-50 rounded-lg group-hover:bg-blue-800 group-hover:text-white transition-colors">
                  group
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-800">Padrón de Vecinos</p>
                  <p className="text-xs text-slate-500">Registrar y listar residentes</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-800 group-hover:translate-x-0.5 transition-all">
                arrow_forward
              </span>
            </Link>

            <Link
              href="/asambleas"
              className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-blue-800 p-2 bg-blue-50 rounded-lg group-hover:bg-blue-800 group-hover:text-white transition-colors">
                  event
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-800">Programar Asamblea</p>
                  <p className="text-xs text-slate-500">Crear reuniones y eventos</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-800 group-hover:translate-x-0.5 transition-all">
                arrow_forward
              </span>
            </Link>

            <Link
              href="/asistencias"
              className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-blue-800 p-2 bg-blue-50 rounded-lg group-hover:bg-blue-800 group-hover:text-white transition-colors">
                  how_to_reg
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-800">Control de Asistencia</p>
                  <p className="text-xs text-slate-500">Verificar quorum y multas</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-800 group-hover:translate-x-0.5 transition-all">
                arrow_forward
              </span>
            </Link>

            <Link
              href="/comunicados"
              className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-blue-800 p-2 bg-blue-50 rounded-lg group-hover:bg-blue-800 group-hover:text-white transition-colors">
                  campaign
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-800">Comunicados y Carteles</p>
                  <p className="text-xs text-slate-500">Publicar citaciones y avisos OTB</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-800 group-hover:translate-x-0.5 transition-all">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
