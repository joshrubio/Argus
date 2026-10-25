"use client";

import { useEffect, useState } from "react";
import type { SimEvent } from "@/lib/types";
import { SEVERITY_LABEL, SEVERITY_VAR, relativeTime } from "@/lib/status";
import { PanelHeader } from "./AssetList";
import {
  AlertTriangle,
  BatteryWarning,
  Radio,
  RadioTower,
  Wrench,
  Gauge,
  CheckCircle2,
  CloudLightning,
  ShieldAlert,
} from "lucide-react";

const ICONS: Record<
  SimEvent["type"],
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  geofence_breach: ShieldAlert,
  low_battery: BatteryWarning,
  link_degraded: Radio,
  link_lost: RadioTower,
  sensor_fault: Wrench,
  calibration_drift: Gauge,
  rtb: RadioTower,
  task_complete: CheckCircle2,
  weather_hazard: CloudLightning,
  nominal_check: AlertTriangle,
};

export function EventFeed({ events }: { events: SimEvent[] }) {
  // Date.now() must not be read directly during render (components must
  // stay pure), so a small interval ticks a bit of state instead to keep
  // the "x ago" labels current.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="Event feed" count={events.length} />
      <ul className="flex-1 overflow-y-auto">
        {events.map((e) => {
          const Icon = ICONS[e.type] ?? AlertTriangle;
          return (
            <li
              key={e.id}
              className="flex items-start gap-2 border-b border-border/60 px-3 py-2 animate-in fade-in slide-in-from-top-1 duration-300"
            >
              <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: SEVERITY_VAR[e.severity] }} />
              <div className="min-w-0 flex-1">
                <p className="text-xs leading-snug">{e.message}</p>
                <div className="mt-0.5 flex items-center gap-2 font-tabular text-[10px] text-muted-foreground">
                  <span
                    className="rounded-sm px-1 py-0.5 font-semibold uppercase tracking-wide"
                    style={{ color: SEVERITY_VAR[e.severity] }}
                  >
                    {SEVERITY_LABEL[e.severity]}
                  </span>
                  <span>{relativeTime(e.ts, now)}</span>
                </div>
              </div>
            </li>
          );
        })}
        {events.length === 0 && (
          <li className="px-3 py-6 text-center text-xs text-muted-foreground">
            No events yet — the simulation is warming up.
          </li>
        )}
      </ul>
    </div>
  );
}
