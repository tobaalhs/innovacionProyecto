import type { Metadata } from "next";
import ReportesClient from "./ReportesClient";

export const metadata: Metadata = {
  title: "CereSense — Reportes",
};

export default function Page() {
  return <ReportesClient />;
}
