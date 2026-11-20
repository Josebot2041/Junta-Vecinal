"use client";

import React, { useState, useEffect } from "react";

interface Vecino {
  id: number;
  nombre: string;
  manzano?: string;
  lote?: string;
  estado_cuenta?: string;
  saldo?: string;
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

export default function ReportesPage() {
  const [vecinos, setVecinos] = useState<Vecino[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [asambleas, setAsambleas] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de filtrado y exportación
  const [reportFormat, setReportFormat] = useState<"PDF" | "Excel">("Excel");
  const [filterStatus, setFilterStatus] = useState<"todos" | "pagados" | "pendientes">("todos");
  const [isExporting, setIsExporting] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        const [resVecinos, resPagos, resAsambleas] = await Promise.all([
          fetch(`${API_URL}/vecinos`).catch(() => null),
          fetch(`${API_URL}/pagos`).catch(() => null),
          fetch(`${API_URL}/asambleas`).catch(() => null),
        ]);

        if (resVecinos && resVecinos.ok) {
          setVecinos(await resVecinos.json());
        }
        if (resPagos && resPagos.ok) {
          setPagos(await resPagos.json());
        }
        if (resAsambleas && resAsambleas.ok) {
          setAsambleas(await resAsambleas.json());
        }
      } catch (error) {
        console.error("Error al cargar reportes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [API_URL]);

  // Cálculos estadísticos
  const pagosPagados = pagos.filter((p) => p.estado?.toLowerCase() === "pagado");
  const pagosPendientes = pagos.filter((p) => p.estado?.toLowerCase() === "pendiente");

  const totalRecaudado = pagosPagados.reduce((acc, curr) => acc + Number(curr.monto || 0), 0);
  const totalPendiente = pagosPendientes.reduce((acc, curr) => acc + Number(curr.monto || 0), 0);
  const totalFacturado = totalRecaudado + totalPendiente;

  const tasaCumplimiento =
    totalFacturado > 0 ? Math.round((totalRecaudado / totalFacturado) * 100) : 0;
  const tasaMorosidad =
    totalFacturado > 0 ? Math.round((totalPendiente / totalFacturado) * 100) : 0;

  // Desglose por concepto
  const conceptosMap: { [key: string]: { total: number; count: number } } = {};
  pagos.forEach((p) => {
    const c = p.concepto || "Otro";
    if (!conceptosMap[c]) conceptosMap[c] = { total: 0, count: 0 };
    conceptosMap[c].total += Number(p.monto || 0);
    conceptosMap[c].count += 1;
  });

  // Filtrado de la tabla de pagos
  const pagosFiltrados = pagos.filter((p) => {
    if (filterStatus === "pagados") return p.estado?.toLowerCase() === "pagado";
    if (filterStatus === "pendientes") return p.estado?.toLowerCase() === "pendiente";
    return true;
  });

  // Exportar Funcional Real
  const handleExport = () => {
    setIsExporting(true);

    if (reportFormat === "PDF") {
      // Abre el diálogo de impresión nativo del navegador con estilos
      window.print();
      setIsExporting(false);
    } else {
      // Generar archivo CSV compatible con Excel (con BOM UTF-8)
      try {
        const headers = ["ID", "Fecha", "Vecino", "Manzano", "Lote", "Concepto", "Monto (BOB)", "Estado"];
        const rows = pagos.map((p) => [
          p.id,
          new Date(p.fecha).toLocaleDateString(),
          `"${(p.vecino_nombre || "").replace(/"/g, '""')}"`,
          `"${p.manzano || ""}"`,
          `"${p.lote || ""}"`,
          `"${(p.concepto || "").replace(/"/g, '""')}"`,
          Number(p.monto).toFixed(2),
          p.estado,
        ]);

        const csvContent =
          "\uFEFF" + // UTF-8 BOM
          [headers.join(";"), ...rows.map((e) => e.join(";"))].join("\r\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          `Reporte_Financiero_OTB_${new Date().toISOString().split("T")[0]}.csv`,
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error("Error al exportar:", err);
      } finally {
        setIsExporting(false);
      }
    }
  };

  return (
    <main className="flex-1 p-4 lg:p-8 max-w-[1280px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[#00288e] font-semibold text-xs uppercase tracking-wider">
            Auditoría y Estadísticas
          </span>
          <h1 className="text-3xl font-bold text-[#191c1e] mt-1">
            Panel de Reportes
          </h1>
          <p className="text-[#444653] text-base">
            Información financiera y operativa consolidada de la Junta Vecinal.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Recaudado */}
        <div className="bg-white p-5 rounded-xl border border-[#c4c5d5] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <span className="material-symbols-outlined text-[#00288e] p-2 bg-[#dde1ff] rounded-lg">
              payments
            </span>
            <span className="text-[#006c49] text-xs font-bold bg-[#6cf8bb]/30 px-2.5 py-0.5 rounded-full">
              {tasaCumplimiento}% Recaudado
            </span>
          </div>
          <div className="text-xs font-medium text-[#444653]">
            Recaudación Cobrada
          </div>
          <div className="text-2xl font-bold text-[#00288e] mt-1">
            {loading ? "..." : `Bs. ${totalRecaudado.toFixed(2)}`}
          </div>
          <p className="text-[11px] text-[#444653] mt-1">
            {pagosPagados.length} recibos cobrados
          </p>
        </div>

        {/* Mora */}
        <div className="bg-white p-5 rounded-xl border border-[#c4c5d5] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <span className="material-symbols-outlined text-[#ba1a1a] p-2 bg-[#ffdad6] rounded-lg">
              warning
            </span>
            <span className="text-[#ba1a1a] text-xs font-bold bg-[#ffdad6] px-2.5 py-0.5 rounded-full">
              {tasaMorosidad}% Mora
            </span>
          </div>
          <div className="text-xs font-medium text-[#444653]">
            Deuda Pendiente / Multas
          </div>
          <div className="text-2xl font-bold text-[#ba1a1a] mt-1">
            {loading ? "..." : `Bs. ${totalPendiente.toFixed(2)}`}
          </div>
          <p className="text-[11px] text-[#444653] mt-1">
            {pagosPendientes.length} cobros pendientes
          </p>
        </div>

        {/* Vecinos */}
        <div className="bg-white p-5 rounded-xl border border-[#c4c5d5] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <span className="material-symbols-outlined text-[#006c49] p-2 bg-[#6cf8bb]/30 rounded-lg">
              group
            </span>
          </div>
          <div className="text-xs font-medium text-[#444653]">
            Padrón de Vecinos
          </div>
          <div className="text-2xl font-bold text-[#191c1e] mt-1">
            {loading ? "..." : `${vecinos.length} Familias`}
          </div>
          <p className="text-[11px] text-[#444653] mt-1">
            Registrados en el sistema
          </p>
        </div>

        {/* Asambleas */}
        <div className="bg-white p-5 rounded-xl border border-[#c4c5d5] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <span className="material-symbols-outlined text-[#00288e] p-2 bg-[#dde1ff] rounded-lg">
              how_to_reg
            </span>
          </div>
          <div className="text-xs font-medium text-[#444653]">
            Asambleas Registradas
          </div>
          <div className="text-2xl font-bold text-[#191c1e] mt-1">
            {loading ? "..." : `${asambleas.length} Eventos`}
          </div>
          <p className="text-[11px] text-[#444653] mt-1">
            Reuniones convocadas
          </p>
        </div>
      </div>

      {/* Grid: Desglose de Conceptos + Panel de Exportación */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Desglose por Concepto */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#c4c5d5] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold text-[#191c1e]">
                  Distribución de Ingresos por Concepto
                </h3>
                <p className="text-xs text-[#444653]">
                  Montos totales emitidos según el tipo de aporte
                </p>
              </div>
            </div>

            <div className="space-y-4 my-4">
              {Object.keys(conceptosMap).length === 0 ? (
                <p className="text-sm text-[#444653] py-4">No hay conceptos registrados aún.</p>
              ) : (
                Object.entries(conceptosMap).map(([concepto, data]) => {
                  const pct = totalFacturado > 0 ? Math.round((data.total / totalFacturado) * 100) : 0;
                  return (
                    <div key={concepto} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-[#191c1e]">
                          {concepto}{" "}
                          <span className="text-xs text-[#444653] font-normal">
                            ({data.count} pagos)
                          </span>
                        </span>
                        <span className="font-bold text-[#00288e]">
                          Bs. {data.total.toFixed(2)}{" "}
                          <span className="text-xs text-[#444653] font-normal">({pct}%)</span>
                        </span>
                      </div>
                      <div className="w-full bg-[#f2f4f6] rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#00288e] h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-[#c4c5d5] flex justify-between items-center text-xs text-[#444653]">
            <span>Total emitido en sistema:</span>
            <span className="font-bold text-sm text-[#191c1e]">Bs. {totalFacturado.toFixed(2)}</span>
          </div>
        </div>

        {/* Panel de Exportación */}
        <div className="lg:col-span-5 bg-[#00288e] text-white p-6 rounded-2xl border border-[#00288e] shadow-lg flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-white">download_for_offline</span>
              <h3 className="text-lg font-bold text-white">
                Exportar Reporte Oficial
              </h3>
            </div>
            <p className="text-xs text-[#a8b8ff]">
              Genera documentos descargables para presentar ante el directorio o la asamblea general.
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-white/90">
              Formato de Descarga
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setReportFormat("Excel")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all cursor-pointer ${
                  reportFormat === "Excel"
                    ? "bg-white/20 border-white font-bold shadow-sm"
                    : "bg-white/10 border-white/20 hover:bg-white/15"
                }`}
              >
                <span className="material-symbols-outlined text-white text-sm">
                  table_chart
                </span>
                <span className="text-sm">Excel (CSV)</span>
              </button>
              <button
                type="button"
                onClick={() => setReportFormat("PDF")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all cursor-pointer ${
                  reportFormat === "PDF"
                    ? "bg-white/20 border-white font-bold shadow-sm"
                    : "bg-white/10 border-white/20 hover:bg-white/15"
                }`}
              >
                <span className="material-symbols-outlined text-white text-sm">
                  print
                </span>
                <span className="text-sm">Imprimir (PDF)</span>
              </button>
            </div>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-xs text-blue-100 space-y-1">
            <div className="flex justify-between">
              <span>Registros a exportar:</span>
              <span className="font-bold text-white">{pagos.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Monto total auditado:</span>
              <span className="font-bold text-white">Bs. {totalFacturado.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleExport}
            disabled={isExporting || pagos.length === 0}
            className="w-full bg-[#006c49] text-white font-bold py-3 rounded-xl shadow-lg hover:bg-[#005236] transition-colors flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                Generando...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">
                  {reportFormat === "PDF" ? "print" : "file_download"}
                </span>
                {reportFormat === "PDF" ? "Imprimir Reporte" : "Descargar Archivo CSV/Excel"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabla Detallada de Ingresos y Filtros */}
      <div className="bg-white rounded-2xl border border-[#c4c5d5] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#c4c5d5] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-[#191c1e]">
              Detalle de Registros Financieros
            </h3>
            <p className="text-sm text-[#444653]">
              Listado completo para verificación de aportes
            </p>
          </div>

          {/* Filtros de estado */}
          <div className="flex items-center gap-2 bg-[#f2f4f6] p-1 rounded-xl border border-[#c4c5d5]">
            <button
              onClick={() => setFilterStatus("todos")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filterStatus === "todos" ? "bg-white text-[#00288e] shadow-sm" : "text-[#444653]"
              }`}
            >
              Todos ({pagos.length})
            </button>
            <button
              onClick={() => setFilterStatus("pagados")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filterStatus === "pagados" ? "bg-white text-[#006c49] shadow-sm" : "text-[#444653]"
              }`}
            >
              Cobrados ({pagosPagados.length})
            </button>
            <button
              onClick={() => setFilterStatus("pendientes")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filterStatus === "pendientes" ? "bg-white text-[#ba1a1a] shadow-sm" : "text-[#444653]"
              }`}
            >
              Pendientes ({pagosPendientes.length})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f2f4f6] border-b border-[#c4c5d5]">
              <tr>
                <th className="px-6 py-3 text-xs font-bold text-[#444653] uppercase">Fecha</th>
                <th className="px-6 py-3 text-xs font-bold text-[#444653] uppercase">Vecino</th>
                <th className="px-6 py-3 text-xs font-bold text-[#444653] uppercase">Ubicación</th>
                <th className="px-6 py-3 text-xs font-bold text-[#444653] uppercase">Concepto</th>
                <th className="px-6 py-3 text-xs font-bold text-[#444653] uppercase text-right">Monto</th>
                <th className="px-6 py-3 text-xs font-bold text-[#444653] uppercase text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c4c5d5]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-6 text-center text-[#444653]">
                    Cargando información del reporte...
                  </td>
                </tr>
              ) : pagosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-6 text-center text-[#444653]">
                    No se encontraron pagos con el filtro seleccionado.
                  </td>
                </tr>
              ) : (
                pagosFiltrados.map((p) => {
                  const isPagado = p.estado?.toLowerCase() === "pagado";
                  return (
                    <tr key={p.id} className="hover:bg-[#f2f4f6]/50 transition-colors">
                      <td className="px-6 py-4 text-xs text-[#444653]">
                        {new Date(p.fecha).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-semibold text-sm text-[#191c1e]">
                        {p.vecino_nombre || `Vecino #${p.vecino_id}`}
                      </td>
                      <td className="px-6 py-4 text-xs text-[#444653]">
                        Mz: {p.manzano || "-"} | Lote: {p.lote || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#444653]">{p.concepto}</td>
                      <td className="px-6 py-4 text-right font-bold text-sm text-[#191c1e]">
                        Bs. {Number(p.monto).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded-full ${
                            isPagado
                              ? "bg-[#DCFCE7] text-[#166534]"
                              : "bg-amber-100 text-amber-900"
                          }`}
                        >
                          {p.estado}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
