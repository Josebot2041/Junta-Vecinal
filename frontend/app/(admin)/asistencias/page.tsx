"use client";

import { useState, useEffect } from "react";

// Interfaces de Tipado
interface NeighborAttendance {
  id: string;
  name: string;
  property: string;
  initials: string;
  status: "present" | "absent" | "excused";
}

interface EventItem {
  id: string;
  title: string;
}

interface Justificacion {
  id: number;
  asamblea_id: number;
  vecino_id: number;
  vecino_nombre?: string;
  manzano?: string;
  lote?: string;
  asamblea_nombre?: string;
  asamblea_fecha?: string;
  motivo: string;
  descripcion: string;
  documento_url?: string;
  estado: string; // 'Pendiente' | 'Aprobada' | 'Rechazada'
  creado_en: string;
}

export default function AttendancePage() {
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFinesModalOpen, setIsFinesModalOpen] = useState<boolean>(false);
  const [isJustificacionesModalOpen, setIsJustificacionesModalOpen] = useState<boolean>(false);
  const [previewDocModal, setPreviewDocModal] = useState<string | null>(null);
  const [attendanceList, setAttendanceList] = useState<NeighborAttendance[]>([]);
  const [justificaciones, setJustificaciones] = useState<Justificacion[]>([]);
  const [preQuorum, setPreQuorum] = useState<{
    confirmados: number;
    totalVecinos: number;
    porcentaje: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(true);

  const API_URL = "http://localhost:5000/api";

  // Cargar justificaciones
  const fetchJustificaciones = async () => {
    try {
      const res = await fetch(`${API_URL}/asistencias/justificaciones`);
      if (res.ok) {
        const data = await res.json();
        setJustificaciones(data);
      }
    } catch (error) {
      console.error("Error al cargar justificaciones:", error);
    }
  };

  // Cargar pre-quórum
  const fetchPreQuorum = async (asambleaId: string) => {
    if (!asambleaId) return;
    try {
      const res = await fetch(`${API_URL}/asambleas/${asambleaId}/pre-quorum`);
      if (res.ok) {
        const data = await res.json();
        setPreQuorum(data);
      }
    } catch (error) {
      console.error("Error al cargar pre-quórum:", error);
    }
  };

  // 1. Cargar las asambleas creadas desde el Backend
  useEffect(() => {
    const fetchAsambleas = async () => {
      setIsLoadingEvents(true);
      try {
        const response = await fetch(`${API_URL}/asambleas`);
        if (!response.ok) {
          throw new Error("Error al obtener las asambleas");
        }
        const data = await response.json();

        const mappedEvents: EventItem[] = data.map((item: any) => ({
          id: String(item.id),
          title: item.nombre || `${item.tipo} - ${item.fecha}`,
        }));

        setEvents(mappedEvents);

        if (mappedEvents.length > 0) {
          setSelectedEvent(mappedEvents[0].id);
        }
      } catch (error) {
        console.error("Error al cargar las asambleas:", error);
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchAsambleas();
    fetchJustificaciones();
  }, []);

  // 2. Cargar los vecinos y asistencias según la asamblea seleccionada
  useEffect(() => {
    const fetchAttendance = async () => {
      if (!selectedEvent) return;
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/asistencias/${selectedEvent}`);
        if (!response.ok) {
          throw new Error("Error al obtener las asistencias");
        }
        const data = await response.json();

        const mappedList: NeighborAttendance[] = data.map((item: any) => ({
          id: String(item.id),
          name: item.nombre,
          property: item.property,
          initials: item.nombre
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),
          status: item.status,
        }));

        setAttendanceList(mappedList);
      } catch (error) {
        console.error("Error al cargar la lista de asistencia:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendance();
    fetchPreQuorum(selectedEvent);
  }, [selectedEvent]);

  const handleResolverJustificacion = async (id: number, nuevoEstado: "Aprobada" | "Rechazada") => {
    try {
      const res = await fetch(`${API_URL}/asistencias/justificaciones/${id}/resolver`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      if (res.ok) {
        await fetchJustificaciones();
        // Recargar asistencia para reflejar estado 'justified' / 'absent'
        if (selectedEvent) {
          const response = await fetch(`${API_URL}/asistencias/${selectedEvent}`);
          if (response.ok) {
            const data = await response.json();
            const mappedList: NeighborAttendance[] = data.map((item: any) => ({
              id: String(item.id),
              name: item.nombre,
              property: item.property,
              initials: item.nombre
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase(),
              status: item.status,
            }));
            setAttendanceList(mappedList);
          }
        }
      } else {
        alert("Error al resolver la solicitud de licencia.");
      }
    } catch (err) {
      console.error("Error al resolver justificación:", err);
    }
  };

  // Cálculo dinámico del Quorum
  const totalRegistered = attendanceList.length;
  const presentCount = attendanceList.filter(
    (item) => item.status === "present",
  ).length;
  const quorumPercentage =
    totalRegistered > 0
      ? Math.round((presentCount / totalRegistered) * 100)
      : 0;

  const handleStatusChange = async (
    id: string,
    status: "present" | "absent" | "excused",
  ) => {
    const previousList = [...attendanceList];

    setAttendanceList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item)),
    );

    try {
      const response = await fetch(`${API_URL}/asistencias/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: selectedEvent,
          neighborId: id,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al guardar la asistencia en el servidor");
      }
    } catch (error) {
      console.error("Error al actualizar la asistencia:", error);
      setAttendanceList(previousList);
      alert(
        "No se pudo actualizar el estado de asistencia. Inténtelo de nuevo.",
      );
    }
  };

  const handleGenerateFines = async () => {
    try {
      const response = await fetch(`${API_URL}/asistencias/fines/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: selectedEvent }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Multas generadas exitosamente.");
        setIsFinesModalOpen(false);
      } else {
        alert(data.error || "Hubo un error al generar las multas.");
      }
    } catch (error) {
      console.error("Error al generar multas:", error);
      alert("Error de conexión al generar las multas.");
    }
  };

  const filteredNeighbors = attendanceList.filter(
    (neighbor) =>
      neighbor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      neighbor.property.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <main className="max-w-[1280px] mx-auto p-4 lg:p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[#00288e] font-semibold text-xs uppercase tracking-wider">
              Control de Eventos
            </span>
            <h2 className="text-3xl font-bold mt-1">Registro de Asistencia</h2>

            {/* Quorum Bar & Pre-Quorum Badge */}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <div className="flex items-center gap-4 bg-[#1e40af]/10 border border-[#00288e]/20 rounded-full px-4 py-1 w-fit">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-[#00288e]">
                    {quorumPercentage}%
                  </span>
                  <span className="text-xs text-[#444653]">Quorum en Sala</span>
                </div>
                <div className="w-24 bg-[#e0e3e5] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#00288e] h-full transition-all duration-300"
                    style={{ width: `${quorumPercentage}%` }}
                  ></div>
                </div>
                <span className="text-xs text-[#444653] font-medium">
                  {presentCount} de {totalRegistered}
                </span>
              </div>

              {preQuorum && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-3.5 py-1 text-xs text-emerald-800 font-semibold shadow-xs">
                  <span className="material-symbols-outlined text-sm text-emerald-600">how_to_reg</span>
                  <span>Pre-Quórum Web: <strong>{preQuorum.confirmados}</strong> confirmados ({preQuorum.porcentaje}%)</span>
                </div>
              )}
            </div>

            <p className="text-[#444653] text-base mt-2">
              Seleccione una asamblea para registrar la asistencia de los
              vecinos y gestionar el quorum legal.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsJustificacionesModalOpen(true)}
              className="flex items-center gap-2 bg-[#00288e] text-white font-semibold text-sm px-5 py-3 rounded-lg shadow-sm hover:brightness-110 active:scale-95 transition-all cursor-pointer relative"
            >
              <span className="material-symbols-outlined">medical_information</span>
              Bandeja de Licencias
              {justificaciones.filter((j) => j.estado === "Pendiente").length > 0 && (
                <span className="bg-amber-400 text-amber-950 text-xs font-black px-2 py-0.5 rounded-full shadow-xs">
                  {justificaciones.filter((j) => j.estado === "Pendiente").length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsFinesModalOpen(true)}
              className="flex items-center gap-2 bg-[#ba1a1a] text-white font-semibold text-sm px-6 py-3 rounded-lg shadow-sm hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined">gavel</span>
              Generar Multas Automáticas
            </button>
          </div>
        </div>

        {/* Section List */}
        <section className="bg-white border border-[#c4c5d5] rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div className="p-6 border-b border-[#c4c5d5] flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-white z-20">
            <div className="w-full md:w-1/2">
              <h3 className="text-lg font-semibold mb-2">
                Listado de Asistencia
              </h3>
              <div className="flex flex-col gap-2 bg-[#f2f4f6] p-4 rounded-xl border border-[#00288e]/20">
                <label className="text-xs font-medium text-[#444653]">
                  Seleccionar Asamblea Creada
                </label>
                <div className="relative">
                  {isLoadingEvents ? (
                    <div className="p-3 text-sm text-[#444653]">
                      Cargando asambleas...
                    </div>
                  ) : events.length === 0 ? (
                    <div className="p-3 text-sm text-[#ba1a1a]">
                      No hay asambleas registradas.
                    </div>
                  ) : (
                    <select
                      value={selectedEvent}
                      onChange={(e) => setSelectedEvent(e.target.value)}
                      className="w-full p-3 bg-[#f2f4f6] border border-[#c4c5d5] rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00288e]/20 transition-all"
                    >
                      {events.map((ev) => (
                        <option key={ev.id} value={ev.id}>
                          {ev.title}
                        </option>
                      ))}
                    </select>
                  )}
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#444653]">
                    <span className="material-symbols-outlined">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center bg-[#f2f4f6] rounded-lg px-4 py-2 border border-[#c4c5d5] w-full md:w-64">
              <span className="material-symbols-outlined text-[#444653] text-sm mr-2">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
                placeholder="Filtrar por nombre o casa..."
              />
            </div>
          </div>

          {/* Tabla de Asistencia */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center text-[#444653] font-medium">
                Cargando registros de asistencia...
              </div>
            ) : filteredNeighbors.length === 0 ? (
              <div className="p-8 text-center text-[#444653]">
                No se encontraron registros de vecinos para esta asamblea.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#f2f4f6] text-[#444653] sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-sm">
                      Vecino / Propiedad
                    </th>
                    <th className="px-4 py-4 font-semibold text-sm text-center">
                      Presente
                    </th>
                    <th className="px-4 py-4 font-semibold text-sm text-center">
                      Ausente
                    </th>
                    <th className="px-4 py-4 font-semibold text-sm text-center">
                      Licencia
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c4c5d5]">
                  {filteredNeighbors.map((neighbor) => (
                    <tr
                      key={neighbor.id}
                      className="hover:bg-[#f2f4f6] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#eceef0] flex items-center justify-center text-[#00288e] font-bold">
                            {neighbor.initials}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">
                              {neighbor.name}
                            </p>
                            <p className="text-xs text-[#444653]">
                              {neighbor.property}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <input
                          type="radio"
                          name={`att_${neighbor.id}`}
                          checked={neighbor.status === "present"}
                          onChange={() =>
                            handleStatusChange(neighbor.id, "present")
                          }
                          className="w-6 h-6 text-[#006c49] focus:ring-[#006c49] border-[#c4c5d5] rounded-full cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <input
                          type="radio"
                          name={`att_${neighbor.id}`}
                          checked={neighbor.status === "absent"}
                          onChange={() =>
                            handleStatusChange(neighbor.id, "absent")
                          }
                          className="w-6 h-6 text-[#ba1a1a] focus:ring-[#ba1a1a] border-[#c4c5d5] rounded-full cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <input
                          type="radio"
                          name={`att_${neighbor.id}`}
                          checked={neighbor.status === "excused"}
                          onChange={() =>
                            handleStatusChange(neighbor.id, "excused")
                          }
                          className="w-6 h-6 text-[#00288e] focus:ring-[#00288e] border-[#c4c5d5] rounded-full cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="p-6 bg-[#f2f4f6] border-t border-[#c4c5d5] flex justify-between items-center">
            <span className="text-[#444653] text-xs font-medium">
              Mostrando {filteredNeighbors.length} de {attendanceList.length}{" "}
              registros
            </span>
          </div>
        </section>
      </main>

      {/* Modal Multas */}
      {isFinesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-xl">
            <div className="flex items-center gap-2 text-[#ba1a1a] mb-4">
              <span className="material-symbols-outlined text-4xl">
                warning
              </span>
              <h3 className="text-xl font-semibold">¿Generar Multas?</h3>
            </div>
            <p className="text-[#444653] text-sm mb-6">
              Esta acción aplicará una multa automática a todos los vecinos
              marcados como &quot;Ausente&quot; sin licencia en esta asamblea.
              ¿Desea continuar?
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleGenerateFines}
                className="w-full bg-[#ba1a1a] text-white font-semibold text-sm py-3 rounded-lg shadow-sm hover:brightness-110 active:scale-95 transition-all"
              >
                Confirmar y Aplicar Multas
              </button>
              <button
                onClick={() => setIsFinesModalOpen(false)}
                className="w-full bg-[#e6e8ea] text-[#444653] font-semibold text-sm py-3 rounded-lg hover:bg-[#e0e3e5] transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Bandeja de Licencias / Justificaciones */}
      {isJustificacionesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#dde1ff] text-[#00288e] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined">medical_information</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Bandeja de Licencias e Inasistencias</h3>
                  <p className="text-xs text-slate-500">Solicitudes de justificación enviadas por los vecinos</p>
                </div>
              </div>
              <button
                onClick={() => setIsJustificacionesModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {justificaciones.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">event_available</span>
                <p className="text-sm font-medium">No hay solicitudes de justificación registradas.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                {justificaciones.map((j) => (
                  <div
                    key={j.id}
                    className="p-4 rounded-xl border border-slate-200 bg-[#f7f9fb] hover:border-slate-300 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{j.vecino_nombre}</span>
                          <span className="text-xs text-slate-500 font-medium">
                            (Mz. {j.manzano || "-"} - Lote {j.lote || "-"})
                          </span>
                        </div>
                        <p className="text-xs text-[#00288e] font-semibold mt-0.5">
                          Asamblea: {j.asamblea_nombre} {j.asamblea_fecha ? `• ${j.asamblea_fecha}` : ""}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full w-fit ${
                          j.estado === "Aprobada"
                            ? "bg-[#DCFCE7] text-[#166534]"
                            : j.estado === "Rechazada"
                            ? "bg-[#FEE2E2] text-[#ba1a1a]"
                            : "bg-amber-100 text-amber-900"
                        }`}
                      >
                        {j.estado}
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
                      <p>
                        <strong className="text-slate-900">Motivo:</strong> {j.motivo}
                      </p>
                      <p>
                        <strong className="text-slate-900">Explicación:</strong> {j.descripcion || "Sin descripción adicional"}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      {j.documento_url ? (
                        <button
                          type="button"
                          onClick={() => setPreviewDocModal(j.documento_url || null)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-[#00288e] hover:underline"
                        >
                          <span className="material-symbols-outlined text-sm">attachment</span>
                          Ver Documento de Respaldo
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Sin archivo adjunto</span>
                      )}

                      {j.estado === "Pendiente" && (
                        <div className="flex items-center gap-2 ml-auto">
                          <button
                            onClick={() => handleResolverJustificacion(j.id, "Rechazada")}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#ba1a1a] border border-[#ba1a1a]/40 hover:bg-[#FEE2E2] transition-colors"
                          >
                            Rechazar
                          </button>
                          <button
                            onClick={() => handleResolverJustificacion(j.id, "Aprobada")}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#006c49] hover:brightness-110 shadow-xs transition-colors flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-xs">check</span>
                            Aprobar Licencia
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsJustificacionesModalOpen(false)}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-600 border border-slate-300 hover:bg-slate-100 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Preview Documento */}
      {previewDocModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-sm text-slate-900">Respaldo de Justificación</h4>
              <button
                onClick={() => setPreviewDocModal(null)}
                className="p-1 text-slate-400 hover:text-slate-800"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="border border-slate-200 rounded-xl p-2 bg-slate-50 flex items-center justify-center max-h-96 overflow-auto">
              <img
                src={previewDocModal}
                alt="Documento de justificación"
                className="max-h-80 w-auto object-contain rounded-lg shadow-sm"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setPreviewDocModal(null)}
                className="px-4 py-1.5 bg-[#00288e] text-white rounded-lg text-xs font-bold"
              >
                Cerrar Vista Previa
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
