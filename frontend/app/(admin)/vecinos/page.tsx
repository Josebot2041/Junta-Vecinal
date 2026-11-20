"use client";

import React, { useState, useEffect } from "react";

interface VecinoItem {
  id: number | string;
  nombre: string;
  ci?: string;
  telefono?: string;
  manzano?: string;
  lote?: string;
  direccion?: string;
  estado: string;
  tipoEstado: string;
  saldo: string;
  iniciales: string;
  [key: string]: unknown;
}

interface PagoHistorial {
  id: number;
  concepto: string;
  monto: number;
  estado: string;
  fecha: string;
}

interface AsistenciaHistorial {
  id: number;
  asamblea_nombre: string;
  asamblea_fecha: string;
  estado: string;
}

interface HistorialData {
  vecino: VecinoItem & { estado_cuenta?: string };
  pagos: PagoHistorial[];
  asistencias: AsistenciaHistorial[];
}

const API = "http://localhost:5000/api";

function mapVecino(vecino: any): VecinoItem {
  const nombre = vecino.nombre || "";
  const iniciales = nombre
    .split(" ")
    .filter(Boolean)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return {
    ...vecino,
    tipoEstado: vecino.estado_cuenta === "Con saldo pendiente" ? "danger" : "success",
    estado: vecino.estado_cuenta || "Al día",
    saldo: `Bs. ${Number(vecino.saldo || 0).toFixed(2)}`,
    iniciales: iniciales || "VN",
  };
}

