"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Vecino {
  id: number;
  nombre: string;
  ci: string;
  manzano: string;
  lote: string;
  estado_cuenta: string;
  saldo: string | number;
}

interface AsistenciaHistorial {
  id: number;
  asamblea_id: number;
  asamblea_nombre: string;
  asamblea_fecha: string;
  estado: string; // 'present' | 'absent' | 'justified'
  observacion?: string;
  asamblea_tipo?: string;
}

interface Asamblea {
  id: number;
  nombre: string;
  tipo?: string;
  fecha: string;
  hora: string;
  lugar: string;
  descripcion?: string;
}

const API = "http://localhost:5000/api";

export default function VecinoAsambleasPage() {
  const [vecino, setVecino] = useState<Vecino | null>(null);
  const [proximaAsamblea, setProximaAsamblea] = useState<Asamblea | null>(null);
  const [asistencias, setAsistencias] = useState<AsistenciaHistorial[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [filtroEstado, setFiltroEstado] = useState("Todos los estados");
  const [filtroGestion, setFiltroGestion] = useState("Gestión 2026");

  // Interacciones
  const [confirmado, setConfirmado] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modales
  const [modalJustificacion, setModalJustificacion] = useState(false);
  const [modalActa, setModalActa] = useState<{ open: boolean; item: any }>({
    open: false,
    item: null,
  });

  // Formulario de Justificación
  const [justificacionForm, setJustificacionForm] = useState<{
    motivo: string;
    descripcion: string;
    archivoNombre: string;
    previewUrl: string | null;
  }>({
    motivo: "Motivo de Salud / Médico",
    descripcion: "",
    archivoNombre: "",
    previewUrl: null,
  });
  const [enviandoJustificacion, setEnviandoJustificacion] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const localUser = localStorage.getItem("user");
        let vecinoActual: Vecino | null = null;

        const [resVecinos, resAsambleas] = await Promise.all([
          fetch(`${API}/vecinos`).catch(() => null),
          fetch(`${API}/asambleas`).catch(() => null),
        ]);

        if (resVecinos && resVecinos.ok) {
          const lista: Vecino[] = await resVecinos.json();
          if (localUser) {
            try {
              const parsed = JSON.parse(localUser);
              vecinoActual = lista.find((v) => String(v.ci) === String(parsed.ci)) || lista[0];
            } catch {
              vecinoActual = lista[0];
            }
          } else {
            vecinoActual = lista[0];
          }
          setVecino(vecinoActual);
        }

        if (resAsambleas && resAsambleas.ok) {
          const asambleasData: Asamblea[] = await resAsambleas.json();
          if (asambleasData.length > 0) {
            setProximaAsamblea(asambleasData[0]);

            // Comprobar si ya confirmó asistencia previamente
            if (vecinoActual) {
              try {
                const resPreQuorum = await fetch(`${API}/asambleas/${asambleasData[0].id}/pre-quorum?vecino_id=${vecinoActual.id}`);
                if (resPreQuorum.ok) {
                  const dataQuorum = await resPreQuorum.json();
                  if (dataQuorum.yaConfirmado) {
                    setConfirmado(true);
                  }
                }
              } catch (e) {
                console.error("Error al verificar confirmación previa:", e);
              }
            }
          }
        }

        if (vecinoActual) {
          const resHistorial = await fetch(`${API}/vecinos/${vecinoActual.id}/historial`).catch(() => null);
          if (resHistorial && resHistorial.ok) {
            const dataHist = await resHistorial.json();
            const asistenciasDb = dataHist.asistencias || [];

            // Datos de demostración enriquecidos para la defensa de grado
            if (asistenciasDb.length === 0) {
              setAsistencias([
                {
                  id: 101,
                  asamblea_id: 1,
                  asamblea_nombre: "Asamblea Extraordinaria: Seguridad Ciudadana",
                  asamblea_tipo: "Asamblea Extraordinaria",
                  asamblea_fecha: "2026-10-20",
                  estado: "present",
                  observacion: "Firma registrada a las 18:45. Aportó en moción de cámaras.",
                },
                {
                  id: 102,
                  asamblea_id: 2,
                  asamblea_nombre: "Asamblea Ordinaria Mensual: Revisión de Obras",
                  asamblea_tipo: "Asamblea Ordinaria",
                  asamblea_fecha: "2026-09-15",
                  estado: "absent",
                  observacion: "Sin justificación previa. Multa reglamentaria aplicada en Folio 82.",
                },
                {
                  id: 103,
                  asamblea_id: 3,
                  asamblea_nombre: "Asamblea Extraordinaria: Agua Potable y Tanques",
                  asamblea_tipo: "Asamblea Extraordinaria",
                  asamblea_fecha: "2026-08-18",
                  estado: "justified",
                  observacion: "Licencia médica aceptada por Directorio antes de las 12:00. Exento de multa.",
                },
                {
                  id: 104,
                  asamblea_id: 4,
                  asamblea_nombre: "Asamblea Ordinaria Semestral: Rendición de Cuentas",
                  asamblea_tipo: "Asamblea Ordinaria",
                  asamblea_fecha: "2026-07-14",
                  estado: "present",
                  observacion: "Presente en 1er llamado. Firma en Folio 75.",
                },
              ]);
            } else {
              setAsistencias(asistenciasDb);
            }
          }
        }
      } catch (err) {
        console.error("Error al cargar asambleas del vecino:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleConfirmar = async () => {
    if (confirmado || !proximaAsamblea || !vecino) return;
    setConfirmando(true);
    try {
      const res = await fetch(`${API}/asambleas/${proximaAsamblea.id}/confirmar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vecino_id: vecino.id }),
      });
      if (res.ok) {
        setConfirmado(true);
        setToastMsg("¡Asistencia confirmada exitosamente! Registrado en pre-quórum.");
      } else {
        setToastMsg("Hubo un inconveniente al registrar la confirmación.");
      }
    } catch (e) {
      console.error("Error al confirmar:", e);
      setToastMsg("Error de conexión al confirmar.");
    } finally {
      setConfirmando(false);
      setTimeout(() => setToastMsg(null), 3500);
    }
  };

  const handleEnviarJustificacion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proximaAsamblea || !vecino) return;
    setEnviandoJustificacion(true);
    try {
      const res = await fetch(`${API}/asistencias/justificaciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asamblea_id: proximaAsamblea.id,
          vecino_id: vecino.id,
          motivo: justificacionForm.motivo,
          descripcion: justificacionForm.descripcion,
          documento_url: justificacionForm.previewUrl || null,
        }),
      });
      if (res.ok) {
        setModalJustificacion(false);
        setToastMsg("Solicitud de justificación enviada al Directorio para su revisión.");
        setJustificacionForm({
          motivo: "Motivo de Salud / Médico",
          descripcion: "",
          archivoNombre: "",
          previewUrl: null,
        });
      } else {
        setToastMsg("No se pudo registrar la solicitud de justificación.");
      }
    } catch (err) {
      console.error("Error al enviar justificación:", err);
      setToastMsg("Error de conexión al enviar la justificación.");
    } finally {
      setEnviandoJustificacion(false);
      setTimeout(() => setToastMsg(null), 4000);
    }
  };

  // Filtrado de asistencias
  const asistenciasFiltradas = asistencias.filter((a) => {
    if (filtroEstado === "Presente") return a.estado === "present";
    if (filtroEstado === "Justificado") return a.estado === "justified";
    if (filtroEstado === "Con Multa") return a.estado === "absent";
    return true;
  });

  const totalAsistencias = asistencias.length;
  const cumplidas = asistencias.filter((a) => a.estado === "present" || a.estado === "justified").length;
  const porcentaje = totalAsistencias > 0 ? Math.round((cumplidas / totalAsistencias) * 100) : 100;

  return (
    <main className="max-w-[1280px] mx-auto p-4 md:p-8 min-h-screen">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-[150] bg-[#166534] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Header & Breadcrumbs */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#757684] mb-1">
              <span>Portal Residente</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-[#00288e] font-bold">Asambleas y Asistencias</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#191c1e] tracking-tight">
              Asambleas y Mis Asistencias
            </h1>
            <p className="text-[#444653] text-sm md:text-base mt-1 max-w-2xl leading-relaxed">
              Supervisa tu récord de participación en asambleas, confirma asistencia y gestiona
              justificaciones para mantenerte al día con la OTB Villa Calama.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setModalJustificacion(true)}
              className="px-4 py-2.5 bg-white border border-[#c4c5d5] hover:bg-[#f2f4f6] text-[#00288e] font-bold text-xs md:text-sm rounded-xl shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">assignment_turned_in</span>
              Solicitar Justificación / Licencia
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUMNA IZQUIERDA: PRÓXIMA ASAMBLEA (4 cols) */}
        <section className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#191c1e] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00288e]">campaign</span>
              Próxima Asamblea Programada
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#00288e] text-white text-[10px] font-extrabold uppercase">
              Oficial
            </span>
          </div>

          <div className="bg-white border-2 border-[#00288e]/30 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 rounded-full bg-[#dde1ff] text-[#00288e] text-xs font-bold">
                {proximaAsamblea?.tipo || "Asamblea General Ordinaria"}
              </span>
              <div className="text-right bg-[#f2f4f6] px-3 py-1.5 rounded-xl border border-[#c4c5d5]">
                <p className="text-xl font-black text-[#00288e] leading-none">
                  {proximaAsamblea?.fecha ? new Date(proximaAsamblea.fecha).getDate() : "15"}
                </p>
                <p className="text-[10px] uppercase font-bold text-[#757684]">
                  {proximaAsamblea?.fecha
                    ? new Date(proximaAsamblea.fecha).toLocaleString("es-ES", { month: "short" })
                    : "Nov 2026"}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#191c1e] leading-snug">
                {proximaAsamblea?.nombre || "Asamblea Ordinaria de Cierre y Presupuesto"}
              </h3>
              <p className="text-xs text-[#757684] mt-0.5">
                Convocatoria aprobada por Directorio OTB
              </p>
            </div>

            <div className="space-y-2 py-3 border-y border-[#c4c5d5] text-xs text-[#191c1e]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00288e] text-base shrink-0">
                  schedule
                </span>
                <p>
                  <strong>1er Llamado:</strong> {proximaAsamblea?.hora || "18:30"} |{" "}
                  <strong>2do Llamado:</strong> 19:00
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#00288e] text-base shrink-0 mt-0.5">
                  location_on
                </span>
                <p>{proximaAsamblea?.lugar || "Sede Social OTB Villa Calama (Salón Principal)"}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00288e] text-base shrink-0">
                  rule
                </span>
                <p>Tolerancia máxima: 15 minutos (Reglamento OTB)</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-[#191c1e] mb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#00288e] text-sm">
                  format_list_numbered
                </span>
                Orden del Día Detallado:
              </p>
              <ol className="list-decimal list-inside text-xs text-[#444653] space-y-1.5 bg-[#f2f4f6] p-3 rounded-xl border border-[#c4c5d5]">
                <li>Control de Asistencia y Quórum reglamentario.</li>
                <li>Lectura y aprobación del Acta de la asamblea previa.</li>
                <li>Informe de Ingresos y Egresos Gestión 2026.</li>
                <li>Plan de Alumbrado y Mejoras en el Parque Central.</li>
                <li>Varios y Aprobación de Presupuesto 2027.</li>
              </ol>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleConfirmar}
                disabled={confirmando || confirmado}
                className={`w-full py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                  confirmado
                    ? "bg-[#166534] text-white"
                    : "bg-[#00288e] text-white hover:bg-[#1e40af]"
                }`}
              >
                {confirmando ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                    <span>Confirmando...</span>
                  </>
                ) : confirmado ? (
                  <>
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    <span>¡Asistencia Confirmada!</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    <span>Confirmar Asistencia</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setModalJustificacion(true)}
                className="w-full py-2 bg-[#f2f4f6] text-[#444653] hover:text-[#00288e] border border-[#c4c5d5] font-semibold text-xs rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">edit_calendar</span>
                Solicitar Justificación / Licencia
              </button>
            </div>
          </div>
        </section>

        {/* COLUMNA DERECHA: HISTORIAL OFICIAL DE PARTICIPACIÓN (8 cols) */}
        <section className="lg:col-span-8">
          <div className="bg-white border border-[#c4c5d5] rounded-2xl overflow-hidden shadow-sm flex flex-col h-full">
            {/* Header de la tarjeta */}
            <div className="p-5 border-b border-[#c4c5d5] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#dde1ff] flex items-center justify-center text-[#00288e]">
                  <span className="material-symbols-outlined">history_edu</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#191c1e]">
                    Historial Oficial de Participación
                  </h2>
                  <p className="text-xs text-[#757684]">
                    Registro individual de asistencias asentadas en libro de actas OTB
                  </p>
                </div>
              </div>

              {/* Filtros */}
              <div className="flex gap-2">
                <select
                  value={filtroGestion}
                  onChange={(e) => setFiltroGestion(e.target.value)}
                  className="bg-[#f2f4f6] border border-[#c4c5d5] rounded-xl py-1.5 px-3 text-xs font-bold text-[#191c1e] outline-none cursor-pointer"
                >
                  <option>Gestión 2026</option>
                  <option>Gestión 2025</option>
                </select>

                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="bg-[#f2f4f6] border border-[#c4c5d5] rounded-xl py-1.5 px-3 text-xs font-bold text-[#191c1e] outline-none cursor-pointer"
                >
                  <option>Todos los estados</option>
                  <option>Presente</option>
                  <option>Justificado</option>
                  <option>Con Multa</option>
                </select>
              </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead className="bg-[#f2f4f6] text-[#757684] font-bold border-b border-[#c4c5d5]">
                  <tr>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Tipo de Asamblea</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Observación en Acta</th>
                    <th className="px-4 py-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c4c5d5]">
                  {asistenciasFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-xs text-[#757684]">
                        No se encontraron registros de asistencia con los filtros seleccionados.
                      </td>
                    </tr>
                  ) : (
                    asistenciasFiltradas.map((item) => {
                      const esPresente = item.estado === "present";
                      const esJustificado = item.estado === "justified";
                      const esMulta = item.estado === "absent";

                      return (
                        <tr
                          key={item.id}
                          className={`hover:bg-[#f7f9fb] transition-colors ${
                            esMulta ? "bg-red-50/40" : ""
                          }`}
                        >
                          <td className="px-4 py-3.5 font-semibold text-[#191c1e] whitespace-nowrap">
                            {new Date(item.asamblea_fecha).toLocaleDateString("es-ES", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="font-bold text-[#191c1e]">
                              {item.asamblea_tipo || "Asamblea General"}
                            </p>
                            <p className="text-[11px] text-[#757684] line-clamp-1">
                              {item.asamblea_nombre}
                            </p>
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            {esPresente && (
                              <span className="px-3 py-1 rounded-full bg-[#DCFCE7] text-[#166534] text-xs font-bold inline-flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">check</span>
                                Presente
                              </span>
                            )}
                            {esJustificado && (
                              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold inline-flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">
                                  event_busy
                                </span>
                                Justificado con Licencia
                              </span>
                            )}
                            {esMulta && (
                              <span className="px-3 py-1 rounded-full bg-[#FEE2E2] text-[#991B1B] text-xs font-bold inline-flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">
                                  warning
                                </span>
                                Inasistencia con Multa Bs. 50.00
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-xs text-[#444653]">
                            {item.observacion || "Firma registrada en libro de actas oficial."}
                          </td>
                          <td className="px-4 py-3.5 text-right whitespace-nowrap">
                            {esMulta ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <Link
                                  href="/vecino/pagos"
                                  className="px-3 py-1 bg-[#00288e] text-white rounded-lg text-xs font-bold hover:bg-[#1e40af] transition-all cursor-pointer shadow-sm"
                                >
                                  Pagar Bs. 50
                                </Link>
                                <button
                                  onClick={() => setModalActa({ open: true, item })}
                                  className="p-1 hover:bg-[#f2f4f6] rounded-lg text-[#00288e] cursor-pointer"
                                  title="Ver Acta"
                                >
                                  <span className="material-symbols-outlined text-base">
                                    description
                                  </span>
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setModalActa({ open: true, item })}
                                className="px-3 py-1 bg-[#f2f4f6] hover:bg-[#00288e] hover:text-white text-[#00288e] rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-colors border border-[#c4c5d5] cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-sm">
                                  description
                                </span>
                                Ver Acta
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer de la tabla */}
            <div className="p-4 border-t border-[#c4c5d5] flex items-center justify-between text-xs text-[#757684]">
              <p>
                Mostrando {asistenciasFiltradas.length} de {asistencias.length} asambleas registradas
              </p>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-[#00288e]">Libro de Actas Oficial OTB</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── Summary Statistics (3 cards abajo) ── */}
      <section className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-[#c4c5d5] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#166534] shrink-0">
            <span className="material-symbols-outlined text-2xl">verified</span>
          </div>
          <div>
            <p className="text-xs text-[#757684] font-medium">Asistencia Anual 2026</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <p className="text-2xl font-black text-[#191c1e]">{porcentaje}%</p>
              <span className="text-[11px] font-bold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                {cumplidas} de {totalAsistencias} cumplidas
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#c4c5d5] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#dde1ff] flex items-center justify-center text-[#00288e] shrink-0">
            <span className="material-symbols-outlined text-2xl">groups</span>
          </div>
          <div>
            <p className="text-xs text-[#757684] font-medium">Indicador Quórum Vecinal</p>
            <p className="text-2xl font-black text-[#00288e] mt-0.5">
              76% <span className="text-xs text-[#757684] font-normal">promedio OTB</span>
            </p>
            <p className="text-[11px] text-[#757684]">Válido legalmente (&gt;50%+1)</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#c4c5d5] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#166534] shrink-0">
            <span className="material-symbols-outlined text-2xl">how_to_reg</span>
          </div>
          <div>
            <p className="text-xs text-[#757684] font-medium">Derecho Asambleario</p>
            <p className="text-sm font-extrabold text-[#166534] flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#166534]"></span>
              Habilitado para Voz y Voto
            </p>
            <p className="text-[11px] text-[#757684]">Cumple requisitos del Estatuto OTB</p>
          </div>
        </div>
      </section>

      {/* ── MODAL: SOLICITAR JUSTIFICACIÓN / LICENCIA ── */}
      {modalJustificacion && (
        <div className="fixed inset-0 z-[120] overflow-y-auto" role="dialog">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => !enviandoJustificacion && setModalJustificacion(false)}
            ></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-[#c4c5d5] relative z-10 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#c4c5d5] pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00288e]">assignment_add</span>
                  <h3 className="font-bold text-base text-[#191c1e]">
                    Solicitar Justificación / Licencia
                  </h3>
                </div>
                <button
                  onClick={() => setModalJustificacion(false)}
                  className="p-1 text-[#757684] hover:bg-[#f2f4f6] rounded-full cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleEnviarJustificacion} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-[#191c1e] mb-1">
                    Asamblea a Justificar
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`${proximaAsamblea?.nombre || "Asamblea General Ordinaria"} - 15 Nov 2026`}
                    className="w-full bg-[#f2f4f6] border border-[#c4c5d5] rounded-xl p-2.5 font-semibold text-[#191c1e] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#191c1e] mb-1">
                    Motivo de Inasistencia *
                  </label>
                  <select
                    value={justificacionForm.motivo}
                    onChange={(e) =>
                      setJustificacionForm({ ...justificacionForm, motivo: e.target.value })
                    }
                    className="w-full bg-white border border-[#c4c5d5] rounded-xl p-2.5 font-medium text-[#191c1e] outline-none cursor-pointer"
                  >
                    <option>Motivo de Salud / Médico</option>
                    <option>Fuerza Mayor / Motivo Laboral</option>
                    <option>Viaje Fuera del Departamento</option>
                    <option>Otro motivo contemplado en Estatuto</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#191c1e] mb-1">
                    Descripción / Fundamentación *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Explica brevemente la razón de tu ausencia..."
                    value={justificacionForm.descripcion}
                    onChange={(e) =>
                      setJustificacionForm({ ...justificacionForm, descripcion: e.target.value })
                    }
                    className="w-full bg-white border border-[#c4c5d5] rounded-xl p-2.5 text-xs text-[#191c1e] outline-none resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#191c1e] mb-1">
                    Adjuntar Respaldo (Certificado médico, boleta, nota)
                  </label>
                  <div
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/*,application/pdf";
                      input.onchange = (e: any) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            setJustificacionForm((prev) => ({
                              ...prev,
                              archivoNombre: file.name,
                              previewUrl: reader.result as string,
                            }));
                          };
                          reader.readAsDataURL(file);
                        }
                      };
                      input.click();
                    }}
                    className="border-2 border-dashed border-[#c4c5d5] rounded-xl p-4 text-center hover:bg-[#f2f4f6] transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[#00288e] text-2xl">
                      cloud_upload
                    </span>
                    <p className="font-bold text-[#191c1e] mt-1">
                      {justificacionForm.archivoNombre || "Haz clic para seleccionar archivo o constancia"}
                    </p>
                    <p className="text-[11px] text-[#757684]">Formatos: PDF, JPG, PNG (máx. 10MB)</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#c4c5d5]">
                  <button
                    type="button"
                    onClick={() => setModalJustificacion(false)}
                    className="px-4 py-2 border border-[#c4c5d5] text-[#444653] rounded-xl font-semibold hover:bg-[#f2f4f6] cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={enviandoJustificacion}
                    className="px-5 py-2 bg-[#00288e] text-white rounded-xl font-bold hover:bg-[#1e40af] shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    {enviandoJustificacion ? "Enviando..." : "Enviar Justificación"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: VER ACTA DE ASAMBLEA ── */}
      {modalActa.open && (
        <div className="fixed inset-0 z-[120] overflow-y-auto" role="dialog">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setModalActa({ open: false, item: null })}
            ></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full border border-[#c4c5d5] relative z-10 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#c4c5d5] pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00288e]">description</span>
                  <h3 className="font-bold text-base text-[#191c1e]">
                    Extracto de Acta de Asamblea
                  </h3>
                </div>
                <button
                  onClick={() => setModalActa({ open: false, item: null })}
                  className="p-1 text-[#757684] hover:bg-[#f2f4f6] rounded-full cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="bg-amber-50/40 p-5 rounded-xl border border-amber-200 font-serif text-xs text-slate-800 space-y-3 leading-relaxed">
                <div className="text-center border-b border-slate-300 pb-2">
                  <h4 className="font-sans font-bold text-sm text-[#00288e] uppercase">
                    OTB VILLA CALAMA — COCHABAMBA
                  </h4>
                  <p className="font-sans text-[10px] text-slate-500">
                    Libro Oficial de Actas Nº 04 • Folio 78
                  </p>
                </div>

                <p>
                  <strong>Asamblea:</strong> {modalActa.item?.asamblea_nombre}
                </p>
                <p>
                  <strong>Fecha de Realización:</strong>{" "}
                  {new Date(modalActa.item?.asamblea_fecha).toLocaleDateString("es-ES", {
                    dateStyle: "full",
                  })}
                </p>
                <p>
                  <strong>Quórum Verificado:</strong> 82 vecinos propietarios acreditados (Mayoría
                  Absoluta).
                </p>
                <p>
                  <strong>Resolución Principal:</strong> Se aprobaron los informes presentados y se
                  dio curso a las mociones reglamentarias asentadas con firma de la Directiva y Control
                  Social.
                </p>
                <p className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <strong>Registro Individual del Vecino:</strong> {vecino?.nombre} (Mz.{" "}
                  {vecino?.manzano}-L.{vecino?.lote}) — Estado:{" "}
                  <span className="font-bold uppercase text-[#00288e]">
                    {modalActa.item?.estado === "present"
                      ? "PRESENTE"
                      : modalActa.item?.estado === "justified"
                      ? "LICENCIA CONCEDIDA"
                      : "INASISTENCIA REGISTRADA"}
                  </span>
                  .
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#c4c5d5]">
                <button
                  onClick={() => setModalActa({ open: false, item: null })}
                  className="px-4 py-2 bg-[#00288e] text-white rounded-xl text-xs font-bold hover:bg-[#1e40af] transition-all cursor-pointer shadow-sm"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
