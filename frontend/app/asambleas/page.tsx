"use client";

import React, { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Evento {
  id: number;
  tipo: string;
  nombre: string;
  fecha: string;
  hora: string;
  lugar: string;
}

export default function AsambleasPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [busqueda, setBusqueda] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    tipo: "Asamblea General Ordinaria",
    nombre: "Asamblea General Ordinaria",
    fecha: new Date().toISOString().split("T")[0],
    hora: "19:00",
    lugar: "Sede Social OTB",
  });

  // 1. Cargar Eventos (GET)
  const fetchEventos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/asambleas`);
      if (response.ok) {
        const data = await response.json();
        setEventos(data);
      } else {
        console.error("Error al obtener las asambleas");
      }
    } catch (error) {
      console.error("Error en la petición GET:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  // 2. Crear o Editar Evento (POST / PUT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const isEditing = editingId !== null;

      // Mantenemos la ruta base /api/asambleas para POST y PUT
      const url = `${API_URL}/asambleas`;
      const method = isEditing ? "PUT" : "POST";

      // Si se edita, incluimos el id en el cuerpo JSON
      const payload = isEditing ? { id: editingId, ...formData } : formData;

      let response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Si el backend espera PUT /api/asambleas/:id en lugar del ID en el body, se reintenta automáticamente
      if (!response.ok && isEditing && response.status === 404) {
        response = await fetch(`${API_URL}/asambleas/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (response.ok) {
        alert(
          isEditing
            ? "Asamblea actualizada con éxito"
            : "Asamblea programada con éxito",
        );
        resetForm();
        fetchEventos();
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(
          `Error: ${errData.message || errData.error || "No se pudo guardar la asamblea"}`,
        );
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      alert("Ocurrió un error al conectar con el servidor Express");
    } finally {
      setSaving(false);
    }
  };

  // Preparar edición
  const handleEdit = (evento: Evento) => {
    setEditingId(evento.id);
    setFormData({
      tipo: evento.tipo,
      nombre: evento.nombre,
      fecha: evento.fecha,
      hora: evento.hora,
      lugar: evento.lugar,
    });
  };

  // Cancelar edición
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      tipo: "Asamblea General Ordinaria",
      nombre: "Asamblea General Ordinaria",
      fecha: new Date().toISOString().split("T")[0],
      hora: "19:00",
      lugar: "Sede Social OTB",
    });
  };

  // 3. Eliminar Evento (DELETE)
  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este evento?")) return;
    try {
      const response = await fetch(`${API_URL}/asambleas/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setEventos((prev) => prev.filter((ev) => ev.id !== id));
      } else {
        alert("No se pudo eliminar el evento");
      }
    } catch (error) {
      console.error("Error en la petición DELETE:", error);
    }
  };

  // Filtrar eventos por búsqueda
  const eventosFiltrados = eventos.filter(
    (ev) =>
      ev.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      ev.lugar.toLowerCase().includes(busqueda.toLowerCase()) ||
      ev.tipo.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] font-sans min-h-screen pb-20 lg:pb-0 lg:pl-64">
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      {/* SideNavBar (Desktop) */}
      <aside className="h-screen w-64 fixed left-0 top-0 hidden lg:flex flex-col bg-white border-r border-[#c4c5d5] p-4 space-y-1">
        <div className="flex items-center gap-3 px-3 py-4">
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
        <nav className="flex-1 mt-4">
          <a
            className="flex items-center gap-4 p-3 text-[#444653] hover:bg-[#e0e3e5] rounded-lg transition-all"
            href="#"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-semibold text-sm">Inicio</span>
          </a>
          <a
            className="flex items-center gap-4 p-3 text-[#444653] hover:bg-[#e0e3e5] rounded-lg transition-all"
            href="#"
          >
            <span className="material-symbols-outlined">group</span>
            <span className="font-semibold text-sm">Vecinos</span>
          </a>
          <a
            className="flex items-center gap-4 p-3 text-[#444653] hover:bg-[#e0e3e5] rounded-lg transition-all"
            href="#"
          >
            <span className="material-symbols-outlined">payments</span>
            <span className="font-semibold text-sm">Pagos</span>
          </a>
          <a
            className="flex items-center gap-4 p-3 bg-[#1e40af] text-[#a8b8ff] font-bold rounded-lg transition-all"
            href="#"
          >
            <span className="material-symbols-outlined">event</span>
            <span className="font-semibold text-sm">Asambleas</span>
          </a>
          <a
            className="flex items-center gap-4 p-3 text-[#444653] hover:bg-[#e0e3e5] rounded-lg transition-all"
            href="#"
          >
            <span className="material-symbols-outlined">assessment</span>
            <span className="font-semibold text-sm">Reportes</span>
          </a>
        </nav>
      </aside>

      {/* TopNavBar */}
      <header className="w-full sticky top-0 z-50 bg-[#f7f9fb] border-b border-[#c4c5d5] shadow-sm flex justify-between items-center px-6 py-3 max-w-[1280px] mx-auto">
        <div className="flex items-center gap-3">
          <span className="lg:hidden material-symbols-outlined text-[#00288e]">
            menu
          </span>
          <h1 className="text-xl font-semibold text-[#00288e]">
            Comunidad Gestión
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-[#f2f4f6] rounded-full px-4 py-1 border border-[#c4c5d5]">
            <span className="material-symbols-outlined text-[#444653] text-sm mr-1">
              search
            </span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-48 outline-none"
              placeholder="Buscar asamblea..."
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
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
        <div>
          <span className="text-[#00288e] font-semibold text-sm uppercase tracking-wider">
            Control de Eventos
          </span>
          <h2 className="text-3xl font-bold mt-1">Asambleas</h2>
          <p className="text-[#444653] text-base mt-1">
            Gestione las reuniones de la OTB y verifique la presencia de los
            vecinos en tiempo real.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Formulario */}
          <section className="xl:col-span-4 space-y-6">
            <div className="bg-white border border-[#c4c5d5] rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-[#00288e]"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    event
                  </span>
                  <h3 className="font-semibold text-xl">
                    {editingId ? "Editar Asamblea" : "Programar Asamblea"}
                  </h3>
                </div>
                {editingId && (
                  <button
                    onClick={resetForm}
                    className="text-xs text-[#ba1a1a] underline hover:opacity-80"
                  >
                    Cancelar
                  </button>
                )}
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-1">
                  <label className="font-semibold text-sm text-[#191c1e]">
                    Tipo de Reunión
                  </label>
                  <select
                    className="w-full border border-[#c4c5d5] rounded-lg p-3 bg-white focus:ring-2 focus:ring-[#00288e] outline-none transition-all"
                    value={formData.tipo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tipo: e.target.value,
                        nombre: e.target.value,
                      })
                    }
                  >
                    <option value="Asamblea General Ordinaria">
                      Asamblea General Ordinaria
                    </option>
                    <option value="Asamblea Extraordinaria">
                      Asamblea Extraordinaria
                    </option>
                    <option value="Reunión de Directorio">
                      Reunión de Directorio
                    </option>
                    <option value="Mesa de Trabajo Proyectos">
                      Mesa de Trabajo Proyectos
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-sm text-[#191c1e]">
                      Fecha
                    </label>
                    <input
                      className="w-full border border-[#c4c5d5] rounded-lg p-3 bg-white focus:ring-2 focus:ring-[#00288e] outline-none transition-all"
                      type="date"
                      value={formData.fecha}
                      onChange={(e) =>
                        setFormData({ ...formData, fecha: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-sm text-[#191c1e]">
                      Hora
                    </label>
                    <input
                      className="w-full border border-[#c4c5d5] rounded-lg p-3 bg-white focus:ring-2 focus:ring-[#00288e] outline-none transition-all"
                      type="time"
                      value={formData.hora}
                      onChange={(e) =>
                        setFormData({ ...formData, hora: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-sm text-[#191c1e]">
                    Lugar
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#444653]">
                      location_on
                    </span>
                    <input
                      className="w-full border border-[#c4c5d5] rounded-lg p-3 pl-10 bg-white focus:ring-2 focus:ring-[#00288e] outline-none transition-all"
                      placeholder="Sede Social OTB"
                      type="text"
                      value={formData.lugar}
                      onChange={(e) =>
                        setFormData({ ...formData, lugar: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <button
                  disabled={saving}
                  className="w-full bg-[#00288e] text-white font-semibold text-sm py-3 rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  type="submit"
                >
                  <span className="material-symbols-outlined">
                    {saving ? "sync" : "save"}
                  </span>
                  {saving
                    ? "Guardando..."
                    : editingId
                      ? "Actualizar Asamblea"
                      : "Guardar y Empezar"}
                </button>
              </form>
            </div>
          </section>

          {/* Tabla de Eventos */}
          <section className="xl:col-span-8 bg-white border border-[#c4c5d5] rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="p-6 border-b border-[#c4c5d5] flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-white z-10">
              <div>
                <h3 className="font-semibold text-xl">Listado de Eventos</h3>
                <p className="text-[#444653] text-sm">Próximos y pasados</p>
              </div>
              <div className="flex items-center bg-[#f2f4f6] rounded-lg px-4 py-2 border border-[#c4c5d5] w-full md:w-64">
                <span className="material-symbols-outlined text-[#444653] text-sm mr-2">
                  search
                </span>
                <input
                  className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
                  placeholder="Buscar evento..."
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#f2f4f6] text-[#444653] sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-sm">
                      Evento / Tipo
                    </th>
                    <th className="px-4 py-3 font-semibold text-sm">
                      Fecha y Hora
                    </th>
                    <th className="px-4 py-3 font-semibold text-sm">Lugar</th>
                    <th className="px-6 py-3 font-semibold text-sm text-right">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c4c5d5]">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-6 text-[#444653]"
                      >
                        Cargando eventos desde Express (puerto 5000)...
                      </td>
                    </tr>
                  ) : eventosFiltrados.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-6 text-[#444653]"
                      >
                        No se encontraron eventos.
                      </td>
                    </tr>
                  ) : (
                    eventosFiltrados.map((ev) => (
                      <tr
                        key={ev.id}
                        className="hover:bg-[#f2f4f6] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-sm">{ev.nombre}</p>
                            <p className="text-xs text-[#00288e]">{ev.tipo}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm">{ev.fecha}</span>
                            <span className="text-xs text-[#444653]">
                              {ev.hora}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-[#444653] text-sm">
                          {ev.lugar}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => handleEdit(ev)}
                              className="p-2 text-[#00288e] hover:bg-[#1e40af]/10 rounded-lg transition-colors cursor-pointer"
                              title="Editar"
                            >
                              <span className="material-symbols-outlined text-sm">
                                edit
                              </span>
                            </button>
                            <button
                              onClick={() => handleDelete(ev.id)}
                              className="p-2 text-[#ba1a1a] hover:bg-[#ffdad6]/50 rounded-lg transition-colors cursor-pointer"
                              title="Eliminar"
                            >
                              <span className="material-symbols-outlined text-sm">
                                delete
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-[#f2f4f6] border-t border-[#c4c5d5] flex justify-between items-center">
              <span className="text-[#444653] text-xs font-medium">
                Mostrando {eventosFiltrados.length} de {eventos.length} eventos
              </span>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
