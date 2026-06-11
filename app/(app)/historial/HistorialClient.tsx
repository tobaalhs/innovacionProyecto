"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Package,
} from "lucide-react";
import { HISTORICAL_LOTS, type HistoricalLot } from "@/lib/data";

const STATUS_CONFIG = {
  active: {
    label: "En curso",
    bg: "bg-blue-100",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  completed: {
    label: "Completado",
    bg: "bg-primary-subtle",
    text: "text-primary",
    dot: "bg-primary",
  },
};

export default function HistorialClient() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "completed">("all");

  const filtered = HISTORICAL_LOTS.filter((lot) => {
    const matchSearch =
      lot.id.toLowerCase().includes(search.toLowerCase()) ||
      lot.destination.toLowerCase().includes(search.toLowerCase()) ||
      lot.variety.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" || lot.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleRowClick = (id: string) => {
    router.push(`/reportes?lot=${id}`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto page-enter">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Historial</h1>
        <p className="text-text-secondary text-sm mt-0.5">
          Registro de todos los lotes de la temporada 2025–2026
        </p>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por lote, destino o variedad..."
            className="w-full pl-9 pr-4 py-2.5 bg-surface border border-border-base rounded-xl text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            aria-label="Buscar lotes"
          />
        </div>
        <div className="flex gap-1 p-1 bg-bg-base border border-border-base rounded-xl">
          {(["all", "active", "completed"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all ${
                statusFilter === s
                  ? "bg-surface text-text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {s === "all" ? "Todos" : s === "active" ? "En curso" : "Completados"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-xl border border-border-base shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-border-base bg-bg-base">
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Lote
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Destino
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Variedad
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Fechas
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Estado
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Alertas
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Reporte
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lot, idx) => {
                const statusCfg = STATUS_CONFIG[lot.status];
                return (
                  <tr
                    key={lot.id}
                    className="border-b border-border-base last:border-0 hover:bg-bg-base transition-colors cursor-pointer group"
                    onClick={() => handleRowClick(lot.id)}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && handleRowClick(lot.id)}
                    role="row"
                    aria-label={`Ver reporte de ${lot.id}`}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-primary-subtle flex items-center justify-center shrink-0">
                          <Package size={13} className="text-primary" aria-hidden="true" />
                        </div>
                        <span className="font-mono text-sm font-semibold text-text-primary">
                          {lot.id}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-text-primary font-medium">
                      {lot.destination}
                    </td>
                    <td className="px-4 py-3.5 text-text-secondary">{lot.variety}</td>
                    <td className="px-4 py-3.5 text-text-secondary text-xs">
                      {lot.startDate} → {lot.endDate}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${statusCfg.bg} ${statusCfg.text}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot} ${
                            lot.status === "active" ? "animate-live-pulse" : ""
                          }`}
                          aria-hidden="true"
                        />
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {lot.alerts > 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-alert-red bg-alert-red-bg px-2.5 py-1 rounded-full">
                          <AlertTriangle size={11} aria-hidden="true" />
                          {lot.alerts} alerta{lot.alerts > 1 ? "s" : ""}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary-subtle px-2.5 py-1 rounded-full">
                          <CheckCircle2 size={11} aria-hidden="true" />
                          Sin alertas
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all">
                        Ver reporte
                        <ChevronRight size={13} aria-hidden="true" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-text-secondary">
              <Package size={32} className="mx-auto mb-2 opacity-40" aria-hidden="true" />
              <p className="text-sm">No se encontraron lotes</p>
            </div>
          )}
        </div>
        <div className="px-4 py-2.5 border-t border-border-base text-xs text-text-secondary">
          Mostrando {filtered.length} de {HISTORICAL_LOTS.length} lotes
        </div>
      </div>
    </div>
  );
}
