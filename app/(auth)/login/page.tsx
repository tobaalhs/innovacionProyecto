"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => router.push("/dashboard"), 800);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #D8F3DC 0%, #F8FAF9 60%, #ffffff 100%)",
      }}
    >
      <div className="w-full max-w-md page-enter">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-border-base p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-11 h-11 rounded-xl bg-primary-subtle flex items-center justify-center">
                <CherryIcon className="text-primary" />
              </div>
              <span className="text-3xl font-bold text-primary tracking-tight">
                CereSense
              </span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              Trazabilidad inteligente para cerezas de exportación
            </p>
          </div>

          <div className="border-t border-border-base mb-6" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Company */}
            <div>
              <label
                htmlFor="empresa"
                className="block text-sm font-medium text-text-primary mb-1.5"
              >
                Empresa exportadora
              </label>
              <div className="relative">
                <Building2
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                  aria-hidden="true"
                />
                <input
                  id="empresa"
                  type="text"
                  placeholder="Agrícola San Pedro"
                  className="w-full pl-9 pr-4 py-2.5 bg-bg-base border border-border-base rounded-lg text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  autoComplete="organization"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-primary mb-1.5"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                  aria-hidden="true"
                />
                <input
                  id="email"
                  type="email"
                  placeholder="maria@agricolasanpedro.cl"
                  className="w-full pl-9 pr-4 py-2.5 bg-bg-base border border-border-base rounded-lg text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-primary mb-1.5"
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                  aria-hidden="true"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-bg-base border border-border-base rounded-lg text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary cursor-pointer"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-border-base text-primary accent-primary cursor-pointer"
                />
                <span className="text-sm text-text-secondary">Recordarme</span>
              </label>
              <button
                type="button"
                className="text-sm text-primary hover:text-primary-light cursor-pointer font-medium"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Ingresando...
                </>
              ) : (
                "Ingresar"
              )}
            </button>
          </form>

          {/* Prototype hint */}
          <p className="mt-4 text-center text-xs text-text-secondary bg-primary-subtle rounded-lg px-3 py-2">
            Ingresa cualquier dato para continuar (prototipo)
          </p>
        </div>

        <p className="text-center text-xs text-text-secondary mt-4">
          Temporada 2025–2026
        </p>
      </div>
    </div>
  );
}

function CherryIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="22"
      height="22"
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
      <path
        d="M12 9 C13 6 16 4 17 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
