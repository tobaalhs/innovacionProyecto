"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.push("/dashboard"), 3000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base">
      <div className="text-center page-enter">
        <div className="w-20 h-20 rounded-full bg-primary-subtle flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl" role="img" aria-label="Error">
            404
          </span>
        </div>
        <h1 className="text-5xl font-bold text-primary mb-3">404</h1>
        <p className="text-text-secondary mb-1 text-lg">Página no encontrada</p>
        <p className="text-sm text-text-secondary">
          Redirigiendo al panel principal...
        </p>
        <div className="mt-6">
          <div className="w-32 h-1 bg-border-base rounded-full mx-auto overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ animation: "grow 3s linear forwards" }}
            />
          </div>
        </div>
      </div>
      <style>{`
        @keyframes grow { from { width: 0% } to { width: 100% } }
      `}</style>
    </div>
  );
}
