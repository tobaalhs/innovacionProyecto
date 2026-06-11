import type { Metadata } from "next";
import HistorialClient from "./HistorialClient";

export const metadata: Metadata = {
  title: "CereSense — Historial",
};

export default function Page() {
  return <HistorialClient />;
}
