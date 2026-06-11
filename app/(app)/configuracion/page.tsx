import type { Metadata } from "next";
import ConfiguracionClient from "./ConfiguracionClient";

export const metadata: Metadata = {
  title: "CereSense — Configuración",
};

export default function Page() {
  return <ConfiguracionClient />;
}
