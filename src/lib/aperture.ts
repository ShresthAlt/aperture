/**
 * APERTURE synthetic data + priority engine.
 * All data is fake/synthetic. No real patient data.
 */

export type Finding =
  | "Possible pneumothorax"
  | "Suspected nodule"
  | "Cardiomegaly"
  | "Pneumonia (consolidation)"
  | "Pleural effusion"
  | "Rib fracture"
  | "Atelectasis"
  | "No finding";

export type Modality = "CXR" | "CT" | "CTA" | "US";

export type Urgency = "high" | "moderate" | "low";

export interface Study {
  id: string;
  patientId: string;
  accession: string;
  modality: Modality;
  bodyPart: string;
  finding: Finding;
  confidence: number; // calibrated 0..1
  utility: number; // clinical utility weight 0..10
  readMinutes: number;
  arrivedAtOffsetSec: number; // seconds already waited at t0
  disagreement: boolean;
  site: string;
  age: number;
  sex: "M" | "F";
  heat: { cx: number; cy: number; r: number } | null;
}

export const SITES = [
  { id: "apollo", name: "Apollo Metro", region: "Tier-1 · 640 beds", kms: "kms/aperture-apollo-metro" },
  { id: "fortis", name: "Fortis Rural Node", region: "Tier-3 · 82 beds", kms: "kms/aperture-fortis-rural" },
  { id: "aiims", name: "AIIMS Satellite Clinic", region: "Tier-2 · 210 beds", kms: "kms/aperture-aiims-sat" },
] as const;

export const UTILITY_TABLE: Record<Finding, number> = {
  "Possible pneumothorax": 9.4,
  "Pneumonia (consolidation)": 6.8,
  "Pleural effusion": 6.1,
  "Suspected nodule": 5.4,
  "Rib fracture": 4.2,
  Cardiomegaly: 3.6,
  Atelectasis: 2.8,
  "No finding": 0.8,
};

export function urgencyOf(s: Study): Urgency {
  const w = UTILITY_TABLE[s.finding] * s.confidence;
  if (w >= 5.5) return "high";
  if (w >= 2.4) return "moderate";
  return "low";
}

export const ALPHA = 0.055;

export interface PriorityBreakdown {
  utility: number;
  probability: number;
  readMinutes: number;
  waitBonus: number;
  benefitPerMinute: number;
  score: number;
  delayAvoidedMin: number;
}

export function priorityOf(s: Study, waitSec: number): PriorityBreakdown {
  const utility = UTILITY_TABLE[s.finding];
  const benefitPerMinute = (utility * s.confidence) / s.readMinutes;
  const waitBonus = ALPHA * (waitSec / 60);
  const score = benefitPerMinute + waitBonus;
  const delayAvoidedMin = Math.round(benefitPerMinute * 14 + waitSec / 120);
  return {
    utility,
    probability: s.confidence,
    readMinutes: s.readMinutes,
    waitBonus,
    benefitPerMinute,
    score,
    delayAvoidedMin,
  };
}

export type SortMode = "fifo" | "ai" | "aperture";

export const SORT_MODES: { id: SortMode; label: string; hint: string }[] = [
  { id: "fifo", label: "FIFO", hint: "First in, first out — ignores clinical signal" },
  { id: "ai", label: "AI urgency only", hint: "Sorts by raw model score — can bury under-scored studies" },
  { id: "aperture", label: "APERTURE", hint: "Accumulating benefit-per-minute queue" },
];

// ---------------------------------------------------------------------------
// Synthetic study generation (deterministic — safe for SSR + hydration)
// ---------------------------------------------------------------------------

function mulberry(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FINDINGS: Finding[] = [
  "Possible pneumothorax",
  "Suspected nodule",
  "Cardiomegaly",
  "Pneumonia (consolidation)",
  "Pleural effusion",
  "Rib fracture",
  "Atelectasis",
  "No finding",
];

export function generateStudies(siteId: string, count = 18): Study[] {
  const seed = siteId.split("").reduce((a, c) => a + c.charCodeAt(0), 7) * 977;
  const rand = mulberry(seed);
  const studies: Study[] = [];

  for (let i = 0; i < count; i++) {
    const findingRoll = rand();
    const finding =
      findingRoll < 0.1
        ? "Possible pneumothorax"
        : findingRoll < 0.24
          ? "Pneumonia (consolidation)"
          : findingRoll < 0.36
            ? "Suspected nodule"
            : findingRoll < 0.46
              ? "Pleural effusion"
              : findingRoll < 0.55
                ? "Cardiomegaly"
                : findingRoll < 0.62
                  ? "Rib fracture"
                  : findingRoll < 0.7
                    ? "Atelectasis"
                    : FINDINGS[7]!;

    const modality: Modality =
      rand() < 0.72 ? "CXR" : rand() < 0.6 ? "CT" : rand() < 0.5 ? "CTA" : "US";

    const base = finding === "No finding" ? 0.55 + rand() * 0.4 : 0.58 + rand() * 0.39;
    const confidence = Math.min(0.985, Number(base.toFixed(3)));

    studies.push({
      id: `S${(seed % 97) + i}-${i}`,
      patientId: `PT-${88000 + Math.floor(rand() * 8999)}`,
      accession: `ACC-${2026}${String(1000 + Math.floor(rand() * 8999))}`,
      modality,
      bodyPart: modality === "US" ? "Abdomen" : "Chest",
      finding,
      confidence,
      utility: UTILITY_TABLE[finding],
      readMinutes: Math.max(3, Math.round((modality === "CXR" ? 4 : 12) + rand() * 11)),
      arrivedAtOffsetSec: Math.round(60 + rand() * 4500),
      disagreement: false,
      site: siteId,
      age: 21 + Math.floor(rand() * 62),
      sex: rand() < 0.5 ? "M" : "F",
      heat:
        finding === "No finding"
          ? null
          : {
              cx: 60 + rand() * 80,
              cy: 70 + rand() * 70,
              r: 16 + rand() * 14,
            },
    });
  }

  // Two safety-net "model disagreement" flags
  studies[3]!.disagreement = true;
  studies[11]!.disagreement = true;
  return studies;
}

export function formatWait(sec: number) {
  const m = Math.floor(sec / 60);
  if (m < 60) return `${m}m ${String(sec % 60).padStart(2, "0")}s`;
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
}

export function sortStudies(studies: Study[], mode: SortMode, nowSec: number): Study[] {
  const copy = [...studies];
  if (mode === "fifo") {
    return copy.sort(
      (a, b) => b.arrivedAtOffsetSec + nowSec - (a.arrivedAtOffsetSec + nowSec),
    );
  }
  if (mode === "ai") return copy.sort((a, b) => b.confidence - a.confidence);
  return copy.sort(
    (a, b) =>
      priorityOf(b, b.arrivedAtOffsetSec + nowSec).score -
      priorityOf(a, a.arrivedAtOffsetSec + nowSec).score,
  );
}
