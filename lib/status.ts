import type { AssetStatus, EventSeverity } from "./types";

export const STATUS_LABEL: Record<AssetStatus, string> = {
  nominal: "Nominal",
  caution: "Caution",
  warning: "Warning",
  critical: "Critical",
  offline: "Offline",
};

export const STATUS_VAR: Record<AssetStatus, string> = {
  nominal: "var(--status-nominal)",
  caution: "var(--status-caution)",
  warning: "var(--status-warning)",
  critical: "var(--status-critical)",
  offline: "var(--status-offline)",
};

export const SEVERITY_VAR: Record<EventSeverity, string> = {
  info: "var(--status-info)",
  caution: "var(--status-caution)",
  warning: "var(--status-warning)",
  critical: "var(--status-critical)",
};

export const SEVERITY_LABEL: Record<EventSeverity, string> = {
  info: "Info",
  caution: "Caution",
  warning: "Warning",
  critical: "Critical",
};

export function relativeTime(ts: number, nowMs: number): string {
  const diffSec = Math.max(0, Math.round((nowMs - ts) / 1000));
  if (diffSec < 5) return "just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  const min = Math.floor(diffSec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  return `${hr}h ago`;
}

export function clockReadout(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString("en-GB", { hour12: false });
}
