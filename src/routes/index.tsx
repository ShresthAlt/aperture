import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Activity, Gauge, Layers, ShieldCheck, Waves } from "lucide-react";
import { ScanFilm } from "@/components/ScanFilm";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "APERTURE — Capacity-Aware Imaging Triage" },
      {
        name: "description",
        content:
          "APERTURE decides what a radiologist should read next using an accumulating benefit-per-minute queue — explainable, bandwidth-adaptive, multi-tenant.",
      },
      { property: "og:title", content: "APERTURE — Capacity-Aware Imaging Triage" },
      {
        property: "og:description",
        content:
          "Scheduling, not sorting: a live, explainable reading-queue engine for hospital radiology.",
      },
    ],
  }),
  component: Landing,
});

const PILLARS = [
  {
    icon: Gauge,
    title: "Scheduling, not sorting",
    body: "An accumulating benefit-per-minute queue ranks severity per unit of scarce reading time, with a wait-aging term so nothing is ever buried.",
  },
  {
    icon: Activity,
    title: "Live queue digital twin",
    body: "FIFO, naive AI-sort and APERTURE race the same synthetic arrival stream in front of you — the benefit is demonstrated, not cited.",
  },
  {
    icon: Layers,
    title: "Queue-level explainability",
    body: "Every row opens into the four terms of the priority formula, so a reader sees exactly why a study sits where it sits.",
  },
  {
    icon: Waves,
    title: "Bandwidth-adaptive delivery",
    body: "Progressive tile-first retrieval puts a diagnostic signal on screen in under two seconds, even on a rural 3G link.",
  },
  {
    icon: ShieldCheck,
    title: "Multi-tenant by construction",
    body: "Per-tenant keys, role-based access and a hash-chained, tamper-evident audit trail across three independent hospital sites.",
  },
];

