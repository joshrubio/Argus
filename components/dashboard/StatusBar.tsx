"use client";

import type { AssetSnapshot } from "@/lib/types";
import { clockReadout } from "@/lib/status";
import { Activity, Eye } from "lucide-react";

export function StatusBar({ assets, clock }: { assets: AssetSnapshot[]; clock: number }) {
  const counts = { nominal: 0, caution: 0, warning: 0, critical: 0, offline: 0 };
  for (const a of assets) counts[a.status] += 1;
  const avgLink = assets.length
    ? assets.reduce((sum, a) => sum + a.linkQuality, 0) / assets.length
    : 0;

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-1 border-b border-border bg-panel px-4 py-2 font-tabular text-[11px]">
      <div className="flex items-center gap-1.5 text-accent">
        <Eye className="h-3.5 w-3.5 animate-pulse" />
        <span className="font-semibold">LIVE SIM</span>
      </div>
      {/* The simulation re-renders roughly once a second, so this clock
          and the counts below stay current without any timer of their own. */}
      <span suppressHydrationWarning className="text-muted-foreground">
        {clockReadout(clock)} UTC-sim
      </span>
      <Dot color="var(--status-nominal)" label={`${counts.nominal} nominal`} />
      <Dot color="var(--status-caution)" label={`${counts.caution} caution`} />
      <Dot color="var(--status-warning)" label={`${counts.warning} warning`} />
      <Dot color="var(--status-critical)" label={`${counts.critical} critical`} />
      <Dot color="var(--status-offline)" label={`${counts.offline} offline`} />
      <div className="ml-auto flex items-center gap-1.5 text-muted-foreground">
        <Activity className="h-3.5 w-3.5" />
        avg link {avgLink.toFixed(0)}%
      </div>
    </div>
  );
}

function Dot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-muted-foreground">{label}</span>
    </span>
  );
}
