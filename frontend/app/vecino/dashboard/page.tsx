"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface Vecino {
  id: number;
  nombre: string;
  ci: string;
  telefono?: string;
  manzano: string;
  lote: string;
  direccion?: string;
  saldo: string | number;
  estado_cuenta: string;
}

interface Pago {
  id: number;
  concepto: string;
  monto: number;
  estado: string;
  fecha: string;
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

interface Comunicado {
  id: number;
  titulo: string;
  categoria: string;
  descripcion: string;
  imagen_url?: string | null;
  archivo_nombre?: string | null;
  prioridad: string;
  creado_en: string;
}

const API = "http://localhost:5000/api";

export default function VecinoDashboardPage() {
  const [vecinos, setVecinos] = useState<Vecino[]>([]);
  const [currentVecino, setCurrentVecino] = useState<Vecino | null>(null);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [asamblea, setAsamblea] = useState<Asamblea | null>(null);
  const [comunicados, setComunicados] = useState<Comunicado[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados interactivos
  const [asistenciaConfirmada, setAsistenciaConfirmada] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modales
  const [temarioModal, setTemarioModal] = useState(false);
  const [historialModal, setHistorialModal] = useState(false);
  const [pazYSalvoModal, setPazYSalvoModal] = useState(false);

  const certificadoRef = useRef<HTMLDivElement>(null);

  // Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [resVecinos, resAsambleas, resComunicados] = await Promise.all([
          fetch(`${API}/vecinos`).catch(() => null),
          fetch(`${API}/asambleas`).catch(() => null),
          fetch(`${API}/comunicados`).catch(() => null),
        ]);

        let vecinoSeleccionado: Vecino | null = null;

        if (resVecinos && resVecinos.ok) {
          const dataVecinos: Vecino[] = await resVecinos.json();
          setVecinos(dataVecinos);

          // Determinar qué vecino mostrar según usuario autenticado en localStorage
          const localUser = localStorage.getItem("user");
          if (localUser) {
            try {
              const parsed = JSON.parse(localUser);
              const found = dataVecinos.find(
                (v) => String(v.ci) === String(parsed.ci)
              );
              vecinoSeleccionado = found || dataVecinos[0] || null;
            } catch {
              vecinoSeleccionado = dataVecinos[0] || null;
            }
          } else {
            vecinoSeleccionado = dataVecinos[0] || null;
          }
          setCurrentVecino(vecinoSeleccionado);
        }

        // Cargar pagos del vecino seleccionado
        if (vecinoSeleccionado) {
          const resHistorial = await fetch(
            `${API}/vecinos/${vecinoSeleccionado.id}/historial`
          ).catch(() => null);
          if (resHistorial && resHistorial.ok) {
            const dataHistorial = await resHistorial.json();
            setPagos(dataHistorial.pagos || []);
          }
        }

        if (resAsambleas && resAsambleas.ok) {
          const dataAsam = await resAsambleas.json();
          if (Array.isArray(dataAsam) && dataAsam.length > 0) {
            setAsamblea(dataAsam[0]);
          }
        }

