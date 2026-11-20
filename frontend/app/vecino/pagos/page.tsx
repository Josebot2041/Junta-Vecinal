"use client";

import React, { useState, useEffect, useRef } from "react";

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
  metodo?: string;
}

const API = "http://localhost:5000/api";

export default function VecinoPagosPage() {
  const [vecino, setVecino] = useState<Vecino | null>(null);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modales
  const [reciboModal, setReciboModal] = useState<{ open: boolean; pago: Pago | null }>({
    open: false,
    pago: null,
  });
  const [certificadoModal, setCertificadoModal] = useState(false);
  const [comprobanteModal, setComprobanteModal] = useState(false);

  // Formulario subir comprobante
  const [comprobanteForm, setComprobanteForm] = useState({
    concepto: "Cuota Mensual",
    monto: "25.00",
    metodo: "QR Simple",
    archivoNombre: "",
    previewUrl: "" as string | null,
  });
  const [subiendoComprobante, setSubiendoComprobante] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const printCertificadoRef = useRef<HTMLDivElement>(null);
  const printReciboRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const localUser = localStorage.getItem("user");
        let vecinoEncontrado: Vecino | null = null;

        const resVecinos = await fetch(`${API}/vecinos`);
        if (resVecinos.ok) {
          const listaVecinos: Vecino[] = await resVecinos.json();

          if (localUser) {
            try {
              const parsed = JSON.parse(localUser);
              vecinoEncontrado =
                listaVecinos.find((v) => String(v.ci) === String(parsed.ci)) ||
                listaVecinos[0] ||
                null;
            } catch {
              vecinoEncontrado = listaVecinos[0] || null;
            }
          } else {
            vecinoEncontrado = listaVecinos[0] || null;
          }
          setVecino(vecinoEncontrado);
        }

        if (vecinoEncontrado) {
          const resHistorial = await fetch(`${API}/vecinos/${vecinoEncontrado.id}/historial`);
          if (resHistorial.ok) {
            const dataHistorial = await resHistorial.json();
            setPagos(dataHistorial.pagos || []);
          }
        }
      } catch (err) {
        console.error("Error al cargar finanzas del vecino:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Copiar al portapapeles
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(`¡${label} copiado al portapapeles!`);
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  const handleShareBankDetails = () => {
    const info = `*DATOS BANCARIOS OTB VILLA CALAMA*\nBanco: Banco Unión S.A.\nCuenta Corriente: 10000034892144\nTitular: OTB Villa Calama\nNIT: 349182029\n*Glosa:* Indicar Manzano, Lote y Nombre del vecino.`;
    navigator.clipboard.writeText(info);
    setCopyFeedback("¡Todos los datos bancarios fueron copiados para compartir!");
    setTimeout(() => setCopyFeedback(null), 3500);
  };

  // Manejo de archivo de comprobante
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setComprobanteForm((prev) => ({
      ...prev,
      archivoNombre: file.name,
    }));

    const reader = new FileReader();
    reader.onload = () => {
      setComprobanteForm((prev) => ({
        ...prev,
        previewUrl: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Enviar comprobante
  const handleSubmitComprobante = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vecino) return;

    setSubiendoComprobante(true);
    try {
      // Registrar en la tabla pagos como Pendiente de verificación por tesorería
      const res = await fetch(`${API}/pagos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vecino_id: vecino.id,
          concepto: `${comprobanteForm.concepto} (${comprobanteForm.metodo})`,
          monto: Number(comprobanteForm.monto),
          estado: "Pendiente",
          comprobante_url: comprobanteForm.previewUrl || null,
        }),
      });

      if (res.ok) {
        alert("¡Comprobante enviado a tesorería! Se verificará y registrará tu cuota.");
        setComprobanteModal(false);
        setComprobanteForm({
          concepto: "Cuota Mensual",
          monto: "25.00",
          metodo: "QR Simple",
          archivoNombre: "",
          previewUrl: null,
        });

        // Recargar historial
        const resHistorial = await fetch(`${API}/vecinos/${vecino.id}/historial`);
        if (resHistorial.ok) {
          const data = await resHistorial.json();
          setPagos(data.pagos || []);
        }
      } else {
        alert("Error al enviar el comprobante.");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión al servidor.");
    } finally {
      setSubiendoComprobante(false);
    }
  };

  // Imprimir Certificado de No Adeudo
  const handlePrintCertificado = () => {
    const content = printCertificadoRef.current?.innerHTML;
    if (!content) return;
    const win = window.open("", "_blank", "width=800,height=900");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Certificado de No Adeudo y Solvencia - OTB Villa Calama</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #111; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #00288e; padding-bottom: 16px; margin-bottom: 24px; }
            .title { font-size: 22px; font-weight: bold; color: #00288e; text-transform: uppercase; margin: 4px 0; }
            .subtitle { font-size: 13px; color: #555; }
            .badge-box { background: #DCFCE7; border: 2px solid #166534; color: #166534; padding: 14px; text-align: center; font-size: 18px; font-weight: bold; border-radius: 8px; margin: 24px 0; }
            .signatures { display: flex; justify-content: space-around; margin-top: 70px; text-align: center; font-size: 13px; }
            .sign-line { border-top: 1px solid #333; width: 180px; margin: 0 auto 6px auto; }
            .footer { font-size: 10px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 12px; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  // Imprimir Recibo Oficial
  const handlePrintRecibo = () => {
    const content = printReciboRef.current?.innerHTML;
    if (!content) return;
    const win = window.open("", "_blank", "width=500,height=700");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Recibo Oficial de Caja</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; color: #111; }
            h1 { font-size: 20px; margin-bottom: 4px; }
            p { margin: 4px 0; font-size: 13px; }
            .divider { border-top: 1px dashed #999; margin: 16px 0; }
            .badge { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 12px; font-weight: bold; background: #DCFCE7; color: #166534; }
            .amount { font-size: 28px; font-weight: bold; color: #00288e; margin: 8px 0; }
            .footer { font-size: 11px; color: #aaa; margin-top: 24px; text-align: center; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  const saldoNumerico = vecino ? Number(vecino.saldo || 0) : 0;
  const estaAlDia = saldoNumerico <= 0;

  // Filtrado de pagos
  const pagosFiltrados = pagos.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      p.concepto.toLowerCase().includes(q) ||
      p.fecha.includes(q) ||
      String(p.monto).includes(q)
    );
  });

  const ultimoPagoPagado = pagos.find((p) => p.estado === "Pagado");

  return (
    <main className="max-w-[1280px] mx-auto p-4 md:p-8 min-h-screen">
      {/* Toast Feedback */}
      {copyFeedback && (
        <div className="fixed top-20 right-6 z-[150] bg-[#00288e] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span className="text-xs font-semibold">{copyFeedback}</span>
        </div>
      )}

      {/* Header Section */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span
              className={`text-xs uppercase tracking-wider font-extrabold px-3 py-0.5 rounded-full ${
                estaAlDia
                  ? "bg-[#DCFCE7] text-[#166534]"
                  : "bg-[#FEE2E2] text-[#991B1B]"
              }`}
            >
              {estaAlDia ? "Vecino Solvente" : "Con saldo pendiente"}
            </span>
            <span className="text-xs text-[#757684] font-semibold">
              C.I. {vecino?.ci || "5492812 CB"}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#191c1e] tracking-tight">
            Mis Pagos y Estado de Cuenta
          </h1>
          <p className="text-[#444653] text-sm md:text-base mt-1">
            Revisa tus aportes ordinarios, extraordinarios y descarga certificados oficiales.
          </p>
        </div>

        <div className="flex gap-2.5 flex-wrap">
          <button
            onClick={() => setCertificadoModal(true)}
            className="bg-white border border-[#c4c5d5] px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs md:text-sm font-bold text-[#191c1e] hover:bg-[#f2f4f6] transition-colors shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[#00288e] text-lg">
              verified
            </span>
            Certificado No Adeudo
          </button>
          <button
            onClick={() => setComprobanteModal(true)}
            className="bg-[#00288e] text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs md:text-sm font-bold hover:bg-[#1e40af] transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">cloud_upload</span>
            Subir Comprobante
          </button>
        </div>
      </header>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUMNA IZQUIERDA: ESTADO FINANCIERO Y TABLA (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Tarjeta de Estado Financiero */}
          <div className="bg-white border border-[#c4c5d5] rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-[#c4c5d5] gap-2">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-[#757684]">
                  Estado Financiero Vecinal
                </span>
                <h2 className="text-lg md:text-xl font-bold text-[#191c1e] flex items-center gap-2 mt-0.5">
                  Certificado de Solvencia
                  <span
                    className="material-symbols-outlined text-[#166534] text-lg"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    check_circle
                  </span>
                </h2>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  estaAlDia
                    ? "bg-[#DCFCE7] text-[#166534]"
                    : "bg-[#FEE2E2] text-[#991B1B]"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    estaAlDia ? "bg-[#166534]" : "bg-[#ba1a1a]"
                  }`}
                ></span>
                {estaAlDia ? "Al día" : "Con saldo pendiente"}
              </span>
            </div>

            {/* 3 Bloques Resumen */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-5">
              <div className="p-4 rounded-xl bg-[#f2f4f6]">
                <p className="text-xs text-[#757684] font-medium">Saldo Adeudado</p>
                <p
                  className={`text-2xl font-black mt-1 ${
                    estaAlDia ? "text-[#166534]" : "text-[#ba1a1a]"
                  }`}
                >
                  Bs. {saldoNumerico.toFixed(2)}
                </p>
                <p className="text-[11px] text-[#757684] font-medium mt-1">
                  {estaAlDia ? "Sin cuotas vencidas" : "Cuotas pendientes por pagar"}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#f2f4f6]">
                <p className="text-xs text-[#757684] font-medium">Última Cuota Pagada</p>
                <p className="text-base font-bold text-[#191c1e] mt-1 truncate">
                  {ultimoPagoPagado ? ultimoPagoPagado.concepto : "Sin registros"}
                </p>
                <p className="text-[11px] text-[#757684] mt-1">
                  {ultimoPagoPagado
                    ? new Date(ultimoPagoPagado.fecha).toLocaleDateString()
                    : "OTB Villa Calama"}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#f2f4f6]">
                <p className="text-xs text-[#757684] font-medium">Inmueble Registrado</p>
                <p className="text-base font-bold text-[#191c1e] mt-1">
                  Mz. {vecino?.manzano || "-"} - Lote {vecino?.lote || "-"}
                </p>
                <p className="text-[11px] text-[#757684] mt-1">OTB Villa Calama</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between pt-4 border-t border-[#c4c5d5] gap-3">
              <div className="flex items-center gap-1.5 text-xs text-[#757684]">
                <span className="material-symbols-outlined text-[#00288e] text-base">
                  verified_user
                </span>
                <span>Válido para trámites municipales y asambleas 2026</span>
              </div>
              <button
                onClick={() => setCertificadoModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#00288e] text-white rounded-xl text-xs font-bold hover:bg-[#1e40af] transition-all cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Descargar Certificado Oficial (PDF)
              </button>
            </div>
          </div>

          {/* Tabla de Historial de Cuotas */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00288e]">
                  receipt_long
                </span>
                <h3 className="font-bold text-base md:text-lg text-[#191c1e]">
                  Historial de Cuotas Pagadas
                </h3>
              </div>
              <div className="relative w-full sm:w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#757684] text-sm">
                  search
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar cuota o concepto..."
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#c4c5d5] rounded-xl text-xs focus:border-[#00288e] outline-none"
                />
              </div>
            </div>

            <div className="bg-white border border-[#c4c5d5] rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="bg-[#f2f4f6] border-b border-[#c4c5d5] text-[#757684] font-bold">
                      <th className="px-4 py-3">Recibo</th>
                      <th className="px-4 py-3">Concepto</th>
                      <th className="px-4 py-3">Monto</th>
                      <th className="px-4 py-3">Fecha & Método</th>
                      <th className="px-4 py-3 text-center">Estado</th>
                      <th className="px-4 py-3 text-right">Comprobante</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c4c5d5]">
                    {pagosFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-xs text-[#757684]">
                          No se encontraron cuotas registradas.
                        </td>
                      </tr>
                    ) : (
                      pagosFiltrados.map((p) => {
                        const esPagado = p.estado === "Pagado";
                        return (
                          <tr key={p.id} className="hover:bg-[#f7f9fb] transition-colors">
                            <td className="px-4 py-3 font-bold text-[#00288e]">
                              #{String(p.id).padStart(4, "0")}
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-bold text-[#191c1e]">{p.concepto}</p>
                              <p className="text-[11px] text-[#757684]">
                                Aporte comunitario OTB
                              </p>
                            </td>
                            <td className="px-4 py-3 font-extrabold text-[#191c1e]">
                              Bs. {Number(p.monto).toFixed(2)}
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-xs font-semibold text-[#191c1e]">
                                {new Date(p.fecha).toLocaleDateString()}
                              </p>
                              <span className="inline-flex items-center gap-1 text-[11px] text-[#757684]">
                                <span className="material-symbols-outlined text-[13px]">
                                  qr_code
                                </span>
                                QR Simple / Efectivo
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                  esPagado
                                    ? "bg-[#DCFCE7] text-[#166534]"
                                    : "bg-amber-100 text-amber-900"
                                }`}
                              >
                                {p.estado}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => setReciboModal({ open: true, pago: p })}
                                className="inline-flex items-center gap-1 bg-[#f2f4f6] hover:bg-[#00288e] hover:text-white text-[#00288e] px-3 py-1.5 rounded-xl font-bold text-xs transition-colors border border-[#c4c5d5] cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-sm">
                                  receipt
                                </span>
                                Ver Recibo Oficial
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-[#f2f4f6] flex items-center justify-between border-t border-[#c4c5d5] text-xs text-[#757684]">
                <span>Mostrando {pagosFiltrados.length} cuotas registradas</span>
                <span className="font-semibold text-[#00288e]">
                  OTB Villa Calama · Gestión 2026
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: QR SIMPLE Y DATOS BANCARIOS (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Tarjeta QR Simple */}
          <div className="bg-white border border-[#c4c5d5] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs uppercase tracking-wider font-extrabold text-[#00288e]">
                  Pago Electrónico
                </span>
                <h3 className="text-lg font-bold text-[#191c1e]">
                  QR Simple Interbancario
                </h3>
              </div>
              <span className="material-symbols-outlined text-[#00288e] text-3xl">
                qr_code_2
              </span>
            </div>

            {/* Código QR Ilustrativo Nítido */}
            <div className="bg-[#f2f4f6] p-4 rounded-2xl flex flex-col items-center justify-center border border-[#c4c5d5] mb-4">
              <div className="w-48 h-48 bg-white p-3 rounded-xl shadow-sm flex flex-col items-center justify-center border border-[#c4c5d5] relative">
                <svg
                  className="w-full h-full text-slate-900"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-5 0h2v3h-2v-3zm2 3h3v2h-3v-2zm3 2h3v4h-3v-4zm-5 2h2v2h-2v-2zm2-2h3v2h-3v-2z"></path>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-white px-2 py-0.5 rounded shadow text-[10px] font-bold text-[#00288e] border border-[#c4c5d5]">
                    SIMPLE QR
                  </div>
                </div>
              </div>
              <p className="text-xs font-bold text-[#191c1e] mt-2.5">
                Válido desde cualquier banco de Bolivia
              </p>
              <p className="text-[11px] text-[#757684]">
                Habilitado 24/7 sin comisión interbancaria
              </p>
            </div>

            {/* Datos de la cuenta */}
            <div className="space-y-2 mb-4 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-[#f2f4f6]">
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#757684]">
                    Banco
                  </p>
                  <p className="font-bold text-[#191c1e]">Banco Unión S.A.</p>
                </div>
                <span className="material-symbols-outlined text-[#757684] text-base">
                  account_balance
                </span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-xl bg-[#f2f4f6]">
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#757684]">
                    Número de Cuenta (Cta. Corriente)
                  </p>
                  <p className="font-mono font-bold text-[#00288e]">
                    10000034892144
                  </p>
                </div>
                <button
                  onClick={() => handleCopy("10000034892144", "N° de Cuenta")}
                  className="p-1 text-[#00288e] hover:bg-[#dde1ff] rounded-lg transition-colors cursor-pointer"
                  title="Copiar N° de Cuenta"
                >
                  <span className="material-symbols-outlined text-base">
                    content_copy
                  </span>
                </button>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-xl bg-[#f2f4f6]">
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#757684]">
                    Titular de la Cuenta
                  </p>
                  <p className="font-bold text-[#191c1e]">OTB Villa Calama</p>
                </div>
                <button
                  onClick={() => handleCopy("OTB Villa Calama", "Titular")}
                  className="p-1 text-[#00288e] hover:bg-[#dde1ff] rounded-lg transition-colors cursor-pointer"
                  title="Copiar Titular"
                >
                  <span className="material-symbols-outlined text-base">
                    content_copy
                  </span>
                </button>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded-xl bg-[#f2f4f6]">
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#757684]">
                    NIT OTB
                  </p>
                  <p className="font-mono font-bold text-[#191c1e]">349182029</p>
                </div>
                <button
                  onClick={() => handleCopy("349182029", "NIT")}
                  className="p-1 text-[#00288e] hover:bg-[#dde1ff] rounded-lg transition-colors cursor-pointer"
                  title="Copiar NIT"
                >
                  <span className="material-symbols-outlined text-base">
                    content_copy
                  </span>
                </button>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="space-y-2">
              <button
                onClick={() => setComprobanteModal(true)}
                className="w-full bg-[#00288e] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#1e40af] transition-all shadow-md text-xs md:text-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">
                  upload_file
                </span>
                Subir Comprobante de Pago
              </button>
              <button
                onClick={handleShareBankDetails}
                className="w-full bg-[#f2f4f6] border border-[#c4c5d5] text-[#191c1e] py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white transition-all text-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">share</span>
                Compartir Datos Bancarios
              </button>
            </div>
          </div>

          {/* Tarjeta de Información Importante */}
          <div className="bg-white border border-[#c4c5d5] rounded-2xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#00288e] text-2xl shrink-0 mt-0.5">
                info
              </span>
              <div>
                <h4 className="text-xs font-bold text-[#191c1e]">
                  Información Importante
                </h4>
                <p className="text-xs text-[#444653] mt-1 leading-relaxed">
                  Recuerda indicar en la glosa de tu transferencia tu{" "}
                  <strong className="text-[#191c1e]">
                    Manzano, Lote y Nombre
                  </strong>{" "}
                  para una conciliación inmediata por la secretaría de hacienda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL: SUBIR COMPROBANTE DE PAGO ── */}
      {comprobanteModal && (
        <div className="fixed inset-0 z-[120] overflow-y-auto" role="dialog">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => !subiendoComprobante && setComprobanteModal(false)}
            ></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full border border-[#c4c5d5] relative z-10 p-6">
              <div className="flex justify-between items-center mb-4 border-b border-[#c4c5d5] pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00288e]">
                    cloud_upload
                  </span>
                  <h3 className="font-bold text-base text-[#191c1e]">
                    Subir Comprobante de Pago
                  </h3>
                </div>
                <button
                  onClick={() => !subiendoComprobante && setComprobanteModal(false)}
                  className="text-[#757684] hover:bg-[#f2f4f6] p-1.5 rounded-full cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSubmitComprobante} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-[#191c1e] block mb-1">
                    Concepto de Pago *
                  </label>
                  <select
                    value={comprobanteForm.concepto}
                    onChange={(e) =>
                      setComprobanteForm({ ...comprobanteForm, concepto: e.target.value })
                    }
                    className="w-full h-10 px-3 border border-[#c4c5d5] rounded-xl bg-[#f2f4f6] text-xs focus:border-[#00288e] outline-none cursor-pointer"
                  >
                    <option value="Cuota Mensual">Cuota Mensual</option>
                    <option value="Aporte Cancha Polifuncional">
                      Aporte Cancha Polifuncional
                    </option>
                    <option value="Multa de Asamblea">Multa de Asamblea</option>
                    <option value="Aporte Extraordinario">Aporte Extraordinario</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-[#191c1e] block mb-1">
                      Monto Pagado (BOB) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={comprobanteForm.monto}
                      onChange={(e) =>
                        setComprobanteForm({ ...comprobanteForm, monto: e.target.value })
                      }
                      className="w-full h-10 px-3 border border-[#c4c5d5] rounded-xl bg-[#f2f4f6] text-xs focus:border-[#00288e] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#191c1e] block mb-1">
                      Método Utilizado
                    </label>
                    <select
                      value={comprobanteForm.metodo}
                      onChange={(e) =>
                        setComprobanteForm({ ...comprobanteForm, metodo: e.target.value })
                      }
                      className="w-full h-10 px-2 border border-[#c4c5d5] rounded-xl bg-[#f2f4f6] text-xs focus:border-[#00288e] outline-none cursor-pointer"
                    >
                      <option value="QR Simple">QR Simple</option>
                      <option value="Transferencia">Transferencia</option>
                      <option value="Depósito Banco Unión">Depósito Banco</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#191c1e] block mb-1">
                    Captura o Foto del Comprobante / Voucher *
                  </label>
                  {comprobanteForm.previewUrl ? (
                    <div className="relative border border-[#c4c5d5] rounded-xl p-2 bg-[#f2f4f6] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={comprobanteForm.previewUrl}
                          alt="Comprobante"
                          className="w-12 h-12 object-cover rounded-lg border border-[#c4c5d5]"
                        />
                        <p className="text-xs font-bold text-[#191c1e] truncate max-w-[180px]">
                          {comprobanteForm.archivoNombre || "voucher.jpg"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setComprobanteForm({ ...comprobanteForm, previewUrl: null, archivoNombre: "" })
                        }
                        className="text-xs text-[#ba1a1a] font-bold hover:underline"
                      >
                        Cambiar
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[#c4c5d5] hover:border-[#00288e] rounded-xl p-5 text-center cursor-pointer transition-colors bg-[#f2f4f6]"
                    >
                      <span className="material-symbols-outlined text-2xl text-[#00288e]">
                        add_photo_alternate
                      </span>
                      <p className="text-xs font-bold text-[#191c1e] mt-1">
                        Toca aquí para seleccionar foto o captura
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#c4c5d5] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setComprobanteModal(false)}
                    className="px-4 py-2 border border-[#c4c5d5] text-[#444653] rounded-xl text-xs font-semibold hover:bg-[#f2f4f6] cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={subiendoComprobante}
                    className="px-5 py-2 bg-[#00288e] text-white rounded-xl text-xs font-bold hover:bg-[#1e40af] transition-all cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {subiendoComprobante ? "Enviando..." : "Enviar a Tesorería"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: RECIBO OFICIAL DE CAJA (IMPRIMIBLE) ── */}
      {reciboModal.open && reciboModal.pago && (
        <div className="fixed inset-0 z-[120] overflow-y-auto" role="dialog">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setReciboModal({ open: false, pago: null })}
            ></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full border border-[#c4c5d5] relative z-10">
              <div ref={printReciboRef} className="p-8">
                {/* Membrete */}
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-full bg-[#dde1ff] text-[#00288e] font-bold flex items-center justify-center text-xl mx-auto mb-2">
                    OTB
                  </div>
                  <h1 className="text-lg font-bold text-[#00288e]">
                    Organización Territorial de Base
                  </h1>
                  <p className="text-xs text-slate-500 font-semibold">
                    Junta Vecinal Villa Calama — Cochabamba, Bolivia
                  </p>
                  <div className="mt-2 inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-[#dde1ff] text-[#00288e]">
                    COMPROBANTE DE PAGO #{String(reciboModal.pago.id).padStart(4, "0")}
                  </div>
                </div>

                <div className="border-t border-dashed border-slate-300 my-4"></div>

                {/* Datos del vecino */}
                <div className="space-y-1 mb-4">
                  <p className="text-xs text-slate-500 font-bold uppercase">PROPIETARIO / VECINO</p>
                  <p className="font-bold text-slate-900">{vecino?.nombre}</p>
                  <p className="text-xs text-slate-500">
                    C.I. {vecino?.ci} | Manzano {vecino?.manzano} — Lote {vecino?.lote}
                  </p>
                </div>

                {/* Detalles */}
                <div className="bg-[#f2f4f6] rounded-xl p-4 space-y-2 mb-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Concepto</span>
                    <span className="font-bold text-slate-900">{reciboModal.pago.concepto}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Fecha</span>
                    <span className="font-bold text-slate-900">
                      {new Date(reciboModal.pago.fecha).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Estado</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        reciboModal.pago.estado === "Pagado"
                          ? "bg-[#DCFCE7] text-[#166534]"
                          : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {reciboModal.pago.estado}
                    </span>
                  </div>
                </div>

                {/* Monto */}
                <div className="text-center py-3 border-t border-dashed border-slate-300">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Total Abonado</p>
                  <p className="text-3xl font-black text-[#00288e]">
                    {Number(reciboModal.pago.monto).toFixed(2)} BOB
                  </p>
                </div>

                <p className="text-center text-[10px] text-slate-400 mt-4">
                  Comprobante digital válido de la Junta Vecinal OTB Villa Calama.
                </p>
              </div>

              {/* Botones */}
              <div className="p-4 bg-slate-50 border-t border-[#c4c5d5] flex justify-end gap-2">
                <button
                  onClick={() => setReciboModal({ open: false, pago: null })}
                  className="px-4 py-2 border border-[#c4c5d5] rounded-xl text-xs font-semibold text-[#444653] hover:bg-white cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  onClick={handlePrintRecibo}
                  className="px-4 py-2 bg-[#00288e] text-white rounded-xl text-xs font-bold hover:bg-[#1e40af] flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">print</span>
                  Imprimir Recibo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: CERTIFICADO DE NO ADEUDO Y SOLVENCIA ── */}
      {certificadoModal && (
        <div className="fixed inset-0 z-[120] overflow-y-auto" role="dialog">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setCertificadoModal(false)}
            ></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full border border-[#c4c5d5] relative z-10">
              <div ref={printCertificadoRef} className="p-8">
                <div className="header text-center border-b-2 border-[#00288e] pb-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#dde1ff] text-[#00288e] font-black flex items-center justify-center text-2xl mx-auto mb-2">
                    OTB
                  </div>
                  <h2 className="title text-xl font-black text-[#00288e] uppercase tracking-wide">
                    ORGANIZACIÓN TERRITORIAL DE BASE
                  </h2>
                  <p className="subtitle text-xs text-slate-600 font-bold">
                    JUNTA VECINAL VILLA CALAMA — COCHABAMBA, BOLIVIA
                  </p>
                  <p className="text-[11px] font-bold text-[#00288e] mt-1">
                    CERTIFICADO DE SOLVENCIA Y NO ADEUDO Nº {new Date().getFullYear()}-
                    {String(vecino?.id || "001").padStart(4, "0")}
                  </p>
                </div>

                <div className="body-text text-sm text-slate-800 space-y-4 text-justify leading-relaxed">
                  <p>
                    La Directiva de la Organización Territorial de Base (OTB) Villa Calama,
                    legalmente constituida en el Municipio de Cochabamba, a solicitud de la parte
                    interesada:
                  </p>
                  <p className="font-bold text-center text-base uppercase text-[#00288e] py-1 bg-slate-50 rounded-lg border border-slate-200">
                    CERTIFICA QUE:
                  </p>
                  <p>
                    El(la) Sr.(a) <strong>{vecino?.nombre}</strong>, con Cédula de Identidad Nº{" "}
                    <strong>{vecino?.ci}</strong>, propietario(a) legalmente registrado(a) del lote
                    de terreno correspondiente al <strong>Manzano {vecino?.manzano}</strong>,{" "}
                    <strong>Lote {vecino?.lote}</strong>:
                  </p>

                  <div
                    className={`badge-box p-4 rounded-xl text-center font-extrabold text-base border-2 ${
                      estaAlDia
                        ? "bg-[#DCFCE7] text-[#166534] border-[#166534]"
                        : "bg-[#FEE2E2] text-[#991B1B] border-[#991B1B]"
                    }`}
                  >
                    {estaAlDia
                      ? "SE ENCUENTRA AL DÍA Y NO REGISTRA ADEUDOS DE CUOTAS"
                      : `REGISTRA SALDO PENDIENTE DE Bs. ${saldoNumerico.toFixed(2)}`}
                    <p className="text-xs font-normal mt-1 opacity-90">
                      {estaAlDia
                        ? "No tiene deudas pendientes por cuotas mensuales, aportes de mejoras ni multas comunales."
                        : "Debe aproximarse a tesorería para regularizar sus aportes pendientes."}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600">
                    Se expide el presente certificado para fines de trámites municipales, notariales
                    y acreditación en asambleas, a los {new Date().getDate()} días del mes de{" "}
                    {new Date().toLocaleString("es-ES", { month: "long" })} del año{" "}
                    {new Date().getFullYear()}.
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
                  Documento emitido digitalmente por el Sistema Oficial de Gestión Vecinal OTB.
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-[#c4c5d5] flex justify-end gap-2">
                <button
                  onClick={() => setCertificadoModal(false)}
                  className="px-4 py-2 border border-[#c4c5d5] rounded-xl text-xs font-semibold text-[#444653] hover:bg-white cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  onClick={handlePrintCertificado}
                  className="px-5 py-2 bg-[#00288e] text-white rounded-xl text-xs font-bold hover:bg-[#1e40af] flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">print</span>
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
