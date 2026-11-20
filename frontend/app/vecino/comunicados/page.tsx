"use client";

import React, { useState, useEffect } from "react";

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
  "Evento",
  "Deportes",
  "Informativo",
];

export default function VecinoComunicadosPage() {
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal Visor de Documentos en Alta Resolución
  const [viewerModal, setViewerModal] = useState<{
    open: boolean;
    titulo: string;
    archivoNombre?: string;
    imagenUrl?: string | null;
    descripcion?: string;
    esCitacion?: boolean;
    fecha?: string;
  }>({
    open: false,
    titulo: "",
  });

  // Modal Inscripción de Equipo de Manzano
  const [inscribirModal, setInscribirModal] = useState(false);
  const [equipoForm, setEquipoForm] = useState({
    nombreEquipo: "",
    manzano: "D-6",
    delegado: "",
    telefono: "",
    categoria: "Varones Libre",
  });
  const [inscriptoExito, setInscriptoExito] = useState(false);

  const fetchComunicados = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/comunicados`);
      if (res.ok) {
        const data: Comunicado[] = await res.json();
        setComunicados(data);
      }
    } catch (err) {
      console.error("Error al cargar comunicados desde el backend:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComunicados();
  }, []);

  const handleDownload = (archivoNombre: string, url?: string | null) => {
    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.download = archivoNombre || "comunicado_otb.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(`Iniciando descarga del documento: ${archivoNombre}`);
    }
  };

  const handleInscribirEquipo = (e: React.FormEvent) => {
    e.preventDefault();
    setInscriptoExito(true);
    setTimeout(() => {
      setInscriptoExito(false);
      setInscribirModal(false);
      setEquipoForm({
        nombreEquipo: "",
        manzano: "D-6",
        delegado: "",
        telefono: "",
        categoria: "Varones Libre",
      });
      alert("¡Equipo registrado con éxito para el Torneo de la OTB!");
    }, 1200);
  };

  // Filtrado dinámico de comunicados cargados de la base de datos
  const comunicadosFiltrados = comunicados.filter((c) => {
    const catLower = (c.categoria || "").toLowerCase();
    const filtroLower = filtroCategoria.toLowerCase();

    const matchCat =
      filtroCategoria === "Todos" ||
      catLower.includes(filtroLower) ||
      (filtroCategoria === "Urgente" && (c.prioridad === "Urgente" || catLower.includes("urgente"))) ||
      (filtroCategoria === "Evento" && (catLower.includes("evento") || catLower.includes("kermesse"))) ||
      (filtroCategoria === "Convocatoria" && catLower.includes("convocatoria"));

    const searchLower = searchTerm.toLowerCase();
    const matchSearch =
      (c.titulo || "").toLowerCase().includes(searchLower) ||
      (c.descripcion || "").toLowerCase().includes(searchLower) ||
      (c.categoria || "").toLowerCase().includes(searchLower);

    return matchCat && matchSearch;
  });

  // Documento más reciente que tenga archivo o imagen para el visor de la barra lateral
  const documentoDestacado =
    comunicados.find((c) => c.imagen_url || c.archivo_nombre) || comunicados[0] || null;

  // Lista de archivos recientes reales cargados por el administrador
  const archivosRecientes = comunicados.filter(
    (c) => c.archivo_nombre || c.imagen_url
  );

  return (
    <main className="max-w-[1280px] mx-auto p-4 md:p-8 min-h-screen space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="material-symbols-outlined text-[#00288e] text-3xl"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              campaign
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#00288e] tracking-tight">
              Cartelera de Comunicados y Citaciones
            </h1>
          </div>
          <p className="text-[#444653] text-sm md:text-base max-w-2xl leading-relaxed">
            Tablón oficial de la Directiva OTB Villa Calama: citaciones con sello, avisos de
            servicios básicos, actividades comunales y documentos escaneados.
          </p>
        </div>

        {/* Buscador y Filtros */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#757684] text-sm">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar comunicado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-[#f2f4f6] border border-[#c4c5d5] rounded-xl text-xs outline-none focus:border-[#00288e] focus:bg-white transition-all w-full sm:w-48"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-[#f2f4f6] p-1.5 rounded-2xl border border-[#c4c5d5]">
            {CATEGORIAS.map((cat) => {
              const isSelected = filtroCategoria === cat;
              const isUrgente = cat === "Urgente";
              return (
                <button
                  key={cat}
                  onClick={() => setFiltroCategoria(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    isSelected
                      ? isUrgente
                        ? "bg-[#ba1a1a] text-white shadow-sm"
                        : "bg-[#00288e] text-white shadow-sm"
                      : isUrgente
                      ? "bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ffdad6]/80"
                      : "text-[#444653] hover:bg-white"
                  }`}
                >
                  {isUrgente && (
                    <span className="material-symbols-outlined text-sm">
                      priority_high
                    </span>
                  )}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Bento Grid Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLUMNA PRINCIPAL: FEED DINÁMICO DE COMUNICADOS (8 columnas) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#191c1e] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00288e]">
                campaign
              </span>
              Comunicados Oficiales
            </h2>
            <span className="text-xs text-[#757684] font-semibold bg-[#f2f4f6] px-3 py-1 rounded-full border border-[#c4c5d5]">
              {loading
                ? "Actualizando..."
                : `${comunicadosFiltrados.length} ${
                    comunicadosFiltrados.length === 1 ? "publicación" : "publicaciones"
                  }`}
            </span>
          </div>

          {/* SKELETON LOADER */}
          {loading && (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-[#c4c5d5] p-6 animate-pulse space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-200"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                      <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                    </div>
                  </div>
                  <div className="h-16 bg-slate-100 rounded"></div>
                </div>
              ))}
            </div>
          )}

          {/* ESTADO VACÍO */}
          {!loading && comunicadosFiltrados.length === 0 && (
            <div className="bg-white rounded-2xl border border-[#c4c5d5] p-12 text-center shadow-xs">
              <div className="w-16 h-16 rounded-full bg-[#dde1ff] text-[#00288e] flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-3xl">inbox</span>
              </div>
              <h3 className="font-bold text-base text-[#191c1e]">
                No hay comunicados en esta categoría
              </h3>
              <p className="text-xs text-[#757684] max-w-sm mx-auto mt-1">
                La directiva de la OTB no ha publicado avisos bajo este filtro o término de búsqueda.
              </p>
              {filtroCategoria !== "Todos" && (
                <button
                  onClick={() => setFiltroCategoria("Todos")}
                  className="mt-4 px-4 py-2 bg-[#00288e] text-white rounded-xl text-xs font-bold hover:bg-[#1e40af] transition-colors cursor-pointer"
                >
                  Ver todos los comunicados
                </button>
              )}
            </div>
          )}

          {/* RENDERIZADO DINÁMICO DE COMUNICADOS DE LA BASE DE DATOS */}
          {!loading &&
            comunicadosFiltrados.map((c) => {
              const esUrgente =
                c.prioridad === "Urgente" ||
                c.prioridad === "Alta" ||
                c.categoria.toLowerCase().includes("urgente");
              const esDeporte =
                c.categoria.toLowerCase().includes("deporte") ||
                c.titulo.toLowerCase().includes("fútbol") ||
                c.titulo.toLowerCase().includes("campeonato");

              const fechaFormateada = new Date(c.creado_en).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              });

              return (
                <article
                  key={c.id}
                  className={`bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all p-5 md:p-6 space-y-4 ${
                    esUrgente
                      ? "border-2 border-red-300 ring-1 ring-red-100"
                      : "border border-[#c4c5d5]"
                  }`}
                >
                  {/* Barra superior con Badges (Categoría a la izquierda, Fecha a la derecha) */}
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-xl text-xs font-bold ${
                          esUrgente
                            ? "bg-red-100 text-red-800 border border-red-200"
                            : "bg-[#dde1ff] text-[#00288e] border border-[#00288e]/15"
                        }`}
                      >
                        {c.categoria}
                      </span>
                      {c.prioridad && c.prioridad !== "Normal" && (
                        <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                          {c.prioridad}
                        </span>
                      )}
                    </div>

                    <span className="text-xs text-[#757684] font-medium flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-[#757684]">
                        calendar_today
                      </span>
                      {fechaFormateada}
                    </span>
                  </div>

                  {/* Título institucional */}
                  <h3 className="text-lg md:text-xl font-bold text-[#191c1e] tracking-tight leading-snug">
                    {c.titulo}
                  </h3>

                  {/* Imagen / Documento con tamaño determinado y visible al 100% (sin recortes) */}
                  {c.imagen_url && (
                    <div className="w-full flex items-center justify-center bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-3 my-2 overflow-hidden shadow-2xs group relative">
                      <img
                        src={c.imagen_url}
                        alt={c.titulo}
                        className="max-h-[380px] sm:max-h-[420px] w-auto max-w-full object-contain rounded-xl transition-transform duration-300 group-hover:scale-[1.01]"
                      />
                      <button
                        onClick={() =>
                          setViewerModal({
                            open: true,
                            titulo: c.titulo,
                            archivoNombre: c.archivo_nombre || `${c.titulo}.jpg`,
                            imagenUrl: c.imagen_url,
                            descripcion: c.descripcion,
                            fecha: c.creado_en,
                          })
                        }
                        className="absolute bottom-4 right-4 bg-black/60 hover:bg-[#00288e] text-white p-2 rounded-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1.5 text-xs font-semibold shadow-md cursor-pointer"
                        title="Pantalla completa"
                      >
                        <span className="material-symbols-outlined text-sm">fullscreen</span>
                        <span>Ampliar</span>
                      </button>
                    </div>
                  )}

                  {/* Texto del Comunicado */}
                  <p className="text-sm text-[#444653] leading-relaxed whitespace-pre-line">
                    {c.descripcion}
                  </p>

                  {/* Badge de fecha de evento si existe */}
                  {c.fecha_evento && (
                    <div className="bg-[#dde1ff]/30 rounded-xl p-3 flex items-center gap-2.5 border border-[#00288e]/15 text-xs font-semibold text-[#00288e]">
                      <span className="material-symbols-outlined text-base">
                        event_upcoming
                      </span>
                      <span>
                        <strong>Fecha programada:</strong> {c.fecha_evento}
                      </span>
                    </div>
                  )}

                  {/* Archivo adjunto oficial si no tiene imagen */}
                  {c.archivo_nombre && !c.imagen_url && (
                    <div className="bg-[#f2f4f6] border border-[#c4c5d5] rounded-xl p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="material-symbols-outlined text-[#00288e] text-xl shrink-0">
                          description
                        </span>
                        <span className="text-xs font-bold text-[#191c1e] truncate">
                          {c.archivo_nombre}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDownload(c.archivo_nombre || "archivo.pdf")}
                        className="px-3 py-1.5 bg-[#00288e] text-white rounded-lg text-xs font-bold hover:bg-[#1e40af] flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">download</span>
                        Descargar
                      </button>
                    </div>
                  )}

                  {/* Barra de acciones inferior: diseño propio y exclusivo para la OTB */}
                  <div className="pt-3 border-t border-[#c4c5d5]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-[#757684]">
                      <div className="w-7 h-7 rounded-lg bg-[#dde1ff] text-[#00288e] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-sm">verified_user</span>
                      </div>
                      <span className="font-medium text-[11px] truncate max-w-[220px]">
                        {c.archivo_nombre ? c.archivo_nombre : "Directiva OTB Villa Calama"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() =>
                          setViewerModal({
                            open: true,
                            titulo: c.titulo,
                            archivoNombre: c.archivo_nombre || `${c.titulo}.jpg`,
                            imagenUrl: c.imagen_url,
                            descripcion: c.descripcion,
                            fecha: c.creado_en,
                          })
                        }
                        className="px-4 py-2 bg-white hover:bg-[#f2f4f6] text-[#00288e] border border-[#c4c5d5] hover:border-[#00288e] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-sm"
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        <span>Ver en Grande</span>
                      </button>

                      <button
                        onClick={() =>
                          handleDownload(
                            c.archivo_nombre || `${c.titulo}.jpg`,
                            c.imagen_url
                          )
                        }
                        className="px-4 py-2 bg-[#00288e] hover:bg-[#1e40af] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-98"
                      >
                        <span className="material-symbols-outlined text-sm">download</span>
                        <span>Descargar</span>
                      </button>

                      {esDeporte && (
                        <button
                          onClick={() => setInscribirModal(true)}
                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
                        >
                          <span className="material-symbols-outlined text-sm">sports_soccer</span>
                          <span>Inscribir Equipo</span>
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
        </div>

        {/* ── COLUMNA LATERAL (4 columnas) ── */}
        <aside className="lg:col-span-4 space-y-6">
          {/* VISOR DE DOCUMENTO EN ALTA RESOLUCIÓN INTEGRADO */}
          <div className="bg-white rounded-2xl border border-[#c4c5d5] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#c4c5d5] bg-[#f2f4f6] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00288e]">
                  picture_as_pdf
                </span>
                <h3 className="font-bold text-sm text-[#191c1e]">
                  Visor de Documentos OTB
                </h3>
              </div>
              <span className="px-2 py-0.5 bg-[#DCFCE7] text-[#166534] text-[10px] font-extrabold rounded-full">
                ALTA RESOLUCIÓN
              </span>
            </div>

            <div className="p-4 bg-[#f7f9fb]">
              {documentoDestacado ? (
                <div className="bg-white border-2 border-[#c4c5d5] rounded-xl shadow-sm overflow-hidden relative group">
                  <div className="bg-[#e6e8ea] px-3 py-2 border-b border-[#c4c5d5] flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#191c1e] truncate max-w-[180px]">
                      {documentoDestacado.archivo_nombre || `${documentoDestacado.titulo}.jpg`}
                    </span>
                    <button
                      onClick={() =>
                        setViewerModal({
                          open: true,
                          titulo: documentoDestacado.titulo,
                          archivoNombre: documentoDestacado.archivo_nombre || "documento.pdf",
                          imagenUrl: documentoDestacado.imagen_url,
                          descripcion: documentoDestacado.descripcion,
                          esCitacion: documentoDestacado.categoria.includes("Convocatoria"),
                          fecha: documentoDestacado.creado_en,
                        })
                      }
                      title="Pantalla Completa"
                      className="material-symbols-outlined text-sm cursor-pointer hover:text-[#00288e]"
                    >
                      fullscreen
                    </button>
                  </div>

                  {/* Vista preliminar del documento o facsímil oficial */}
                  {documentoDestacado.imagen_url ? (
                    <div
                      onClick={() =>
                        setViewerModal({
                          open: true,
                          titulo: documentoDestacado.titulo,
                          archivoNombre: documentoDestacado.archivo_nombre || "documento.jpg",
                          imagenUrl: documentoDestacado.imagen_url,
                          descripcion: documentoDestacado.descripcion,
                          esCitacion: documentoDestacado.categoria.includes("Convocatoria"),
                          fecha: documentoDestacado.creado_en,
                        })
                      }
                      className="cursor-pointer max-h-52 overflow-hidden relative flex items-center justify-center bg-slate-50 p-2"
                    >
                      <img
                        src={documentoDestacado.imagen_url}
                        alt={documentoDestacado.titulo}
                        className="max-h-48 w-auto max-w-full object-contain hover:opacity-90 transition-opacity rounded"
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() =>
                        setViewerModal({
                          open: true,
                          titulo: documentoDestacado.titulo,
                          archivoNombre: documentoDestacado.archivo_nombre || "documento.pdf",
                          descripcion: documentoDestacado.descripcion,
                          esCitacion: true,
                          fecha: documentoDestacado.creado_en,
                        })
                      }
                      className="p-5 space-y-2 bg-amber-50/40 text-[#191c1e] font-serif text-[11px] leading-snug border-b border-dashed border-[#c4c5d5] cursor-pointer hover:bg-amber-50/70 transition-colors"
                    >
                      <div className="text-center border-b border-slate-300 pb-2">
                        <p className="font-bold text-[12px] text-[#00288e] uppercase tracking-wide">
                          ORGANIZACIÓN TERRITORIAL DE BASE
                        </p>
                        <p className="text-[10px] text-[#757684]">
                          Villa Calama • Cochabamba
                        </p>
                      </div>
                      <p className="font-bold text-[11px] pt-1 text-center text-[#ba1a1a]">
                        {documentoDestacado.titulo}
                      </p>
                      <p className="text-justify text-[10px] text-slate-700 line-clamp-3">
                        {documentoDestacado.descripcion}
                      </p>
                    </div>
                  )}

                  <div className="p-2.5 bg-white flex items-center justify-between text-xs border-t border-slate-100">
                    <span className="text-[#757684]">Documento Oficial</span>
                    <button
                      onClick={() =>
                        setViewerModal({
                          open: true,
                          titulo: documentoDestacado.titulo,
                          archivoNombre: documentoDestacado.archivo_nombre || "documento.pdf",
                          imagenUrl: documentoDestacado.imagen_url,
                          descripcion: documentoDestacado.descripcion,
                          esCitacion: documentoDestacado.categoria.includes("Convocatoria"),
                          fecha: documentoDestacado.creado_en,
                        })
                      }
                      className="text-[#00288e] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                      Abrir documento
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-6">
                  No hay documentos adjuntos recientes.
                </p>
              )}
            </div>

            {/* Archivos Recientes de la Directiva dinámicos */}
            <div className="p-4 border-t border-[#c4c5d5] space-y-2">
              <p className="text-xs font-bold text-[#191c1e]">
                Archivos Recientes de la Directiva:
              </p>
              <ul className="space-y-1.5 text-xs">
                {archivosRecientes.length > 0 ? (
                  archivosRecientes.map((c) => (
                    <li
                      key={c.id}
                      className="flex items-center justify-between p-2 hover:bg-[#f2f4f6] rounded-xl transition-colors"
                    >
                      <span className="flex items-center gap-2 text-[#191c1e] truncate max-w-[200px]">
                        <span className="material-symbols-outlined text-[#00288e] text-base shrink-0">
                          description
                        </span>
                        <span className="truncate">
                          {c.archivo_nombre || `${c.titulo}.pdf`}
                        </span>
                      </span>
                      <button
                        onClick={() =>
                          setViewerModal({
                            open: true,
                            titulo: c.titulo,
                            archivoNombre: c.archivo_nombre || `${c.titulo}.pdf`,
                            imagenUrl: c.imagen_url,
                            descripcion: c.descripcion,
                          })
                        }
                        className="text-[#00288e] font-bold hover:underline cursor-pointer shrink-0 ml-2"
                      >
                        Ver
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="text-[11px] text-slate-400 italic py-1">
                    No hay archivos adjuntos en el tablón.
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* TARJETA DE CANALES OFICIALES OTB */}
          <div className="bg-white rounded-2xl border border-[#c4c5d5] shadow-sm p-6">
            <h3 className="font-bold text-base text-[#191c1e] mb-4">
              Canales Oficiales OTB
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-[#f2f4f6] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#DCFCE7] flex items-center justify-center text-[#166534]">
                    <span className="material-symbols-outlined text-lg">chat</span>
                  </div>
                  <span className="text-xs font-semibold text-[#191c1e]">
                    Grupo WhatsApp OTB
                  </span>
                </div>
                <span className="text-[#166534] font-bold text-xs bg-[#DCFCE7] px-2.5 py-0.5 rounded-full">
                  Activo
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-[#f2f4f6] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#dde1ff] flex items-center justify-center text-[#00288e]">
                    <span className="material-symbols-outlined text-lg">phone_in_talk</span>
                  </div>
                  <span className="text-xs font-semibold text-[#191c1e]">Mesa Directiva</span>
                </div>
                <a
                  href="tel:76912245"
                  className="text-[#00288e] font-bold text-xs hover:underline"
                >
                  769-12245
                </a>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-[#f2f4f6] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a]">
                    <span className="material-symbols-outlined text-lg">local_police</span>
                  </div>
                  <span className="text-xs font-semibold text-[#191c1e]">Policía Módulo 12</span>
                </div>
                <a href="tel:110" className="text-[#ba1a1a] font-bold text-xs hover:underline">
                  110
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* ── MODAL VISOR EN ALTA RESOLUCIÓN ── */}
      {viewerModal.open && (
        <div className="fixed inset-0 z-[120] overflow-y-auto" role="dialog">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setViewerModal({ open: false, titulo: "" })}
            ></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full border border-slate-700 relative z-10">
              {/* Barra del visor */}
              <div className="px-6 py-4 bg-[#191c1e] text-white flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="material-symbols-outlined text-[#6cf8bb]">description</span>
                  <div className="truncate">
                    <h3 className="text-sm font-bold truncate">{viewerModal.titulo}</h3>
                    <p className="text-[11px] text-slate-400 truncate">
                      {viewerModal.archivoNombre || "Documento Oficial OTB Villa Calama"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleDownload(
                        viewerModal.archivoNombre || "documento_otb.pdf",
                        viewerModal.imagenUrl
                      )
                    }
                    className="px-3 py-1.5 bg-[#00288e] text-white rounded-lg text-xs font-semibold hover:bg-[#1e40af] flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    Descargar
                  </button>
                  <button
                    onClick={() => setViewerModal({ open: false, titulo: "" })}
                    className="p-1.5 text-slate-400 hover:text-white rounded-full cursor-pointer"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>

              {/* Contenido del visor */}
              <div className="p-6 bg-slate-900 flex items-center justify-center min-h-[420px] max-h-[75vh] overflow-auto">
                {viewerModal.imagenUrl ? (
                  <img
                    src={viewerModal.imagenUrl}
                    alt={viewerModal.titulo}
                    className="max-h-[65vh] w-auto rounded shadow-2xl object-contain"
                  />
                ) : (
                  /* Facsímil nítido de citación firmada */
                  <div className="bg-amber-50/95 text-slate-900 p-8 rounded-xl shadow-2xl max-w-xl w-full font-serif border border-amber-200 space-y-4">
                    <div className="text-center border-b-2 border-slate-800 pb-3">
                      <h2 className="text-lg font-black uppercase text-[#00288e] tracking-wider">
                        ORGANIZACIÓN TERRITORIAL DE BASE
                      </h2>
                      <p className="text-xs font-sans text-slate-600 font-bold">
                        VILLA CALAMA — COCHABAMBA, BOLIVIA
                      </p>
                      <p className="text-[10px] font-sans text-slate-500">
                        Personería Jurídica N° 342/2011
                      </p>
                    </div>

                    <div className="py-2 text-center">
                      <span className="px-4 py-1 bg-red-100 text-[#ba1a1a] text-xs font-sans font-extrabold rounded-full uppercase tracking-wider">
                        DOCUMENTO OFICIAL DE LA DIRECTIVA
                      </span>
                    </div>

                    <h3 className="font-bold text-center text-sm text-slate-900">
                      {viewerModal.titulo}
                    </h3>

                    <p className="text-xs text-justify leading-relaxed whitespace-pre-line">
                      {viewerModal.descripcion ||
                        "Documento emitido y homologado por el Directorio de la Junta Vecinal de la OTB Villa Calama para conocimiento de todos los propietarios y vecinos."}
                    </p>

                    <div className="flex items-center justify-around pt-8">
                      <div className="text-center">
                        <div className="w-32 border-b-2 border-slate-800 mx-auto mb-1"></div>
                        <p className="text-xs font-sans font-bold">Lic. Carlos Meneses</p>
                        <p className="text-[10px] font-sans text-slate-500">Presidente OTB</p>
                      </div>

                      <div className="w-20 h-20 rounded-full border-2 border-[#ba1a1a] flex flex-col items-center justify-center text-center p-1 text-[#ba1a1a] rotate-[-10deg]">
                        <span className="text-[8px] font-black uppercase leading-none">
                          OTB COCHABAMBA
                        </span>
                        <span className="material-symbols-outlined text-lg">verified</span>
                        <span className="text-[7px] font-bold">JUNTA VECINAL</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL INSCRIPCIÓN DE EQUIPO (FÚTBOL) ── */}
      {inscribirModal && (
        <div className="fixed inset-0 z-[120] overflow-y-auto" role="dialog">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setInscribirModal(false)}
            ></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full border border-[#c4c5d5] relative z-10 p-6">
              <div className="flex justify-between items-center mb-4 border-b border-[#c4c5d5] pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-700">sports_soccer</span>
                  <h3 className="font-bold text-base text-[#191c1e]">
                    Inscripción de Equipo al Campeonato
                  </h3>
                </div>
                <button
                  onClick={() => setInscribirModal(false)}
                  className="text-[#757684] hover:bg-[#f2f4f6] p-1.5 rounded-full cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleInscribirEquipo} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-[#191c1e] block mb-1">
                    Nombre del Equipo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Los Halcones del Mz D"
                    value={equipoForm.nombreEquipo}
                    onChange={(e) =>
                      setEquipoForm({ ...equipoForm, nombreEquipo: e.target.value })
                    }
                    className="w-full h-10 px-3 border border-[#c4c5d5] rounded-xl bg-[#f2f4f6] text-xs focus:border-[#00288e] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-[#191c1e] block mb-1">
                      Manzano Representado
                    </label>
                    <input
                      type="text"
                      value={equipoForm.manzano}
                      onChange={(e) =>
                        setEquipoForm({ ...equipoForm, manzano: e.target.value })
                      }
                      className="w-full h-10 px-3 border border-[#c4c5d5] rounded-xl bg-[#f2f4f6] text-xs focus:border-[#00288e] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#191c1e] block mb-1">
                      Categoría
                    </label>
                    <select
                      value={equipoForm.categoria}
                      onChange={(e) =>
                        setEquipoForm({ ...equipoForm, categoria: e.target.value })
                      }
                      className="w-full h-10 px-2 border border-[#c4c5d5] rounded-xl bg-[#f2f4f6] text-xs focus:border-[#00288e] outline-none cursor-pointer"
                    >
                      <option value="Varones Libre">Varones Libre</option>
                      <option value="Mujeres Libre">Mujeres Libre</option>
                      <option value="Senior (+35)">Senior (+35)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#191c1e] block mb-1">
                    Nombre del Delegado / Capitán *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Roberto Mendoza"
                    value={equipoForm.delegado}
                    onChange={(e) =>
                      setEquipoForm({ ...equipoForm, delegado: e.target.value })
                    }
                    className="w-full h-10 px-3 border border-[#c4c5d5] rounded-xl bg-[#f2f4f6] text-xs focus:border-[#00288e] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#191c1e] block mb-1">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 70712345"
                    value={equipoForm.telefono}
                    onChange={(e) =>
                      setEquipoForm({ ...equipoForm, telefono: e.target.value })
                    }
                    className="w-full h-10 px-3 border border-[#c4c5d5] rounded-xl bg-[#f2f4f6] text-xs focus:border-[#00288e] outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-[#c4c5d5] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setInscribirModal(false)}
                    className="px-4 py-2 border border-[#c4c5d5] text-[#444653] rounded-xl text-xs font-semibold hover:bg-[#f2f4f6] cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#00288e] text-white rounded-xl text-xs font-bold hover:bg-[#1e40af] transition-all cursor-pointer shadow-sm"
                  >
                    {inscriptoExito ? "Inscribiendo..." : "Confirmar Inscripción"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
