import { Eye } from "lucide-react";

export const metadata = {
  title: "Argus — What's real, what's simulated",
};

export default function DocsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 overflow-y-auto px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center gap-2">
        <Eye className="h-6 w-6 text-accent" />
        <h1 className="text-2xl font-semibold tracking-tight">Argus — honesty page</h1>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">
        Argus is a portfolio demo: a simulated command-and-control (C2) style operations
        dashboard. It exists to show fullstack and UX work, not to track anything real.
        This page states plainly what is real and what is synthetic, the same way the
        other four satellite demos in this portfolio (Janus, Siren, Themis, Athena) each
        do on their own <code className="rounded-sm bg-panel px-1 py-0.5 text-xs">/docs</code> page.
      </p>

      <Section title="What this is">
        <p>
          A single dashboard screen that fuses a simulated drone/sensor feed, a ticking
          event log, and a rules-based recommendation panel on top of a real map. It is
          inspired by the operator interface of command-and-control and situational
          awareness tools — not a specific product, and not a real deployed system.
        </p>
      </Section>

      <Section title="What's real">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-foreground">The map itself.</strong> Rendered with{" "}
            <a href="https://maplibre.org/" className="underline hover:text-foreground" target="_blank" rel="noreferrer">
              MapLibre GL JS
            </a>{" "}
            (free, open-source, no account or token required) using{" "}
            <a
              href="https://github.com/CartoDB/basemap-styles"
              className="underline hover:text-foreground"
              target="_blank"
              rel="noreferrer"
            >
              CARTO&apos;s free dark-matter basemap style
            </a>
            , built on OpenStreetMap data. Both are real, public, and keyless — attribution
            is shown in the bottom-right corner of the map, per their terms.
          </li>
          <li>
            <strong className="text-foreground">The geography.</strong> The area of
            operations is centered on the real coastline near Almeria, Spain — chosen as a
            relatable, legible backdrop (and because that is where this portfolio was
            built), not because anything shown there reflects real activity.
          </li>
          <li>
            <strong className="text-foreground">The login gate.</strong> It is a real
            cookie-based session gate, and it is real in the sense that it genuinely
            restricts access to the dashboard route — but see below, it is not real
            authentication.
          </li>
        </ul>
      </Section>

      <Section title="What's simulated">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-foreground">Every asset.</strong> The five UAVs and
            three fixed sensor posts, their callsigns, positions, headings, battery
            levels, link quality, and task assignments are all generated in the browser
            by a small deterministic simulation (<code className="rounded-sm bg-panel px-1 py-0.5 text-xs">lib/simulation.ts</code>).
            UAVs fly simple circular patrol orbits computed from elapsed time; nothing is
            fetched from a drone, a sensor, or any external feed.
          </li>
          <li>
            <strong className="text-foreground">The &quot;live&quot; feel.</strong> There
            is no WebSocket server and no database behind this dashboard. A client-side
            <code className="rounded-sm bg-panel px-1 py-0.5 text-xs">setInterval</code>{" "}
            ticks the simulation roughly once a second and re-renders — the same
            lightweight approach the rest of this portfolio uses for synthetic data
            (e.g. Athena&apos;s client-side drone-path simulation) instead of standing up
            real infrastructure to serve fake data.
          </li>
          <li>
            <strong className="text-foreground">The event feed.</strong> Geofence
            breaches, low-battery recalls, link degradation, sensor faults, calibration
            drift, and weather-hazard notices are randomly generated with a seeded
            pseudo-random number generator at low, tunable probabilities per tick. They
            are deliberately framed as abstract operational/logistics events — equipment
            and coverage issues — not anything resembling real targeting or threat
            intelligence.
          </li>
          <li>
            <strong className="text-foreground">The recommendation panel.</strong> This is
            a deterministic <em>rules engine</em>
            (<code className="rounded-sm bg-panel px-1 py-0.5 text-xs">lib/rules-engine.ts</code>), not a
            call to an LLM. A small set of if/then rules — low battery and still on task,
            degraded or lost link, an unacknowledged geofence/sensor event, a coverage
            gap left by a recalled asset — are evaluated against the current simulated
            state every tick and ranked by severity. Each recommendation shows the exact
            rule that fired and the numbers behind it, so it is fully explainable. A real
            LLM call (e.g. Groq) was deliberately skipped here: it would add an API-key
            dependency and latency for a panel that is reasoning over synthetic numbers
            anyway, where a transparent rule is more honest than a model call dressed up
            to look smarter than it is.
          </li>
          <li>
            <strong className="text-foreground">The login itself.</strong> Any input, or
            none, signs you in. No password is checked, no account is created, and no
            credentials are stored anywhere beyond a plain demo session cookie.
          </li>
        </ul>
      </Section>

      <Section title="Known limitations of the simulation">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Patrol paths are perfect circles, not realistic flight plans, and there is no
            collision, weather, or terrain model behind them.
          </li>
          <li>
            Battery, link quality, and fault timing are tuned by hand to look plausible
            and keep the event feed active — they are not derived from any real UAV or
            sensor performance data.
          </li>
          <li>
            The rules engine is intentionally small. It demonstrates explainable,
            auditable prioritization over live state, not a production alerting system.
          </li>
          <li>
            Refreshing the page restarts the simulation from its seed — there is no
            persistence layer, by design (see the project-wide principle below).
          </li>
        </ul>
      </Section>

      <Section title="Why no backend">
        <p>
          None of the five satellite demos in this portfolio stand up a real database or
          a real WebSocket server for their core demo data — Janus uses a static index,
          Siren precomputes its dataset offline, Athena computes its coverage paths
          client-side, and Argus ticks a client-side simulation. The goal is to show the
          fullstack and UX thinking plainly, without pretending a toy dataset is backed
          by infrastructure it isn&apos;t.
        </p>
      </Section>

      <Section title="Stack">
        <ul className="list-disc space-y-2 pl-5">
          <li>Next.js 16 (App Router, Turbopack, TypeScript)</li>
          <li>Tailwind CSS v4, shadcn/ui-style components on @base-ui/react</li>
          <li>MapLibre GL JS + CARTO dark-matter basemap tiles</li>
          <li>A hand-rolled client-side simulation and rules engine (no ML, no backend)</li>
          <li>Cookie-based demo auth, matching the rest of this portfolio</li>
        </ul>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-foreground/90">{children}</div>
    </section>
  );
}
