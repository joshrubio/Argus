"use client";

import { useEffect, useState } from "react";
import { ArgusSimulator } from "./simulation";
import { generateRecommendations } from "./rules-engine";
import type { SimState } from "./types";

function buildInitialState(sim: ArgusSimulator): SimState {
  sim.tick(0.01);
  const snap = sim.snapshot();
  return {
    clock: snap.clock,
    assets: snap.assets,
    events: snap.events,
    recommendations: generateRecommendations(snap.assets, snap.events, snap.clock),
  };
}

/**
 * Drives the whole Argus dashboard. There is no server round trip here —
 * this ticks a client-side simulation on an interval, which is what the
 * portfolio's other satellites use in place of standing up a real
 * WebSocket server for synthetic data (see /docs).
 *
 * The simulator instance lives in `useState` rather than a ref: its
 * lazy initializer gives us a stable, create-once instance without
 * reading or writing a ref during render.
 */
export function useArgusSimulation(tickMs = 1000, simSecondsPerTick = 1.6) {
  const [sim] = useState(() => new ArgusSimulator());
  const [state, setState] = useState<SimState>(() => buildInitialState(sim));

  useEffect(() => {
    const interval = setInterval(() => {
      sim.tick(simSecondsPerTick);
      const snap = sim.snapshot();
      setState({
        clock: snap.clock,
        assets: snap.assets,
        events: snap.events,
        recommendations: generateRecommendations(snap.assets, snap.events, snap.clock),
      });
    }, tickMs);
    return () => clearInterval(interval);
  }, [sim, tickMs, simSecondsPerTick]);

  return state;
}
