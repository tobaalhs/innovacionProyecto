"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Activity,
  Bell,
  History,
  FileText,
  Settings,
  Sun,
  Moon,
  LogOut,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Resumen", icon: LayoutDashboard },
  { href: "/monitoreo", label: "Monitoreo", icon: Activity },
  { href: "/alertas", label: "Alertas", icon: Bell, badge: 2 },
  { href: "/historial", label: "Historial", icon: History },
  { href: "/reportes", label: "Reportes", icon: FileText },
  { href: "/configuracion", label: "Configuración", icon: Settings },
];

const CherryIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
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

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === "dark";

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 h-screen bg-surface border-r border-border-base sticky top-0 z-30">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border-base">
          <div className="w-9 h-9 rounded-xl bg-primary-subtle flex items-center justify-center text-primary shrink-0">
            <CherryIcon />
          </div>
          <div>
            <span className="text-lg font-bold text-primary tracking-tight">
              CereSense
            </span>
            <p className="text-[10px] text-text-secondary leading-none mt-0.5">
              Temporada 2025–2026
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto" aria-label="Navegación principal">
          {navItems.map(({ href, label, icon: Icon, badge }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all duration-150 group relative ${
                  isActive
                    ? "bg-primary-subtle text-primary"
                    : "text-text-secondary hover:bg-bg-base hover:text-text-primary"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  size={18}
                  className={
                    isActive ? "text-primary" : "text-text-secondary group-hover:text-text-primary"
                  }
                  aria-hidden="true"
                />
                <span className="flex-1">{label}</span>
                {badge && !isActive && (
                  <span className="text-[10px] font-semibold bg-alert-red text-white rounded-full px-1.5 py-0.5 leading-none">
                    {badge}
                  </span>
                )}
                {isActive && (
                  <ChevronRight size={14} className="text-primary opacity-60" aria-hidden="true" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-border-base space-y-2">
          {/* Dark mode toggle */}
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-bg-base hover:text-text-primary cursor-pointer transition-all duration-150"
            aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            {mounted ? (
              isDark ? (
                <Sun size={18} aria-hidden="true" />
              ) : (
                <Moon size={18} aria-hidden="true" />
              )
            ) : (
              <Moon size={18} aria-hidden="true" />
            )}
            <span>{isDark ? "Modo claro" : "Modo oscuro"}</span>
          </button>

          {/* User info */}
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
              MR
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                María Rodríguez
              </p>
              <p className="text-xs text-text-secondary truncate">
                Ag. San Pedro
              </p>
            </div>
            <button
              className="text-text-secondary hover:text-alert-red cursor-pointer transition-colors"
              aria-label="Cerrar sesión"
              onClick={() => (window.location.href = "/login")}
            >
              <LogOut size={15} aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile bottom navigation */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border-base flex items-center justify-around px-2 py-2 safe-area-pb"
        aria-label="Navegación móvil"
      >
        {navItems.slice(0, 5).map(({ href, label, icon: Icon, badge }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl cursor-pointer transition-all duration-150 relative ${
                isActive ? "text-primary" : "text-text-secondary"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="relative">
                <Icon size={20} aria-hidden="true" />
                {badge && !isActive && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-alert-red rounded-full text-[8px] text-white flex items-center justify-center font-bold">
                    {badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
