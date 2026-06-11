"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { Thermometer, Droplets, Wind, Zap, CheckCircle2, Circle, Clock } from "lucide-react";
import { useSensorData } from "@/hooks/useSensorData";
import {
  SHIPMENT,
  LOGISTICS_STAGES,
  ALERTS,
  TEMP_HISTORY,
} from "@/lib/data";

function SparkLine({
  data,
  color,
}: {
  data: Array<{ value: number }>;
  color: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={44}>
      <LineChart data={data} margin={{ top: 4, right: 0, bottom: 4, left: 0 }}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.8}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

const SEVERITY_COLORS = {
  critical: { dot: "#DC2626", bg: "#FEF2F2", text: "#DC2626", label: "Crítica" },
  warning: { dot: "#D97706", bg: "#FEF3C7", text: "#D97706", label: "Advertencia" },
  resolved: { dot: "#2D6A4F", bg: "#D8F3DC", text: "#2D6A4F", label: "Resuelta" },
};

export default function DashboardClient() {
  const { data, miniHistory, secondsAgo, isTempCritical, isHumidityCritical, isCO2Critical } =
    useSensorData();

  const [greeting, setGreeting] = useState("Buenos días");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Buenos días" : h < 19 ? "Buenas tardes" : "Buenas noches");
    setDateStr(
      new Date().toLocaleDateString("es-CL", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  const kpiCards = [
    {
      label: "Temperatura",
      value: data.temp.toFixed(1),
      unit: "°C",
      icon: Thermometer,
      isCritical: isTempCritical,
      statusLabel: isTempCritical ? "¡Alerta!" : "Normal",
      sparkData: miniHistory.temp,
      sparkColor: isTempCritical ? "#DC2626" : "#2D6A4F",
      iconColor: isTempCritical ? "#DC2626" : "#2D6A4F",
      iconBg: isTempCritical ? "#FEF2F2" : "#D8F3DC",
    },
    {
      label: "Humedad",
      value: data.humidity.toFixed(1),
      unit: "%",
      icon: Droplets,
      isCritical: isHumidityCritical,
      statusLabel: isHumidityCritical ? "Fuera de rango" : "Normal",
      sparkData: miniHistory.humidity,
      sparkColor: "#3B82F6",
      iconColor: "#3B82F6",
      iconBg: "#EFF6FF",
    },
    {
      label: "CO₂",
      value: data.co2.toString(),
      unit: " ppm",
      icon: Wind,
      isCritical: isCO2Critical,
      statusLabel: isCO2Critical ? "Elevado" : "Normal",
      sparkData: miniHistory.co2,
      sparkColor: "#8B5CF6",
      iconColor: "#8B5CF6",
      iconBg: "#F5F3FF",
    },
    {
      label: "Golpes",
      value: data.impacts.toString(),
      unit: "",
      icon: Zap,
      isCritical: false,
      statusLabel: "Acumulados",
      sparkData: miniHistory.temp.map((_, i) => ({ value: i % 7 === 3 ? 1 : 0 })),
      sparkColor: "#D97706",
      iconColor: "#D97706",
      iconBg: "#FEF3C7",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto page-enter">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">
          {greeting}, María{" "}
          <span role="img" aria-label="saludo">
            👋
          </span>
        </h1>
        {dateStr && (
          <p className="text-text-secondary capitalize mt-0.5">{dateStr}</p>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpiCards.map(
          ({
            label,
            value,
            unit,
            icon: Icon,
            isCritical,
            statusLabel,
            sparkData,
            sparkColor,
            iconColor,
            iconBg,
          }) => (
            <div
              key={label}
              className="bg-surface rounded-xl border border-border-base p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-2">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: iconBg }}
                >
                  <Icon size={18} style={{ color: iconColor }} aria-hidden="true" />
                </div>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    color: isCritical ? "#DC2626" : "#2D6A4F",
                    backgroundColor: isCritical ? "#FEF2F2" : "#D8F3DC",
                  }}
                >
                  {statusLabel}
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-2 mb-0.5">{label}</p>
              <div
                key={`${label}-${value}`}
                className="value-flash"
              >
                <p className="text-2xl font-bold text-text-primary">
                  {value}
                  <span className="text-base font-normal text-text-secondary ml-0.5">
                    {unit}
                  </span>
                </p>
              </div>
              <div className="mt-2 -mx-1">
                <SparkLine data={sparkData} color={sparkColor} />
              </div>
              <p className="text-[11px] text-text-secondary mt-1">
                Actualizado hace {secondsAgo}s
              </p>
            </div>
          )
        )}
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        {/* Shipment stepper */}
        <div className="lg:col-span-3 bg-surface rounded-xl border border-border-base p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-text-primary">
              Estado del envío{" "}
              <span className="text-primary font-mono">{SHIPMENT.lot}</span>
            </h2>
            <span className="text-xs text-text-secondary bg-bg-base px-2 py-1 rounded-lg border border-border-base">
              Día {SHIPMENT.currentDay} de {SHIPMENT.totalDays}
            </span>
          </div>

          {/* Horizontal stepper */}
          <div className="relative overflow-x-auto">
            <div className="flex items-start min-w-max pb-2">
              {LOGISTICS_STAGES.map((stage, idx) => (
                <div key={stage.id} className="flex items-start">
                  <div className="flex flex-col items-center w-20">
                    {/* Icon */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        stage.status === "completed"
                          ? "bg-primary text-white"
                          : stage.status === "current"
                          ? "bg-blue-500 text-white step-pulse"
                          : "bg-border-base text-text-secondary"
                      }`}
                    >
                      {stage.status === "completed" ? (
                        <CheckCircle2 size={16} aria-hidden="true" />
                      ) : stage.status === "current" ? (
                        <Circle size={16} className="fill-white/30" aria-hidden="true" />
                      ) : (
                        <Circle size={14} aria-hidden="true" />
                      )}
                    </div>
                    <p
                      className={`text-[10px] text-center mt-1.5 font-medium leading-tight max-w-[72px] ${
                        stage.status === "completed"
                          ? "text-primary"
                          : stage.status === "current"
                          ? "text-blue-500"
                          : "text-text-secondary"
                      }`}
                    >
                      {stage.name}
                    </p>
                    {stage.date && (
                      <p className="text-[9px] text-text-secondary text-center mt-0.5">
                        {stage.date}
                        {stage.time ? ` · ${stage.time}` : ""}
                      </p>
                    )}
                  </div>

                  {/* Connector */}
                  {idx < LOGISTICS_STAGES.length - 1 && (
                    <div className="flex items-center mt-3.5 mx-1">
                      <div
                        className={`h-0.5 w-10 ${
                          stage.status === "completed"
                            ? "bg-primary"
                            : "border-t-2 border-dashed border-border-base"
                        }`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-text-secondary mt-3 flex items-center gap-1">
            <Clock size={12} aria-hidden="true" />
            Llega aprox. {SHIPMENT.estimatedArrival} · {SHIPMENT.destination}
          </p>
        </div>

        {/* Recent alerts */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-border-base p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-text-primary mb-4">
            Alertas recientes
          </h2>
          <div className="space-y-3">
            {ALERTS.map((alert) => {
              const cfg = SEVERITY_COLORS[alert.severity];
              return (
                <div
                  key={alert.id}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg"
                  style={{ backgroundColor: cfg.bg }}
                >
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: cfg.dot }}
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-text-primary truncate">
                      {alert.lot} — {alert.variable}{" "}
                      <span style={{ color: cfg.text }} className="font-semibold">
                        {alert.value}
                      </span>
                    </p>
                    <p className="text-[11px] text-text-secondary">{alert.date}</p>
                  </div>
                  {alert.status === "resolved" && (
                    <CheckCircle2
                      size={13}
                      className="text-primary shrink-0 mt-0.5"
                      aria-label="Resuelta"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Temperature chart */}
      <div className="bg-surface rounded-xl border border-border-base p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-text-primary">
            Temperatura — Últimos 28 días
          </h2>
          <div className="flex items-center gap-4 text-[11px] text-text-secondary">
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-0.5 bg-primary inline-block rounded" />
              Temperatura
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-0.5 border-t-2 border-dashed border-alert-red inline-block" />
              Umbral 2.0°C
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart
            data={TEMP_HISTORY}
            margin={{ top: 10, right: 16, bottom: 4, left: -10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-base)" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
              tickFormatter={(v) => `D${v}`}
              interval={3}
            />
            <YAxis
              domain={[-0.5, 3]}
              tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
              tickFormatter={(v) => `${v}°`}
              width={42}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border-base)",
                borderRadius: "10px",
                fontSize: "12px",
                color: "var(--color-text-primary)",
              }}
              formatter={(v: unknown) => [`${v}°C`, "Temperatura"]}
              labelFormatter={(l) => `Día ${l}`}
            />
            <ReferenceLine
              y={2.0}
              stroke="#DC2626"
              strokeDasharray="6 4"
              strokeWidth={1.5}
              label={{
                value: "2.0°C",
                position: "insideTopRight",
                fontSize: 10,
                fill: "#DC2626",
                offset: 4,
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2D6A4F"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: "#2D6A4F" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
