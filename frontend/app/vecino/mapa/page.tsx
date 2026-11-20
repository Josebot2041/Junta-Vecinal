"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface PuntoComunitario {
  id: number;
  nombre: string;
  categoria: string;
  latitud: number | string;
  longitud: number | string;
  descripcion: string;
  horarios?: string;
  icono?: string;
}

const API = "http://localhost:5000/api";

const CATEGORIAS = [
  { id: "TODOS", label: "Todos", icon: "explore" },
  { id: "Equipamiento Comunitario", label: "Equipamiento", icon: "domain" },
  { id: "Deportes y Recreación", label: "Deporte", icon: "sports_soccer" },
  { id: "Áreas Verdes y Recreación", label: "Plazas y Parques", icon: "park" },
  { id: "Seguridad Ciudadana", label: "Seguridad", icon: "local_police" },
  { id: "Servicios Básicos y Limpieza", label: "Servicios / EMSA", icon: "delete_sweep" },
];

export default function VecinoMapaPage() {
  const [puntos, setPuntos] = useState<PuntoComunitario[]>([]);
  const [categoriaActiva, setCategoriaActiva] = useState("TODOS");
  const [puntoSeleccionado, setPuntoSeleccionado] = useState<PuntoComunitario | null>(null);
  const [zoomLevel, setZoomLevel] = useState(16);
  const [mapMode, setMapMode] = useState<"standard" | "satellite">("standard");
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Centro de la OTB Villa Calama (Cochabamba, Bolivia)
  const defaultCenter = { lat: -17.3935, lng: -66.1570 };

  useEffect(() => {
    const fetchPuntos = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/puntos-comunitarios`);
        if (res.ok) {
          const data: PuntoComunitario[] = await res.json();
          setPuntos(data);
          if (data.length > 0) {
            setPuntoSeleccionado(data[0]);
          }
        }
      } catch (err) {
        console.error("Error al cargar puntos comunitarios:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPuntos();
  }, []);

  const puntosFiltrados = puntos.filter((p) => {
    const matchCat =
      categoriaActiva === "TODOS" || p.categoria === categoriaActiva;
    const matchSearch =
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.categoria.toLowerCase().includes(busqueda.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCopiarCoordenadas = (p: PuntoComunitario) => {
    const coords = `${p.latitud}, ${p.longitud}`;
    navigator.clipboard.writeText(coords);
    setToastMsg(`Coordenadas copiadas: ${coords}`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAbrirEnGoogleMaps = (p: PuntoComunitario) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${p.latitud},${p.longitud}`;
    window.open(url, "_blank");
  };

  // Helper para asignar color según categoría
  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case "Seguridad Ciudadana":
        return { bg: "bg-red-500", text: "text-red-700", pill: "bg-red-100 text-red-800 border-red-200" };
      case "Deportes y Recreación":
        return { bg: "bg-emerald-600", text: "text-emerald-700", pill: "bg-emerald-100 text-emerald-800 border-emerald-200" };
      case "Áreas Verdes y Recreación":
        return { bg: "bg-teal-600", text: "text-teal-700", pill: "bg-teal-100 text-teal-800 border-teal-200" };
      case "Servicios Básicos y Limpieza":
        return { bg: "bg-amber-600", text: "text-amber-700", pill: "bg-amber-100 text-amber-800 border-amber-200" };
      default:
        return { bg: "bg-[#00288e]", text: "text-[#00288e]", pill: "bg-blue-100 text-[#00288e] border-blue-200" };
    }
  };

  // Coordenadas para render en el mapa interactivo simulado / OpenStreetMap
  const activeLat = puntoSeleccionado ? Number(puntoSeleccionado.latitud) : defaultCenter.lat;
  const activeLng = puntoSeleccionado ? Number(puntoSeleccionado.longitud) : defaultCenter.lng;

  // Iframe con OpenStreetMap centrado exactamente en Cochabamba OTB Villa Calama
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${activeLng - 0.007}%2C${activeLat - 0.005}%2C${activeLng + 0.007}%2C${activeLat + 0.005}&layer=${mapMode === "satellite" ? "hot" : "mapnik"}&marker=${activeLat}%2C${activeLng}`;

  return (
    <main className="max-w-[1280px] mx-auto p-4 md:p-8 min-h-screen space-y-6">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-[150] bg-[#00288e] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Header & Breadcrumb */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#757684] mb-1">
              <span>Portal Residente</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-[#00288e] font-bold">Mapa Comunitario OTB</span>
            </div>
            <h1 className="text-3xl font-bold text-[#191c1e] tracking-tight">
              Mapa del Barrio Villa Calama
            </h1>
            <p className="text-sm text-[#444653] mt-1">
              Guía oficial de equipamientos públicos, áreas verdes, seguridad y puntos de servicio comunal.
            </p>
          </div>

          {/* Privacy Note Badge */}
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-4 py-2 rounded-xl text-xs font-medium max-w-md shadow-xs">
            <span className="material-symbols-outlined text-amber-600 text-lg shrink-0">
              privacy_tip
            </span>
            <span>
              <strong>Privacidad y Seguridad:</strong> No se exponen viviendas individuales ni datos de propietarios en este mapa público.
            </span>
          </div>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#c4c5d5] shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoriaActiva(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                categoriaActiva === cat.id
                  ? "bg-[#00288e] text-white shadow-sm"
                  : "bg-[#f2f4f6] text-[#444653] hover:bg-slate-200"
              }`}
            >
              <span className="material-symbols-outlined text-base">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#757684] text-sm">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar sede, cancha, parque..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#f2f4f6] border border-[#c4c5d5] rounded-xl text-xs outline-none focus:border-[#00288e] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Grid: Map Viewport + Landmark Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Map Box */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-[#c4c5d5] shadow-sm overflow-hidden relative">
            {/* Map Top Bar Controls */}
            <div className="p-4 bg-white border-b border-[#c4c5d5] flex flex-wrap items-center justify-between gap-2 z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                <span className="text-xs font-bold text-[#191c1e]">
                  OTB Villa Calama • Cochabamba
                </span>
                <span className="text-[11px] text-[#757684] hidden sm:inline">
                  (-17.3935° S, -66.1570° O)
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Switcher Capas */}
                <div className="flex bg-[#f2f4f6] p-0.5 rounded-lg border border-[#c4c5d5] text-xs">
                  <button
                    onClick={() => setMapMode("standard")}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                      mapMode === "standard"
                        ? "bg-white text-[#00288e] shadow-xs"
                        : "text-[#444653]"
                    }`}
                  >
                    Calles
                  </button>
                  <button
                    onClick={() => setMapMode("satellite")}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                      mapMode === "satellite"
                        ? "bg-white text-[#00288e] shadow-xs"
                        : "text-[#444653]"
                    }`}
                  >
                    Topográfico
                  </button>
                </div>

                {/* Recenter Button */}
                <button
                  onClick={() => {
                    if (puntos.length > 0) setPuntoSeleccionado(puntos[0]);
                  }}
                  title="Centrar Sede Social"
                  className="p-1.5 bg-[#f2f4f6] hover:bg-slate-200 text-[#00288e] rounded-lg transition-colors border border-[#c4c5d5] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">my_location</span>
                </button>
              </div>
            </div>

            {/* Map Frame */}
            <div className="relative w-full h-[450px] bg-slate-100">
              <iframe
                title="Mapa OTB Villa Calama"
                className="w-full h-full border-0"
                loading="lazy"
                src={osmEmbedUrl}
              ></iframe>

              {/* Floating Overlay Badge with Landmark info */}
              {puntoSeleccionado && (
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-xl flex items-start gap-3 z-20">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm ${
                      getCategoriaColor(puntoSeleccionado.categoria).bg
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {puntoSeleccionado.icono || "location_on"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          getCategoriaColor(puntoSeleccionado.categoria).pill
                        }`}
                      >
                        {puntoSeleccionado.categoria}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-[#191c1e] truncate mt-1">
                      {puntoSeleccionado.nombre}
                    </h4>
                    <p className="text-xs text-[#444653] line-clamp-1 mt-0.5">
                      {puntoSeleccionado.descripcion}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAbrirEnGoogleMaps(puntoSeleccionado)}
                    title="Cómo llegar"
                    className="p-2 bg-[#00288e] hover:bg-[#1e40af] text-white rounded-lg shrink-0 transition-colors shadow-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">directions</span>
                  </button>
                </div>
              )}
            </div>

            {/* Map Footer Bar with Markers Legend */}
            <div className="p-3 bg-[#f7f9fb] border-t border-[#c4c5d5] flex flex-wrap items-center justify-between text-xs text-[#444653] gap-2">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00288e]"></span> Sede OTB
                </span>
                <span className="flex items-center gap-1 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Cancha
                </span>
                <span className="flex items-center gap-1 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span> Plaza
                </span>
                <span className="flex items-center gap-1 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Policía
                </span>
                <span className="flex items-center gap-1 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span> EMSA
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                Cartografía: OpenStreetMap contributors
              </span>
            </div>
          </div>

          {/* Quick Emergency & Directiva Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#c4c5d5] shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">local_police</span>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-[#757684]">Módulo Policial 12</p>
                <p className="text-sm font-extrabold text-[#191c1e]">110 • 4-4251234</p>
                <p className="text-[10px] text-emerald-700 font-semibold">Patrullaje 24 hrs</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#c4c5d5] shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-[#00288e] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">shield</span>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-[#757684]">Directiva OTB</p>
                <p className="text-sm font-extrabold text-[#191c1e]">769-12245</p>
                <p className="text-[10px] text-slate-500">Atención en Sede Social</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#c4c5d5] shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">water_drop</span>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase text-[#757684]">SEMAPA Emergencias</p>
                <p className="text-sm font-extrabold text-[#191c1e]">178 • 4-4284444</p>
                <p className="text-[10px] text-slate-500">Fugas y red matriz</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Landmark List & Selected Detail */}
        <div className="lg:col-span-4 space-y-4">
          {/* Detail Card of Selected Landmark */}
          {puntoSeleccionado ? (
            <div className="bg-white p-5 rounded-2xl border border-[#c4c5d5] shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm ${
                      getCategoriaColor(puntoSeleccionado.categoria).bg
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl">
                      {puntoSeleccionado.icono || "location_on"}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        getCategoriaColor(puntoSeleccionado.categoria).pill
                      }`}
                    >
                      {puntoSeleccionado.categoria}
                    </span>
                    <h3 className="font-bold text-base text-[#191c1e] mt-1 leading-tight">
                      {puntoSeleccionado.nombre}
                    </h3>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#444653] leading-relaxed bg-[#f7f9fb] p-3 rounded-xl border border-slate-200">
                {puntoSeleccionado.descripcion}
              </p>

              {/* Horarios */}
              <div className="space-y-1">
                <p className="text-[11px] font-bold uppercase text-[#757684] tracking-wider">
                  Horarios y Disponibilidad
                </p>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#191c1e] bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="material-symbols-outlined text-sm text-[#00288e]">
                    schedule
                  </span>
                  <span>{puntoSeleccionado.horarios || "Abierto según cronograma"}</span>
                </div>
              </div>

              {/* Coordenadas GPS */}
              <div className="space-y-1">
                <p className="text-[11px] font-bold uppercase text-[#757684] tracking-wider">
                  Ubicación Satelital (GPS)
                </p>
                <div className="flex items-center justify-between gap-2 text-xs text-[#444653] bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="font-mono text-[11px]">
                    {Number(puntoSeleccionado.latitud).toFixed(6)}, {Number(puntoSeleccionado.longitud).toFixed(6)}
                  </span>
                  <button
                    onClick={() => handleCopiarCoordenadas(puntoSeleccionado)}
                    className="p-1 hover:bg-slate-200 rounded text-[#00288e] cursor-pointer"
                    title="Copiar coordenadas"
                  >
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAbrirEnGoogleMaps(puntoSeleccionado)}
                  className="bg-[#00288e] hover:bg-[#1e40af] text-white py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">directions</span>
                  Cómo Llegar
                </button>
                <button
                  onClick={() => {
                    setToastMsg("Notificación registrada para la Directiva OTB");
                    setTimeout(() => setToastMsg(null), 3000);
                  }}
                  className="bg-[#f2f4f6] hover:bg-slate-200 text-[#444653] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-[#c4c5d5] transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">report_problem</span>
                  Reportar Aviso
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-[#c4c5d5] text-center text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-1">map</span>
              <p className="text-xs">Selecciona un punto en la lista para ver su información detallada.</p>
            </div>
          )}

          {/* List of Landmarks in Neighborhood */}
          <div className="bg-white rounded-2xl border border-[#c4c5d5] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#c4c5d5] flex items-center justify-between">
              <h4 className="font-bold text-sm text-[#191c1e] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00288e] text-base">
                  pin_drop
                </span>
                Lugares de la OTB ({puntosFiltrados.length})
              </h4>
            </div>

            <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
              {puntosFiltrados.map((p) => {
                const isSelected = puntoSeleccionado?.id === p.id;
                const colors = getCategoriaColor(p.categoria);
                return (
                  <button
                    key={p.id}
                    onClick={() => setPuntoSeleccionado(p)}
                    className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#dde1ff]/40 border-l-4 border-[#00288e]"
                        : "hover:bg-[#f7f9fb]"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5 ${colors.bg}`}
                    >
                      <span className="material-symbols-outlined text-base">
                        {p.icono || "location_on"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs text-[#191c1e] truncate">{p.nombre}</p>
                      <p className="text-[11px] text-[#757684] truncate">{p.categoria}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{p.horarios}</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 text-sm self-center">
                      chevron_right
                    </span>
                  </button>
                );
              })}

              {puntosFiltrados.length === 0 && (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No se encontraron puntos en esta categoría o búsqueda.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
