import type { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "CereSense — Resumen",
};

export default function Page() {
  return <DashboardClient />;
}
