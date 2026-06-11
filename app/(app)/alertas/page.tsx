import type { Metadata } from "next";
import AlertasClient from "./AlertasClient";

export const metadata: Metadata = {
  title: "CereSense — Alertas",
};

export default function Page() {
  return <AlertasClient />;
}
