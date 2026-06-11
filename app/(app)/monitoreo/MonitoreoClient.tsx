"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Thermometer,
  Droplets,
  Wind,
  Zap,
  CheckCircle2,
  MapPin,
  Calendar,
  Loader2,
} from "lucide-react";
import { useSensorData } from "@/hooks/useSensorData";
import { LOGISTICS_STAGES } from "@/lib/data";

const STAGE_ICONS: Record<number, string> = {
  1: "🌱",
  2: "📦",
  3: "❄️",
  4: "⚓",
  5: "🚢",
  6: "🏭",
};

function LiveMiniChart({
  data,
  color,
}: {
  data: Array<{ value: number }>;
  color: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={52}>
      <LineChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.8}
          dot={false}
          isAnimationActive={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border-base)",
            borderRadius: "8px",
            fontSize: "11px",
            color: "var(--color-text-primary)",
          }}
          formatter={(v: unknown) => [`${v}`, ""]}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function MonitoreoClient() {
  const {
    data,
    miniHistory,
    secondsAgo,
    isTempCritical,
    isHumidityCritical,
    isCO2Critical,
  } = useSensorData();

  const metrics = [
    {
      label: "Temperatura",
      value: data.temp.toFixed(1),
      unit: "°C",
      icon: Thermometer,
      isCritical: isTempCritical,
      sparkData: miniHistory.temp,
      color: isTempCritical ? "#DC2626" : "#2D6A4F",
      iconBg: isTempCritical ? "#FEF2F2" : "#D8F3DC",
      threshold: "Umbral: 2.0°C",
      status: isTempCritical ? "Fuera de rango" : "Normal",
    },
    {
      label: "Humedad relativa",
      value: data.humidity.toFixed(1),
      unit: "%",
      icon: Droplets,
      isCritical: isHumidityCritical,
      sparkData: miniHistory.humidity,
      color: "#3B82F6",
      iconBg: "#EFF6FF",
      threshold: "Rango: 85–95%",
      status: isHumidityCritical ? "Fuera de rango" : "Normal",
    },
    {
      label: "CO₂",
      value: data.co2.toString(),
      unit: " ppm",
      icon: Wind,
      isCritical: isCO2Critical,
      sparkData: miniHistory.co2,
      color: "#8B5CF6",
      iconBg: "#F5F3FF",
      threshold: "Umbral: 750 ppm",
      status: isCO2Critical ? "Elevado" : "Normal",
    },
    {
      label: "Golpes acumulados",
      value: data.impacts.toString(),
      unit: "",
      icon: Zap,
      isCritical: false,
      sparkData: miniHistory.temp.map((_, i) => ({ value: i % 8 === 4 ? 1 : 0 })),
      color: "#D97706",
      iconBg: "#FEF3C7",
      threshold: "Acumulado total",
      status: "Monitoreado",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto page-enter">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Monitoreo</h1>
          <p className="text-text-secondary text-sm mt-0.5">
            Trazabilidad del lote{" "}
            <span className="font-mono font-semibold text-primary">
              LOT-0821
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-primary bg-primary-subtle px-3 py-1.5 rounded-full">
          <span
            className="w-2 h-2 rounded-full bg-primary animate-live-pulse"
            aria-hidden="true"
          />
          En vivo · actualiza cada 5s
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left: Vertical timeline */}
        <div className="lg:col-span-2 space-y-0">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
            Etapas logísticas
          </h2>
          <div className="relative">
            {LOGISTICS_STAGES.map((stage, idx) => {
              const isLast = idx === LOGISTICS_STAGES.length - 1;
              return (
                <div key={stage.id} className="flex gap-4 relative">
                  {/* Left: indicator + line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0 z-10 ${
                        stage.status === "completed"
                          ? "bg-primary shadow-sm"
                          : stage.status === "current"
                          ? "bg-blue-500 shadow-sm"
                          : "bg-bg-base border-2 border-border-base"
                      }`}
                      aria-label={`Etapa: ${stage.name}`}
                    >
                      <span aria-hidden="true">{STAGE_ICONS[stage.id]}</span>
                    </div>
                    {!isLast && (
                      <div
                        className={`w-0.5 flex-1 min-h-[48px] mt-1 mb-1 ${
                          stage.status === "completed"
                            ? "bg-primary"
                            : "border-l-2 border-dashed border-border-base bg-transparent"
                        }`}
                      />
                    )}
                  </div>

                  {/* Right: content card */}
                  <div
                    className={`flex-1 mb-4 p-3.5 rounded-xl border transition-all ${
                      stage.status === "current"
                        ? "border-blue-400/50 bg-blue-50 dark:bg-blue-950/20 shadow-sm"
                        : "border-border-base bg-surface"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <p className="text-sm font-semibold text-text-primary">
                        {stage.name}
                      </p>
                      {stage.status === "completed" ? (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-primary bg-primary-subtle px-2 py-0.5 rounded-full">
                          <CheckCircle2 size={11} aria-hidden="true" />
                          Completado
                        </span>
                      ) : stage.status === "current" ? (
                        <span className="flex items-center gap-1.5 text-[11px] font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-live-pulse" aria-hidden="true" />
                          En curso
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-text-secondary bg-bg-base border border-border-base px-2 py-0.5 rounded-full">
                          Pendiente
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-text-secondary mb-1">
                      <MapPin size={11} aria-hidden="true" />
                      {stage.location}
                    </div>

                    {stage.date && (
                      <div className="flex items-center gap-1 text-[11px] text-text-secondary">
                        <Calendar size={11} aria-hidden="true" />
                        {stage.date}
                        {stage.time ? ` · ${stage.time}` : ""}
                      </div>
                    )}

                    {stage.temperature !== undefined && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <Thermometer size={11} className="text-text-secondary" aria-hidden="true" />
                        <span className="text-[11px] text-text-secondary">
                          Temp. registrada:{" "}
                          <span className="font-semibold text-text-primary">
                            {stage.temperature}°C
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live sensor readings */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
            Lecturas en tiempo real
          </h2>

          {metrics.map(
            ({
              label,
              value,
              unit,
              icon: Icon,
              isCritical,
              sparkData,
              color,
              iconBg,
              threshold,
              status,
            }) => (
              <div
                key={label}
                className={`bg-surface rounded-xl border p-4 shadow-sm transition-colors ${
                  isCritical ? "border-alert-red/40" : "border-border-base"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: iconBg }}
                    >
                      <Icon size={16} style={{ color }} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-text-secondary">{label}</p>
                      <p className="text-[11px] text-text-secondary">{threshold}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      key={`${label}-${value}`}
                      className="value-flash"
                    >
                      <p
                        className="text-2xl font-bold"
                        style={{ color: isCritical ? "#DC2626" : color }}
                      >
                        {value}
                        <span
                          className="text-base font-normal text-text-secondary ml-0.5"
                        >
                          {unit}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center justify-end gap-1.5 mt-0.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-live-pulse"
                        style={{ backgroundColor: color }}
                        aria-hidden="true"
                      />
                      <span className="text-[11px]" style={{ color }}>
                        En vivo
                      </span>
                      <span className="text-[11px] text-text-secondary">
                        · {status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="-mx-1">
                  <LiveMiniChart data={sparkData} color={color} />
                </div>
                <p className="text-[11px] text-text-secondary mt-1 text-right">
                  Actualizado hace {secondsAgo}s
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
