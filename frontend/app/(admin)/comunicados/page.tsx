"use client";

import React, { useState, useEffect, useRef } from "react";

interface Comunicado {
  id: number;
  titulo: string;
  categoria: string;
  descripcion: string;
  imagen_url?: string | null;
  archivo_nombre?: string | null;
  prioridad: string;
  fecha_evento?: string | null;
  creado_en: string;
}

const API = "http://localhost:5000/api";

const CATEGORIAS = [
  "Todos",
  "Urgente",
  "Convocatoria",
  "Kermesse / Evento",
  "Deportes",
  "Informativo",
];

export default function ComunicadosPage() {
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal Crear / Editar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    titulo: "",
    categoria: "Informativo",
    descripcion: "",
    prioridad: "Normal",
    fecha_evento: "",
    imagen_url: "" as string | null,
    archivo_nombre: "" as string | null,
  });

  // Modal visor de imagen / documento en alta resolución
  const [viewerModal, setViewerModal] = useState<{
    open: boolean;
    comunicado: Comunicado | null;
  }>({
    open: false,
    comunicado: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar comunicados
  const fetchComunicados = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/comunicados`);
      if (res.ok) {
        const data = await res.json();
        setComunicados(data);
      }
    } catch (error) {
      console.error("Error al cargar comunicados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComunicados();
  }, []);

  // Manejo de archivo (imagen o documento escaneado) -> Convertir a base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert("El archivo no debe exceder los 15MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        imagen_url: reader.result as string,
        archivo_nombre: file.name,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({
      ...prev,
      imagen_url: null,
      archivo_nombre: null,
    }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      titulo: "",
      categoria: "Informativo",
      descripcion: "",
      prioridad: "Normal",
      fecha_evento: "",
      imagen_url: null,
      archivo_nombre: null,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (c: Comunicado) => {
    setEditingId(c.id);
    setFormData({
      titulo: c.titulo,
      categoria: c.categoria || "Informativo",
      descripcion: c.descripcion,
      prioridad: c.prioridad || "Normal",
      fecha_evento: c.fecha_evento || "",
      imagen_url: c.imagen_url || null,
      archivo_nombre: c.archivo_nombre || null,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titulo.trim() || !formData.descripcion.trim()) {
      alert("Por favor complete el título y la descripción.");
      return;
    }

    setSubmitting(true);
    try {
      const isEditing = editingId !== null;
      const url = isEditing
        ? `${API}/comunicados/${editingId}`
        : `${API}/comunicados`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await fetchComunicados();
        setIsModalOpen(false);
        setEditingId(null);
      } else {
        alert("Error al guardar el comunicado.");
      }
    } catch (error) {
      console.error("Error al guardar comunicado:", error);
      alert("Error de conexión al servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, titulo: string) => {
    if (!confirm(`¿Seguro que desea eliminar el comunicado:\n"${titulo}"?`))
      return;
    try {
      const res = await fetch(`${API}/comunicados/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setComunicados((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert("Error al eliminar el comunicado.");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  // Función para descargar imagen / documento adjunto
  const handleDownload = (comunicado: Comunicado) => {
    if (!comunicado.imagen_url) return;
    const link = document.createElement("a");
    link.href = comunicado.imagen_url;
    link.download =
      comunicado.archivo_nombre ||
      `comunicado_${comunicado.id}_${comunicado.titulo.replace(/\s+/g, "_")}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtrado de comunicados
  const comunicadosFiltrados = comunicados.filter((c) => {
    const matchCat =
      filtroCategoria === "Todos" ||
      c.categoria.toLowerCase() === filtroCategoria.toLowerCase() ||
      (filtroCategoria === "Urgente" && c.prioridad === "Urgente");
    const matchSearch =
      c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <main className="max-w-[1280px] mx-auto p-4 md:p-8 min-h-screen">
      {/* Header de la página */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="material-symbols-outlined text-[#00288e] text-3xl"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              campaign
            </span>
            <h1 className="text-3xl font-bold text-[#191c1e] tracking-tight">
              Comunicados y Avisos
            </h1>
          </div>
          <p className="text-[#444653] text-sm md:text-base max-w-2xl">
            Publica carteles de kermesses, citaciones firmadas, convocatorias a
            marchas, campeonatos deportivos y avisos oficiales para toda la OTB.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#00288e] text-white rounded-xl font-bold hover:bg-[#1e40af] transition-all active:scale-95 shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Publicar Comunicado</span>
          </button>
        </div>
      </div>

      {/* Grid Principal (Bento Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Feed de Comunicados (8 columnas) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Barra de Filtros y Búsqueda */}
          <div className="bg-white p-4 rounded-2xl border border-[#c4c5d5] shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Buscador */}
            <div className="relative w-full md:w-80">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#757684]">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar comunicado o convocatoria..."
                className="w-full pl-10 pr-4 py-2 bg-[#f2f4f6] rounded-xl border border-[#c4c5d5] focus:border-[#00288e] outline-none text-sm"
              />
            </div>

            {/* Chips de categorías */}
            <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
              {CATEGORIAS.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFiltroCategoria(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    filtroCategoria === cat
                      ? "bg-[#00288e] text-white shadow-sm"
                      : "bg-[#f2f4f6] text-[#444653] hover:bg-[#e6e8ea]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de Comunicados */}
          {loading ? (
            <div className="bg-white rounded-2xl border border-[#c4c5d5] p-12 text-center shadow-sm">
              <span className="material-symbols-outlined animate-spin text-[#00288e] text-4xl">
                sync
              </span>
              <p className="text-sm text-[#444653] mt-2">
                Cargando comunicados...
              </p>
            </div>
          ) : comunicadosFiltrados.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#c4c5d5] p-12 text-center shadow-sm">
              <span className="material-symbols-outlined text-[#757684] text-5xl mb-2">
                announcement
              </span>
              <h3 className="text-lg font-bold text-[#191c1e]">
                No hay comunicados disponibles
              </h3>
              <p className="text-sm text-[#444653] mt-1 max-w-sm mx-auto">
                No se encontraron avisos que coincidan con los filtros
                seleccionados.
              </p>
              <button
                onClick={openCreateModal}
                className="mt-4 px-4 py-2 bg-[#00288e] text-white rounded-lg text-sm font-semibold hover:bg-[#1e40af] transition-all cursor-pointer"
              >
                + Crear el primer comunicado
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {comunicadosFiltrados.map((c) => {
                const esUrgente =
                  c.prioridad === "Urgente" || c.categoria === "Urgente";
                return (
                  <article
                    key={c.id}
                    className={`bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-all ${
                      esUrgente
                        ? "border-red-300 ring-1 ring-red-200"
                        : "border-[#c4c5d5]"
                    }`}
                  >
                    {/* Header de la tarjeta */}
                    <div className="p-5 md:p-6">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                              esUrgente
                                ? "bg-[#ffdad6] text-[#ba1a1a]"
                                : c.categoria === "Convocatoria"
                                ? "bg-amber-100 text-amber-900"
                                : c.categoria === "Deportes"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-[#dde1ff] text-[#00288e]"
                            }`}
                          >
                            <span
                              className="material-symbols-outlined text-2xl"
                              style={{
                                fontVariationSettings: esUrgente
                                  ? '"FILL" 1'
                                  : '"FILL" 0',
                              }}
                            >
                              {esUrgente
                                ? "warning"
                                : c.categoria === "Convocatoria"
                                ? "assignment"
                                : c.categoria === "Deportes"
                                ? "sports_soccer"
                                : c.categoria === "Kermesse / Evento"
                                ? "celebration"
                                : "campaign"}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                  esUrgente
                                    ? "bg-[#ffdad6] text-[#ba1a1a]"
                                    : "bg-[#e6e8ea] text-[#191c1e]"
                                }`}
                              >
                                {c.categoria}
                              </span>
                              {c.prioridad && c.prioridad !== "Normal" && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                                  Prioridad {c.prioridad}
                                </span>
                              )}
                              {c.fecha_evento && (
                                <span className="text-xs text-[#00288e] font-semibold bg-[#dde1ff]/50 px-2 py-0.5 rounded">
                                  📅 {c.fecha_evento}
                                </span>
                              )}
                            </div>
                            <h2 className="text-xl font-bold text-[#191c1e] mt-1">
                              {c.titulo}
                            </h2>
                          </div>
                        </div>

                        <span className="text-xs text-[#757684] shrink-0">
                          {new Date(c.creado_en).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Texto del comunicado */}
                      <p className="text-[#444653] text-sm md:text-base leading-relaxed whitespace-pre-line mb-4">
                        {c.descripcion}
                      </p>

                      {/* Archivo adjunto: Cartel / Citación firmada */}
                      {c.imagen_url && (
                        <div className="mb-4 bg-[#f7f9fb] p-3 rounded-xl border border-[#c4c5d5] flex flex-col sm:flex-row items-center gap-4">
                          {/* Miniatura si es imagen */}
                          <div
                            onClick={() =>
                              setViewerModal({ open: true, comunicado: c })
                            }
                            className="relative w-full sm:w-48 h-36 rounded-lg overflow-hidden bg-slate-200 shrink-0 cursor-pointer group shadow-inner"
                          >
                            <img
                              src={c.imagen_url}
                              alt={c.titulo}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-1 font-semibold text-xs">
                              <span className="material-symbols-outlined text-sm">
                                zoom_in
                              </span>
                              Ampliar
                            </div>
                          </div>

                          <div className="flex-1 w-full space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-[#00288e]">
                                description
                              </span>
                              <div className="overflow-hidden">
                                <p className="text-xs font-bold text-[#191c1e] truncate">
                                  {c.archivo_nombre ||
                                    "Documento / Cartel Adjunto"}
                                </p>
                                <p className="text-[11px] text-[#757684]">
                                  Archivo de respaldo oficial / firmado
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-2 flex-wrap">
                              <button
                                onClick={() =>
                                  setViewerModal({ open: true, comunicado: c })
                                }
                                className="px-3 py-1.5 bg-[#00288e] text-white rounded-lg text-xs font-semibold hover:bg-[#1e40af] transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-sm">
                                  visibility
                                </span>
                                Ver Imagen / Documento
                              </button>
                              <button
                                onClick={() => handleDownload(c)}
                                className="px-3 py-1.5 bg-white border border-[#c4c5d5] text-[#191c1e] rounded-lg text-xs font-semibold hover:bg-[#f2f4f6] transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-sm">
                                  download
                                </span>
                                Descargar
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Footer de la tarjeta con acciones administrativas */}
                      <div className="flex items-center justify-between pt-3 border-t border-[#c4c5d5] text-xs text-[#757684]">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">
                            verified
                          </span>
                          Publicado por la Directiva OTB
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(c)}
                            title="Editar comunicado"
                            className="px-2.5 py-1 text-[#00288e] hover:bg-[#dde1ff]/40 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-base">
                              edit
                            </span>
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(c.id, c.titulo)}
                            title="Eliminar comunicado"
                            className="px-2.5 py-1 text-[#ba1a1a] hover:bg-red-50 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-base">
                              delete
                            </span>
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Columna Derecha: Tareas de Bloque, Resumen y Contactos (4 columnas) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Tarjeta de Tareas de Bloque / Proyectos Comunitarios */}
          <div className="bg-white rounded-2xl border border-[#c4c5d5] shadow-sm overflow-hidden">
            <div className="p-4 md:p-5 border-b border-[#c4c5d5] bg-[#f2f4f6]/60 flex items-center justify-between">
              <h2 className="font-bold text-[#191c1e] text-base flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00288e]">
                  engineering
                </span>
                Tareas de Bloque y OTB
              </h2>
              <span className="w-6 h-6 rounded-full bg-[#00288e] text-white text-xs flex items-center justify-center font-bold">
                3
              </span>
            </div>

            <div className="divide-y divide-[#c4c5d5]">
              {/* Tarea 1 */}
              <div className="p-4 hover:bg-[#f7f9fb] transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[11px] font-bold uppercase rounded">
                    En Progreso
                  </span>
                  <span className="text-xs text-[#757684]">Mz. 2 y 3</span>
                </div>
                <h4 className="font-semibold text-sm text-[#191c1e] mb-1">
                  Limpieza y Desmalezado de Cancha
                </h4>
                <p className="text-xs text-[#444653] mb-2">
                  Coordinador: Vecino Carlos V.
                </p>
                <div className="w-full bg-[#e6e8ea] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#00288e] h-full transition-all duration-500"
                    style={{ width: "65%" }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-[11px]">
                  <span className="text-[#757684]">Avance</span>
                  <span className="font-bold text-[#00288e]">65%</span>
                </div>
              </div>

              {/* Tarea 2 */}
              <div className="p-4 hover:bg-[#f7f9fb] transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <span className="px-2 py-0.5 bg-[#DCFCE7] text-[#166534] text-[11px] font-bold uppercase rounded">
                    Completado
                  </span>
                  <span className="text-xs text-[#757684]">General</span>
                </div>
                <h4 className="font-semibold text-sm text-[#191c1e] mb-1">
                  Mantenimiento de Bomba de Agua
                </h4>
                <p className="text-xs text-[#444653] mb-1">
                  Empresa: Hidráulica del Sur
                </p>
                <div className="flex items-center gap-1 text-[#166534] text-xs font-semibold">
                  <span
                    className="material-symbols-outlined text-[16px]"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    check_circle
                  </span>
                  Verificado por el directorio
                </div>
              </div>

              {/* Tarea 3 */}
              <div className="p-4 hover:bg-[#f7f9fb] transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <span className="px-2 py-0.5 bg-[#e6e8ea] text-[#444653] text-[11px] font-bold uppercase rounded">
                    Pendiente
                  </span>
                  <span className="text-xs text-[#757684]">Sede Social</span>
                </div>
                <h4 className="font-semibold text-sm text-[#191c1e] mb-1">
                  Pintado de Fachada de la Sede
                </h4>
                <p className="text-xs text-[#444653]">
                  Inicio programado: Próximo fin de semana
                </p>
              </div>
            </div>
          </div>

          {/* Tarjeta Resumen de Gestión */}
          <div className="bg-[#00288e] rounded-2xl p-5 text-white relative overflow-hidden shadow-md">
            <div className="relative z-10">
              <span className="text-xs uppercase tracking-wider text-white/80 font-bold">
                Gestión OTB
              </span>
              <h3 className="text-xl font-bold mt-1 mb-4">
                Comunidad Organizada
              </h3>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                  <span className="text-2xl font-extrabold block">
                    {comunicados.length}
                  </span>
                  <span className="text-xs text-white/80">
                    Avisos publicados
                  </span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                  <span className="text-2xl font-extrabold block">100%</span>
                  <span className="text-xs text-white/80">Transparencia</span>
                </div>
              </div>

              <p className="text-xs text-white/80 leading-relaxed">
                Todos los documentos y citaciones oficiales se conservan
                digitalmente con acceso para la directiva y vecinos.
              </p>
            </div>
          </div>

          {/* Contactos de Emergencia */}
          <div className="bg-white rounded-2xl border border-[#c4c5d5] shadow-sm p-5">
            <h3 className="font-bold text-[#191c1e] text-base mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ba1a1a]">
                emergency
              </span>
              Contactos de Emergencia
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f2f4f6] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">
                      local_police
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#191c1e]">
                      Policía (Módulo OTB)
                    </p>
                    <p className="text-[11px] text-[#757684]">
                      Radio Patrullas
                    </p>
                  </div>
                </div>
                <a
                  href="tel:110"
                  className="text-sm font-bold text-[#00288e] hover:underline"
                >
                  110
                </a>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f2f4f6] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#DCFCE7] text-[#166534] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">
                      medical_services
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#191c1e]">
                      Ambulancia / Cruz Roja
                    </p>
                    <p className="text-[11px] text-[#757684]">Emergencias Médicas</p>
                  </div>
                </div>
                <a
                  href="tel:161"
                  className="text-sm font-bold text-[#00288e] hover:underline"
                >
                  161
                </a>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f2f4f6] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#dde1ff] text-[#00288e] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">
                      bolt
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#191c1e]">
                      Emergencias ELFEC
                    </p>
                    <p className="text-[11px] text-[#757684]">Cortes de Luz</p>
                  </div>
                </div>
                <a
                  href="tel:176"
                  className="text-sm font-bold text-[#00288e] hover:underline"
                >
                  176
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* ── Modal de Publicación / Edición ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto" role="dialog">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={() => !submitting && setIsModalOpen(false)}
            ></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-[#c4c5d5] relative z-10">
              <div className="px-6 py-6 md:px-8">
                <div className="flex items-center justify-between mb-5 border-b border-[#c4c5d5] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#00288e] text-2xl">
                      {editingId ? "edit_note" : "add_photo_alternate"}
                    </span>
                    <h3 className="text-xl font-bold text-[#191c1e]">
                      {editingId
                        ? "Editar Comunicado"
                        : "Publicar Nuevo Comunicado"}
                    </h3>
                  </div>
                  <button
                    onClick={() => !submitting && setIsModalOpen(false)}
                    className="text-[#757684] hover:bg-[#f2f4f6] p-2 rounded-full cursor-pointer"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Título */}
                  <div>
                    <label className="block text-xs font-bold text-[#191c1e] mb-1">
                      Título del Comunicado o Convocatoria *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.titulo}
                      onChange={(e) =>
                        setFormData({ ...formData, titulo: e.target.value })
                      }
                      placeholder="Ej. Kermesse Solidaria Pro-Cancha / Convocatoria a Marcha Vecinal"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#c4c5d5] bg-[#f2f4f6] focus:border-[#00288e] outline-none"
                    />
                  </div>

                  {/* Categoría y Prioridad */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#191c1e] mb-1">
                        Categoría
                      </label>
                      <select
                        value={formData.categoria}
                        onChange={(e) =>
                          setFormData({ ...formData, categoria: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm rounded-xl border border-[#c4c5d5] bg-[#f2f4f6] focus:border-[#00288e] outline-none cursor-pointer"
                      >
                        <option value="Informativo">Informativo</option>
                        <option value="Convocatoria">
                          Convocatoria / Citación
                        </option>
                        <option value="Kermesse / Evento">
                          Kermesse / Evento
                        </option>
                        <option value="Deportes">Deportes / Campeonato</option>
                        <option value="Urgente">Urgente / Alerta</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#191c1e] mb-1">
                        Prioridad
                      </label>
                      <select
                        value={formData.prioridad}
                        onChange={(e) =>
                          setFormData({ ...formData, prioridad: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm rounded-xl border border-[#c4c5d5] bg-[#f2f4f6] focus:border-[#00288e] outline-none cursor-pointer"
                      >
                        <option value="Normal">Normal</option>
                        <option value="Alta">Alta</option>
                        <option value="Urgente">Urgente</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#191c1e] mb-1">
                        Fecha / Hora de Referencia
                      </label>
                      <input
                        type="text"
                        value={formData.fecha_evento}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            fecha_evento: e.target.value,
                          })
                        }
                        placeholder="Ej. Domingo 28 Nov - 09:00"
                        className="w-full px-3 py-2 text-sm rounded-xl border border-[#c4c5d5] bg-[#f2f4f6] focus:border-[#00288e] outline-none"
                      />
                    </div>
                  </div>

                  {/* Descripción / Contenido */}
                  <div>
                    <label className="block text-xs font-bold text-[#191c1e] mb-1">
                      Descripción o Texto Completo *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.descripcion}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          descripcion: e.target.value,
                        })
                      }
                      placeholder="Escriba aquí los detalles, motivos, acuerdos, requisitos, puntos de concentración o información relevante..."
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#c4c5d5] bg-[#f2f4f6] focus:border-[#00288e] outline-none resize-none leading-relaxed"
                    />
                  </div>

                  {/* Subir Cartel / Citación firmada (Imagen) */}
                  <div>
                    <label className="block text-xs font-bold text-[#191c1e] mb-1">
                      Cartel, Folleto o Documento Firmado (Foto / Imagen / PDF)
                    </label>

                    {formData.imagen_url ? (
                      <div className="relative rounded-xl border border-[#c4c5d5] p-3 bg-[#f7f9fb] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={formData.imagen_url}
                            alt="Previsualización"
                            className="w-14 h-14 object-cover rounded-lg border border-[#c4c5d5]"
                          />
                          <div>
                            <p className="text-xs font-bold text-[#191c1e]">
                              {formData.archivo_nombre || "archivo_adjunto.jpg"}
                            </p>
                            <p className="text-[11px] text-[#166534] flex items-center gap-1 font-semibold">
                              <span className="material-symbols-outlined text-[14px]">
                                check_circle
                              </span>
                              Archivo cargado listo para publicar
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="px-3 py-1.5 text-xs text-[#ba1a1a] hover:bg-red-50 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">
                            delete
                          </span>
                          Quitar
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-[#c4c5d5] hover:border-[#00288e] rounded-xl p-6 text-center cursor-pointer transition-colors bg-[#f7f9fb]"
                      >
                        <span className="material-symbols-outlined text-3xl text-[#00288e] mb-1">
                          cloud_upload
                        </span>
                        <p className="text-xs font-bold text-[#191c1e]">
                          Haga clic aquí para subir una imagen o citación firmada
                        </p>
                        <p className="text-[11px] text-[#757684] mt-0.5">
                          Admite JPG, PNG, WEBP escaneados (hasta 15MB)
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>

                  {/* Botones de acción */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#c4c5d5]">
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#444653] hover:bg-[#f2f4f6] transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#00288e] hover:bg-[#1e40af] transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-sm">
                            sync
                          </span>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-sm">
                            publish
                          </span>
                          {editingId
                            ? "Guardar Cambios"
                            : "Publicar Comunicado"}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Visor de Documento / Cartel en Alta Resolución ── */}
      {viewerModal.open && viewerModal.comunicado && (
        <div className="fixed inset-0 z-[120] overflow-y-auto" role="dialog">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
              onClick={() => setViewerModal({ open: false, comunicado: null })}
            ></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full border border-slate-700 relative z-10">
              {/* Barra superior del visor */}
              <div className="px-6 py-4 bg-[#191c1e] text-white flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="material-symbols-outlined text-[#a8b8ff]">
                    description
                  </span>
                  <div className="truncate">
                    <h3 className="text-sm font-bold truncate">
                      {viewerModal.comunicado.titulo}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate">
                      {viewerModal.comunicado.archivo_nombre ||
                        "Documento escaneado / Cartel oficial"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDownload(viewerModal.comunicado!)}
                    className="px-3 py-1.5 bg-[#00288e] text-white rounded-lg text-xs font-semibold hover:bg-[#1e40af] flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">
                      download
                    </span>
                    Descargar
                  </button>
                  <button
                    onClick={() =>
                      setViewerModal({ open: false, comunicado: null })
                    }
                    className="p-1.5 text-slate-400 hover:text-white rounded-full transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>

              {/* Imagen central */}
              <div className="p-4 bg-slate-900 flex items-center justify-center max-h-[75vh] overflow-auto">
                {viewerModal.comunicado.imagen_url ? (
                  <img
                    src={viewerModal.comunicado.imagen_url}
                    alt={viewerModal.comunicado.titulo}
                    className="max-h-[70vh] w-auto max-w-full rounded shadow-lg object-contain"
                  />
                ) : (
                  <p className="text-slate-400 text-sm py-12">
                    No hay imagen disponible.
                  </p>
                )}
              </div>

              {/* Pie con detalles del comunicado */}
              <div className="px-6 py-4 bg-white border-t border-[#c4c5d5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#444653]">
                <div>
                  <span className="font-bold text-[#191c1e]">Categoría: </span>
                  {viewerModal.comunicado.categoria}
                  {viewerModal.comunicado.fecha_evento && (
                    <span className="ml-3">
                      <span className="font-bold text-[#191c1e]">
                        Fecha de Referencia:{" "}
                      </span>
                      {viewerModal.comunicado.fecha_evento}
                    </span>
                  )}
                </div>
                <div>
                  Publicado el{" "}
                  {new Date(
                    viewerModal.comunicado.creado_en
                  ).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
