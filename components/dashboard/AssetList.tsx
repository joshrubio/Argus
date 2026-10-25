"use client";

import type { AssetSnapshot } from "@/lib/types";
import { STATUS_LABEL, STATUS_VAR } from "@/lib/status";
import { BatteryMedium, Radio, Satellite, Plane } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssetListProps {
  assets: AssetSnapshot[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function AssetList({ assets, selectedId, onSelect }: AssetListProps) {
  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="Assets" count={assets.length} />
      <div className="flex-1 overflow-y-auto">
        {assets.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => onSelect(a.id)}
            className={cn(
              "flex w-full items-center gap-2.5 border-b border-border/60 px-3 py-2 text-left transition-colors",
              selectedId === a.id ? "bg-accent/10" : "hover:bg-panel-raised"
            )}
          >
            {a.kind === "uav" ? (
              <Plane className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            ) : (
              <Satellite className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-xs font-medium">{a.callsign}</span>
                <span
                  className="shrink-0 rounded-sm px-1.5 py-0.5 font-tabular text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: STATUS_VAR[a.status], backgroundColor: "color-mix(in oklch, " + STATUS_VAR[a.status] + " 18%, transparent)" }}
                >
                  {STATUS_LABEL[a.status]}
                </span>
              </div>
              <div className="mt-0.5 flex items-center gap-3 font-tabular text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BatteryMedium className="h-3 w-3" />
                  {a.batteryPct.toFixed(0)}%
                </span>
                <span className="flex items-center gap-1">
                  <Radio className="h-3 w-3" />
                  {a.linkQuality.toFixed(0)}%
                </span>
                <span className="truncate">{a.sector}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function PanelHeader({ title, count }: { title: string; count?: number }) {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-border px-3 py-2">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      {typeof count === "number" && (
        <span className="font-tabular text-[10px] text-muted-foreground">{count}</span>
      )}
    </div>
  );
}
