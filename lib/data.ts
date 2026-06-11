export interface LogisticsStage {
  id: number;
  name: string;
  location: string;
  date: string;
  time?: string;
  status: "completed" | "current" | "pending";
  temperature?: number;
}

export interface Alert {
  id: string;
  severity: "critical" | "warning" | "resolved";
  variable: string;
  lot: string;
  value: string;
  date: string;
  status: "active" | "resolved";
  detail: string;
}

export interface HistoricalLot {
  id: string;
  destination: string;
  variety: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed";
  alerts: number;
}

export interface ChartPoint {
  day: number;
  value: number;
}

export const SHIPMENT = {
  lot: "LOT-0821",
  origin: "Curicó, Chile",
  destination: "Shanghái, China",
  exporter: "Agrícola San Pedro",
  variety: "Bing",
  currentDay: 18,
  totalDays: 28,
  estimatedArrival: "30 Ene",
};

export const LOGISTICS_STAGES: LogisticsStage[] = [
  {
    id: 1,
    name: "Huerto",
    location: "Curicó, Chile",
    date: "12 Ene",
    time: "06:00",
    status: "completed",
    temperature: 18.2,
  },
  {
    id: 2,
    name: "Packing",
    location: "Planta Curicó",
    date: "13 Ene",
    time: "09:30",
    status: "completed",
    temperature: 2.0,
  },
  {
    id: 3,
    name: "Cámara de frío",
    location: "Puerto Seco Curicó",
    date: "13 Ene",
    time: "18:00",
    status: "completed",
    temperature: 0.5,
  },
  {
    id: 4,
    name: "Puerto Valparaíso",
    location: "Valparaíso, Chile",
    date: "15 Ene",
    time: "07:00",
    status: "completed",
    temperature: 1.0,
  },
  {
    id: 5,
    name: "Transporte marítimo",
    location: "Océano Pacífico",
    date: "18 Ene",
    time: undefined,
    status: "current",
    temperature: 1.2,
  },
  {
    id: 6,
    name: "Destino Shanghái",
    location: "Shanghái, China",
    date: "30 Ene",
    time: undefined,
    status: "pending",
    temperature: undefined,
  },
];

export const ALERTS: Alert[] = [
  {
    id: "ALT-001",
    severity: "critical",
    variable: "Temperatura",
    lot: "LOT-0821",
    value: "+2.4°C",
    date: "20 Ene, 14:32",
    status: "active",
    detail:
      "Se registró un pico de temperatura de 2.4°C durante el transporte marítimo, superando el umbral máximo de 2.0°C. El evento duró aproximadamente 38 minutos antes de regresar a valores normales. Se recomienda verificar el estado del sistema de refrigeración del contenedor.",
  },
  {
    id: "ALT-002",
    severity: "warning",
    variable: "Humedad",
    lot: "LOT-0817",
    value: "83%",
    date: "19 Ene, 09:15",
    status: "active",
    detail:
      "La humedad relativa dentro del contenedor descendió a 83%, por debajo del umbral mínimo de 85%. Esto podría afectar la calidad de la fruta a largo plazo. Se recomienda revisar el sistema de humidificación.",
  },
  {
    id: "ALT-003",
    severity: "resolved",
    variable: "CO₂",
    lot: "LOT-0819",
    value: "720 ppm",
    date: "17 Ene, 22:40",
    status: "resolved",
    detail:
      "Concentración de CO₂ superó el umbral de 700 ppm alcanzando 720 ppm. El evento fue resuelto tras ventilación del contenedor a las 23:10 del mismo día. No se espera impacto en la calidad de la fruta.",
  },
];

export const HISTORICAL_LOTS: HistoricalLot[] = [
  {
    id: "LOT-0821",
    destination: "Shanghái",
    variety: "Bing",
    startDate: "12 Ene",
    endDate: "30 Ene",
    status: "active",
    alerts: 2,
  },
  {
    id: "LOT-0819",
    destination: "Guangzhou",
    variety: "Regina",
    startDate: "08 Ene",
    endDate: "25 Ene",
    status: "completed",
    alerts: 0,
  },
  {
    id: "LOT-0817",
    destination: "Shanghái",
    variety: "Lapins",
    startDate: "03 Ene",
    endDate: "20 Ene",
    status: "completed",
    alerts: 1,
  },
  {
    id: "LOT-0815",
    destination: "Hong Kong",
    variety: "Bing",
    startDate: "28 Dic",
    endDate: "14 Ene",
    status: "completed",
    alerts: 0,
  },
  {
    id: "LOT-0812",
    destination: "Shanghái",
    variety: "Regina",
    startDate: "22 Dic",
    endDate: "08 Ene",
    status: "completed",
    alerts: 3,
  },
  {
    id: "LOT-0809",
    destination: "Taipei",
    variety: "Bing",
    startDate: "15 Dic",
    endDate: "01 Ene",
    status: "completed",
    alerts: 0,
  },
];

