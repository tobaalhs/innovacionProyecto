"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Eye,
  X,
  ExternalLink,
} from "lucide-react";
import { ALERTS, type Alert } from "@/lib/data";

type FilterTab = "all" | "critical" | "warning" | "resolved";

const SEVERITY_CONFIG = {
  critical: {
    label: "Crítica",
    color: "#DC2626",
    bg: "var(--color-alert-red-bg)",
    badgeBg: "#FEF2F2",
    badgeText: "#DC2626",
    icon: AlertTriangle,
  },
  warning: {
    label: "Advertencia",
    color: "#D97706",
    bg: "var(--color-alert-yellow-bg)",
    badgeBg: "#FEF3C7",
    badgeText: "#D97706",
    icon: Info,
  },
  resolved: {
    label: "Resuelta",
    color: "#2D6A4F",
    bg: "var(--color-alert-green-bg)",
    badgeBg: "#D8F3DC",
    badgeText: "#2D6A4F",
    icon: CheckCircle2,
  },
};

function SeverityBadge({ severity }: { severity: Alert["severity"] }) {
  const cfg = SEVERITY_CONFIG[severity];
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: cfg.badgeBg, color: cfg.badgeText }}
    >
      <Icon size={12} aria-hidden="true" />
      {cfg.label}
    </span>
  );
}

function AlertModal({
  alert,
  onClose,
}: {
  alert: Alert;
  onClose: () => void;
}) {
  const cfg = SEVERITY_CONFIG[alert.severity];
  const Icon = cfg.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-surface rounded-2xl border border-border-base shadow-xl w-full max-w-lg page-enter">
        {/* Header */}
        <div
          className="flex items-start justify-between p-5 rounded-t-2xl border-b border-border-base"
          style={{ backgroundColor: cfg.badgeBg }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: cfg.color + "22" }}
            >
              <Icon size={20} style={{ color: cfg.color }} aria-hidden="true" />
            </div>
            <div>
              <h2
                id="modal-title"
                className="text-base font-bold text-text-primary"
              >
                Alerta {cfg.label}
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                {alert.id} · {alert.date}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary cursor-pointer p-1 rounded-lg hover:bg-black/5 transition-colors"
            aria-label="Cerrar"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-bg-base rounded-xl p-3">
              <p className="text-xs text-text-secondary mb-0.5">Variable</p>
              <p className="text-sm font-semibold text-text-primary">
                {alert.variable}
              </p>
            </div>
            <div className="bg-bg-base rounded-xl p-3">
              <p className="text-xs text-text-secondary mb-0.5">Valor registrado</p>
              <p
                className="text-sm font-bold"
                style={{ color: cfg.color }}
              >
                {alert.value}
              </p>
            </div>
            <div className="bg-bg-base rounded-xl p-3">
              <p className="text-xs text-text-secondary mb-0.5">Lote</p>
              <p className="text-sm font-semibold text-text-primary font-mono">
                {alert.lot}
              </p>
            </div>
            <div className="bg-bg-base rounded-xl p-3">
              <p className="text-xs text-text-secondary mb-0.5">Estado</p>
              <SeverityBadge severity={alert.severity} />
            </div>
          </div>

          <div>
            <p className="text-xs text-text-secondary mb-1.5">Detalle</p>
            <p className="text-sm text-text-primary leading-relaxed bg-bg-base rounded-xl p-3">
              {alert.detail}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary border border-border-base hover:bg-bg-base cursor-pointer transition-colors"
          >
            Cerrar
          </button>
          <button className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-light cursor-pointer transition-colors flex items-center gap-1.5">
            <ExternalLink size={14} aria-hidden="true" />
            Ver lote
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AlertasClient() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const hasCritical = ALERTS.some(
    (a) => a.severity === "critical" && a.status === "active"
  );
  const criticalAlert = ALERTS.find(
    (a) => a.severity === "critical" && a.status === "active"
  );

  const filtered = ALERTS.filter((a) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "resolved") return a.status === "resolved";
    return a.severity === activeFilter;
  });

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "Todas", count: ALERTS.length },
    {
      key: "critical",
      label: "Críticas",
      count: ALERTS.filter((a) => a.severity === "critical").length,
    },
    {
      key: "warning",
      label: "Advertencias",
      count: ALERTS.filter((a) => a.severity === "warning").length,
    },
    {
      key: "resolved",
      label: "Resueltas",
      count: ALERTS.filter((a) => a.status === "resolved").length,
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto page-enter">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Alertas</h1>

      {/* Critical banner */}
      {hasCritical && criticalAlert && (
        <div className="flex items-center justify-between bg-alert-red-bg border border-alert-red/30 rounded-xl px-4 py-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-alert-red/15 flex items-center justify-center shrink-0">
              <AlertTriangle
                size={16}
                className="text-alert-red"
                aria-hidden="true"
              />
            </div>
            <p className="text-sm font-semibold text-alert-red">
              Alerta crítica activa —{" "}
              <span className="font-mono">{criticalAlert.lot}</span>: Temperatura{" "}
              {criticalAlert.value}
            </p>
          </div>
          <button
            onClick={() => setSelectedAlert(criticalAlert)}
            className="text-xs font-semibold text-alert-red border border-alert-red/40 rounded-lg px-3 py-1.5 hover:bg-alert-red/10 cursor-pointer transition-colors whitespace-nowrap"
          >
            Ver detalle
          </button>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-5 p-1 bg-bg-base border border-border-base rounded-xl w-fit">
        {tabs.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 flex items-center gap-1.5 ${
              activeFilter === key
                ? "bg-surface text-text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {label}
            <span
              className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                activeFilter === key
                  ? "bg-primary-subtle text-primary"
                  : "bg-border-base text-text-secondary"
              }`}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-surface rounded-xl border border-border-base shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-border-base bg-bg-base">
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Severidad
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Variable
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Lote
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Valor
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Fecha
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Estado
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((alert, idx) => (
                <tr
                  key={alert.id}
                  className={`border-b border-border-base last:border-0 hover:bg-bg-base transition-colors ${
                    idx % 2 === 1 ? "bg-bg-base/40" : ""
                  }`}
                >
                  <td className="px-4 py-3.5">
                    <SeverityBadge severity={alert.severity} />
                  </td>
                  <td className="px-4 py-3.5 text-text-primary font-medium">
                    {alert.variable}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-xs bg-bg-base border border-border-base px-2 py-0.5 rounded-md text-text-primary">
                      {alert.lot}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3.5 font-bold"
                    style={{
                      color: SEVERITY_CONFIG[alert.severity].color,
                    }}
                  >
                    {alert.value}
                  </td>
                  <td className="px-4 py-3.5 text-text-secondary">
                    {alert.date}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                        alert.status === "active"
                          ? "bg-alert-red-bg text-alert-red"
                          : "bg-alert-green-bg text-alert-green"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          alert.status === "active"
                            ? "bg-alert-red animate-live-pulse"
                            : "bg-alert-green"
                        }`}
                        aria-hidden="true"
                      />
                      {alert.status === "active" ? "Activa" : "Resuelta"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => setSelectedAlert(alert)}
                      className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-light cursor-pointer transition-colors px-3 py-1.5 rounded-lg border border-primary/30 hover:bg-primary-subtle"
                    >
                      <Eye size={13} aria-hidden="true" />
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-text-secondary">
              <CheckCircle2 size={32} className="mx-auto mb-2 text-primary" />
              <p className="text-sm">No hay alertas en esta categoría</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedAlert && (
        <AlertModal
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
        />
      )}
    </div>
  );
}
