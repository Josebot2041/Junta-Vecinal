"use client";

import React, { useState, useEffect } from "react";

interface VecinoItem {
  id: number | string;
  nombre: string;
  ci?: string;
  manzano?: string;
  lote?: string;
  estado: string;
  tipoEstado: string;
  saldo: string;
  iniciales: string;
  [key: string]: unknown;
}

export default function DashboardVecinosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedManzano, setSelectedManzano] = useState("Todas las Manzanas");
  const [vecinos, setVecinos] = useState<VecinoItem[]>([]);

  useEffect(() => {
    const fetchVecinos = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/vecinos");
        if (response.ok) {
          const data = await response.json();
          const vecinosMapeados = data.map((vecino: any) => {
            const nombreVecino = vecino.nombre || "";
            const iniciales = nombreVecino
              .split(" ")
              .filter(Boolean)
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);
            return {
              ...vecino,
              tipoEstado: vecino.estado_cuenta === "Moroso" ? "danger" : "success",
              estado: vecino.estado_cuenta || "Al día",
              saldo: `Bs. ${vecino.saldo || "0.00"}`,
              iniciales: iniciales || "VN",
            };
          });
          setVecinos(vecinosMapeados);
        }
      } catch (error) {
        console.error("Error de red al conectar con el backend:", error);
      }
    };
    fetchVecinos();
  }, []);

  const [formData, setFormData] = useState({
    nombre: "", ci: "", telefono: "", manzano: "", lote: "", direccion: "",
    estado_cuenta: "Al día", saldo: "0.00",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitVecino = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/vecinos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        const nuevoVecino = data.vecino || data;
        const nombreVecino = nuevoVecino.nombre || formData.nombre;
        const iniciales = nombreVecino.split(" ").filter(Boolean).map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
        setVecinos((prev) => [
          ...prev,
          {
            ...nuevoVecino,
            id: nuevoVecino.id || Date.now(),
            nombre: nombreVecino,
            ci: nuevoVecino.ci || formData.ci,
            manzano: nuevoVecino.manzano || formData.manzano,
            lote: nuevoVecino.lote || formData.lote,
            estado: nuevoVecino.estado_cuenta || formData.estado_cuenta || "Al día",
            tipoEstado: "success",
            saldo: `Bs. ${nuevoVecino.saldo || formData.saldo || "0.00"}`,
            iniciales,
          },
        ]);
        setIsModalOpen(false);
        setFormData({ nombre: "", ci: "", telefono: "", manzano: "", lote: "", direccion: "", estado_cuenta: "Al día", saldo: "0.00" });
      } else {
        alert("Error al guardar el vecino en el servidor.");
      }
    } catch (error) {
      console.error("Error de red o backend no disponible:", error);
    }
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
  }, [isModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setIsModalOpen(false); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main className="max-w-[1280px] mx-auto px-4 md:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Directorio de Vecinos</h1>
          <p className="text-slate-600 mt-1">Administra la información de los residentes y sus estados de cuenta.</p>
        </div>
        <button
          onClick={toggleModal}
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
              {vecinos.filter((v: any) => v.tipoEstado === "success").length}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-6">
          <div className="w-12 h-12 rounded-full bg-[#FEE2E2] text-[#991B1B] flex items-center justify-center">
            <span className="material-symbols-outlined">warning</span>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">En Mora</p>
            <p className="text-xl font-bold text-slate-900">
              {vecinos.filter((v: any) => v.tipoEstado === "danger").length}
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
            <option>Todas las Manzanas</option>
            <option>Manzano 2</option>
            <option>Manzano 3</option>
            <option>Manzano 4</option>
            <option>d-3</option>
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
                <th className="px-6 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {vecinos
                .filter((v: any) => {
                  const matchesSearch =
                    v.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    v.ci?.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesManzano =
                    selectedManzano === "Todas las Manzanas" ||
                    v.manzano?.toLowerCase() === selectedManzano.toLowerCase();
                  return matchesSearch && matchesManzano;
                })
                .map((vecino: any, index: number) => (
                  <tr key={vecino.id || index} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#dde1ff] text-[#00288e] font-bold flex items-center justify-center text-xs">
                          {vecino.iniciales}
                        </div>
                        <div className="font-semibold text-slate-900">{vecino.nombre}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{vecino.ci}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">Mz. {vecino.manzano}</div>
                      <div className="text-xs text-slate-500">
                        Lote {vecino.lote} {vecino.direccion ? `- ${vecino.direccion}` : ""}
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
                    <td className="px-6 py-4 text-right">
                      <button className="material-symbols-outlined text-slate-400 hover:text-slate-700 transition-colors">
                        more_vert
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50 px-6 py-3 flex items-center justify-between border-t border-slate-200">
          <p className="text-xs text-slate-500">Mostrando {vecinos.length} vecinos registrados</p>
        </div>
      </div>

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto" role="dialog">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50 backdrop-blur-sm" onClick={toggleModal}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-slate-200 relative z-10">
              <div className="px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Registrar Nuevo Vecino</h3>
                    <p className="text-sm text-slate-500">Complete todos los datos requeridos.</p>
                  </div>
                  <button onClick={toggleModal} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full">
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
                    <button type="button" onClick={toggleModal} className="px-5 py-2 rounded-lg text-sm font-medium text-[#00288e] border border-[#00288e] hover:bg-slate-50 transition-colors">
                      Cancelar
                    </button>
                    <button type="submit" className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-[#00288e] shadow-md hover:brightness-110 transition-all">
                      Guardar Vecino
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
