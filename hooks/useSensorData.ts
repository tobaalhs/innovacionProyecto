"use client";

import { useState, useEffect } from "react";

export interface SensorReading {
  temp: number;
  humidity: number;
  co2: number;
  impacts: number;
  lastUpdated: number;
  updateKey: number;
}

export interface MiniHistory {
  temp: Array<{ value: number }>;
  humidity: Array<{ value: number }>;
  co2: Array<{ value: number }>;
}

const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

const buildMiniHistory = (
  base: number,
  variance: number,
  points: number
): Array<{ value: number }> =>
  Array.from({ length: points }, (_, i) => ({
    value: +( base + Math.sin(i * 1.4) * variance * 0.5).toFixed(1),
  }));

export function useSensorData() {
  const [data, setData] = useState<SensorReading>({
    temp: 1.2,
    humidity: 91.0,
    co2: 680,
    impacts: 4,
    lastUpdated: Date.now(),
    updateKey: 0,
  });

  const [miniHistory, setMiniHistory] = useState<MiniHistory>({
    temp: buildMiniHistory(1.2, 0.3, 24),
    humidity: buildMiniHistory(91, 2, 24),
    co2: buildMiniHistory(680, 20, 24),
  });

  const [secondsAgo, setSecondsAgo] = useState(0);

  // Sensor updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newTemp = clamp(
          +(prev.temp + (Math.random() - 0.5) * 0.3).toFixed(1),
          -1,
          3
        );
        const newHumidity = clamp(
          +(prev.humidity + (Math.random() - 0.5) * 2).toFixed(1),
          79,
          98
        );
        const newCO2 = clamp(
          Math.round(prev.co2 + (Math.random() - 0.5) * 22),
          620,
          780
        );
        const newImpacts =
          prev.impacts + (Math.random() < 1 / 6 ? 1 : 0);

        setMiniHistory((h) => ({
          temp: [...h.temp.slice(1), { value: newTemp }],
          humidity: [...h.humidity.slice(1), { value: newHumidity }],
          co2: [...h.co2.slice(1), { value: newCO2 }],
        }));

        return {
          temp: newTemp,
          humidity: newHumidity,
          co2: newCO2,
          impacts: newImpacts,
          lastUpdated: Date.now(),
          updateKey: prev.updateKey + 1,
        };
      });
      setSecondsAgo(0);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Second counter since last update
  useEffect(() => {
    const counter = setInterval(() => {
      setSecondsAgo((s) => s + 1);
    }, 1000);
    return () => clearInterval(counter);
  }, []);

  const isTempCritical = data.temp > 2.0;
  const isHumidityCritical = data.humidity < 85 || data.humidity > 95;
  const isCO2Critical = data.co2 > 750;

  return {
    data,
    miniHistory,
    secondsAgo,
    isTempCritical,
    isHumidityCritical,
    isCO2Critical,
  };
}
