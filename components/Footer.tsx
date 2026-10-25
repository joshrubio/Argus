"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export function Footer() {
  const pathname = usePathname();
  if (pathname === "/login") return null;

  return (
    <footer className="shrink-0 border-t border-border bg-panel px-4 py-2 text-[11px] text-muted-foreground sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span>
          Argus is a portfolio demo. All feeds, telemetry, and recommendations are{" "}
          <strong className="font-medium text-foreground">synthetic</strong> — see{" "}
          <Link href="/docs" className="underline hover:text-foreground">
            /docs
          </Link>{" "}
          for the full real-vs-simulated breakdown.
        </span>
        <span>Built by Josh Rubio</span>
      </div>
    </footer>
  );
}