function Landing() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".hero-line", {
        y: 26,
        opacity: 0,
        duration: 0.9,
        stagger: 0.09,
        ease: "power3.out",
      });
      gsap.from(".hero-film", {
        opacity: 0,
        scale: 0.94,
        duration: 1.2,
        delay: 0.2,
        ease: "power3.out",
      });
      gsap.to(".hero-film", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.from(el, {
          y: 34,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      gsap.utils.toArray<HTMLElement>(".metric").forEach((el, i) => {
        gsap.from(el, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          delay: i * 0.07,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%" },
        });
      });

      gsap.to(".formula-track", {
        xPercent: -6,
        ease: "none",
        scrollTrigger: { trigger: ".formula", start: "top bottom", end: "bottom top", scrub: true },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="overflow-x-clip">
      {/* HERO */}
      <section className="hero relative border-b border-border">
        <div className="pointer-events-none absolute inset-0 grid-film opacity-40" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-signal-soft/50 blur-3xl" />
        <div className="relative mx-auto grid max-w-[1240px] items-center gap-12 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:py-28">
          <div>
            <p className="hero-line inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Cloud-native imaging triage · synthetic demo
            </p>
            <h1 className="hero-line mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-foreground lg:text-[54px]">
              What should the radiologist
              <br />
              open <span className="text-primary">next</span>?
            </h1>
            <p className="hero-line mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              Most triage tools label a scan urgent and sort a list. APERTURE schedules the entire
              reading queue — combining calibrated AI probability, clinical utility, estimated read
              time and accumulated waiting — and shows its work on every single row.
            </p>
            <div className="hero-line mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/worklist"
                className="group inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-[13px] font-semibold text-primary-foreground transition-all hover:opacity-90"
              >
                Open live worklist
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/twin"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2.5 text-[13px] font-semibold text-foreground transition-colors hover:bg-surface-raised"
              >
                Run the queue simulation
              </Link>
            </div>

            <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-8">
              {[
                { k: "30–60%", v: "delay-cost reduction modelled under load" },
                { k: "<2s", v: "time to first diagnostic signal, rural 3G" },
                { k: "3 sites", v: "independent tenants, isolated keys" },
              ].map((m) => (
                <div key={m.k} className="metric">
                  <dt className="num text-xl font-semibold text-foreground">{m.k}</dt>
                  <dd className="mt-1 text-[11px] leading-snug text-muted-foreground">{m.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="hero-film relative">
            <div className="panel p-3 shadow-[var(--shadow-panel)]">
              <div className="mb-3 flex items-center justify-between px-1">
                <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  PT-88213 · CXR · Chest AP
                </span>
                <span className="rounded border border-border bg-urgency-high-soft px-2 py-0.5 text-[10px] font-semibold text-urgency-high">
                  PRIORITY 1
                </span>
              </div>
              <ScanFilm
                heat={{ cx: 74, cy: 92, r: 22 }}
                showHeat
                seed={99}
                className="aspect-[4/5] w-full"
                label="Schematic chest scan with finding region highlighted"
              />
              <div className="mt-3 flex items-center justify-between px-1 text-[11px]">
                <span className="text-muted-foreground">Possible pneumothorax</span>
                <span className="num text-foreground">p = 0.891</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FORMULA */}
      <section className="formula border-b border-border bg-surface/40">
        <div className="mx-auto max-w-[1240px] px-6 py-20">
          <div className="reveal max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              One formula, recomputed on every refresh
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              Priority is not a label the model assigns once at ingestion. It is a function of time,
              so a moderately urgent five-minute read is never trapped behind a marginally more
              urgent twenty-minute one — and a study the model under-scored still climbs.
            </p>
          </div>

          <div className="formula-track reveal mt-10 overflow-x-auto">
            <div className="panel inline-flex min-w-full items-center gap-6 p-8">
              <div className="text-center">
                <div className="num text-[13px] text-muted-foreground">Priority(s, t)</div>
              </div>
              <span className="text-lg text-muted-foreground">=</span>
              <div className="text-center">
                <div className="border-b border-border-strong px-4 pb-2 text-[13px] text-foreground">
                  Utility(finding) × P<sub>calibrated</sub>(urgent)
                </div>
                <div className="px-4 pt-2 text-[13px] text-foreground">EstimatedReadTime(s)</div>
              </div>
              <span className="text-lg text-muted-foreground">+</span>
              <div className="whitespace-nowrap text-[13px] text-foreground">
                α × WaitTime(s, t)
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Utility weight", "Clinician-configurable per finding type"],
              ["Calibrated probability", "Temperature-scaled, not raw softmax"],
              ["Estimated read time", "Predicted from series count and complexity"],
              ["Wait-time bonus", "Accumulating aging term — nothing waits forever"],
            ].map(([t, b]) => (
              <div key={t} className="reveal panel p-4">
                <div className="text-[12px] font-semibold text-foreground">{t}</div>
                <div className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">{b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1240px] px-6 py-20">
          <h2 className="reveal text-2xl font-semibold tracking-tight text-foreground">
            Five things a hospital can actually verify
          </h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p) => (
              <div key={p.title} className="reveal bg-surface p-6">
                <p.icon className="h-5 w-5 text-primary" />
                <h3 className="mt-4 text-[14px] font-semibold text-foreground">{p.title}</h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            ))}
            <div className="reveal flex flex-col justify-between bg-surface-raised p-6">
              <h3 className="text-[14px] font-semibold text-foreground">
                See the four screens in order
              </h3>
              <div className="mt-4 flex flex-col gap-2">
                {[
                  ["/worklist", "1 · Live triage worklist"],
                  ["/twin", "2 · Queue digital twin"],
                  ["/viewer", "3 · Adaptive viewer"],
                  ["/admin", "4 · Compliance & calibration"],
                ].map(([to, label]) => (
                  <Link
                    key={to}
                    to={to}
                    className="group flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2 text-[12px] font-medium text-foreground transition-colors hover:border-border-strong"
                  >
                    {label}
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-[1240px] px-6 py-12">
        <div className="reveal flex flex-col gap-2 text-[11px] text-muted-foreground">
          <span>
            APERTURE is a decision-support and workflow-prioritization demonstration. It does not
            diagnose. All patients, studies, findings and audit entries shown are synthetic.
          </span>
          <span>© 2026 APERTURE · Precision Care Challenge submission</span>
        </div>
      </footer>
    </div>
  );
}
