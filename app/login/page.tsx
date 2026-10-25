import { Suspense } from "react";
import { Eye } from "lucide-react";
import { signIn } from "./actions";

export default function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  return (
    <div className="flex flex-1 items-center justify-center bg-background px-4">
      <Suspense fallback={<LoginCardSkeleton />}>
        <LoginCard searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function LoginCard({
  searchParams,
}: {
  searchParams: PageProps<"/login">["searchParams"];
}) {
  const params = await searchParams;
  const from = typeof params.from === "string" ? params.from : "/";

  return (
    <div className="w-full max-w-sm rounded-lg border border-border bg-panel p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <Eye className="h-6 w-6 text-accent" strokeWidth={2.25} />
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Argus</h1>
          <p className="text-xs text-muted-foreground">Demo operations console</p>
        </div>
      </div>

      <form action={signIn} className="space-y-3">
        <input type="hidden" name="from" value={from} />
        <div>
          <label htmlFor="operator" className="mb-1 block text-xs font-medium text-muted-foreground">
            Operator callsign (optional)
          </label>
          <input
            id="operator"
            name="operator"
            type="text"
            placeholder="anything, or leave blank"
            className="w-full rounded-md border border-border bg-panel-raised px-3 py-2 text-sm outline-none focus:border-accent/60"
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          Enter console
        </button>
      </form>

      <p className="mt-5 text-[11px] leading-relaxed text-muted-foreground">
        This is a <strong className="text-foreground">demo access gate</strong>, not real
        authentication. Any input — or none — signs you in. This is a portfolio project
        built to demonstrate a simulated C2-style dashboard; nothing behind it is a real
        account, and no credentials are checked or stored anywhere except a plain demo
        session cookie.
      </p>
    </div>
  );
}

function LoginCardSkeleton() {
  return (
    <div className="w-full max-w-sm rounded-lg border border-border bg-panel p-6">
      <div className="h-6 w-32 animate-pulse rounded bg-panel-raised" />
    </div>
  );
}