export default function DashboardVecinosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedManzano, setSelectedManzano] = useState("Todas las Manzanas");
  const [vecinos, setVecinos] = useState<VecinoItem[]>([]);
  const [editingVecino, setEditingVecino] = useState<VecinoItem | null>(null);
  const [historialData, setHistorialData] = useState<HistorialData | null>(null);
  const [historialOpen, setHistorialOpen] = useState(false);
  const [loadingHistorial, setLoadingHistorial] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "", ci: "", telefono: "", manzano: "", lote: "", direccion: "",
  });

  const fetchVecinos = async () => {
    try {
      const response = await fetch(`${API}/vecinos`);
      if (response.ok) {
        const data = await response.json();
        setVecinos(data.map(mapVecino));
      }
    } catch (error) {
      console.error("Error de red al conectar con el backend:", error);
    }
  };

  useEffect(() => { fetchVecinos(); }, []);

  useEffect(() => {
    document.body.style.overflow = (isModalOpen || historialOpen) ? "hidden" : "auto";
  }, [isModalOpen, historialOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setIsModalOpen(false); setHistorialOpen(false); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    setEditingVecino(null);
    setFormData({ nombre: "", ci: "", telefono: "", manzano: "", lote: "", direccion: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (vecino: VecinoItem) => {
    setEditingVecino(vecino);
    setFormData({
      nombre: String(vecino.nombre || ""),
      ci: String(vecino.ci || ""),
      telefono: String(vecino.telefono || ""),
      manzano: String(vecino.manzano || ""),
      lote: String(vecino.lote || ""),
      direccion: String(vecino.direccion || ""),
    });
    setIsModalOpen(true);
  };

  const handleSubmitVecino = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEditing = !!editingVecino;
      const url = isEditing ? `${API}/vecinos/${editingVecino!.id}` : `${API}/vecinos`;
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchVecinos();
        setIsModalOpen(false);
        setEditingVecino(null);
        setFormData({ nombre: "", ci: "", telefono: "", manzano: "", lote: "", direccion: "" });
      } else {
        alert("Error al guardar el vecino en el servidor.");
      }
    } catch (error) {
      console.error("Error de red o backend no disponible:", error);
    }
  };

  const handleDeleteVecino = async (vecino: VecinoItem) => {
    if (!confirm(`¿Seguro que desea eliminar a ${vecino.nombre}?\nEsta acción también eliminará sus pagos y asistencias.`)) return;
    try {
      const response = await fetch(`${API}/vecinos/${vecino.id}`, { method: "DELETE" });
      if (response.ok) {
        setVecinos((prev) => prev.filter((v) => v.id !== vecino.id));
      } else {
        alert("Error al eliminar el vecino.");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const handleVerHistorial = async (vecino: VecinoItem) => {
    setLoadingHistorial(true);
    setHistorialOpen(true);
    try {
      const response = await fetch(`${API}/vecinos/${vecino.id}/historial`);
      if (response.ok) {
        const data = await response.json();
        setHistorialData(data);
      }
    } catch (error) {
      console.error("Error al cargar historial:", error);
    } finally {
      setLoadingHistorial(false);
    }
  };

  const manzanosUnicos = ["Todas las Manzanas", ...Array.from(new Set(vecinos.map((v) => v.manzano).filter(Boolean)))];

  const vecinosFiltrados = vecinos.filter((v) => {
    const matchesSearch =
      v.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(v.ci || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesManzano =
      selectedManzano === "Todas las Manzanas" ||
      String(v.manzano || "").toLowerCase() === selectedManzano.toLowerCase();
    return matchesSearch && matchesManzano;
  });

  return (
    <main className="max-w-[1280px] mx-auto px-4 md:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Directorio de Vecinos</h1>
          <p className="text-slate-600 mt-1">Administra la información de los residentes y sus estados de cuenta.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-[#00288e] text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">person_add</span>
          Registrar Nuevo Vecino
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-6">
          <div className="w-12 h-12 rounded-full bg-[#dde1ff] text-[#00288e] flex items-center justify-center">
            <span className="material-symbols-outlined">groups</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Vecinos</p>
            <p className="text-xl font-bold text-slate-900">{vecinos.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-6">
          <div className="w-12 h-12 rounded-full bg-[#DCFCE7] text-[#166534] flex items-center justify-center">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Al día</p>
            <p className="text-xl font-bold text-slate-900">
              {vecinos.filter((v) => v.tipoEstado === "success").length}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-6">
          <div className="w-12 h-12 rounded-full bg-[#FEE2E2] text-[#991B1B] flex items-center justify-center">
            <span className="material-symbols-outlined">warning</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Con saldo pendiente</p>
            <p className="text-xl font-bold text-slate-900">
              {vecinos.filter((v) => v.tipoEstado === "danger").length}
            </p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-t-xl border-x border-t border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o CI..."
            className="w-full pl-12 pr-4 py-2 rounded-lg border border-slate-300 focus:border-[#00288e] focus:ring-1 focus:ring-[#00288e] outline-none transition-all text-sm"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select
            value={selectedManzano}
            onChange={(e) => setSelectedManzano(e.target.value)}
            className="flex-1 md:flex-none py-2 px-4 rounded-lg border border-slate-300 text-sm bg-white outline-none"
          >
            {manzanosUnicos.map((m) => <option key={String(m)}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-b-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Nombre Completo</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">CI / Documento</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Ubicación</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Estado de Cuenta</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Saldo</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {vecinosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">
                    No se encontraron vecinos.
                  </td>
                </tr>
              ) : (
                vecinosFiltrados.map((vecino, index) => (
                  <tr key={String(vecino.id) || String(index)} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#dde1ff] text-[#00288e] font-bold flex items-center justify-center text-xs">
                          {vecino.iniciales}
                        </div>
                        <div className="font-semibold text-slate-900">{vecino.nombre}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{String(vecino.ci || "-")}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">Mz. {vecino.manzano}</div>
                      <div className="text-xs text-slate-500">
                        Lote {vecino.lote} {vecino.direccion ? `- ${String(vecino.direccion)}` : ""}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit gap-1 ${vecino.tipoEstado === "success" ? "bg-[#DCFCE7] text-[#166534]" : "bg-[#FEE2E2] text-[#991B1B]"}`}>
                        <span className="material-symbols-outlined text-[14px]">
                          {vecino.tipoEstado === "success" ? "check_circle" : "error"}
                        </span>
                        {vecino.estado}
                      </span>
                    </td>
                    <td className={`px-6 py-4 font-bold ${vecino.tipoEstado === "success" ? "text-[#00288e]" : "text-[#ba1a1a]"}`}>
                      {vecino.saldo}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* Editar */}
                        <button
                          onClick={() => openEditModal(vecino)}
                          title="Editar vecino"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#00288e] hover:bg-[#dde1ff]/40 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        {/* Ver historial */}
                        <button
                          onClick={() => handleVerHistorial(vecino)}
                          title="Ver historial"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#2563eb] hover:bg-blue-50 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">person_search</span>
                        </button>
                        {/* Eliminar */}
                        <button
                          onClick={() => handleDeleteVecino(vecino)}
                          title="Eliminar vecino"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#ba1a1a] hover:bg-[#FEE2E2] transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50 px-6 py-3 flex items-center justify-between border-t border-slate-200">
          <p className="text-xs text-slate-500">Mostrando {vecinosFiltrados.length} de {vecinos.length} vecinos registrados</p>
        </div>
      </div>

      {/* ── Modal Crear / Editar Vecino ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto" role="dialog">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-slate-200 relative z-10">
              <div className="px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {editingVecino ? "Editar Vecino" : "Registrar Nuevo Vecino"}
                    </h3>
                    <p className="text-sm text-slate-500">Complete todos los datos requeridos.</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                <form onSubmit={handleSubmitVecino} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: "Nombre Completo", name: "nombre", placeholder: "Ej. Juan Pérez", required: true },
                      { label: "Cédula de Identidad (CI)", name: "ci", placeholder: "Ej. 13378711", required: true },
                      { label: "Teléfono", name: "telefono", placeholder: "Ej. 70712345" },
                      { label: "Manzano", name: "manzano", placeholder: "Ej. d-3", required: true },
                      { label: "Lote", name: "lote", placeholder: "Ej. 25", required: true },
                      { label: "Dirección / Referencia", name: "direccion", placeholder: "Ej. Villa Calama" },
                    ].map(({ label, name, placeholder, required }) => (
                      <div key={name}>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">{label}</label>
                        <input
                          type="text"
                          name={name}
                          value={(formData as any)[name]}
                          onChange={handleInputChange}
                          placeholder={placeholder}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-[#00288e] outline-none"
                          required={required}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 rounded-lg text-sm font-medium text-[#00288e] border border-[#00288e] hover:bg-slate-50 transition-colors">
                      Cancelar
                    </button>
                    <button type="submit" className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-[#00288e] shadow-md hover:brightness-110 transition-all">
                      {editingVecino ? "Guardar Cambios" : "Registrar Vecino"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Historial del Vecino ── */}
      {historialOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto" role="dialog">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 sm:block sm:p-0">
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setHistorialOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full border border-slate-200 relative z-10">
              <div className="px-8 py-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#00288e]">person_search</span>
                    Historial del Vecino
                  </h3>
                  <button onClick={() => setHistorialOpen(false)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                {loadingHistorial ? (
                  <div className="flex items-center justify-center py-12">
                    <span className="material-symbols-outlined animate-spin text-[#00288e] text-4xl">sync</span>
                  </div>
                ) : historialData ? (
                  <div className="space-y-6">
                    {/* Tarjeta del vecino */}
                    <div className="bg-[#f2f4f6] rounded-xl p-4 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-[#dde1ff] text-[#00288e] font-bold flex items-center justify-center text-lg">
                        {historialData.vecino.nombre?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-lg font-bold text-slate-900">{historialData.vecino.nombre}</p>
                        <p className="text-sm text-slate-500">CI: {historialData.vecino.ci} | Tel: {String(historialData.vecino.telefono || "-")}</p>
                        <p className="text-sm text-slate-500">Mz. {historialData.vecino.manzano} — Lote {historialData.vecino.lote}</p>
                      </div>
                      <div className="ml-auto">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${historialData.vecino.estado_cuenta === "Con saldo pendiente" ? "bg-[#FEE2E2] text-[#991B1B]" : "bg-[#DCFCE7] text-[#166534]"}`}>
                          {historialData.vecino.estado_cuenta || "Al día"}
                        </span>
                      </div>
                    </div>

                    {/* Pagos */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-[#00288e]">payments</span>
                        Historial de Pagos ({historialData.pagos.length})
                      </h4>
                      {historialData.pagos.length === 0 ? (
                        <p className="text-sm text-slate-400 italic">Sin registros de pagos.</p>
                      ) : (
                        <div className="overflow-x-auto rounded-lg border border-slate-200">
                          <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50">
                              <tr>
                                <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Concepto</th>
                                <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase text-right">Monto</th>
                                <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase text-center">Estado</th>
                                <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Fecha</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {historialData.pagos.map((p) => (
                                <tr key={p.id}>
                                  <td className="px-4 py-2">{p.concepto}</td>
                                  <td className="px-4 py-2 text-right font-semibold">{Number(p.monto).toFixed(2)} BOB</td>
                                  <td className="px-4 py-2 text-center">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${p.estado === "Pagado" ? "bg-[#DCFCE7] text-[#166534]" : "bg-amber-100 text-amber-900"}`}>
                                      {p.estado}
                                    </span>
                                  </td>
                                  <td className="px-4 py-2 text-slate-500">{new Date(p.fecha).toLocaleDateString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Asistencias */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-[#00288e]">groups</span>
                        Asistencia a Asambleas ({historialData.asistencias.length})
                      </h4>
                      {historialData.asistencias.length === 0 ? (
                        <p className="text-sm text-slate-400 italic">Sin registros de asistencias.</p>
                      ) : (
                        <div className="overflow-x-auto rounded-lg border border-slate-200">
                          <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50">
                              <tr>
                                <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Asamblea</th>
                                <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Fecha</th>
                                <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase text-center">Estado</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {historialData.asistencias.map((a) => (
                                <tr key={a.id}>
                                  <td className="px-4 py-2">{a.asamblea_nombre}</td>
                                  <td className="px-4 py-2 text-slate-500">{new Date(a.asamblea_fecha).toLocaleDateString()}</td>
                                  <td className="px-4 py-2 text-center">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${a.estado === "present" ? "bg-[#DCFCE7] text-[#166534]" : a.estado === "justified" ? "bg-blue-100 text-blue-800" : "bg-[#FEE2E2] text-[#991B1B]"}`}>
                                      {a.estado === "present" ? "Presente" : a.estado === "justified" ? "Justificado" : "Ausente"}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 py-6 text-center">No se pudo cargar el historial.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
