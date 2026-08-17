"use client";

import React, { useState, useEffect } from "react";

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

export default function PagosPage() {
  const [selectedStatus, setSelectedStatus] = useState<"Pagado" | "Pendiente">(
    "Pagado",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  // Estados para datos dinámicos
  const [vecinos, setVecinos] = useState<Vecino[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);

  // Campos del formulario
  const [vecinoId, setVecinoId] = useState("");
  const [concepto, setConcepto] = useState("Cuota Mensual");
  const [monto, setMonto] = useState("");

  // Cargar vecinos y pagos al iniciar la página
  useEffect(() => {
    fetchVecinos();
    fetchPagos();
  }, []);

  const fetchVecinos = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/vecinos");
      if (res.ok) {
        const data = await res.json();
        setVecinos(data);
      }
    } catch (error) {
      console.error("Error al cargar vecinos:", error);
    }
  };

  const fetchPagos = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/pagos");
      if (res.ok) {
        const data = await res.json();
        setPagos(data);
      }
    } catch (error) {
      console.error("Error al cargar pagos:", error);
    }
  };

  // Envío real del formulario hacia el backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vecinoId || !monto || Number(monto) <= 0) {
      alert(
        "Por favor seleccione un vecino y escriba un monto válido mayor a 0.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:5000/api/pagos", {
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
        setIsSubmitting(false);
        setSuccessMessage(true);
        setMonto("");
        setVecinoId("");
        fetchPagos(); // Recargar la tabla de pagos automáticamente

        setTimeout(() => {
          setSuccessMessage(false);
        }, 2000);
      } else {
        setIsSubmitting(false);
        alert("Error al registrar el pago");
      }
    } catch (error) {
      console.error("Error de red:", error);
      setIsSubmitting(false);
    }
  };

  // Cálculos para las tarjetas de resumen
  const hoyStr = new Date().toISOString().split("T")[0];
  const cobradoHoy = pagos
    .filter((p) => p.fecha?.startsWith(hoyStr) && p.estado === "Pagado")
    .reduce((acc, curr) => acc + Number(curr.monto), 0);

  const cajaGeneral = pagos
    .filter((p) => p.estado === "Pagado")
    .reduce((acc, curr) => acc + Number(curr.monto), 0);

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
      </aside>

      {/* TopNavBar */}
      <header className="bg-white w-full sticky top-0 z-50 shadow-sm border-b border-[#c4c5d5]">
        <div className="flex justify-between items-center px-6 py-3 max-w-[1280px] mx-auto">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-[#00288e]">
              Comunidad Gestión
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 lg:p-8 max-w-[1280px] mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#191c1e] mb-1">
            Gestión Financiera
          </h1>
          <p className="text-[#444653] text-base">
            Registro manual de cobros y control de tesorería conectado a
            PostgreSQL.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Registration Form Panel & Cards */}
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
                    <label className="block text-sm font-semibold text-[#191c1e] mb-1">
                      Concepto
                    </label>
                    <select
                      value={concepto}
                      onChange={(e) => setConcepto(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#f2f4f6] border border-[#c4c5d5] rounded-xl focus:border-[#00288e] focus:ring-1 focus:ring-[#00288e] outline-none text-sm cursor-pointer"
                    >
                      <option value="Cuota Mensual">Cuota Mensual</option>
                      <option value="Multa">Multa</option>
                      <option value="Aporte Extraordinario">
                        Aporte Extraordinario
                      </option>
                      <option value="Alquiler de Salón">
                        Alquiler de Salón
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#191c1e] mb-1">
                      Monto (BOB)
                    </label>
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
                    className="w-full bg-[#00288e] text-white py-3 rounded-xl font-bold hover:bg-[#1e40af] transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-md cursor-pointer"
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

            {/* Tarjetas de Resumen (Cobrado hoy y Caja General) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#e8f5e9] p-4 rounded-2xl border border-[#c8e6c9] shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-2 text-[#2e7d32] mb-2">
                  <span className="material-symbols-outlined">trending_up</span>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Cobrado Hoy
                  </span>
                </div>
                <div className="text-xl font-extrabold text-[#1b5e20]">
                  {cobradoHoy.toFixed(2)} BOB
                </div>
              </div>

              <div className="bg-[#e8eaf6] p-4 rounded-2xl border border-[#c5cae9] shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-2 text-[#3f51b5] mb-2">
                  <span className="material-symbols-outlined">wallet</span>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Caja General
                  </span>
                </div>
                <div className="text-xl font-extrabold text-[#1a237e]">
                  {cajaGeneral.toFixed(2)} BOB
                </div>
              </div>
            </div>
          </section>

          {/* History & Table Panel */}
          <section className="xl:col-span-7 bg-white rounded-2xl shadow-sm border border-[#c4c5d5] overflow-hidden flex flex-col justify-between">
            <div>
              <div className="p-6 border-b border-[#c4c5d5] bg-[#f2f4f6]/50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#191c1e]">
                  Historial de Ingresos
                </h2>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#f2f4f6] border-b border-[#c4c5d5]">
                    <tr>
                      <th className="px-6 py-3 text-xs font-bold text-[#444653] uppercase">
                        Vecino
                      </th>
                      <th className="px-6 py-3 text-xs font-bold text-[#444653] uppercase">
                        Concepto
                      </th>
                      <th className="px-6 py-3 text-xs font-bold text-[#444653] uppercase text-right">
                        Monto
                      </th>
                      <th className="px-6 py-3 text-xs font-bold text-[#444653] uppercase text-center">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-xs font-bold text-[#444653] uppercase">
                        Fecha
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c4c5d5]">
                    {pagos.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-6 text-center text-sm text-[#444653]"
                        >
                          No hay pagos registrados todavía.
                        </td>
                      </tr>
                    ) : (
                      pagos.map((p) => (
                        <tr
                          key={p.id}
                          className="hover:bg-[#f2f4f6]/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <p className="font-semibold text-sm text-[#191c1e]">
                              {p.vecino_nombre || "Desconocido"}
                            </p>
                            <p className="text-xs text-[#444653]">
                              Mz: {p.manzano || "-"} | Lote: {p.lote || "-"}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-sm text-[#444653]">
                            {p.concepto}
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-sm text-[#191c1e]">
                            {Number(p.monto).toFixed(2)} BOB
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`px-3 py-1 text-xs font-bold rounded-full ${
                                p.estado === "Pagado"
                                  ? "bg-[#DCFCE7] text-[#166534]"
                                  : "bg-amber-100 text-amber-900"
                              }`}
                            >
                              {p.estado}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-[#444653]">
                            {new Date(p.fecha).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
