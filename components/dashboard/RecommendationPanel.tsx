"use client";

import type { Recommendation } from "@/lib/types";
import { SEVERITY_LABEL, SEVERITY_VAR } from "@/lib/status";
import { Sparkles } from "lucide-react";

export function RecommendationPanel({
  recommendations,
  onFocusAsset,
}: {
  recommendations: Recommendation[];
  onFocusAsset: (id: string) => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Recommended actions
          </h2>
        </div>
        <span className="font-tabular text-[10px] text-muted-foreground">rules-based</span>
      </div>
      <ul className="flex-1 overflow-y-auto">
        {recommendations.map((r, i) => (
          <li
            key={r.id}
            className="border-b border-border/60 px-3 py-2.5 animate-in fade-in duration-300"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-tabular text-[10px] text-muted-foreground">#{i + 1}</span>
                <span
                  className="rounded-sm px-1 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: SEVERITY_VAR[r.severity] }}
                >
                  {SEVERITY_LABEL[r.severity]}
                </span>
              </div>
              <span className="font-tabular text-[10px] text-muted-foreground">{r.ruleId}</span>
            </div>
            <p className="mt-1 text-sm font-medium leading-snug">{r.title}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{r.rationale}</p>
            {r.assetIds.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {r.assetIds.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onFocusAsset(id)}
                    className="rounded-sm border border-border px-1.5 py-0.5 font-tabular text-[10px] text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground"
                  >
                    {id}
                  </button>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
