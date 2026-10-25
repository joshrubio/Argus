// Deterministic, rules-based recommendation engine.
//
// This is the "AI panel" for Argus. It is intentionally NOT a call to an
// LLM — it is a small, explainable set of if/then rules evaluated over
// the current simulated asset and event state, each one producing a
// human-readable rationale that cites the exact numbers that triggered
// it. See /docs for why this was the deliberate choice over wiring up a
// real model call for synthetic data.

import type { AssetSnapshot, Recommendation, SimEvent } from "./types";

const SEVERITY_WEIGHT: Record<string, number> = {
  critical: 100,
  warning: 60,
  caution: 30,
  info: 10,
};

export function generateRecommendations(
  assets: AssetSnapshot[],
  recentEvents: SimEvent[],
  nowMs: number
): Recommendation[] {
  const recs: Recommendation[] = [];
  const byId = new Map(assets.map((a) => [a.id, a]));
  let seq = 0;
  const mk = (
    ruleId: string,
    severity: Recommendation["severity"],
    title: string,
    rationale: string,
    assetIds: string[],
    boost = 0
  ) => {
    seq += 1;
    recs.push({
      id: `rec-${ruleId}-${assetIds.join("-")}-${seq}`,
      priority: SEVERITY_WEIGHT[severity] + boost,
      severity,
      title,
      rationale,
      ruleId,
      assetIds,
      ts: nowMs,
    });
  };

  // Rule 1 — critical/offline assets need immediate attention.
  const coveredByRule1 = new Set<string>();
  for (const a of assets) {
    if (a.status === "offline" || a.status === "critical") coveredByRule1.add(a.id);
    if (a.status === "offline") {
      mk(
        "link-lost",
        "critical",
        `Re-establish contact with ${a.callsign}`,
        `Link quality reads ${a.linkQuality.toFixed(0)}% and signal is treated as lost. Last fix at ${a.sector}. Recommend switching to backup relay or dispatching the nearest asset to re-acquire.`,
        [a.id],
        10
      );
    } else if (a.status === "critical" && a.kind === "uav") {
      mk(
        "battery-critical",
        "critical",
        `Recall ${a.callsign} immediately`,
        `Battery at ${a.batteryPct.toFixed(0)}% with link quality ${a.linkQuality.toFixed(0)}%. Continuing the current task risks a forced landing outside the recovery zone.`,
        [a.id]
      );
    } else if (a.status === "critical" && a.kind === "sensor") {
      const cause = a.faulted
        ? "an active sensor fault"
        : `degraded telemetry (link ${a.linkQuality.toFixed(0)}%, battery ${a.batteryPct.toFixed(0)}%)`;
      mk(
        "sensor-critical",
        "critical",
        `Dispatch diagnostics for ${a.callsign}`,
        `Fixed post is flagged with ${cause}. Readings from this post should be treated as unreliable until checked.`,
        [a.id]
      );
    }
  }

  // Rule 2 — coverage gap: a UAV is RTB/offline, find the nearest nominal
  // UAV in an adjacent sector to extend coverage.
  const uavs = assets.filter((a) => a.kind === "uav");
  for (const gapAsset of uavs) {
    if (gapAsset.task !== "Returning to base" && gapAsset.status !== "offline") continue;
    const candidate = uavs
      .filter((a) => a.id !== gapAsset.id && a.status === "nominal")
      .sort((a, b) => haversine(a, gapAsset) - haversine(b, gapAsset))[0];
    if (candidate) {
      mk(
        "coverage-gap",
        "warning",
        `Reassign ${candidate.callsign} to cover ${gapAsset.sector}`,
        `${gapAsset.callsign} is ${gapAsset.task === "Returning to base" ? "returning to base" : "offline"} and leaving ${gapAsset.sector} unmonitored. ${candidate.callsign} is nominal and ${haversine(candidate, gapAsset).toFixed(1)} km away — closest available asset to extend coverage.`,
        [gapAsset.id, candidate.id]
      );
    }
  }

  // Rule 3 — unacknowledged critical/warning events from the last window.
  const windowMs = 3 * 60 * 1000;
  const unacked = recentEvents.filter(
    (e) => !e.acknowledged && nowMs - e.ts < windowMs && (e.type === "geofence_breach" || e.type === "sensor_fault")
  );
  for (const e of unacked.slice(0, 4)) {
    if (coveredByRule1.has(e.assetId)) continue; // already surfaced as a critical/offline recommendation above
    const asset = byId.get(e.assetId);
    mk(
      e.type === "geofence_breach" ? "verify-breach" : "verify-fault",
      e.severity,
      e.type === "geofence_breach"
        ? `Verify position of ${e.assetCallsign}`
        : `Schedule diagnostics for ${e.assetCallsign}`,
      e.message + (asset ? ` Currently in ${asset.sector}.` : ""),
      [e.assetId],
      5
    );
  }

  // Rule 4 — caution-level battery, not yet critical: plan ahead.
  for (const a of assets) {
    if (a.kind === "uav" && a.status === "caution" && a.task !== "Returning to base") {
      mk(
        "battery-plan-ahead",
        "caution",
        `Plan relief for ${a.callsign}`,
        `Battery at ${a.batteryPct.toFixed(0)}% and trending down. Not urgent yet, but queue a relief asset for ${a.sector} within the next cycle.`,
        [a.id],
        -5
      );
    }
  }

  recs.sort((a, b) => b.priority - a.priority || b.ts - a.ts);

  if (recs.length === 0) {
    mk(
      "all-nominal",
      "info",
      "All assets nominal",
      `${assets.length} assets reporting nominal battery, link, and task status. No action required this cycle.`,
      assets.map((a) => a.id),
      -100
    );
  }

  return recs.slice(0, 6);
}

function haversine(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
