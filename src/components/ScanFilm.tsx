import { cn } from "@/lib/utils";

/**
 * Stylized, schematic chest-scan graphic. Entirely synthetic vector art —
 * no real imagery or patient data.
 */
export function ScanFilm({
  heat,
  showHeat = false,
  blur = 0,
  className,
  seed = 1,
  label,
}: {
  heat?: { cx: number; cy: number; r: number } | null;
  showHeat?: boolean;
  blur?: number;
  className?: string;
  seed?: number;
  label?: string;
}) {
  const gid = `ap-${seed}`;
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-border bg-[oklch(0.16_0.008_250)]",
        className,
      )}
    >
      <svg
        viewBox="0 0 200 220"
        className="h-full w-full transition-[filter] duration-700 ease-out"
        style={{ filter: blur ? `blur(${blur}px)` : undefined }}
        role="img"
        aria-label={label ?? "Schematic chest scan"}
      >
        <defs>
          <radialGradient id={`${gid}-lung`} cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="oklch(0.42 0.01 250)" />
            <stop offset="100%" stopColor="oklch(0.24 0.008 250)" />
          </radialGradient>
          <radialGradient id={`${gid}-heat`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.68 0.18 30 / 0.85)" />
            <stop offset="55%" stopColor="oklch(0.75 0.15 70 / 0.45)" />
            <stop offset="100%" stopColor="oklch(0.75 0.15 70 / 0)" />
          </radialGradient>
          <linearGradient id={`${gid}-body`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.34 0.008 250)" />
            <stop offset="100%" stopColor="oklch(0.2 0.006 250)" />
          </linearGradient>
        </defs>

        <rect width="200" height="220" fill={`url(#${gid}-body)`} />

        {/* thorax silhouette */}
        <path
          d="M100 18c-20 0-34 6-40 14-8 10-14 40-16 78-2 34 4 62 10 76 4 10 26 16 46 16s42-6 46-16c6-14 12-42 10-76-2-38-8-68-16-78-6-8-20-14-40-14z"
          fill="oklch(0.28 0.008 250)"
          stroke="oklch(0.42 0.01 250)"
          strokeWidth="1.2"
        />

        {/* lungs */}
        <path
          d="M84 52c-14 4-22 20-25 48-3 26 0 48 6 58 6 9 17 6 19-6 3-18 4-72 3-92-.3-6-1-9-3-8z"
          fill={`url(#${gid}-lung)`}
        />
        <path
          d="M116 52c14 4 22 20 25 48 3 26 0 48-6 58-6 9-17 6-19-6-3-18-4-72-3-92 .3-6 1-9 3-8z"
          fill={`url(#${gid}-lung)`}
        />

        {/* mediastinum / heart */}
        <path
          d="M100 62c8 0 12 26 12 46s-6 30-14 30-14-12-14-30 8-46 16-46z"
          fill="oklch(0.36 0.01 250)"
          opacity="0.9"
        />

        {/* ribs */}
        {Array.from({ length: 8 }).map((_, i) => (
          <g key={i} opacity={0.35}>
            <path
              d={`M60 ${58 + i * 14} q40 ${12 + i * 1.5} 80 0`}
              stroke="oklch(0.66 0.01 250)"
              strokeWidth="1.4"
              fill="none"
            />
          </g>
        ))}

        {/* spine */}
        <rect x="97" y="40" width="6" height="150" rx="3" fill="oklch(0.5 0.008 250)" opacity="0.5" />

        {/* clavicles */}
        <path d="M62 46q38 -14 76 0" stroke="oklch(0.7 0.01 250)" strokeWidth="2" fill="none" opacity="0.4" />

        {heat && showHeat && (
          <>
            <circle
              cx={heat.cx}
              cy={heat.cy}
              r={heat.r * 1.9}
              fill={`url(#${gid}-heat)`}
              className="animate-pulse"
            />
            <circle
              cx={heat.cx}
              cy={heat.cy}
              r={heat.r}
              fill="none"
              stroke="oklch(0.75 0.16 45 / 0.8)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          </>
        )}
      </svg>
      <div className="pointer-events-none absolute inset-0 grid-film opacity-[0.06]" />
    </div>
  );
}
