// Shared domain types for the Argus simulation layer.
// Everything described here is SYNTHETIC — see /docs for the full
// real-vs-simulated breakdown. There is no real telemetry anywhere
// in this codebase.

export type AssetKind = "uav" | "sensor";

export type AssetStatus = "nominal" | "caution" | "warning" | "critical" | "offline";

export interface AssetSnapshot {
  id: string;
  callsign: string;
  kind: AssetKind;
  /** Human-readable current task / assignment. */
  task: string;
  /** Patrol sector label, used for coverage-gap reasoning. */
  sector: string;
  lat: number;
  lng: number;
  /** Degrees, 0 = north, for UAVs only (sensors render as static icons). */
  heading: number;
  altitudeM: number;
  speedKmh: number;
  batteryPct: number;
  linkQuality: number; // 0-100
  status: AssetStatus;
  /** True while a fault/calibration-drift condition is active for this asset. */
  faulted: boolean;
  lastUpdated: number; // epoch ms (simulation clock)
}

export type EventSeverity = "info" | "caution" | "warning" | "critical";

export type EventType =
  | "geofence_breach"
  | "low_battery"
  | "link_degraded"
  | "link_lost"
  | "sensor_fault"
  | "calibration_drift"
  | "rtb"
  | "task_complete"
  | "weather_hazard"
  | "nominal_check";

export interface SimEvent {
  id: string;
  ts: number; // epoch ms (simulation clock)
  type: EventType;
  severity: EventSeverity;
  assetId: string;
  assetCallsign: string;
  message: string;
  acknowledged: boolean;
}

export interface Recommendation {
  id: string;
  priority: number; // higher = more urgent
  severity: EventSeverity;
  title: string;
  rationale: string;
  ruleId: string;
  assetIds: string[];
  ts: number;
}

export interface SimState {
  clock: number; // epoch ms, simulated
  assets: AssetSnapshot[];
  events: SimEvent[];
  recommendations: Recommendation[];
}