// Pre-generated deterministic historical data (28 days)
export const TEMP_HISTORY: ChartPoint[] = [
  { day: 1, value: 1.1 },
  { day: 2, value: 1.3 },
  { day: 3, value: 1.0 },
  { day: 4, value: 1.2 },
  { day: 5, value: 1.4 },
  { day: 6, value: 1.1 },
  { day: 7, value: 1.3 },
  { day: 8, value: 1.2 },
  { day: 9, value: 0.9 },
  { day: 10, value: 1.1 },
  { day: 11, value: 1.4 },
  { day: 12, value: 1.2 },
  { day: 13, value: 1.3 },
  { day: 14, value: 1.0 },
  { day: 15, value: 1.2 },
  { day: 16, value: 1.4 },
  { day: 17, value: 1.6 },
  { day: 18, value: 1.8 },
  { day: 19, value: 1.6 },
  { day: 20, value: 2.4 },
  { day: 21, value: 1.9 },
  { day: 22, value: 1.5 },
  { day: 23, value: 1.3 },
  { day: 24, value: 1.2 },
  { day: 25, value: 1.1 },
  { day: 26, value: 1.3 },
  { day: 27, value: 1.2 },
  { day: 28, value: 1.2 },
];

export const HUMIDITY_HISTORY: ChartPoint[] = [
  { day: 1, value: 91.2 },
  { day: 2, value: 90.8 },
  { day: 3, value: 91.5 },
  { day: 4, value: 92.0 },
  { day: 5, value: 91.3 },
  { day: 6, value: 90.9 },
  { day: 7, value: 91.7 },
  { day: 8, value: 92.1 },
  { day: 9, value: 91.4 },
  { day: 10, value: 90.7 },
  { day: 11, value: 91.0 },
  { day: 12, value: 91.8 },
  { day: 13, value: 92.2 },
  { day: 14, value: 91.6 },
  { day: 15, value: 91.1 },
  { day: 16, value: 90.8 },
  { day: 17, value: 91.4 },
  { day: 18, value: 91.9 },
  { day: 19, value: 91.2 },
  { day: 20, value: 90.6 },
  { day: 21, value: 91.3 },
  { day: 22, value: 91.7 },
  { day: 23, value: 92.0 },
  { day: 24, value: 91.5 },
  { day: 25, value: 91.0 },
  { day: 26, value: 90.9 },
  { day: 27, value: 91.4 },
  { day: 28, value: 91.0 },
];

export const CO2_HISTORY: ChartPoint[] = [
  { day: 1, value: 658 },
  { day: 2, value: 665 },
  { day: 3, value: 672 },
  { day: 4, value: 680 },
  { day: 5, value: 688 },
  { day: 6, value: 695 },
  { day: 7, value: 703 },
  { day: 8, value: 710 },
  { day: 9, value: 716 },
  { day: 10, value: 720 },
  { day: 11, value: 718 },
  { day: 12, value: 714 },
  { day: 13, value: 710 },
  { day: 14, value: 705 },
  { day: 15, value: 700 },
  { day: 16, value: 695 },
  { day: 17, value: 691 },
  { day: 18, value: 688 },
  { day: 19, value: 685 },
  { day: 20, value: 683 },
  { day: 21, value: 681 },
  { day: 22, value: 680 },
  { day: 23, value: 679 },
  { day: 24, value: 680 },
  { day: 25, value: 681 },
  { day: 26, value: 680 },
  { day: 27, value: 680 },
  { day: 28, value: 680 },
];

export const IMPACT_HISTORY: ChartPoint[] = [
  { day: 1, value: 0 },
  { day: 2, value: 0 },
  { day: 3, value: 0 },
  { day: 4, value: 1 },
  { day: 5, value: 0 },
  { day: 6, value: 0 },
  { day: 7, value: 0 },
  { day: 8, value: 2 },
  { day: 9, value: 0 },
  { day: 10, value: 0 },
  { day: 11, value: 0 },
  { day: 12, value: 0 },
  { day: 13, value: 1 },
  { day: 14, value: 0 },
  { day: 15, value: 0 },
  { day: 16, value: 0 },
  { day: 17, value: 3 },
  { day: 18, value: 0 },
  { day: 19, value: 0 },
  { day: 20, value: 0 },
  { day: 21, value: 0 },
  { day: 22, value: 0 },
  { day: 23, value: 1 },
  { day: 24, value: 0 },
  { day: 25, value: 0 },
  { day: 26, value: 0 },
  { day: 27, value: 0 },
  { day: 28, value: 0 },
];
