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

export default function AttendancePage() {
  // Estados para manejar la lógica de la UI
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFinesModalOpen, setIsFinesModalOpen] = useState<boolean>(false);
  const [attendanceList, setAttendanceList] = useState<NeighborAttendance[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(true);

  const API_URL = "http://localhost:5000/api";

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

        // Mapea la estructura de la base de datos (id, nombre, fecha)
        const mappedEvents: EventItem[] = data.map((item: any) => ({
          id: String(item.id),
          title: item.nombre || `${item.tipo} - ${item.fecha}`,
        }));

        setEvents(mappedEvents);

        // Selecciona automáticamente la primera asamblea si existe
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

        // Mapea los datos del backend
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
  }, [selectedEvent]);

  // Cálculo dinámico del Quorum
  const totalRegistered = attendanceList.length;
  const presentCount = attendanceList.filter(
    (item) => item.status === "present",
  ).length;
  const quorumPercentage =
    totalRegistered > 0
      ? Math.round((presentCount / totalRegistered) * 100)
      : 0;

  // --- ACCIONES ---

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
    <div className="bg-[#f7f9fb] text-[#191c1e] font-sans min-h-screen pb-20 lg:pb-0 lg:pl-64">
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      {/* SideNavBar (Desktop) */}
      <aside className="h-screen w-64 fixed left-0 top-0 hidden lg:flex flex-col bg-white border-r border-[#c4c5d5] p-4 space-y-2 z-40">
        <div className="flex items-center gap-3 px-2 py-4">
          <div className="w-10 h-10 rounded-lg bg-[#1e40af] flex items-center justify-center text-[#a8b8ff]">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              account_balance
            </span>
          </div>
          <div>
            <h2 className="font-semibold text-lg text-[#00288e]">
              Gestión OTB
            </h2>
            <p className="text-[10px] text-[#444653] uppercase tracking-widest">
              Cochabamba, Bolivia
            </p>
          </div>
        </div>
        <nav className="flex-1 mt-4 space-y-1">
          <a
            href="#"
            className="flex items-center gap-4 p-3 text-[#444653] hover:bg-[#e6e8ea] rounded-lg transition-all"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-semibold text-sm">Inicio</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-4 p-3 text-[#444653] hover:bg-[#e6e8ea] rounded-lg transition-all"
          >
            <span className="material-symbols-outlined">group</span>
            <span className="font-semibold text-sm">Vecinos</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-4 p-3 text-[#444653] hover:bg-[#e6e8ea] rounded-lg transition-all"
          >
            <span className="material-symbols-outlined">payments</span>
            <span className="font-semibold text-sm">Pagos</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-4 p-3 bg-[#1e40af] text-[#a8b8ff] font-bold rounded-lg transition-all"
          >
            <span className="material-symbols-outlined">construction</span>
            <span className="font-semibold text-sm">Proyectos</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-4 p-3 text-[#444653] hover:bg-[#e6e8ea] rounded-lg transition-all"
          >
            <span className="material-symbols-outlined">assessment</span>
            <span className="font-semibold text-sm">Reportes</span>
          </a>
        </nav>
        <div className="pt-4 border-t border-[#c4c5d5]">
          <button className="w-full bg-[#00288e] text-white font-semibold text-sm py-3 px-4 rounded-lg shadow-sm hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">add</span>
            Registrar Pago
          </button>
        </div>
      </aside>

      {/* TopNavBar */}
      <header className="w-full sticky top-0 z-30 bg-[#f7f9fb] border-b border-[#c4c5d5] shadow-sm flex justify-between items-center px-6 py-3 max-w-[1280px] mx-auto">
        <div className="flex items-center gap-2">
          <span className="lg:hidden material-symbols-outlined text-[#00288e] cursor-pointer">
            menu
          </span>
          <h1 className="text-xl font-semibold text-[#00288e]">
            Comunidad Gestión
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-[#f2f4f6] rounded-full px-4 py-1 border border-[#c4c5d5]">
            <span className="material-symbols-outlined text-[#444653] text-sm mr-2">
              search
            </span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-48 outline-none"
              placeholder="Buscar..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1 rounded-full hover:bg-[#f2f4f6] transition-colors">
              <span className="material-symbols-outlined text-[#444653]">
                notifications
              </span>
            </button>
            <div className="w-8 h-8 rounded-full bg-[#dde1ff] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#00288e] text-lg">
                account_circle
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1280px] mx-auto p-4 lg:p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[#00288e] font-semibold text-xs uppercase tracking-wider">
              Control de Eventos
            </span>
            <h2 className="text-3xl font-bold mt-1">Registro de Asistencia</h2>

            {/* Quorum Bar */}
            <div className="flex items-center gap-4 mt-3 bg-[#1e40af]/10 border border-[#00288e]/20 rounded-full px-4 py-1 w-fit">
              <div className="flex items-center gap-1">
                <span className="font-bold text-[#00288e]">
                  {quorumPercentage}%
                </span>
                <span className="text-xs text-[#444653]">Quorum</span>
              </div>
              <div className="w-32 bg-[#e0e3e5] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#00288e] h-full transition-all duration-300"
                  style={{ width: `${quorumPercentage}%` }}
                ></div>
              </div>
              <span className="text-xs text-[#444653] font-medium">
                {presentCount} de {totalRegistered} vecinos
              </span>
            </div>

            <p className="text-[#444653] text-base mt-2">
              Seleccione una asamblea para registrar la asistencia de los
              vecinos y gestionar el quorum legal.
            </p>
          </div>
          <div>
            <button
              onClick={() => setIsFinesModalOpen(true)}
              className="flex items-center gap-2 bg-[#ba1a1a] text-white font-semibold text-sm px-6 py-3 rounded-lg shadow-sm hover:brightness-110 active:scale-95 transition-all"
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
    </div>
  );
}
