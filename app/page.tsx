"use client";

import dynamic from "next/dynamic";

// The whole dashboard is a client-side simulation (clock, asset motion,
// event feed) with no server-stable output, and it drives a MapLibre map
// that cannot run during server rendering. Rendering it client-only here
// avoids hydration mismatches instead of fighting them with timestamps
// that differ between server and client renders.
const Dashboard = dynamic(
  () => import("@/components/dashboard/Dashboard").then((m) => m.Dashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        Spinning up the simulated ops feed…
      </div>
    ),
  }
);

export default function HomePage() {
  return <Dashboard />;
}
