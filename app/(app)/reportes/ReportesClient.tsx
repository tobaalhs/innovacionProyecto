"use client";

import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import {
  Download,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Thermometer,
  Timer,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  TEMP_HISTORY,
  HUMIDITY_HISTORY,
  CO2_HISTORY,
  IMPACT_HISTORY,
  ALERTS,
  LOGISTICS_STAGES,
  HISTORICAL_LOTS,
} from "@/lib/data";

const LOT_OPTIONS = ["LOT-0821", "LOT-0819", "LOT-0817", "LOT-0815", "LOT-0812", "LOT-0809"];

const CHART_MARGIN = { top: 8, right: 16, bottom: 4, left: -8 };

function SectionChart({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-bg-base rounded-xl border border-border-base p-4">
      <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function ReportesClient() {
  const searchParams = useSearchParams();
  const initialLot = searchParams.get("lot") || "LOT-0821";
  const [selectedLot, setSelectedLot] = useState(initialLot);
  const [isExporting, setIsExporting] = useState(false);
  const [showLotMenu, setShowLotMenu] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lot = searchParams.get("lot");
    if (lot && LOT_OPTIONS.includes(lot)) setSelectedLot(lot);
  }, [searchParams]);

  const lotData = HISTORICAL_LOTS.find((l) => l.id === selectedLot);
  const lotAlerts = ALERTS.filter((a) => a.lot === selectedLot);

  const handleExportPDF = async () => {
    if (!reportRef.current || isExporting) return;
    setIsExporting(true);

    try {
      const [{ toCanvas }, jsPDFModule] = await Promise.all([
        import("html-to-image"),
        import("jspdf"),
      ]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const JsPDF: any = (jsPDFModule as any).jsPDF ?? jsPDFModule.default;

      const element = reportRef.current;

      // Apply light-mode CSS variables directly on the element so the
      // screenshot is always light-themed regardless of current dark/light mode.
      // CSS custom properties cascade, so element-level vars override the
      // dark-mode vars inherited from <html class="dark">.
      const LIGHT_VARS: Record<string, string> = {
        "--color-bg-base": "#F8FAF9",
        "--color-surface": "#FFFFFF",
        "--color-primary": "#2D6A4F",
        "--color-primary-light": "#52B788",
        "--color-primary-subtle": "#D8F3DC",
        "--color-text-primary": "#111827",
        "--color-text-secondary": "#6B7280",
        "--color-border-base": "#E5E7EB",
        "--color-alert-red": "#DC2626",
        "--color-alert-red-bg": "#FEF2F2",
        "--color-alert-yellow": "#D97706",
        "--color-alert-yellow-bg": "#FEF3C7",
        "--color-alert-green": "#2D6A4F",
        "--color-alert-green-bg": "#D8F3DC",
      };
      Object.entries(LIGHT_VARS).forEach(([prop, val]) =>
        element.style.setProperty(prop, val)
      );

      let canvas: HTMLCanvasElement;
      try {
        // html-to-image renders via SVG foreignObject → the browser's own engine
        // handles all CSS including oklch/oklab/color-mix without a custom parser.
        canvas = await toCanvas(element, {
          pixelRatio: 2,
          backgroundColor: "#ffffff",
        });
      } finally {
        Object.keys(LIGHT_VARS).forEach((prop) =>
          element.style.removeProperty(prop)
        );
      }

      const imgData = canvas.toDataURL("image/png");

      // Compute page dimensions: A4 width, height that exactly fits the content.
      // A single tall page avoids mid-content page breaks entirely.
      const pageW = 210; // mm (A4 width)
      const margin = 12;
      const headerH = 28;
      const contentW = pageW - margin * 2;
      const startY = headerH + 6;
      const imgW = canvas.width;
      const imgH = canvas.height;
      const contentImgH = (imgH * contentW) / imgW; // mm, preserving aspect ratio
      const pageH = startY + contentImgH + margin;

      const pdf = new JsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [pageW, pageH],
      });

      // Header bar
      pdf.setFillColor(45, 106, 79);
      pdf.rect(0, 0, pageW, headerH, "F");
      pdf.setFontSize(16);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.text("CereSense", margin, 11);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.text("Plataforma de trazabilidad para cerezas de exportación", margin, 17);
      pdf.setFontSize(8);
      pdf.setTextColor(200, 240, 220);
      const dateStr = new Date().toLocaleDateString("es-CL", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      pdf.text(`Generado: ${dateStr}`, pageW - margin, 17, { align: "right" });

      pdf.addImage(imgData, "PNG", margin, startY, contentW, contentImgH);

      pdf.save(`CereSense-${selectedLot}-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error("Error generando PDF:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto page-enter">
      {/* Toolbar (excluded from PDF) */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Reporte de Exportación</h1>
          <p className="text-text-secondary text-sm mt-0.5">
            Informe de trazabilidad · Temporada 2025–2026
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Lot selector */}
          <div className="relative">
            <button
              onClick={() => setShowLotMenu(!showLotMenu)}
              className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border-base rounded-xl text-sm font-medium text-text-primary hover:bg-bg-base cursor-pointer transition-colors"
              aria-haspopup="listbox"
              aria-expanded={showLotMenu}
              aria-label="Seleccionar lote"
            >
              <span className="font-mono">{selectedLot}</span>
              <ChevronDown
                size={15}
                className={`text-text-secondary transition-transform ${showLotMenu ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
            {showLotMenu && (
              <div
                className="absolute right-0 top-full mt-1 bg-surface border border-border-base rounded-xl shadow-lg z-20 overflow-hidden min-w-[140px]"
                role="listbox"
                aria-label="Seleccionar lote"
              >
                {LOT_OPTIONS.map((lot) => (
                  <button
                    key={lot}
                    onClick={() => {
                      setSelectedLot(lot);
                      setShowLotMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-mono cursor-pointer transition-colors hover:bg-bg-base ${
                      selectedLot === lot
                        ? "text-primary font-semibold bg-primary-subtle"
                        : "text-text-primary"
                    }`}
                    role="option"
                    aria-selected={selectedLot === lot}
                  >
                    {lot}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export button */}
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-light text-white font-semibold rounded-xl cursor-pointer transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
            aria-label={isExporting ? "Generando PDF..." : "Exportar reporte como PDF"}
          >
            {isExporting ? (
              <>
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                Generando...
              </>
            ) : (
              <>
                <Download size={16} aria-hidden="true" />
                Exportar PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* REPORT CONTENT — this section is captured for PDF */}
      <div
        ref={reportRef}
        className="bg-surface rounded-xl border border-border-base shadow-sm overflow-hidden"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* Section 1: Header */}
        <div className="bg-primary px-6 py-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                  <CherryIcon className="text-white w-4 h-4" />
                </div>
                <span className="text-white/80 text-sm font-medium">CereSense</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                Reporte de Exportación — {selectedLot}
              </h2>
              <p className="text-white/70 text-sm mt-0.5">
                Informe de trazabilidad · Temporada 2025–2026
              </p>
            </div>
            <div className="text-right text-white/70 text-xs">
              <p>Generado</p>
              <p className="font-medium text-white">
                {new Date().toLocaleDateString("es-CL")}
              </p>
            </div>
          </div>

          {/* Info chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              { label: "Lote", value: selectedLot },
              {
                label: "Destino",
                value: lotData?.destination ?? "Shanghái",
              },
              { label: "Exportadora", value: "Agrícola San Pedro" },
              { label: "Variedad", value: lotData?.variety ?? "Bing" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-white/15 rounded-lg px-3 py-1.5 text-xs"
              >
                <span className="text-white/60">{label}: </span>
                <span className="text-white font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Section 2: Summary stats */}
          <div>
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
              Resumen de monitoreo
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  icon: Timer,
                  label: "Duración total",
                  value: "28",
                  unit: "días",
                  color: "#2D6A4F",
                  bg: "#D8F3DC",
                },
                {
                  icon: TrendingUp,
                  label: "Temp. máxima",
                  value: "2.4",
                  unit: "°C",
                  color: "#DC2626",
                  bg: "#FEF2F2",
                },
                {
                  icon: TrendingDown,
                  label: "Temp. mínima",
                  value: "-0.8",
                  unit: "°C",
                  color: "#3B82F6",
                  bg: "#EFF6FF",
                },
                {
                  icon: AlertTriangle,
                  label: "Total alertas",
                  value: "3",
                  unit: "",
                  color: "#D97706",
                  bg: "#FEF3C7",
                },
              ].map(({ icon: Icon, label, value, unit, color, bg }) => (
                <div
                  key={label}
                  className="rounded-xl p-4 border border-border-base"
                  style={{ backgroundColor: bg }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                    style={{ backgroundColor: color + "22" }}
                  >
                    <Icon size={16} style={{ color }} aria-hidden="true" />
                  </div>
                  <p className="text-xs text-text-secondary mb-0.5">{label}</p>
                  <p className="text-2xl font-bold" style={{ color }}>
                    {value}
                    <span className="text-sm font-normal text-text-secondary ml-0.5">
                      {unit}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Charts 2x2 */}
          <div>
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
              Detalle por variable
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SectionChart title="Temperatura (°C)">
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={TEMP_HISTORY} margin={CHART_MARGIN}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 10 }}
                      interval={6}
                      tickFormatter={(v) => `D${v}`}
                    />
                    <YAxis
                      domain={[-0.5, 3]}
                      tick={{ fontSize: 10 }}
                      tickFormatter={(v) => `${v}°`}
                      width={38}
                    />
                    <Tooltip
                      contentStyle={{ fontSize: "11px", borderRadius: "8px" }}
                      formatter={(v: unknown) => [`${v}°C`, "Temp."]}
                      labelFormatter={(l) => `Día ${l}`}
                    />
                    <ReferenceLine
                      y={2.0}
                      stroke="#DC2626"
                      strokeDasharray="5 3"
                      strokeWidth={1.5}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#2D6A4F"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 3, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </SectionChart>

              <SectionChart title="Humedad (%)">
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={HUMIDITY_HISTORY} margin={CHART_MARGIN}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 10 }}
                      interval={6}
                      tickFormatter={(v) => `D${v}`}
                    />
                    <YAxis
                      domain={[88, 95]}
                      tick={{ fontSize: 10 }}
                      tickFormatter={(v) => `${v}%`}
                      width={40}
                    />
                    <Tooltip
                      contentStyle={{ fontSize: "11px", borderRadius: "8px" }}
                      formatter={(v: unknown) => [`${v}%`, "Humedad"]}
                      labelFormatter={(l) => `Día ${l}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 3, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </SectionChart>

              <SectionChart title="CO₂ (ppm)">
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={CO2_HISTORY} margin={CHART_MARGIN}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 10 }}
                      interval={6}
                      tickFormatter={(v) => `D${v}`}
                    />
                    <YAxis
                      domain={[640, 740]}
                      tick={{ fontSize: 10 }}
                      width={34}
                    />
                    <Tooltip
                      contentStyle={{ fontSize: "11px", borderRadius: "8px" }}
                      formatter={(v: unknown) => [`${v} ppm`, "CO₂"]}
                      labelFormatter={(l) => `Día ${l}`}
                    />
                    <ReferenceLine
                      y={750}
                      stroke="#D97706"
                      strokeDasharray="5 3"
                      strokeWidth={1.5}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 3, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </SectionChart>

              <SectionChart title="Golpes acumulados">
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={IMPACT_HISTORY} margin={CHART_MARGIN}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 10 }}
                      interval={6}
                      tickFormatter={(v) => `D${v}`}
                    />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      allowDecimals={false}
                      width={22}
                    />
                    <Tooltip
                      contentStyle={{ fontSize: "11px", borderRadius: "8px" }}
                      formatter={(v: unknown) => [`${v}`, "Golpes"]}
                      labelFormatter={(l) => `Día ${l}`}
                    />
                    <Bar
                      dataKey="value"
                      fill="#D97706"
                      radius={[3, 3, 0, 0]}
                      maxBarSize={20}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </SectionChart>
            </div>
          </div>

          {/* Section 4: Traceability stepper */}
          <div>
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
              Trazabilidad del lote
            </h3>
            <div className="bg-bg-base rounded-xl border border-border-base p-4 overflow-x-auto">
              <div className="flex items-start min-w-max gap-2">
                {LOGISTICS_STAGES.map((stage, idx) => (
                  <div key={stage.id} className="flex items-start">
                    <div className="flex flex-col items-center w-20">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                          stage.status === "completed"
                            ? "bg-primary text-white"
                            : stage.status === "current"
                            ? "bg-blue-500 text-white"
                            : "bg-border-base text-text-secondary"
                        }`}
                      >
                        {stage.status === "completed" ? (
                          <CheckCircle2 size={14} aria-hidden="true" />
                        ) : (
                          <span className="text-[10px] font-bold">{stage.id}</span>
                        )}
                      </div>
                      <p className="text-[10px] text-center mt-1 font-medium text-text-primary leading-tight max-w-[72px]">
                        {stage.name}
                      </p>
                      <p className="text-[9px] text-text-secondary text-center">
                        {stage.date}
                      </p>
                    </div>
                    {idx < LOGISTICS_STAGES.length - 1 && (
                      <div className="flex items-center mt-3 mx-0.5">
                        <div
                          className={`h-0.5 w-8 ${
                            stage.status === "completed"
                              ? "bg-primary"
                              : "border-t border-dashed border-border-base"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 5: Alerts table */}
          <div>
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
              Alertas del lote
            </h3>
            <div className="rounded-xl border border-border-base overflow-hidden">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="bg-bg-base border-b border-border-base">
                    <th className="text-left px-3 py-2 text-xs font-semibold text-text-secondary">
                      ID
                    </th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-text-secondary">
                      Variable
                    </th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-text-secondary">
                      Valor
                    </th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-text-secondary">
                      Fecha
                    </th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-text-secondary">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ALERTS.map((alert) => (
                    <tr
                      key={alert.id}
                      className="border-b border-border-base last:border-0"
                    >
                      <td className="px-3 py-2.5 font-mono text-xs text-text-secondary">
                        {alert.id}
                      </td>
                      <td className="px-3 py-2.5 text-text-primary text-sm">
                        {alert.variable}
                      </td>
                      <td
                        className="px-3 py-2.5 text-sm font-bold"
                        style={{
                          color:
                            alert.severity === "critical"
                              ? "#DC2626"
                              : alert.severity === "warning"
                              ? "#D97706"
                              : "#2D6A4F",
                        }}
                      >
                        {alert.value}
                      </td>
                      <td className="px-3 py-2.5 text-text-secondary text-xs">
                        {alert.date}
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            alert.status === "active"
                              ? "bg-alert-red-bg text-alert-red"
                              : "bg-alert-green-bg text-alert-green"
                          }`}
                        >
                          {alert.status === "active" ? "Activa" : "Resuelta"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {ALERTS.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-3 py-6 text-center text-text-secondary text-sm">
                        Sin alertas registradas
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 6: Final status */}
          <div className="rounded-xl border-2 border-primary/30 bg-primary-subtle p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                <CheckCircle2 size={24} className="text-white" aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold text-primary">
                    ✓ Apto para comercialización
                  </span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  El lote{" "}
                  <span className="font-mono font-semibold text-text-primary">
                    {selectedLot}
                  </span>{" "}
                  completó el proceso logístico dentro de los parámetros aceptables para la
                  exportación de cerezas. Se registró un evento de temperatura elevada en el
                  día 20 que fue atendido oportunamente. La fruta se encuentra en condiciones
                  adecuadas para su comercialización en destino.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CherryIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="8.5" cy="17.5" r="4.5" fill="currentColor" opacity="0.85" />
      <circle cx="17" cy="15.5" r="4.5" fill="currentColor" />
      <path
        d="M8.5 13 C9 9 13 5 17 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
