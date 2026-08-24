import { Link, useRouterState } from "@tanstack/react-router";
import { Moon, Sun, ChevronDown, ShieldAlert, Check } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/components/theme";
import { useSite } from "@/components/site-context";
import { SITES } from "@/lib/aperture";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV = [
  { to: "/", label: "Overview" },
  { to: "/worklist", label: "Worklist" },
  { to: "/twin", label: "Queue Twin" },
  { to: "/viewer", label: "Adaptive Viewer" },
  { to: "/admin", label: "Compliance" },
];

export function ApertureMark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="relative grid h-7 w-7 place-items-center rounded-md border border-border-strong bg-surface-raised">
        <span className="absolute h-3.5 w-3.5 rotate-45 rounded-[2px] border border-primary" />
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      </span>
      <span className="text-[15px] font-semibold tracking-[0.22em] text-foreground">APERTURE</span>
    </span>
  );
}

export function TopNav() {
  const { theme, toggle } = useTheme();
  const { site, setSiteId } = useSite();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="flex h-14 items-center gap-6 px-4 lg:px-6">
        <Link to="/" className="shrink-0">
          <ApertureMark />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => {
            const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "relative rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:bg-surface-raised">
              <span className="h-1.5 w-1.5 rounded-full bg-ok" />
              <span className="hidden sm:inline">{site.name}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {SITES.map((s) => (
                <DropdownMenuItem
                  key={s.id}
                  onSelect={() => setSiteId(s.id)}
                  className="flex items-start gap-2 py-2"
                >
                  <Check
                    className={cn(
                      "mt-0.5 h-3.5 w-3.5 shrink-0",
                      s.id === site.id ? "text-primary" : "opacity-0",
                    )}
                  />
                  <span>
                    <span className="block text-[13px] font-medium">{s.name}</span>
                    <span className="block text-[11px] text-muted-foreground">{s.region}</span>
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={toggle}
            aria-label="Toggle color theme"
            className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface text-muted-foreground transition-colors hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 border-t border-border bg-signal-soft/60 px-4 py-1 text-[11px] tracking-wide text-muted-foreground">
        <ShieldAlert className="h-3 w-3" />
        <span>
          Decision-support tool — <span className="font-medium text-foreground">not for diagnostic use</span>.
          Synthetic demonstration data only.
        </span>
      </div>
    </header>
  );
}
