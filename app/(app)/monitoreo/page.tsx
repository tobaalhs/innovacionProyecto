import type { Metadata } from "next";
import MonitoreoClient from "./MonitoreoClient";

export const metadata: Metadata = {
  title: "CereSense — Monitoreo",
};

export default function Page() {
  return <MonitoreoClient />;
}
