import type { Metadata } from "next";
import { Suspense } from "react";
import ReportesClient from "./ReportesClient";

export const metadata: Metadata = {
  title: "CereSense — Reportes",
};

function ReportesLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-text-secondary">Cargando reporte...</p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<ReportesLoading />}>
      <ReportesClient />
    </Suspense>
  );
}
