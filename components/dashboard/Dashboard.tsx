"use client";

import { useState } from "react";
import { useArgusSimulation } from "@/lib/useArgusSimulation";
import { MapView } from "./MapView";
import { AssetList } from "./AssetList";
import { EventFeed } from "./EventFeed";
import { RecommendationPanel } from "./RecommendationPanel";
import { StatusBar } from "./StatusBar";

export function Dashboard() {
  const { assets, events, recommendations, clock } = useArgusSimulation();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="flex flex-1 min-h-0 flex-col">
      <StatusBar assets={assets} clock={clock} />
      <div className="flex flex-1 min-h-0 flex-col lg:flex-row">
        <div className="relative h-[42vh] min-h-[280px] w-full border-b border-border lg:h-auto lg:flex-1 lg:border-b-0 lg:border-r">
          <MapView assets={assets} selectedId={selectedId} onSelect={setSelectedId} />
          <div className="pointer-events-none absolute left-3 top-3 rounded-md border border-border/60 bg-background/70 px-2 py-1 font-tabular text-[10px] text-muted-foreground backdrop-blur-sm">
            AO: Gulf of Almeria (simulated) · {assets.length} assets tracked
          </div>
        </div>

        <div className="grid w-full shrink-0 grid-cols-1 sm:grid-cols-2 lg:w-[380px] lg:grid-cols-1 lg:border-r lg:border-border">
          <div className="h-56 border-b border-border sm:border-r lg:h-[38%] lg:border-r-0">
            <AssetList assets={assets} selectedId={selectedId} onSelect={setSelectedId} />
          </div>
          <div className="h-56 border-b border-border lg:h-[62%] lg:border-b-0">
            <EventFeed events={events} />
          </div>
        </div>

        <div className="h-64 w-full lg:h-auto lg:w-[360px]">
          <RecommendationPanel recommendations={recommendations} onFocusAsset={setSelectedId} />
        </div>
      </div>
    </div>
  );
}
