"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Eye, Moon, Sun, LogOut, BookText, LayoutDashboard } from "lucide-react";
import { signOut } from "@/app/login/actions";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // next-themes can't know the resolved theme until after hydration;
    // this one-time mount flag avoids a flash of the wrong icon.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (pathname === "/login") return null;

  return (
    <header className="shrink-0 border-b border-border bg-panel">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-accent" strokeWidth={2.25} />
          <span className="font-semibold tracking-tight">Argus</span>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            simulated ops console
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink href="/" active={pathname === "/"} icon={<LayoutDashboard className="h-4 w-4" />}>
            Dashboard
          </NavLink>
          <NavLink href="/docs" active={pathname === "/docs"} icon={<BookText className="h-4 w-4" />}>
            Docs
          </NavLink>

          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-panel-raised hover:text-foreground"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          <form action={signOut}>
            <button
              type="submit"
              className="ml-1 inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  icon,
  children,
}: {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-accent/15 text-accent"
          : "text-muted-foreground hover:bg-panel-raised hover:text-foreground"
      )}
    >
      {icon}
      <span className="hidden sm:inline">{children}</span>
    </Link>
  );
}