        if (resComunicados && resComunicados.ok) {
          const dataCom = await resComunicados.json();
          setComunicados(dataCom);
        }
      } catch (err) {
        console.error("Error al cargar datos del vecino:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Confirmar asistencia
  const handleConfirmarAsistencia = () => {
    if (asistenciaConfirmada) return;
    setConfirmando(true);
    setTimeout(() => {
      setConfirmando(false);
      setAsistenciaConfirmada(true);
      setToastMessage("¡Asistencia confirmada exitosamente ante la directiva!");
      setTimeout(() => setToastMessage(null), 3500);
    }, 1000);
  };

  // Imprimir Certificado de Paz y Salvo
  const handlePrintPazYSalvo = () => {
    const content = certificadoRef.current?.innerHTML;
    if (!content) return;
    const printWindow = window.open("", "_blank", "width=800,height=900");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Certificado de Solvencia y Paz y Salvo - OTB Villa Calama</title>
          <style>
            body { font-family: 'Arial', sans-serif; padding: 40px; color: #111; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #00288e; padding-bottom: 16px; margin-bottom: 24px; }
            .title { font-size: 22px; font-weight: bold; color: #00288e; text-transform: uppercase; margin: 4px 0; }
            .subtitle { font-size: 13px; color: #555; }
            .certificate-number { font-size: 11px; font-weight: bold; color: #00288e; margin-top: 8px; }
            .body-text { font-size: 15px; margin: 24px 0; text-align: justify; }
            .badge-box { background: #DCFCE7; border: 2px solid #166534; color: #166534; padding: 14px; text-align: center; font-size: 18px; font-weight: bold; border-radius: 8px; margin: 24px 0; }
            .signatures { display: flex; justify-content: space-around; margin-top: 70px; text-align: center; font-size: 13px; }
            .sign-line { border-top: 1px solid #333; width: 180px; margin: 0 auto 6px auto; }
            .footer { font-size: 10px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 12px; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const fechaHoyStr = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const saldoNumerico = currentVecino ? Number(currentVecino.saldo || 0) : 0;
  const estaAlDia = saldoNumerico <= 0;

  // Último pago registrado
  const ultimoPago = pagos.length > 0 ? pagos[0] : null;

  return (
    <main className="flex-1 p-4 md:p-8 max-w-[1280px] mx-auto min-h-screen">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[150] bg-[#166534] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined">check_circle</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <section className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-extrabold text-[#191c1e] tracking-tight">
              Hola, {currentVecino?.nombre || "Vecino de la OTB"}
            </h1>
            <span className="bg-[#e0e3e5] text-[#191c1e] text-xs font-bold px-3 py-1 rounded-full border border-[#c4c5d5] flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#00288e]">
                home
              </span>
              Mz. {currentVecino?.manzano || "-"} · Lote{" "}
              {currentVecino?.lote || "-"}
            </span>
          </div>
          <p className="text-[#444653] text-sm md:text-base mt-1">
            Bienvenido a tu panel de control de la OTB Villa Calama.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Fecha Actual */}
          <div className="flex items-center gap-2 text-[#444653] bg-white border border-[#c4c5d5] px-3.5 py-2 rounded-xl shadow-sm text-xs md:text-sm font-semibold">
            <span className="material-symbols-outlined text-[#00288e] text-base">
              calendar_today
            </span>
            <span className="capitalize">{fechaHoyStr}</span>
          </div>
        </div>
      </section>

      {/* Bento Grid Principal */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* ── 1. ESTADO DE CUENTA CARD (Bento Large - 8 cols) ── */}
        <div className="md:col-span-8 bg-white border border-[#c4c5d5] rounded-2xl p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#00288e]/5 rounded-bl-full -mr-8 -mt-8 pointer-events-none transition-transform group-hover:scale-110"></div>

          <div className="flex flex-col h-full justify-between gap-6 relative z-10">
            {/* Cabecera de la tarjeta */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-[#757684] uppercase tracking-wider mb-1">
                  Estado de Cuenta Personal
                </p>
                <h2 className="text-xl font-bold text-[#191c1e]">
                  Manzano {currentVecino?.manzano || "-"} — Lote{" "}
                  {currentVecino?.lote || "-"}
                </h2>
                <p className="text-xs text-[#444653]">
                  OTB Villa Calama · Cochabamba, Bolivia
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm ${
                  estaAlDia
                    ? "bg-[#DCFCE7] text-[#166534]"
                    : "bg-[#FEE2E2] text-[#991B1B]"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {estaAlDia ? "check_circle" : "warning"}
                </span>
                {estaAlDia ? "Al día" : "Con saldo pendiente"}
              </span>
            </div>

            {/* Saldo y Botones de Acción */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center pt-2">
              <div>
                <p className="text-xs text-[#757684] font-medium">
                  Saldo Pendiente Actual
                </p>
                <div className="flex items-baseline gap-1 my-0.5">
                  <span className="text-base font-bold text-[#444653]">
                    Bs.
                  </span>
                  <span
                    className={`text-3xl font-extrabold ${
                      estaAlDia ? "text-[#00288e]" : "text-[#ba1a1a]"
                    }`}
                  >
                    {saldoNumerico.toFixed(2)}
                  </span>
                </div>
                <p
                  className={`text-xs font-semibold ${
                    estaAlDia ? "text-[#166534]" : "text-[#ba1a1a]"
                  }`}
                >
                  {estaAlDia
                    ? "✓ Todas tus cuotas al corriente"
                    : `Tiene ${pagos.filter((p) => p.estado === "Pendiente").length} cuota(s) por pagar`}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setHistorialModal(true)}
                  className="flex-1 bg-[#00288e] text-white py-2.5 px-3 rounded-xl text-xs md:text-sm font-bold hover:bg-[#1e40af] transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">
                    history
                  </span>
                  Ver Historial
                </button>

                <button
                  onClick={() => setPazYSalvoModal(true)}
                  className="flex-1 border border-[#00288e] text-[#00288e] bg-white hover:bg-[#dde1ff]/30 py-2.5 px-3 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">
                    verified
                  </span>
                  Paz y Salvo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. ÚLTIMO PAGO REGISTRADO (Bento Small - 4 cols) ── */}
        <div className="md:col-span-4 bg-white border border-[#c4c5d5] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[#00288e]">
                receipt_long
              </span>
              <p className="text-xs font-bold text-[#757684] uppercase tracking-wide">
                Último Pago Registrado
              </p>
            </div>

            {ultimoPago ? (
              <>
                <h3 className="text-2xl font-black text-[#191c1e]">
                  {Number(ultimoPago.monto).toFixed(2)} Bs.
                </h3>
                <p className="text-sm font-semibold text-[#444653] mt-0.5">
                  {ultimoPago.concepto}
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold text-[#757684]">Sin pagos</h3>
                <p className="text-xs text-[#757684]">
                  No registra cuotas abonadas
                </p>
              </>
            )}
          </div>

          <div className="pt-3 border-t border-[#c4c5d5] mt-4 flex items-center justify-between text-xs text-[#757684]">
            {ultimoPago ? (
              <>
                <span>
                  Recibo #{String(ultimoPago.id).padStart(4, "0")} —{" "}
                  {new Date(ultimoPago.fecha).toLocaleDateString()}
                </span>
                <span
                  className="material-symbols-outlined text-[#166534] text-lg"
                  style={{ fontVariationSettings: '"FILL" 1' }}
                >
                  verified
                </span>
              </>
            ) : (
              <span>OTB Villa Calama</span>
            )}
          </div>
        </div>

        {/* ── 3. HERO BANNER: PRÓXIMA ASAMBLEA GENERAL (12 cols) ── */}
        <div className="md:col-span-12 relative rounded-2xl overflow-hidden min-h-[220px] flex items-center shadow-md">
          {/* Fondo gradiente azul institucional */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#00288e] via-[#00288e]/90 to-[#1e40af]/80"></div>

          {/* Patrón decorativo de fondo */}
          <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center justify-center pr-12 pointer-events-none">
            <span className="material-symbols-outlined text-[200px] text-white">
              groups
            </span>
          </div>

          <div className="relative z-10 p-6 md:p-8 w-full md:w-3/4 flex flex-col gap-3 text-white">
            <div>
              <span className="bg-[#6cf8bb] text-[#002113] px-3 py-1 rounded-full text-xs font-bold mb-2 inline-block shadow-sm">
                Próxima Asamblea General
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                {asamblea?.nombre || "Asamblea General Ordinaria de Vecinos"}
              </h2>
              <p className="text-sm md:text-base text-blue-100 max-w-2xl mt-1 leading-relaxed">
                {asamblea?.descripcion ||
                  "Aprobación del presupuesto comunal, informe de ingresos por cuotas y proyectos de seguridad vecinal."}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 md:gap-6 items-center text-xs md:text-sm text-blue-100 font-semibold pt-1">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">
                  event
                </span>
                <span>{asamblea?.fecha ? new Date(asamblea.fecha).toLocaleDateString("es-ES", { dateStyle: "long" }) : "Sábado 28 de Octubre"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">
                  schedule
                </span>
                <span>{asamblea?.hora || "09:00 AM"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">
                  location_on
                </span>
                <span>{asamblea?.lugar || "Sede Social OTB Villa Calama"}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleConfirmarAsistencia}
                disabled={confirmando || asistenciaConfirmada}
                className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                  asistenciaConfirmada
                    ? "bg-[#166534] text-white ring-2 ring-white/50"
                    : "bg-white text-[#00288e] hover:bg-[#f2f4f6] active:scale-95"
                }`}
              >
                {confirmando ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-sm">
                      sync
                    </span>
                    <span>Confirmando...</span>
                  </>
                ) : asistenciaConfirmada ? (
                  <>
                    <span
                      className="material-symbols-outlined text-sm"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      check_circle
                    </span>
                    <span>¡Asistencia Confirmada!</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">
                      how_to_reg
                    </span>
                    <span>Confirmar Asistencia</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setTemarioModal(true)}
                className="border border-white/50 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all backdrop-blur-sm cursor-pointer"
              >
                Ver Temario
              </button>
            </div>
          </div>
        </div>

        {/* ── 4. ACCESOS DIRECTOS (12 cols) ── */}
        <div className="md:col-span-12">
          <h3 className="text-base font-bold text-[#191c1e] mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#00288e]">
              apps
            </span>
            Accesos Directos
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setHistorialModal(true)}
              className="bg-white border border-[#c4c5d5] hover:border-[#00288e] p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all group text-left cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-[#dde1ff] text-[#00288e] flex items-center justify-center group-hover:bg-[#00288e] group-hover:text-white transition-all shrink-0">
                <span className="material-symbols-outlined text-2xl">
                  payments
                </span>
              </div>
              <div>
                <h4 className="font-bold text-[#191c1e] group-hover:text-[#00288e] transition-colors text-sm md:text-base">
                  Mis Pagos
                </h4>
                <p className="text-xs text-[#757684]">
                  Historial y recibos de caja
                </p>
              </div>
            </button>

            <Link
              href="/vecino/comunicados"
              className="bg-white border border-[#c4c5d5] hover:border-[#00288e] p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#DCFCE7] text-[#166534] flex items-center justify-center group-hover:bg-[#166534] group-hover:text-white transition-all shrink-0">
                <span className="material-symbols-outlined text-2xl">
                  campaign
                </span>
              </div>
              <div>
                <h4 className="font-bold text-[#191c1e] group-hover:text-[#00288e] transition-colors text-sm md:text-base">
                  Cartelera
                </h4>
                <p className="text-xs text-[#757684]">
                  Avisos, kermesses y marchas
                </p>
              </div>
            </Link>

            <button
              onClick={() => setTemarioModal(true)}
              className="bg-white border border-[#c4c5d5] hover:border-[#00288e] p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all group text-left cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-[#e6e8ea] text-[#191c1e] flex items-center justify-center group-hover:bg-[#00288e] group-hover:text-white transition-all shrink-0">
                <span className="material-symbols-outlined text-2xl">
                  groups
                </span>
              </div>
              <div>
                <h4 className="font-bold text-[#191c1e] group-hover:text-[#00288e] transition-colors text-sm md:text-base">
                  Asambleas
                </h4>
                <p className="text-xs text-[#757684]">
                  Actas, temarios y quorum
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* ── 5. PROYECTOS EN CURSO (6 cols) ── */}
        <div className="md:col-span-6 bg-white border border-[#c4c5d5] rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-[#191c1e] text-base flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#00288e]">
                construction
              </span>
              Proyectos de la OTB en Curso
            </h4>
            <span className="text-xs font-semibold text-[#00288e]">
              Gestión 2026
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-3.5 bg-[#f2f4f6] rounded-xl border border-[#c4c5d5]/40">
              <div className="flex justify-between items-start mb-1.5">
                <p className="text-xs font-bold text-[#191c1e]">
                  Muro Perimetral y Enmallado Norte
                </p>
                <span className="text-xs font-extrabold text-[#00288e]">
                  75%
                </span>
              </div>
              <div className="w-full bg-[#e6e8ea] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#00288e] h-full rounded-full transition-all duration-700"
                  style={{ width: "75%" }}
                ></div>
              </div>
              <p className="text-[11px] text-[#757684] mt-1.5">
                Financiado con aportes extraordinarios de la OTB.
              </p>
            </div>

            <div className="p-3.5 bg-[#f2f4f6] rounded-xl border border-[#c4c5d5]/40">
              <div className="flex justify-between items-start mb-1.5">
                <p className="text-xs font-bold text-[#191c1e]">
                  Nueva Red de Cámaras de Vigilancia
                </p>
                <span className="text-xs font-extrabold text-[#00288e]">
                  35%
                </span>
              </div>
              <div className="w-full bg-[#e6e8ea] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#00288e] h-full rounded-full transition-all duration-700"
                  style={{ width: "35%" }}
                ></div>
              </div>
              <p className="text-[11px] text-[#757684] mt-1.5">
                Conectado con el Módulo Policial de la zona.
              </p>
            </div>
          </div>
        </div>

        {/* ── 6. AVISOS DE ADMINISTRACIÓN (6 cols) ── */}
        <div className="md:col-span-6 bg-white border border-[#c4c5d5] rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-[#191c1e] text-base flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#ba1a1a]">
                warning
              </span>
              Avisos Oficiales de la OTB
            </h4>
            <Link
              href="/vecino/comunicados"
              className="text-xs font-bold text-[#00288e] hover:underline"
            >
              Ver cartelera →
            </Link>
          </div>

          <div className="space-y-3">
            {comunicados.length === 0 ? (
              <p className="text-xs text-[#757684] text-center py-6">
                No hay comunicados registrados actualmente.
              </p>
            ) : (
              comunicados.slice(0, 2).map((c) => {
                const esUrgente =
                  c.prioridad === "Urgente" || c.categoria === "Urgente";
                return (
                  <div
                    key={c.id}
                    className={`p-3.5 rounded-xl border flex gap-3 items-start transition-all ${
                      esUrgente
                        ? "bg-[#ffdad6]/20 border-red-200"
                        : "bg-[#f2f4f6] border-[#c4c5d5]/50"
                    }`}
                  >
                    <div
                      className={`min-w-[40px] h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        esUrgente
                          ? "bg-[#ffdad6] text-[#ba1a1a]"
                          : "bg-[#dde1ff] text-[#00288e]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">
                        {esUrgente ? "water_drop" : "campaign"}
                      </span>
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-[#191c1e] truncate">
                          {c.titulo}
                        </p>
                        {esUrgente && (
                          <span className="bg-[#ba1a1a] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                            Urgente
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#444653] mt-1 line-clamp-2 leading-relaxed">
                        {c.descripcion}
                      </p>
                      <p className="text-[11px] text-[#757684] mt-1">
                        {new Date(c.creado_en).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── MODAL: TEMARIO DE ASAMBLEA ── */}
      {temarioModal && (
        <div className="fixed inset-0 z-[120] overflow-y-auto" role="dialog">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setTemarioModal(false)}
            ></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-[#c4c5d5] relative z-10 p-6">
              <div className="flex justify-between items-center mb-4 border-b border-[#c4c5d5] pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00288e]">
                    menu_book
                  </span>
                  <h3 className="font-bold text-lg text-[#191c1e]">
                    Orden del Día de la Asamblea
                  </h3>
                </div>
                <button
                  onClick={() => setTemarioModal(false)}
                  className="text-[#757684] hover:bg-[#f2f4f6] p-1.5 rounded-full cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="space-y-3 text-sm text-[#444653]">
                <div className="bg-[#f2f4f6] p-3 rounded-xl">
                  <p className="font-bold text-[#191c1e]">
                    1. Control de Quórum e Instalación
                  </p>
                  <p className="text-xs text-[#757684]">
                    Toma de firmas por manzana a cargo de la secretaría de
                    actas.
                  </p>
                </div>
                <div className="bg-[#f2f4f6] p-3 rounded-xl">
                  <p className="font-bold text-[#191c1e]">
                    2. Informe Económico de Tesorería
                  </p>
                  <p className="text-xs text-[#757684]">
                    Presentación del balance financiero del mes y recaudación de
                    cuotas.
                  </p>
                </div>
                <div className="bg-[#f2f4f6] p-3 rounded-xl">
                  <p className="font-bold text-[#191c1e]">
                    3. Proyecto de Luminarias LED y Seguridad
                  </p>
                  <p className="text-xs text-[#757684]">
                    Aprobación de cotizaciones para el cambio de postes en
                    pasajes principales.
                  </p>
                </div>
                <div className="bg-[#f2f4f6] p-3 rounded-xl">
                  <p className="font-bold text-[#191c1e]">4. Asuntos Varios</p>
                  <p className="text-xs text-[#757684]">
                    Palabra abierta a los vecinos propietarios.
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#c4c5d5] flex justify-end">
                <button
                  onClick={() => setTemarioModal(false)}
                  className="px-4 py-2 bg-[#00288e] text-white rounded-xl text-xs font-bold hover:bg-[#1e40af] transition-all cursor-pointer"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: HISTORIAL DE PAGOS DEL VECINO ── */}
      {historialModal && (
        <div className="fixed inset-0 z-[120] overflow-y-auto" role="dialog">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setHistorialModal(false)}
            ></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-[#c4c5d5] relative z-10 p-6">
              <div className="flex justify-between items-center mb-4 border-b border-[#c4c5d5] pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00288e]">
                    payments
                  </span>
                  <h3 className="font-bold text-lg text-[#191c1e]">
                    Historial de Pagos y Aportes
                  </h3>
                </div>
                <button
                  onClick={() => setHistorialModal(false)}
                  className="text-[#757684] hover:bg-[#f2f4f6] p-1.5 rounded-full cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs md:text-sm">
                  <thead className="bg-[#f2f4f6] text-[#757684] font-bold">
                    <tr>
                      <th className="p-2.5">Recibo</th>
                      <th className="p-2.5">Concepto</th>
                      <th className="p-2.5 text-right">Monto</th>
                      <th className="p-2.5 text-center">Estado</th>
                      <th className="p-2.5">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c4c5d5]">
                    {pagos.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-6 text-center text-xs text-[#757684]"
                        >
                          No hay registros de pagos para este vecino.
                        </td>
                      </tr>
                    ) : (
                      pagos.map((p) => (
                        <tr key={p.id} className="hover:bg-[#f7f9fb]">
                          <td className="p-2.5 font-bold text-[#00288e]">
                            #{String(p.id).padStart(4, "0")}
                          </td>
                          <td className="p-2.5 font-semibold text-[#191c1e]">
                            {p.concepto}
                          </td>
                          <td className="p-2.5 text-right font-extrabold text-[#191c1e]">
                            {Number(p.monto).toFixed(2)} BOB
                          </td>
                          <td className="p-2.5 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                p.estado === "Pagado"
                                  ? "bg-[#DCFCE7] text-[#166534]"
                                  : "bg-[#FEE2E2] text-[#991B1B]"
                              }`}
                            >
                              {p.estado}
                            </span>
                          </td>
                          <td className="p-2.5 text-[#757684]">
                            {new Date(p.fecha).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 pt-3 border-t border-[#c4c5d5] flex justify-end">
                <button
                  onClick={() => setHistorialModal(false)}
                  className="px-4 py-2 bg-[#00288e] text-white rounded-xl text-xs font-bold hover:bg-[#1e40af] transition-all cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: CERTIFICADO DE PAZ Y SALVO (SOLVENCIA) ── */}
      {pazYSalvoModal && (
        <div className="fixed inset-0 z-[120] overflow-y-auto" role="dialog">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setPazYSalvoModal(false)}
            ></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full border border-[#c4c5d5] relative z-10">
              {/* Contenido imprimible */}
              <div ref={certificadoRef} className="p-8">
                <div className="header text-center border-b-2 border-[#00288e] pb-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#dde1ff] text-[#00288e] font-extrabold flex items-center justify-center text-2xl mx-auto mb-2">
                    OTB
                  </div>
                  <h2 className="title text-xl font-black text-[#00288e] uppercase tracking-wide">
                    ORGANIZACIÓN TERRITORIAL DE BASE
                  </h2>
                  <p className="subtitle text-xs text-slate-600 font-bold">
                    JUNTA VECINAL VILLA CALAMA — COCHABAMBA, BOLIVIA
                  </p>
                  <p className="certificate-number text-[11px] font-bold text-[#00288e] mt-1">
                    CERTIFICADO DE SOLVENCIA Y PAZ Y SALVO Nº{" "}
                    {new Date().getFullYear()}-
                    {String(currentVecino?.id || "001").padStart(4, "0")}
                  </p>
                </div>

                <div className="body-text text-sm text-slate-800 space-y-4 text-justify leading-relaxed">
                  <p>
                    La Directiva de la Organización Territorial de Base (OTB)
                    Villa Calama, legalmente constituida en el Municipio de
                    Cochabamba, a solicitud de la parte interesada:
                  </p>
                  <p className="font-bold text-center text-base uppercase text-[#00288e] py-1 bg-slate-50 rounded-lg border border-slate-200">
                    CERTIFICA QUE:
                  </p>
                  <p>
                    El(la) Sr.(a) <strong>{currentVecino?.nombre}</strong>, con
                    Cédula de Identidad Nº <strong>{currentVecino?.ci}</strong>,
                    propietario(a) legalmente registrado(a) del lote de terreno
                    correspondiente al <strong>Manzano {currentVecino?.manzano}</strong>,{" "}
                    <strong>Lote {currentVecino?.lote}</strong>:
                  </p>

                  <div
                    className={`badge-box p-4 rounded-xl text-center font-extrabold text-base border-2 ${
                      estaAlDia
                        ? "bg-[#DCFCE7] text-[#166534] border-[#166534]"
                        : "bg-[#FEE2E2] text-[#991B1B] border-[#991B1B]"
                    }`}
                  >
                    {estaAlDia
                      ? "SE ENCUENTRA AL DÍA Y EN CONDICIÓN DE PAZ Y SALVO"
                      : `REGISTRA SALDO PENDIENTE DE Bs. ${saldoNumerico.toFixed(2)}`}
                    <p className="text-xs font-normal mt-1 opacity-90">
                      {estaAlDia
                        ? "No tiene deudas pendientes por cuotas mensuales, aportes de mejoras ni multas comunales."
                        : "Debe aproximarse a tesorería para regularizar sus aportes pendientes."}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600">
                    Se expide el presente certificado para los fines que al
                    interesado convenga, a los {new Date().getDate()} días del mes
                    de{" "}
                    {new Date().toLocaleString("es-ES", { month: "long" })} del
                    año {new Date().getFullYear()}.
                  </p>

                  <div className="signatures flex justify-around mt-12 text-center text-xs">
                    <div>
                      <div className="sign-line border-t border-slate-800 w-36 mx-auto mb-1"></div>
                      <p className="font-bold">Presidente OTB</p>
                      <p className="text-[10px] text-slate-500">Villa Calama</p>
                    </div>
                    <div>
                      <div className="sign-line border-t border-slate-800 w-36 mx-auto mb-1"></div>
                      <p className="font-bold">Secretario de Hacienda</p>
                      <p className="text-[10px] text-slate-500">Tesorería</p>
                    </div>
                  </div>
                </div>

                <div className="footer text-center text-[10px] text-slate-400 mt-8 border-t border-dashed border-slate-300 pt-3">
                  Documento emitido digitalmente por el Sistema Oficial de Gestión
                  Vecinal OTB.
                </div>
              </div>

              {/* Botones */}
              <div className="p-4 bg-slate-50 border-t border-[#c4c5d5] flex justify-end gap-3">
                <button
                  onClick={() => setPazYSalvoModal(false)}
                  className="px-4 py-2 border border-[#c4c5d5] rounded-xl text-xs font-semibold text-[#444653] hover:bg-white cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  onClick={handlePrintPazYSalvo}
                  className="px-5 py-2 bg-[#00288e] text-white rounded-xl text-xs font-bold hover:bg-[#1e40af] flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">
                    print
                  </span>
                  Imprimir Certificado
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
