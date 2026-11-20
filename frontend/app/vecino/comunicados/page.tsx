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
  "Urgentes",
  "Kermesse",
  "Convocatorias",
  "Deportes",
  "Servicios",
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

  useEffect(() => {
    const fetchComunicados = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/comunicados`);
        if (res.ok) {
          const data = await res.json();
          setComunicados(data);
        }
      } catch (err) {
        console.error("Error al cargar comunicados:", err);
      } finally {
        setLoading(false);
      }
    };
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
      alert(`Iniciando descarga de: ${archivoNombre}`);
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
      alert("¡Equipo registrado con éxito para el Torneo Relámpago!");
    }, 1200);
  };

  // Filtrado de comunicados
  const comunicadosFiltrados = comunicados.filter((c) => {
    const matchCat =
      filtroCategoria === "Todos" ||
      c.categoria.toLowerCase().includes(filtroCategoria.toLowerCase()) ||
      (filtroCategoria === "Urgentes" && (c.prioridad === "Urgente" || c.categoria === "Urgente"));
    const matchSearch =
      c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <main className="max-w-[1280px] mx-auto p-4 md:p-8 min-h-screen">
      {/* ── Page Header ── */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
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
            Tablón oficial de la Directiva OTB: citaciones con sello, avisos de
            servicios básicos, actividades comunales y documentos oficiales
            escaneados.
          </p>
        </div>

        {/* Barra de Filtros */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#f2f4f6] p-1.5 rounded-2xl border border-[#c4c5d5]">
          {CATEGORIAS.map((cat) => {
            const isSelected = filtroCategoria === cat;
            const isUrgente = cat === "Urgentes";
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

      {/* ── Bento Grid Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUMNA PRINCIPAL: FEED DE COMUNICADOS (8 columnas) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#191c1e] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00288e]">
                campaign
              </span>
              Comunicados Oficiales Recientes
            </h2>
            <span className="text-xs text-[#757684] font-semibold">
              {comunicados.length > 0
                ? `${comunicados.length} anuncios vigentes`
                : "Tablón activo"}
            </span>
          </div>

          {/* 1. TARJETA DESTACADA: AVISO URGENTE SEMAPA */}
          <article className="bg-white rounded-2xl border-2 border-red-300 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-5 md:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#ffdad6] flex items-center justify-center shrink-0">
                    <span
                      className="material-symbols-outlined text-[#ba1a1a] text-2xl"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      water_drop
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-3 py-0.5 bg-[#ba1a1a] text-white text-[11px] font-extrabold rounded-full">
                        Aviso Urgente
                      </span>
                      <span className="px-2 py-0.5 bg-[#e0e3e5] text-[#191c1e] text-[11px] font-bold rounded">
                        SEMAPA
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#191c1e]">
                      Corte Imprevisto de Agua Potable - Red Matriz
                    </h3>
                  </div>
                </div>
                <span className="text-xs text-[#757684] font-medium shrink-0">
                  Hoy
                </span>
              </div>

              <p className="text-sm text-[#444653] mb-4 leading-relaxed">
                Por rotura de matriz principal en la intersección de{" "}
                <strong className="text-[#191c1e]">
                  Av. Panamericana y Villa Calama
                </strong>
                , SEMAPA suspenderá el suministro de agua potable hoy desde las
                10:00 hasta las 18:30 para trabajos de reparación de emergencia.
              </p>

              <div className="bg-[#f2f4f6] rounded-xl p-3 mb-4 flex items-center gap-3 border border-[#c4c5d5]">
                <span className="material-symbols-outlined text-[#00288e] text-2xl shrink-0">
                  local_shipping
                </span>
                <span className="text-xs text-[#191c1e]">
                  <strong>Cisterna de auxilio:</strong> Plazuela Central a
                  partir de las 14:00 (presentar carnet o boleta OTB para
                  provisión por lote).
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#c4c5d5] text-xs">
                <span className="text-[#ba1a1a] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    schedule
                  </span>
                  Reanudación estimada: 18:30 hrs
                </span>
                <button
                  onClick={() =>
                    alert("Estado de cuadrilla SEMAPA: En trabajo activo sobre válvula principal.")
                  }
                  className="text-[#00288e] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Seguimiento de cuadrilla</span>
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </article>

          {/* 2. TARJETA KERMESSE SOLIDARIA (CON AFICHE COLOR) */}
          <article className="bg-white rounded-2xl border border-[#c4c5d5] shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Afiche / Banner */}
              <div className="md:col-span-5 relative bg-slate-900 min-h-[220px]">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBQ831ptI3wqwKi2qjDI5inOV5SpRqJlvpHJ8lW7zIVusQ5XrfF2D9xSMiURhpFMT2qU8hGTZo2OujLGHRTrenhzmO1QtnVZ0Prr2Rsp-Djo52x7ImZT-9B4f8iEXmUHMCtul8k2YDj-esA-OxNvr_fBtDoMV5oJFbSqwqJcwIVOp2M4Womu4IpmJ2SBygCY3Im9JxJukL-i8-1Jg3wzv__rU-WIX_3hs41y5dG5RFx6uaNxsLWbTom47FjjNgS97U7ZJ6VEyvznsk')",
                  }}
                ></div>
                <div className="absolute inset-0 bg-[#00288e]/40 flex flex-col justify-between p-4 text-white">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 font-bold text-xs rounded-full w-max shadow-sm">
                    Gran Kermesse
                  </span>
                  <div className="bg-white/95 backdrop-blur-md text-[#191c1e] p-2.5 rounded-xl text-center shadow-md">
                    <p className="text-[11px] font-extrabold uppercase text-[#00288e]">
                      Domingo 12 Noviembre
                    </p>
                    <p className="text-xs font-semibold">
                      10:00 AM • Cancha Multifuncional
                    </p>
                  </div>
                </div>
              </div>

              {/* Contenido */}
              <div className="md:col-span-7 p-5 md:p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="px-3 py-0.5 bg-[#DCFCE7] text-[#166534] text-xs font-bold rounded-full">
                      Kermesse Solidaria
                    </span>
                    <span className="text-xs text-[#757684]">Comunidad</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#191c1e] mb-2">
                    Gran Kermesse Pro-Techo Cancha
                  </h3>
                  <p className="text-xs md:text-sm text-[#444653] leading-relaxed mb-3">
                    Ven con toda la familia a apoyar la recaudación de fondos
                    para el techado metálico de nuestra cancha poli-funcional.
                    Delicioso menú tradicional cochabambino:
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="px-2.5 py-1 bg-[#f2f4f6] rounded-lg text-xs font-semibold text-[#191c1e]">
                      🍖 Chicharrón tradicional (Bs 35)
                    </span>
                    <span className="px-2.5 py-1 bg-[#f2f4f6] rounded-lg text-xs font-semibold text-[#191c1e]">
                      🥩 Pique Macho (Bs 35)
                    </span>
                    <span className="px-2.5 py-1 bg-[#f2f4f6] rounded-lg text-xs font-semibold text-[#191c1e]">
                      🥤 Refresco de mocochinchi
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#c4c5d5]">
                  <div className="flex items-center gap-1.5 text-xs text-[#444653] font-semibold">
                    <span className="material-symbols-outlined text-[#166534] text-base">
                      volunteer_activism
                    </span>
                    <span>Meta: Bs 18.000</span>
                  </div>
                  <button
                    onClick={() =>
                      handleDownload(
                        "Afiche_Kermesse_ProTecho_OTB.jpg",
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuBQ831ptI3wqwKi2qjDI5inOV5SpRqJlvpHJ8lW7zIVusQ5XrfF2D9xSMiURhpFMT2qU8hGTZo2OujLGHRTrenhzmO1QtnVZ0Prr2Rsp-Djo52x7ImZT-9B4f8iEXmUHMCtul8k2YDj-esA-OxNvr_fBtDoMV5oJFbSqwqJcwIVOp2M4Womu4IpmJ2SBygCY3Im9JxJukL-i8-1Jg3wzv__rU-WIX_3hs41y5dG5RFx6uaNxsLWbTom47FjjNgS97U7ZJ6VEyvznsk"
                      )
                    }
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#00288e] text-white rounded-xl text-xs font-bold hover:bg-[#1e40af] transition-all cursor-pointer shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">
                      download
                    </span>
                    <span>Descargar Afiche</span>
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* 3. CITACIÓN FIRMADA CON FACSÍMIL Y SELLO DE DIRECTIVA */}
          <article className="bg-white rounded-2xl border border-[#c4c5d5] shadow-sm p-5 md:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#dde1ff] flex items-center justify-center shrink-0 text-[#00288e]">
                  <span className="material-symbols-outlined text-2xl">
                    assignment
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-3 py-0.5 bg-[#dde1ff] text-[#00288e] font-extrabold text-xs rounded-full">
                      Convocatoria Oficial
                    </span>
                    <span className="px-2 py-0.5 bg-[#DCFCE7] text-[#166534] text-[11px] rounded font-bold uppercase">
                      Firmada y Sellada
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#191c1e]">
                    Citación: Marcha Pacífica por Alumbrado y Seguridad
                  </h3>
                </div>
              </div>
              <span className="text-xs text-[#757684]">20 Oct</span>
            </div>

            <p className="text-sm text-[#444653] mb-4 leading-relaxed">
              La Directiva de la OTB convoca con carácter{" "}
              <strong className="text-[#191c1e]">
                obligatorio a 1 representante por lote
              </strong>{" "}
              a la movilización pacífica ante la Subalcaldía de Distrito para
              exigir la reposición inmediata de luminarias LED en los Pasajes A,
              B y C, y mayor patrullaje preventivo.
            </p>

            {/* Facsímil de documento sellado */}
            <div className="bg-[#f2f4f6] border border-[#c4c5d5] rounded-xl p-4 mb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-14 bg-white border border-[#c4c5d5] rounded-lg shadow-sm flex flex-col items-center justify-center text-center p-1 shrink-0">
                  <span className="material-symbols-outlined text-[#00288e] text-lg">
                    verified
                  </span>
                  <span className="text-[8px] font-black text-[#ba1a1a] uppercase leading-none mt-0.5">
                    SELLO OTB
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#191c1e]">
                    Resolución-OTB-Nro-042-2023.pdf
                  </p>
                  <p className="text-[11px] text-[#757684]">
                    Documento oficial escaneado • Firmas Directiva y Control
                    Social (1.8 MB)
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  setViewerModal({
                    open: true,
                    titulo: "Citación: Marcha Pacífica por Alumbrado y Seguridad",
                    archivoNombre: "Resolución-OTB-Nro-042-2023.pdf",
                    esCitacion: true,
                    descripcion:
                      "Resolución y citación firmada de la OTB Villa Calama para la marcha pacífica hacia la Subalcaldía.",
                  })
                }
                className="w-full sm:w-auto px-4 py-2 border-2 border-[#00288e] text-[#00288e] bg-white hover:bg-[#dde1ff]/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">
                  visibility
                </span>
                <span>Ver Documento Firmado</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#757684]">
              <span>📍 Punto de concentración: Sede OTB (08:00 AM)</span>
              <span className="text-[#ba1a1a] font-bold">
                Asistencia controlada con registro de firma
              </span>
            </div>
          </article>

          {/* 4. CONVOCATORIA CAMPEONATO DE FÚTBOL VECINAL */}
          <article className="bg-white rounded-2xl border border-[#c4c5d5] shadow-sm p-5 md:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-800">
                  <span className="material-symbols-outlined text-2xl">
                    sports_soccer
                  </span>
                </div>
                <div>
                  <span className="px-3 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full mb-1 inline-block">
                    Deportes y Confraternización
                  </span>
                  <h3 className="text-xl font-bold text-[#191c1e]">
                    Convocatoria Campeonato Vecinal "Copa Amistad OTB"
                  </h3>
                </div>
              </div>
              <span className="text-xs text-[#757684]">18 Oct</span>
            </div>

            <p className="text-sm text-[#444653] mb-4 leading-relaxed">
              Quedan abiertas las inscripciones para el Torneo Relámpago de
              Fútbol de Salón Inter-Manzanos. Categorías Varones Libre y Mujeres
              Libre. Premios en trofeos y medallas.
            </p>

            <div className="grid grid-cols-3 gap-2 bg-[#f2f4f6] p-3 rounded-xl mb-4 text-xs">
              <div className="border-r border-[#c4c5d5] pr-2">
                <p className="text-[#757684] text-[10px]">Inscripción</p>
                <p className="font-bold text-[#191c1e]">Bs 50 (Garantía)</p>
              </div>
              <div className="border-r border-[#c4c5d5] pr-2 pl-2">
                <p className="text-[#757684] text-[10px]">Inicio Fixture</p>
                <p className="font-bold text-[#191c1e]">Sábado 18 Nov</p>
              </div>
              <div className="pl-2">
                <p className="text-[#757684] text-[10px]">Cierre listas</p>
                <p className="font-bold text-[#00288e]">10 Noviembre</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() =>
                  alert("Descargando el Fixture preliminar y reglamento de juego...")
                }
                className="px-4 py-2.5 bg-[#00288e] text-white rounded-xl text-xs font-bold hover:bg-[#1e40af] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">
                  download
                </span>
                <span>Descargar Fixture Preliminar</span>
              </button>
              <button
                onClick={() => setInscribirModal(true)}
                className="px-4 py-2.5 border border-[#c4c5d5] hover:border-[#00288e] text-[#191c1e] rounded-xl text-xs font-bold hover:bg-[#f2f4f6] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">
                  group_add
                </span>
                <span>Inscribir Equipo de Manzano</span>
              </button>
            </div>
          </article>

          {/* Comunicados adicionales de PostgreSQL si existen */}
          {comunicadosFiltrados
            .filter(
              (c) =>
                !c.titulo.includes("Corte Imprevisto") &&
                !c.titulo.includes("Kermesse") &&
                !c.titulo.includes("Marcha") &&
                !c.titulo.includes("Campeonato")
            )
            .map((c) => (
              <article
                key={c.id}
                className="bg-white rounded-2xl border border-[#c4c5d5] shadow-sm p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#dde1ff] text-[#00288e]">
                    {c.categoria}
                  </span>
                  <span className="text-xs text-[#757684]">
                    {new Date(c.creado_en).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#191c1e] mb-1">
                  {c.titulo}
                </h3>
                <p className="text-xs md:text-sm text-[#444653] leading-relaxed mb-3">
                  {c.descripcion}
                </p>
                {c.imagen_url && (
                  <button
                    onClick={() =>
                      setViewerModal({
                        open: true,
                        titulo: c.titulo,
                        archivoNombre: c.archivo_nombre || "archivo_adjunto.jpg",
                        imagenUrl: c.imagen_url,
                        descripcion: c.descripcion,
                      })
                    }
                    className="px-3 py-1.5 bg-[#00288e] text-white rounded-lg text-xs font-bold hover:bg-[#1e40af] flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">
                      visibility
                    </span>
                    Ver Cartel / Documento
                  </button>
                )}
              </article>
            ))}
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
              <div className="bg-white border-2 border-[#c4c5d5] rounded-xl shadow-sm overflow-hidden relative group">
                <div className="bg-[#e6e8ea] px-3 py-2 border-b border-[#c4c5d5] flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#191c1e] truncate max-w-[180px]">
                    Citacion_Oficial_Marcha.jpg
                  </span>
                  <div className="flex items-center gap-1.5 text-[#444653]">
                    <span
                      onClick={() =>
                        setViewerModal({
                          open: true,
                          titulo: "Citación Oficial de Marcha",
                          esCitacion: true,
                        })
                      }
                      title="Pantalla Completa"
                      className="material-symbols-outlined text-sm cursor-pointer hover:text-[#00288e]"
                    >
                      fullscreen
                    </span>
                  </div>
                </div>

                {/* Facsímil estilo papel antiguo con sello oficial */}
                <div
                  onClick={() =>
                    setViewerModal({
                      open: true,
                      titulo: "Citación Oficial de Marcha",
                      esCitacion: true,
                    })
                  }
                  className="p-5 space-y-2 bg-amber-50/30 text-[#191c1e] font-serif text-[11px] leading-snug border-b border-dashed border-[#c4c5d5] cursor-pointer hover:bg-amber-50/60 transition-colors"
                >
                  <div className="text-center border-b border-slate-300 pb-2">
                    <p className="font-bold text-[12px] text-[#00288e] uppercase tracking-wide">
                      ORGANIZACIÓN TERRITORIAL DE BASE
                    </p>
                    <p className="text-[10px] text-[#757684]">
                      Personería Jurídica N° 342/2011 • Cochabamba
                    </p>
                  </div>

                  <p className="font-bold text-[11px] pt-1 text-center">
                    CITACIÓN OFICIAL DE URGENCIA
                  </p>
                  <p className="text-justify text-[10px] text-slate-700">
                    Por la presente se convoca con carácter obligatorio a los
                    vecinos de los Manzanos 1 al 14 a la concentración por el
                    alumbrado público y seguridad ciudadana...
                  </p>

                  <div className="flex items-end justify-between pt-4">
                    <div className="text-center">
                      <div className="w-16 h-8 border-b border-slate-800 mx-auto"></div>
                      <p className="text-[9px] font-sans font-bold text-slate-900">
                        Lic. Carlos Meneses
                        <br />
                        <span className="text-[#757684]">Presidente OTB</span>
                      </p>
                    </div>

                    {/* Sello circular OTB */}
                    <div className="w-14 h-14 rounded-full border-2 border-[#ba1a1a] flex flex-col items-center justify-center text-center p-1 text-[#ba1a1a] rotate-[-12deg] shadow-xs">
                      <span className="text-[7px] font-black uppercase leading-none">
                        OTB COCHABAMBA
                      </span>
                      <span className="material-symbols-outlined text-sm">
                        verified
                      </span>
                      <span className="text-[6px] font-bold">JUNTA VECINAL</span>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 bg-white flex items-center justify-between text-xs">
                  <span className="text-[#757684]">Página 1 de 1</span>
                  <button
                    onClick={() =>
                      setViewerModal({
                        open: true,
                        titulo: "Citación Oficial de Marcha",
                        esCitacion: true,
                      })
                    }
                    className="text-[#00288e] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">
                      open_in_new
                    </span>
                    Abrir documento
                  </button>
                </div>
              </div>
            </div>

            {/* Archivos Recientes */}
            <div className="p-4 border-t border-[#c4c5d5] space-y-2">
              <p className="text-xs font-bold text-[#191c1e]">
                Archivos Recientes de la Directiva:
              </p>
              <ul className="space-y-1.5 text-xs">
                <li className="flex items-center justify-between p-2 hover:bg-[#f2f4f6] rounded-xl transition-colors">
                  <span className="flex items-center gap-2 text-[#191c1e] truncate max-w-[200px]">
                    <span className="material-symbols-outlined text-[#00288e] text-base">
                      description
                    </span>
                    Acta_Asamblea_2026.pdf
                  </span>
                  <button
                    onClick={() =>
                      alert("Descargando Acta_Asamblea_2026.pdf...")
                    }
                    className="text-[#00288e] font-bold hover:underline cursor-pointer"
                  >
                    Ver
                  </button>
                </li>
                <li className="flex items-center justify-between p-2 hover:bg-[#f2f4f6] rounded-xl transition-colors">
                  <span className="flex items-center gap-2 text-[#191c1e] truncate max-w-[200px]">
                    <span className="material-symbols-outlined text-[#00288e] text-base">
                      description
                    </span>
                    Balance_ProTecho_Octubre.pdf
                  </span>
                  <button
                    onClick={() =>
                      alert("Descargando Balance_ProTecho_Octubre.pdf...")
                    }
                    className="text-[#00288e] font-bold hover:underline cursor-pointer"
                  >
                    Ver
                  </button>
                </li>
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
                    <span className="material-symbols-outlined text-lg">
                      chat
                    </span>
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
                    <span className="material-symbols-outlined text-lg">
                      phone_in_talk
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-[#191c1e]">
                    Mesa Directiva
                  </span>
                </div>
                <a
                  href="tel:76912345"
                  className="text-[#00288e] font-bold text-xs hover:underline"
                >
                  769-12345
                </a>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-[#f2f4f6] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a]">
                    <span className="material-symbols-outlined text-lg">
                      local_police
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-[#191c1e]">
                    Policía Módulo 12
                  </span>
                </div>
                <a
                  href="tel:110"
                  className="text-[#ba1a1a] font-bold text-xs hover:underline"
                >
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
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full border border-slate-700 relative z-10">
              {/* Barra del visor */}
              <div className="px-6 py-4 bg-[#191c1e] text-white flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="material-symbols-outlined text-[#6cf8bb]">
                    description
                  </span>
                  <div className="truncate">
                    <h3 className="text-sm font-bold truncate">
                      {viewerModal.titulo}
                    </h3>
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
                    <span className="material-symbols-outlined text-sm">
                      download
                    </span>
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
                        CITACIÓN OFICIAL DE URGENCIA
                      </span>
                    </div>

                    <p className="text-xs text-justify leading-relaxed">
                      Por medio del presente documento, la Directiva de la OTB
                      Villa Calama convoca a todos los propietarios y vecinos de
                      los diferentes manzanos a la <strong>Marcha Pacífica</strong> convocada
                      para el día miércoles a las 08:00 AM, con concentración en la Sede Comunal.
                    </p>

                    <p className="text-xs text-justify leading-relaxed">
                      <strong>Motivo:</strong> Exigir a la Subalcaldía la inmediata instalación de luminarias LED y red de seguridad ciudadana.
                    </p>

                    <div className="flex items-center justify-around pt-8">
                      <div className="text-center">
                        <div className="w-32 border-b-2 border-slate-800 mx-auto mb-1"></div>
                        <p className="text-xs font-sans font-bold">Lic. Carlos Meneses</p>
                        <p className="text-[10px] font-sans text-slate-500">Presidente OTB</p>
                      </div>

                      <div className="w-20 h-20 rounded-full border-2 border-[#ba1a1a] flex flex-col items-center justify-center text-center p-1 text-[#ba1a1a] rotate-[-10deg]">
                        <span className="text-[8px] font-black uppercase leading-none">OTB COCHABAMBA</span>
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
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full border border-[#c4c5d5] relative z-10 p-6">
              <div className="flex justify-between items-center mb-4 border-b border-[#c4c5d5] pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-700">
                    sports_soccer
                  </span>
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
