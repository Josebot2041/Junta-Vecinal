"use client";

import React, { useState, useEffect, useRef } from "react";

interface Vecino {
  id: number;
  nombre: string;
  manzano?: string;
  lote?: string;
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

const API = "http://localhost:5000/api";

export default function PagosPage() {
  const [selectedStatus, setSelectedStatus] = useState<"Pagado" | "Pendiente">("Pagado");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [vecinos, setVecinos] = useState<Vecino[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [vecinoId, setVecinoId] = useState("");
  const [concepto, setConcepto] = useState("Cuota Mensual");
  const [monto, setMonto] = useState("");

  // Modal recibo
  const [reciboModal, setReciboModal] = useState<{ open: boolean; pago: Pago | null }>({ open: false, pago: null });
  const reciboRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchVecinos();
    fetchPagos();
  }, []);

  const fetchVecinos = async () => {
    try {
      const res = await fetch(`${API}/vecinos`);
      if (res.ok) setVecinos(await res.json());
    } catch (error) {
      console.error("Error al cargar vecinos:", error);
    }
  };

  const fetchPagos = async () => {
    try {
      const res = await fetch(`${API}/pagos`);
      if (res.ok) setPagos(await res.json());
    } catch (error) {
      console.error("Error al cargar pagos:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vecinoId || !monto || Number(monto) <= 0) {
      alert("Por favor seleccione un vecino y escriba un monto válido mayor a 0.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API}/pagos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vecino_id: Number(vecinoId),
          concepto,
          monto: Number(monto),
          estado: selectedStatus,
        }),
      });
      if (res.ok) {
        setSuccessMessage(true);
        setMonto("");
        setVecinoId("");
        fetchPagos();
        setTimeout(() => setSuccessMessage(false), 2000);
      } else {
        alert("Error al registrar el pago");
      }
    } catch (error) {
      console.error("Error de red:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCobrarPago = async (id: number) => {
    if (!confirm("¿Marcar este pago como cobrado?")) return;
    try {
      const res = await fetch(`${API}/pagos/${id}/cobrar`, { method: "PATCH" });
      if (res.ok) {
        fetchPagos();
      } else {
        alert("Error al actualizar el pago.");
      }
    } catch (error) {
      console.error("Error al cobrar pago:", error);
    }
  };

  const handleEliminarPago = async (id: number) => {
    if (!confirm("¿Seguro que desea eliminar este registro de pago? Esta acción no se puede deshacer.")) return;
    try {
      const res = await fetch(`${API}/pagos/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPagos((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Error al eliminar el pago.");
      }
    } catch (error) {
      console.error("Error al eliminar pago:", error);
    }
  };

  const handleImprimirRecibo = (pago: Pago) => {
    setReciboModal({ open: true, pago });
  };

  const handlePrintWindow = () => {
    const printContents = reciboRef.current?.innerHTML;
    if (!printContents) return;
    const win = window.open("", "_blank", "width=500,height=700");
    if (!win) return;
    win.document.write(`
      <html><head><title>Recibo de Pago</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 32px; color: #111; }
        h1 { font-size: 20px; margin-bottom: 4px; }
        p { margin: 4px 0; font-size: 13px; }
        .label { color: #555; }
        .divider { border-top: 1px dashed #999; margin: 16px 0; }
        .badge { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 12px; font-weight: bold; background: #DCFCE7; color: #166534; }
        .amount { font-size: 28px; font-weight: bold; color: #00288e; margin: 8px 0; }
        .footer { font-size: 11px; color: #aaa; margin-top: 24px; text-align: center; }
      </style>
      </head><body>${printContents}</body></html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  const hoyStr = new Date().toISOString().split("T")[0];
  const cobradoHoy = pagos
    .filter((p) => p.fecha?.startsWith(hoyStr) && p.estado === "Pagado")
    .reduce((acc, curr) => acc + Number(curr.monto), 0);
  const cajaGeneral = pagos
    .filter((p) => p.estado === "Pagado")
    .reduce((acc, curr) => acc + Number(curr.monto), 0);

  return (
    <main className="flex-1 p-4 lg:p-8 max-w-[1280px] mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#191c1e] mb-1">Gestión Financiera</h1>
        <p className="text-[#444653] text-base">
          Registro manual de cobros y control de tesorería conectado a PostgreSQL.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Registration Form Panel & Cards */}
        <section className="xl:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#c4c5d5]">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-[#00288e]">add_circle</span>
              <h2 className="text-xl font-bold text-[#191c1e]">Registrar Cobro</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#191c1e] mb-1">Vecino / Propietario</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#757684]">person</span>
                  <select
                    value={vecinoId}
                    onChange={(e) => setVecinoId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f2f4f6] border border-[#c4c5d5] rounded-xl focus:border-[#00288e] focus:ring-1 focus:ring-[#00288e] outline-none text-sm cursor-pointer"
                  >
                    <option value="">Seleccionar vecino...</option>
                    {vecinos.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.nombre} {v.manzano ? `- Mz: ${v.manzano}` : ""}{" "}
                        {v.lote ? `Lote: ${v.lote}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#191c1e] mb-1">Concepto</label>
                  <select
                    value={concepto}
                    onChange={(e) => setConcepto(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#f2f4f6] border border-[#c4c5d5] rounded-xl focus:border-[#00288e] focus:ring-1 focus:ring-[#00288e] outline-none text-sm cursor-pointer"
                  >
                    <option value="Cuota Mensual">Cuota Mensual</option>
                    <option value="Multa">Multa</option>
                    <option value="Aporte Extraordinario">Aporte Extraordinario</option>
                    <option value="Alquiler de Salón">Alquiler de Salón</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#191c1e] mb-1">Monto (BOB)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#f2f4f6] border border-[#c4c5d5] rounded-xl focus:border-[#00288e] focus:ring-1 focus:ring-[#00288e] outline-none text-sm"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#191c1e] mb-1">Estado inicial</label>
                <div className="flex gap-4">
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded-xl cursor-pointer transition-all ${selectedStatus === "Pagado" ? "border-[#6cf8bb] bg-[#6cf8bb]/10" : "border-[#c4c5d5]"}`}>
                    <input type="radio" name="status" checked={selectedStatus === "Pagado"} onChange={() => setSelectedStatus("Pagado")} />
                    <span className="text-sm font-semibold text-[#002113]">Pagado</span>
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded-xl cursor-pointer transition-all ${selectedStatus === "Pendiente" ? "border-[#00288e] bg-[#dde1ff]/30" : "border-[#c4c5d5]"}`}>
                    <input type="radio" name="status" checked={selectedStatus === "Pendiente"} onChange={() => setSelectedStatus("Pendiente")} />
                    <span className="text-sm font-semibold text-[#444653]">Pendiente</span>
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#00288e] text-white py-3 rounded-xl font-bold hover:bg-[#1e40af] transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  {isSubmitting ? (
                    <><span className="material-symbols-outlined animate-spin">sync</span>Procesando...</>
                  ) : successMessage ? (
                    <><span className="material-symbols-outlined">check_circle</span>¡Registrado!</>
                  ) : (
                    <><span className="material-symbols-outlined">save</span>Confirmar Registro</>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Tarjetas de Resumen */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#e8f5e9] p-4 rounded-2xl border border-[#c8e6c9] shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 text-[#2e7d32] mb-2">
                <span className="material-symbols-outlined">trending_up</span>
                <span className="text-xs font-bold uppercase tracking-wider">Cobrado Hoy</span>
              </div>
              <div className="text-xl font-extrabold text-[#1b5e20]">{cobradoHoy.toFixed(2)} BOB</div>
            </div>
            <div className="bg-[#e8eaf6] p-4 rounded-2xl border border-[#c5cae9] shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 text-[#3f51b5] mb-2">
                <span className="material-symbols-outlined">wallet</span>
                <span className="text-xs font-bold uppercase tracking-wider">Caja General</span>
              </div>
              <div className="text-xl font-extrabold text-[#1a237e]">{cajaGeneral.toFixed(2)} BOB</div>
            </div>
          </div>
        </section>

        {/* History & Table Panel */}
        <section className="xl:col-span-7 bg-white rounded-2xl shadow-sm border border-[#c4c5d5] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-[#c4c5d5] bg-[#f2f4f6]/50">
            <h2 className="text-xl font-bold text-[#191c1e]">Historial de Ingresos</h2>
            <p className="text-xs text-[#444653] mt-1">Haga clic en las acciones para cobrar, eliminar o imprimir un recibo.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#f2f4f6] border-b border-[#c4c5d5]">
                <tr>
                  <th className="px-4 py-3 text-xs font-bold text-[#444653] uppercase">Vecino</th>
                  <th className="px-4 py-3 text-xs font-bold text-[#444653] uppercase">Concepto</th>
                  <th className="px-4 py-3 text-xs font-bold text-[#444653] uppercase text-right">Monto</th>
                  <th className="px-4 py-3 text-xs font-bold text-[#444653] uppercase text-center">Estado</th>
                  <th className="px-4 py-3 text-xs font-bold text-[#444653] uppercase">Fecha</th>
                  <th className="px-4 py-3 text-xs font-bold text-[#444653] uppercase text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c4c5d5]">
                {pagos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-6 text-center text-sm text-[#444653]">
                      No hay pagos registrados todavía.
                    </td>
                  </tr>
                ) : (
                  pagos.map((p) => (
                    <tr key={p.id} className="hover:bg-[#f2f4f6]/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-sm text-[#191c1e]">{p.vecino_nombre || "Desconocido"}</p>
                        <p className="text-xs text-[#444653]">Mz: {p.manzano || "-"} | Lote: {p.lote || "-"}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#444653]">{p.concepto}</td>
                      <td className="px-4 py-3 text-right font-bold text-sm text-[#191c1e]">
                        {Number(p.monto).toFixed(2)} BOB
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${p.estado === "Pagado" ? "bg-[#DCFCE7] text-[#166534]" : "bg-amber-100 text-amber-900"}`}>
                          {p.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#444653]">
                        {new Date(p.fecha).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          {/* Marcar como cobrado (solo si Pendiente) */}
                          {p.estado !== "Pagado" && (
                            <button
                              onClick={() => handleCobrarPago(p.id)}
                              title="Marcar como cobrado"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-[#166534] hover:bg-[#DCFCE7] transition-colors"
                            >
                              <span className="material-symbols-outlined text-[18px]">check_circle</span>
                            </button>
                          )}
                          {/* Imprimir recibo */}
                          <button
                            onClick={() => handleImprimirRecibo(p)}
                            title="Ver recibo"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#1d4ed8] hover:bg-blue-50 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                          </button>
                          {/* Eliminar */}
                          <button
                            onClick={() => handleEliminarPago(p.id)}
                            title="Eliminar pago"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#ba1a1a] hover:bg-[#FEE2E2] transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* ── Modal Recibo de Pago ── */}
      {reciboModal.open && reciboModal.pago && (
        <div className="fixed inset-0 z-[100] overflow-y-auto" role="dialog">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 sm:block sm:p-0">
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setReciboModal({ open: false, pago: null })}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-xl shadow-xl sm:my-8 sm:align-middle sm:max-w-md sm:w-full border border-slate-200 relative z-10 overflow-hidden">
              {/* Contenido imprimible */}
              <div ref={reciboRef} className="p-8">
                {/* Membrete */}
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-full bg-[#dde1ff] text-[#00288e] font-bold flex items-center justify-center text-2xl mx-auto mb-2">OTB</div>
                  <h1 className="text-lg font-bold text-[#00288e]">Organización Territorial de Base</h1>
                  <p className="text-xs text-slate-500">Junta Vecinal — Cochabamba, Bolivia</p>
                  <div className="mt-2 inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-[#dde1ff] text-[#00288e]">
                    RECIBO DE PAGO #{String(reciboModal.pago.id).padStart(4, "0")}
                  </div>
                </div>

                <div className="border-t border-dashed border-slate-300 my-4"></div>

                {/* Datos del vecino */}
                <div className="space-y-1 mb-4">
                  <p className="text-xs text-slate-500 font-medium">VECINO / PROPIETARIO</p>
                  <p className="font-bold text-slate-900">{reciboModal.pago.vecino_nombre || "-"}</p>
                  <p className="text-sm text-slate-500">Mz. {reciboModal.pago.manzano || "-"} — Lote {reciboModal.pago.lote || "-"}</p>
                </div>

                {/* Detalles del pago */}
                <div className="bg-[#f2f4f6] rounded-xl p-4 space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Concepto</span>
                    <span className="font-semibold text-slate-900">{reciboModal.pago.concepto}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Fecha</span>
                    <span className="font-semibold text-slate-900">{new Date(reciboModal.pago.fecha).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Estado</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${reciboModal.pago.estado === "Pagado" ? "bg-[#DCFCE7] text-[#166534]" : "bg-amber-100 text-amber-900"}`}>
                      {reciboModal.pago.estado}
                    </span>
                  </div>
                </div>

                {/* Monto */}
                <div className="text-center py-4 border-t border-dashed border-slate-300">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Total</p>
                  <p className="text-4xl font-extrabold text-[#00288e]">{Number(reciboModal.pago.monto).toFixed(2)} BOB</p>
                </div>

                <p className="text-center text-xs text-slate-400 mt-4">Documento generado por el sistema de gestión vecinal.</p>
              </div>

              {/* Botones de acción */}
              <div className="border-t border-slate-200 px-6 py-4 flex justify-end gap-3 bg-slate-50">
                <button
                  onClick={() => setReciboModal({ open: false, pago: null })}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 border border-slate-300 hover:bg-slate-100 transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={handlePrintWindow}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#00288e] hover:brightness-110 flex items-center gap-2 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">print</span>
                  Imprimir Recibo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
