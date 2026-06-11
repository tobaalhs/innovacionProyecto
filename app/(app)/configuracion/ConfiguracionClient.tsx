"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Building2,
  Bell,
  Shield,
  Save,
  Edit3,
  CheckCircle2,
  Thermometer,
  Droplets,
  Wind,
} from "lucide-react";

function Toggle({
  checked,
  onChange,
  id,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border-base last:border-0">
      <label htmlFor={id} className="text-sm text-text-primary cursor-pointer">
        {label}
      </label>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex w-10 h-5.5 rounded-full transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          checked ? "bg-primary" : "bg-border-base"
        }`}
        style={{ height: "22px", width: "40px" }}
      >
        <span
          className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform duration-200 ${
            checked ? "translate-x-[18px]" : "translate-x-0.5"
          }`}
          style={{ width: "18px", height: "18px" }}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

function ThresholdInput({
  label,
  value,
  unit,
  onChange,
  icon: Icon,
  iconColor,
}: {
  label: string;
  value: number;
  unit: string;
  onChange: (v: number) => void;
  icon: React.ElementType;
  iconColor: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: iconColor + "22" }}
        aria-hidden="true"
      >
        <Icon size={15} style={{ color: iconColor }} />
      </div>
      <div className="flex-1">
        <label className="text-xs text-text-secondary block mb-0.5">{label}</label>
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            step="0.1"
            className="w-20 px-2.5 py-1.5 bg-bg-base border border-border-base rounded-lg text-sm font-mono font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            aria-label={`${label} ${unit}`}
          />
          <span className="text-sm text-text-secondary">{unit}</span>
        </div>
      </div>
    </div>
  );
}

export default function ConfiguracionClient() {
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    criticalAlerts: true,
    dailySummary: false,
  });

  const [thresholds, setThresholds] = useState({
    tempMax: 2.0,
    humidityMin: 85.0,
    humidityMax: 95.0,
    co2Max: 750,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto page-enter">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Configuración</h1>
        <p className="text-text-secondary text-sm mt-0.5">
          Gestiona tu perfil, notificaciones y umbrales de alerta
        </p>
      </div>

      <div className="space-y-5">
        {/* Section 1: Profile */}
        <div className="bg-surface rounded-xl border border-border-base shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-base">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary-subtle flex items-center justify-center">
                <User size={16} className="text-primary" aria-hidden="true" />
              </div>
              <h2 className="text-sm font-semibold text-text-primary">Perfil</h2>
            </div>
            <button className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-light cursor-pointer transition-colors border border-primary/30 rounded-lg px-3 py-1.5 hover:bg-primary-subtle">
              <Edit3 size={13} aria-hidden="true" />
              Editar
            </button>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold shrink-0">
                MR
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">María Rodríguez</p>
                <p className="text-xs text-text-secondary">Jefa de Exportaciones</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: "Nombre completo", value: "María Rodríguez", icon: User },
                { label: "Correo electrónico", value: "maria@agricolasanpedro.cl", icon: Mail },
                { label: "Empresa", value: "Agrícola San Pedro", icon: Building2 },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-bg-base rounded-xl p-3 flex items-center gap-2.5">
                  <Icon size={15} className="text-text-secondary shrink-0" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-[11px] text-text-secondary">{label}</p>
                    <p className="text-sm font-medium text-text-primary truncate">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-text-secondary bg-primary-subtle rounded-lg px-3 py-2">
              Los datos del perfil son de solo lectura en modo prototipo.
            </p>
          </div>
        </div>

        {/* Section 2: Notifications */}
        <div className="bg-surface rounded-xl border border-border-base shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border-base">
            <div className="w-8 h-8 rounded-lg bg-alert-yellow-bg flex items-center justify-center">
              <Bell size={16} className="text-alert-yellow" aria-hidden="true" />
            </div>
            <h2 className="text-sm font-semibold text-text-primary">Notificaciones</h2>
          </div>
          <div className="px-5">
            <Toggle
              id="emailAlerts"
              label="Alertas por correo electrónico"
              checked={notifications.emailAlerts}
              onChange={(v) => setNotifications((n) => ({ ...n, emailAlerts: v }))}
            />
            <Toggle
              id="criticalAlerts"
              label="Alertas críticas inmediatas"
              checked={notifications.criticalAlerts}
              onChange={(v) => setNotifications((n) => ({ ...n, criticalAlerts: v }))}
            />
            <Toggle
              id="dailySummary"
              label="Resumen diario"
              checked={notifications.dailySummary}
              onChange={(v) => setNotifications((n) => ({ ...n, dailySummary: v }))}
            />
          </div>
        </div>

        {/* Section 3: Thresholds */}
        <div className="bg-surface rounded-xl border border-border-base shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border-base">
            <div className="w-8 h-8 rounded-lg bg-alert-red-bg flex items-center justify-center">
              <Shield size={16} className="text-alert-red" aria-hidden="true" />
            </div>
            <h2 className="text-sm font-semibold text-text-primary">
              Umbrales de alerta
            </h2>
          </div>
          <div className="p-5 space-y-4">
            <p className="text-xs text-text-secondary">
              Configura los valores límite para la generación automática de alertas.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ThresholdInput
                label="Temperatura máxima"
                value={thresholds.tempMax}
                unit="°C"
                onChange={(v) => setThresholds((t) => ({ ...t, tempMax: v }))}
                icon={Thermometer}
                iconColor="#DC2626"
              />
              <ThresholdInput
                label="Humedad mínima"
                value={thresholds.humidityMin}
                unit="%"
                onChange={(v) => setThresholds((t) => ({ ...t, humidityMin: v }))}
                icon={Droplets}
                iconColor="#3B82F6"
              />
              <ThresholdInput
                label="Humedad máxima"
                value={thresholds.humidityMax}
                unit="%"
                onChange={(v) => setThresholds((t) => ({ ...t, humidityMax: v }))}
                icon={Droplets}
                iconColor="#3B82F6"
              />
              <ThresholdInput
                label="CO₂ máximo"
                value={thresholds.co2Max}
                unit="ppm"
                onChange={(v) => setThresholds((t) => ({ ...t, co2Max: v }))}
                icon={Wind}
                iconColor="#8B5CF6"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSave}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200 ${
                  saved
                    ? "bg-primary-subtle text-primary border border-primary/30"
                    : "bg-primary hover:bg-primary-light text-white shadow-sm"
                }`}
                aria-label="Guardar umbrales"
              >
                {saved ? (
                  <>
                    <CheckCircle2 size={16} aria-hidden="true" />
                    ¡Guardado!
                  </>
                ) : (
                  <>
                    <Save size={16} aria-hidden="true" />
                    Guardar cambios
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
