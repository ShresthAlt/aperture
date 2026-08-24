# Triage Compass

Build a polished, production-quality web app called "APERTURE" — a radiology imaging triage
platform for hospitals. This is a demo with realistic fake/synthetic data, not a real medical
device — but it should look and feel like something a hospital would actually deploy: calm,
precise, trustworthy, data-dense but never cluttered. Think Linear or Vercel's dashboard
polish crossed with a clinical PACS system — not a generic SaaS template.
CORE CONCEPT
APERTURE doesn't just flag scans as "urgent" — it schedules the radiologist's entire reading
queue using a live-updating priority formula that combines AI confidence, clinical severity,
estimated read time, and how long a study has been waiting. The whole point of the demo is to
make this feel alive and explainable, not like a static sorted list.
GLOBAL REQUIREMENTS
- Full light/dark mode toggle in the top nav, persisted, with a genuinely well-designed dark
  theme (deep charcoal/near-black backgrounds, not pure black; soft blue/teal accent, not neon)
- Clean sans-serif typography, generous whitespace, subtle borders instead of heavy shadows
- Smooth micro-animations: rows re-sorting in the worklist should visibly animate to their new
  position (not just snap), numbers should count up/down, badges should have a soft transition
- Fully responsive, but optimize primarily for a 13"-15" laptop screen (this will be demoed live)
- Use a persistent top nav with: APERTURE logo/wordmark, a "hospital site" switcher dropdown
  (Apollo Metro, Fortis Rural Node, AIIMS Satellite Clinic — three fake tenant hospitals),
  a light/dark toggle, and a "Decision-support tool — not for diagnostic use" banner that is
  always visible but not obnoxious (small, persistent, top of page)
SCREEN 1 — LIVE TRIAGE WORKLIST (default landing screen)
A table/list of ~15-20 fake radiology studies, each row showing:
- Patient ID (fake, anonymized format like "PT-88213")
- Modality icon (chest X-ray, CT, etc.)
- AI finding badge (e.g. "Possible pneumothorax", "Suspected nodule", "No finding") with a
  calibrated confidence percentage
- A priority score, shown prominently, plus an "Est. delay avoided: X min" figure
- Wait time (live-ticking, e.g. "waiting 14m")
- A small "model disagreement" warning icon on 1-2 rows to show the safety-net flag in action
Rows are sorted by live priority score and periodically re-sort with a smooth animation to
simulate wait-time aging pushing older studies up. Include a toggle to switch the sort mode
between "FIFO", "AI urgency only", and "APERTURE" — switching it visibly reshuffles the list,
demonstrating the difference.
Clicking a row expands an inline panel (don't navigate away) showing:
- A large, clean placeholder chest X-ray-style image (use a generated/placeholder medical
  image or an abstract chest-scan-style illustration — no real patient data obviously, keep
  it schematic/stylized if a real-looking image isn't available) with a toggleable heatmap
  overlay (colored region highlighting the "finding")
- The full "why is this ranked here?" breakdown: four separate numbers with mini labeled bars
  — Utility weight, Calibrated AI probability, Estimated read time, Wait-time bonus — so a
  viewer can see exactly how they sum to the priority score
- A "view full study" button (can just open a modal with a larger viewer mockup)
SCREEN 2 — LIVE QUEUE DIGITAL TWIN
This is the centerpiece "wow" screen. A dashboard that runs a simulated live comparison of
three queueing policies (FIFO, naive AI-sort, APERTURE) processing the same synthetic stream
of incoming studies:
- A "run simulation" button that animates a stream of new study cards flowing in over ~10-15
  seconds
- Three side-by-side live-updating stat cards, one per policy, each showing: average wait
  time (counting down/settling in real time), and a "buried study" count (studies that waited
  dangerously long) — APERTURE should visibly outperform the other two as the simulation runs
- A simple animated line or bar chart (using recharts) showing average wait time per policy
  updating live during the simulation
- A concluding summary line that appears after the run: e.g. "APERTURE reduced average delay
  by 47% vs. naive AI-sort and prevented 3 studies from being buried past clinical threshold"
  (numbers can be randomized within a realistic 30-60% range each run, per policy comparison)
SCREEN 3 — BANDWIDTH-ADAPTIVE VIEWER DEMO
A split-screen or toggle demo showing "Full-resolution fetch" vs "APERTURE progressive mode":
- A simulated network speed selector (Fast/Fiber, Rural 4G, Poor 3G)
- On the left/before: a loading spinner that takes visibly longer at lower speeds before
  showing the full image
- On the right/after: the same fake scan image loads a blurry thumbnail almost instantly with
  the AI badge and confidence score overlaid within ~1-2 seconds, then sharpens progressively
  to full resolution
- Show a small live "time to first diagnostic signal" counter for both sides so the contrast
  is numeric, not just visual
SCREEN 4 — ADMIN / COMPLIANCE DASHBOARD (secondary screen, less emphasis but should exist)
- A hash-chained audit log table (fake entries: user, action, timestamp, a truncated hash
  value) with a small visual indicator showing the chain is unbroken (green check) vs. a
  demo "tamper" button that breaks one link and turns subsequent entries red, to show
  tamper-evidence working
- A per-tenant KMS key indicator per hospital site
- A calibration reliability chart (simple line/scatter) showing the AI model's predicted vs.
  actual accuracy, labeled as a transparency feature
DATA
Generate all data client-side as realistic fake/mock JSON — synthetic patient IDs, a
believable spread of chest X-ray findings (pneumothorax, nodule, cardiomegaly, no finding,
pneumonia, etc.), varied confidence scores, varied wait times. No real images or real patient
data required — use tasteful placeholder/abstract medical imagery or simple stylized SVG
chest-scan graphics with a colored region to represent a "finding," styled consistently with
the rest of the UI so it doesn't look out of place.
TONE
Confident, clinical, and calm — never gamified, never cartoonish. This should look like
software a hospital IT department would actually trust, while still feeling modern and fast.
Use subtle color coding for urgency (not harsh red/green — muted amber for moderate, deeper
coral/red for high urgency, cool blue/gray for low), and keep the overall palette restrained
so the priority-driven color coding actually stands out.

keep fake images if needed, gsap on scrolling at the intro home page, and all ui elements must look very good and proffesional, the judges should love our UI/UX and workflow alot. 

Im giving the whole project solution below just for your understanding
# Project APERTURE
### A Capacity-Aware, Bandwidth-Adaptive Imaging Triage Platform on AWS HealthImaging
**GE HealthCare Precision Care Challenge 2026 — Track: Cloud-Native AI-Ready Imaging Platform for Early Disease Triage**

*Team size: 4 · Round 1 paper due Aug 26, 2026 · Virtual presentation Sept 7–10 · PoC development Sept 17–30*

---

## 0. How to Use This Document

This is the single reference file for the team — it contains the pitch, the full technical design, the research grounding, the tech stack, the team's division of labour, the week-by-week execution plan, setup commands, a cost budget, and honest risk disclosures. Round 1 only needs Sections 1–9 turned into the paper/slides. Sections 10–16 are what the team actually works from between now and the PoC deadline.

---

## 1. The One-Line Pitch

Most teams will build a model that looks at a scan and says "urgent" or "not urgent," then sort a list by that label. APERTURE answers a sharper question: **out of everything sitting in the queue right now, what should the radiologist open next, given how much time they actually have — and can we prove, live, in front of the judges, that this ordering saves time?**

That reframe — classification to scheduling, plus making the benefit *demonstrable rather than merely cited* — is what separates this submission from the rest of the field.

---

## 2. Why Nearly Every Other Team Converges on the Same Build

Be honest about the default submission, because APERTURE is deliberately built to sit above it. The modal entry for this track will: pull a chest X-ray dataset from Kaggle, fine-tune or reuse a CNN classifier, output a single urgency percentage per image, mock the cloud layer with plain S3 and a Flask API (because AWS HealthImaging is not GA in an India region and involves real AWS billing — confirmed below), hide patient names in the UI and call that "compliance," and present a static sorted list as the "triage queue." That build technically touches every bullet in the brief, but it is functionally identical across a large fraction of entries, because it is the first thing anyone finds when they open the problem statement.

APERTURE is designed to still look unmistakably different even to a judge who has already seen forty versions of that submission on the same day.

---

## 3. USP Summary — What Actually Sets This Apart

| # | Differentiator | Why it matters to a judge |
|---|---|---|
| 1 | **Scheduling, not sorting.** The queue uses an accumulating-priority + weighted-shortest-processing-time formula from real healthcare-queueing research, not a static sort by AI score. | Directly answers the brief's "prioritize studies requiring timely attention" — most teams answer with a sorted list, we answer with an algorithm that has a name and a citation trail. |
| 2 | **Live Queue Digital Twin.** A discrete-event simulation (built on the same methodology as FDA's own QuCAD tool) runs *during the demo*, replaying FIFO vs. naive-AI-sort vs. APERTURE on the same synthetic patient stream, so the "X% delay-cost reduction" claim is shown live, not just quoted from a paper. | Nobody else will let the judges watch the benefit happen in real time instead of reading it off a slide. |
| 3 | **Queue-level explainability, not just pixel-level.** Every worklist row can be expanded to show *why* it is ranked where it is — the utility weight, the calibrated probability, the estimated read time, and the accumulated wait bonus, each as a separate number. | The brief asks for "confidence indicators and explainability for triage outputs." Everyone else will show a Grad-CAM heatmap and stop there. We explain the scheduling decision too. |
| 4 | **Real AWS HealthImaging, not a mocked S3 substitute.** HealthImaging is not GA in any India region (confirmed: it is only in us-east-1, us-west-2, eu-west-1, eu-west-2, and ap-southeast-2 as of 2026) — which is exactly why most India-based teams quietly swap in plain S3 and never mention it. We deploy against the real service in ap-southeast-2 (Sydney), the nearest GA region to India, and treat the resulting cross-continent latency as a design input rather than an inconvenience to hide. |
| 5 | **The bandwidth story is measured, not asserted.** Because our nearest real datastore is ~9,700 km away in Sydney, HTJ2K tile-level progressive loading is not a nice-to-have demo trick — it is what makes the tool usable at all from an Indian client. We benchmark full-resolution fetch vs. thumbnail-first progressive fetch from an Indian network during PoC development and publish the real numbers instead of a hypothetical one. |
| 6 | **A safety net with a published failure mode, and we say so.** Autoencoder-based out-of-distribution detectors are a genuine, actively-researched technique — and also have a documented weakness (they can sometimes reconstruct anomalies too well and miss them). We cite that limitation explicitly and describe the mitigation we'd add next (latent-space Mahalanobis distance). Most teams will not admit a single weakness in their own pipeline; doing so signals engineering maturity rather than salesmanship. |
| 7 | **De-identification that actually follows DICOM PS3.15**, including the private-tag problem and burned-in pixel text — not just a scrubbed `PatientName` field, which is what "compliance" means in most submissions. |
| 8 | **A regulatory-literate framing.** Real FDA-cleared CADt devices are typically binary flag + unannotated preview only — they do not localize findings. Our Grad-CAM overlays give more explainability than a strict CADt device would, so we are explicit in the paper that APERTURE sits as a *decision-support and workflow-prioritization tool*, not a claim to any specific FDA device category. This kind of regulatory self-awareness is rare in student submissions and reads as credible rather than naive. |
| 9 | **Cost-of-delay framed in patient terms.** Instead of showing raw priority scores, the worklist surfaces an estimated "minutes of delay avoided" figure per study, computed from the digital twin — tying the algorithm directly to the outcome language the brief itself uses ("delayed identification of urgent cases"). |
| 10 | **Multi-tenant from day one**, not bolted on later — per-tenant KMS keys and a hash-chained audit log simulate 2–3 independent "hospital sites" sharing one platform, which is what "cloud-native, demonstrably scalable" actually means in this brief. |

---

## 4. Requirements Traceability — Every Line of the Brief, Mapped

| Brief requirement | How APERTURE delivers it |
|---|---|
| Ingest publicly available / simulated DICOM datasets | Ingestion pipeline accepts real DICOM P10 files from open chest-imaging datasets (Section 12), malware-scanned and validated on upload |
| Store and index using AWS HealthImaging | All studies land in a real AWS HealthImaging data store (ap-southeast-2) via managed import jobs — not an S3 + custom-index workaround |
| Efficient, low-latency access via APIs | HealthImaging's native DICOMweb-conformant APIs (QIDO-RS search, WADO-RS retrieval, `GetDICOMInstanceMetadata` / `GetDICOMInstanceFrames`), fronted by CloudFront with Lambda@Edge auth for repeat-access latency |
| AI models or rule-based logic to flag/prioritize urgent studies | Two-Model Safety Net (Section 7): calibrated multi-label pathology classifier + independent out-of-distribution autoencoder, feeding the Accumulating Benefit-per-Minute Queue |
| Confidence indicators and explainability | Calibrated probabilities per finding, Grad-CAM region overlays in-viewer, *and* the queue-level "why is this study here" breakdown (Section 6) |
| Open-source / public models, non-diagnostic usage clearly indicated | Built on TorchXRayVision's Apache-2.0 open pretrained weights; a persistent "decision-support, not diagnostic" banner on every screen |
| Secure web interface for clinicians | Cognito-authenticated, OIDC-integrated web app fronting the viewer and worklist |
| Display DICOM images via integrated medical image viewer | OHIF Viewer wired directly to the HealthImaging datastore via AWS's own published CDK sample |
| Surface triage indicators; sort/filter by priority | The Accumulating Benefit-per-Minute Queue *is* the sort order, re-orderable and filterable by finding type, modality, site |
| Role-based access control | Cognito user pools (radiologist / technician / auditor) enforced at API Gateway |
| Encryption in transit and at rest | TLS everywhere; per-tenant AWS KMS keys at rest, including on the HealthImaging datastore |
| Audit logs for access and actions | Hash-chained, tamper-evident audit trail layered on top of AWS CloudTrail |
| Avoid real patient data / proprietary datasets | Public datasets only, run through a genuine DICOM PS3.15 de-identification pass regardless of source |
| Cloud-native, demonstrably scalable | Multi-tenant, multi-AZ design simulating 2–3 independent "hospital sites" sharing one platform |
| Clinical disclaimers, ethical considerations stated | Section 15, carried through UI, paper, and pitch |
| Reference architecture: ingest → import to HealthImaging → index → AI triage → clinician web app | Exactly this pipeline, end-to-end, in Section 8 |

---

## 5. The Core Algorithm: Accumulating Benefit-per-Minute Queue

This is not a hackathon-invented idea dressed up with fancy words — it sits on an active line of research. The FDA has cleared more than 87 AI-enabled computer-aided triage and notification (CADt) devices, and FDA researchers have themselves published queueing-theory frameworks (and a companion tool, QuCAD) specifically to quantify how much waiting time these devices actually save. Stanford radiologists modeled emergency CT/ultrasound scheduling as a queueing problem as far back as 2005 to decide how many slots to reserve for urgent cases. A 2020 *European Radiology* simulation comparing FIFO worklists against AI-urgency-sorted worklists found a serious failure mode worth designing around directly: when an AI wrongly scores a genuinely urgent study as low-risk, that study can get buried at the bottom of the queue indefinitely — worse than doing nothing.

APERTURE's queue avoids that failure mode using an **accumulating priority queue**: every study's priority score combines its clinical urgency **and** how long it has already waited, so priority mathematically climbs the longer something sits unread — guaranteeing every study eventually surfaces even if the AI's initial read was wrong. Layered on top is **weighted shortest processing time (WSPT)**: rank by severity *per unit of scarce reading time*, because a moderately urgent five-minute read buried behind a slightly-more-urgent twenty-minute read is a net loss for the whole queue.

```
Priority(study, t) =  [ Utility(finding_type) × P_calibrated(urgent) ]
                       ─────────────────────────────────────────────  +  α × WaitTime(study, t)
                                  EstimatedReadTime(study)
```

- **P_calibrated(urgent)** — calibrated probability from the Two-Model Safety Net (Section 7), not a raw softmax score.
- **Utility(finding_type)** — a clinician-configurable weight table (a suspected pneumothorax and an incidental nodule are both "abnormal," but not equally urgent).
- **EstimatedReadTime(study)** — predicted from cheap proxy features: series count, modality, prior-study count, image complexity.
- **α × WaitTime(study, t)** — the accumulating-priority aging term guaranteeing no study waits forever.

A 2024 simulation using this class of feature-driven priority queuing on 100,000 real chest X-rays found delay-cost reductions of 30–60% versus naive severity-based sorting under high system load — precisely the scenario the brief describes (rising imaging volumes, radiologist shortage, delayed identification of urgent cases).

---

## 6. What's New: The Live Queue Digital Twin & Queue-Level Explainability

This is the single biggest addition on top of the base concept, and it is the part most likely to make the judges remember this submission after seeing forty others.

### 6.1 The problem with citing a number
Saying "a published study found a 30–60% delay-cost reduction" is a claim about someone else's data. It is true and well-grounded, but a judge has no way to independently verify it applies to *this* team's implementation.

### 6.2 The fix: simulate it live, with our own numbers
We build a lightweight discrete-event simulator (Python + SimPy) — the same modeling approach behind the FDA's own QuCAD tool for evaluating CADt wait-time savings — that:
1. Generates a synthetic stream of study arrivals (configurable Poisson process per simulated "hospital site").
2. Runs the *same* AI outputs (from our real Two-Model Safety Net, not synthetic labels) through three competing queue policies side by side: **FIFO**, **naive-AI-sort** (the "default submission" approach), and **APERTURE's accumulating benefit-per-minute queue**.
3. Tracks per-study wait time, and specifically tracks the worst-case outcome the *European Radiology* paper warned about: a genuinely urgent study that the AI under-scored.
4. Renders live, during the pitch, as a small dashboard showing average wait time and "buried study" count for each policy, side by side.

This turns the pitch's strongest claim from a citation into a demonstration the judges watch happen in front of them, using our own model's real outputs on real public data.

### 6.3 Queue-level explainability
Each row in the OHIF worklist panel has an expandable "why here?" breakdown showing the four terms of the priority formula as separate numbers (utility weight, calibrated probability, estimated read time, wait-time bonus) plus, where relevant, the "model disagreement" flag from Section 7. This is explainability applied to the *scheduling decision*, not just the *pixel classification* — a distinction almost no other team will draw, because almost no other team will have a scheduling algorithm to explain in the first place.

### 6.4 Cost-of-delay framing
The same digital twin lets us translate each study's priority score into an estimated "minutes of avoided delay for this patient" — the number actually shown in the UI next to the AI confidence badge, instead of a raw, hard-to-interpret priority value. This keeps the pitch and the UI anchored to the brief's own language: *delayed identification of urgent cases impacts patient outcomes.*

---

## 7. The AI Layer: A Two-Model Safety Net (and its honest limitation)

A single classifier that has only ever seen "normal" and a handful of labeled pathologies has a structural blind spot: anything genuinely unusual gets confidently — and wrongly — called normal. APERTURE runs two independent models side by side, both built on **TorchXRayVision** (Apache-2.0 licensed, actively maintained, 1.2k+ GitHub stars): it ships pretrained DenseNet121 classifiers trained across NIH ChestX-ray14, CheXpert, PadChest, RSNA Pneumonia, and MIMIC-CXR, and — critically — it also ships a pretrained ResNet autoencoder (`xrv.autoencoders.ResNetAE`) trained on the same corpora.

- The **classifier** scores 18 known pathology categories with calibrated probabilities (temperature-scaled, not raw softmax).
- The **autoencoder** is trained only on normal-looking studies and flags anything whose reconstruction error is unusually high — i.e., anything that "doesn't look like anything the system has been trained to recognize," independent of whether it matches a known label.
- A study only clears as low-priority if *both* models agree there is nothing to see; disagreement is surfaced to the radiologist as a distinct **"uncertain — model disagreement"** flag rather than silently averaged away.
- **Grad-CAM** region overlays are computed against the classifier's final convolutional block and rendered directly on the image in the viewer.

**Honest limitation, stated up front:** reconstruction-error autoencoders are a real, widely used OOD technique, but recent work (Bouman & Heskes, 2025, "Autoencoders for Anomaly Detection are Unreliable") shows they can, in some regimes, reconstruct out-of-distribution inputs too well and under-flag them — the opposite of what we want in a safety net. Our mitigation, scoped as a stretch goal for the PoC: measure a **latent-space Mahalanobis distance** in addition to raw reconstruction error (Denouden et al., 2018), which is known to reduce this failure mode at minimal extra compute cost. We say this in the paper rather than pretending the safety net is failure-proof — a claim that is easy for a technically literate judge to poke a hole in if we make it.

---

## 8. Full System Architecture

```
[Public DICOM datasets] 
        │
        ▼
[Staging S3 bucket] ← API Gateway (Cognito-authed upload) ← Clinician / ingestion script
        │  (malware scan + well-formed DICOM validation)
        ▼
[DICOM PS3.15 de-identification pass]   ← runs BEFORE HealthImaging import, so nothing
        │    - tag-level Basic Confidentiality Profile      sensitive ever reaches the
        │    - private-tag scrub (vendor-specific tags)      authoritative datastore
        │    - OCR + redaction of burned-in pixel text
        │    - Clean Pixel Data attestation stamp
        ▼
[AWS HealthImaging import job] (ap-southeast-2)
        │  → extracts metadata, builds Image Sets, HTJ2K-encodes frames
        ▼
   ┌────┴─────────────────────────────┐
   ▼                                  ▼
[Two-Model Safety Net]         [DICOMweb APIs: QIDO-RS / WADO-RS,
 (event-triggered on import)    GetDICOMInstanceMetadata,
   │  classifier + OOD AE       GetDICOMInstanceFrames]
   │  Grad-CAM overlays                 │
   ▼                                    ▼
[Metadata store: calibrated probs,  [CloudFront + Lambda@Edge]
 OOD flag, priority-formula terms]    (cached, JWT-authed HTJ2K
   │                                    frame delivery, tile-level
   ▼                                    progressive loading)
[Accumulating Benefit-per-Minute            │
 Queue — recomputed on every                │
 refresh, not just at ingestion]            │
   │                                        │
   ▼                                        ▼
[Clinician Web App: Cognito/OIDC-authed, OHIF Viewer + live worklist
 + queue-explainability panel + Live Queue Digital Twin dashboard]
   │
   ▼
[Hash-chained audit log + CloudTrail]  ·  [Per-tenant KMS keys]  ·  [RBAC at API Gateway]
```

### 8.1 Ingestion & storage
Mirrors the low-code ingestion pattern AWS's own partners have published for HealthImaging (API Gateway as an S3 proxy, S3-triggered SQS for event-driven processing). Files are malware-scanned and validated as well-formed DICOM, then de-identified, *before* a managed HealthImaging import job ever touches them — HealthImaging is the authoritative copy, so nothing sensitive should reach it in the first place.

### 8.2 AI-assisted triage workflow
On successful import, an event triggers the Two-Model Safety Net. Its output — calibrated per-pathology probabilities, the OOD flag, Grad-CAM heatmaps, and the four priority-formula terms — is written to a metadata store keyed to the HealthImaging image set. The queue consumes this on every refresh, so the whole worklist re-sorts as new studies land and wait times accrue.

### 8.3 Clinician-facing web app
OHIF — the open-source, standards-compliant viewer with a documented AWS-supported OIDC/Cognito integration path — is wired directly to the HealthImaging datastore. Heatmap overlays render on the image the radiologist is already looking at; the worklist panel *is* the live priority queue.

### 8.4 Security & compliance
Cognito user pools (radiologist / technician / auditor) enforced at API Gateway. TLS in transit; per-tenant AWS KMS keys at rest, including on the HealthImaging datastore, so a breach of one simulated "hospital site" cannot expose another. Every access/action is written to an append-only, hash-chained log (each entry hashes the previous entry, so tampering breaks the chain and is detectable), layered on CloudTrail rather than replacing it. De-identification follows DICOM PS3.15's Basic Confidentiality Profile precisely, including the private-tag problem most teams won't know exists, and burned-in pixel text (PS3.15's "Clean Pixel Data" option) via an OCR-plus-redaction pass. Every de-identified study is stamped with the standard's own attestation attributes, so compliance is machine-verifiable, not just asserted in a slide.

---

## 9. India-First Engineering: Bandwidth-Adaptive Progressive Delivery

This is the piece most teams will never build, because it requires knowing a fairly obscure but genuinely powerful AWS HealthImaging feature exists: **High-Throughput JPEG 2000 (HTJ2K)** encoding with tile-level markers. HTJ2K decodes an order of magnitude faster than classic JPEG 2000 and at least twice as fast as any other DICOM transfer syntax, and its tile-level markers let a client fetch a low-resolution preview almost instantly and progressively stream in full diagnostic resolution behind it. AWS has published sample CDK projects doing exactly this — thumbnail-first retrieval via tile-level markers, and CloudFront-cached frame delivery via Lambda@Edge — as reference architectures, not experimental code we'd have to build from scratch.

**Why this matters more for this specific team than it would for most:** AWS HealthImaging is *not* generally available in any India AWS region. It is GA only in us-east-1, us-west-2, eu-west-1, eu-west-2, and ap-southeast-2 (Sydney) as of 2026. Sydney is the nearest of these to India — still roughly 9,700 km away — meaning the cross-continent round-trip latency our own team will experience during development *is itself* the exact problem a tier-2 or rural Indian clinician's connection would face when trying to pull a full-resolution study. Rather than hide this constraint (as most India-based teams silently do by mocking the cloud layer with plain S3), we deploy against the real service and measure it directly.

APERTURE's mobile/low-bandwidth mode requests only the thumbnail-resolution tiles plus the triage badge and heatmap first — a payload of tens of kilobytes rather than tens of megabytes — so a clinician sees "flagged: possible pneumothorax, 0.89 confidence" in under two seconds, with the full diagnostic-quality image streaming progressively behind it if and when they need to open the full study. **During the PoC phase we will benchmark this directly**: full-resolution WADO-RS fetch vs. thumbnail-first progressive fetch, measured from an Indian network against the real ap-southeast-2 datastore, and publish the actual numbers rather than a hypothetical one. This is also the strongest "why does this matter to GE HealthCare specifically" line in the whole pitch — it is a genuine, deployable answer to imaging access in exactly the under-served settings GE's market strategy is oriented toward, built on a capability GE's own cloud partner already ships.

---

## 10. Datasets and Tools — All Public, Synthetic, or Openly Licensed

No real or proprietary patient data is used anywhere in this build, satisfying the brief's constraint by construction rather than by policy statement.

| Resource | License / access | Use |
|---|---|---|
| **NIH ChestX-ray14** | Fully open, no DUA | 112,000+ frontal chest X-rays, 14 pathology labels; TorchXRayVision's baseline weights |
| **CheXpert (Stanford)** | Open, registration required | Classifier robustness, cross-dataset validation |
| **PadChest (Univ. of Alicante)** | Open | Cross-dataset validation |
| **RSNA Pneumonia Detection Challenge** | Open (Kaggle) | Validation against a task with strong public benchmarks |
| **MIMIC-CXR** | PhysioNet credentialed access | Stretch addition for PoC, not a Round 1 dependency |
| **TorchXRayVision** (`mlmed/torchxrayvision`) | Apache-2.0 | Classifiers + autoencoder (Two-Model Safety Net) |
| **OHIF Viewer** | MIT / open-source | DICOMweb-standards-compliant clinician viewer |
| **AWS HealthImaging, API Gateway, Cognito, KMS, CloudFront, CloudTrail** | Managed AWS services | Published reference architectures for exactly this pipeline |
| **SimPy** | MIT | Discrete-event Live Queue Digital Twin |

---

## 11. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Imaging store | AWS HealthImaging (`ap-southeast-2`) | Only 5 GA regions worldwide as of 2026; Sydney is nearest to India |
| Ingestion | S3 + API Gateway + Lambda + SQS | Malware scan, DICOM validation, PS3.15 de-id before import |
| AI inference | TorchXRayVision (DenseNet121 classifier + ResNetAE) on SageMaker or containerized Lambda/ECS | Calibration via temperature scaling; Grad-CAM via forward/backward hooks |
| Queue engine | Python service (FastAPI) recomputing priority on each poll/refresh; SimPy for the digital twin | Stateless, reads from metadata store |
| Metadata store | DynamoDB (per-study AI outputs, priority terms, audit pointers) | Keyed to HealthImaging Image Set ID |
| Viewer | OHIF Viewer (open-source), deployed via AWS's own CDK sample | DICOMweb data source pointed at HealthImaging |
| Delivery/CDN | CloudFront + Lambda@Edge (JWT auth) | Progressive HTJ2K tile delivery, thumbnail-first mode |
| Auth | Amazon Cognito (OIDC), user pools for radiologist / technician / auditor roles | Enforced at API Gateway |
| Encryption | TLS in transit; per-tenant AWS KMS keys at rest | Including on the HealthImaging datastore |
| Audit | Hash-chained append-only log (DynamoDB or S3 Object Lock) + CloudTrail | Tamper-evident |
| IaC | AWS CDK (TypeScript or Python) | Reuses AWS's published `aws-healthimaging-samples` repo as a base |
| Frontend framework | React (OHIF's native stack) + Tailwind for the worklist/queue-explainability panel | Keep close to OHIF's extension model rather than forking the core viewer |
| Simulation | SimPy + Plotly/Recharts for the live dashboard | Runs client-side or as a small backend job for the pitch demo |

---

## 12. Team Structure (4 People)

| Role | Owns | Primary deliverables |
|---|---|---|
| **1. Cloud & Infrastructure Lead** | AWS HealthImaging setup, ingestion pipeline, IAM/Cognito/KMS, CDK, multi-tenant design, audit logging | Working ingestion → HealthImaging import pipeline; RBAC; hash-chained audit log; cost monitoring |
| **2. AI/ML Lead** | TorchXRayVision integration, calibration, Grad-CAM, OOD autoencoder, priority-formula scoring service | Two-Model Safety Net service; calibration reliability diagrams; read-time estimator |
| **3. Frontend & Viewer Lead** | OHIF/Cognito integration, worklist UI, queue-explainability panel, bandwidth-adaptive mode | Working clinician web app with live-reordering worklist and "why here?" panel |
| **4. Systems, Data & Simulation Lead** (also team PM) | De-identification pipeline (PS3.15), synthetic multi-site arrival generator, Live Queue Digital Twin, paper/slides/demo script | De-id pipeline with attestation stamping; SimPy digital twin; Round 1 paper + pitch deck |

All four collaborate on the Round 1 paper and the Round 2 pitch; the split above is for the PoC build phase (Sept 17–30) where parallel workstreams matter most.

---

## 13. Execution Roadmap

### Phase 0 — Now → Aug 26 (Round 1: paper + slides)
- No infrastructure required yet. Finalize this document into the submission paper + slide deck.
- Systems/Sim lead drafts the paper narrative and the digital-twin section; AI/ML lead sanity-checks the priority formula and TorchXRayVision claims against the actual library API; Cloud lead confirms the architecture diagram against real HealthImaging API names; Frontend lead mocks the queue-explainability panel as static Figma/HTML for the slides.

### Phase 1 — Aug 27 → Sept 6 (prep before virtual presentation)
- Stand up an AWS account (AWS Educate / Free Tier / student credits — see Section 14) in `ap-southeast-2`.
- Cloud lead: bootstrap CDK, deploy a HealthImaging datastore, run one import job against a handful of NIH ChestX-ray14 studies end-to-end.
- AI/ML lead: get TorchXRayVision classifier + autoencoder running locally on the same studies; produce first calibration numbers.
- Systems lead: build the de-identification script (PS3.15 tag scrub + private-tag pass) and run it before the above import.
- Frontend lead: deploy the AWS-published OHIF+Cognito CDK sample as a starting point; confirm it can read the datastore from #1.
- Rehearse Round 2 defence: be ready to explain the queueing-theory grounding and the architecture under jury questioning.

### Phase 2 — Sept 7–10 (Round 2: virtual presentation)
- Present the architecture + queueing-theory grounding; demo whatever is live at this point (even a partial pipeline with real HealthImaging + one working AI flag is stronger than a fully-mocked S3 pipeline).

### Phase 3 — Sept 11–16 (buffer / regroup after Round 2 feedback)
- Incorporate judge feedback. Lock scope for the PoC — de-identification and multi-tenant isolation are the most time-consuming pieces and should not be left for the final week.

### Phase 4 — Sept 17–30 (Round 3: PoC development)
- **Week 1 (Sept 17–23):** Full ingestion → de-id → HealthImaging import pipeline hardened; Two-Model Safety Net running as a real service triggered on import; priority-formula scoring live in DynamoDB; OHIF worklist showing real re-sorting.
- **Week 2 (Sept 24–30):** Live Queue Digital Twin wired to real AI outputs; queue-explainability panel finished; bandwidth-adaptive mode benchmarked from an Indian network against the real Sydney datastore; hash-chained audit log + RBAC finished; demo script rehearsed end-to-end; multi-tenant (2–3 simulated sites) demonstrated.

---

## 14. Repo Structure & Setup

```
aperture/
├── infra/                  # AWS CDK app (based on aws-samples/aws-healthimaging-samples)
│   ├── datastore-stack/    # HealthImaging datastore, KMS keys, tags
│   ├── ingestion-stack/    # S3, API Gateway, Lambda, SQS
│   └── delivery-stack/     # CloudFront + Lambda@Edge, Cognito
├── deident/                 # PS3.15 de-identification pipeline (Python, pydicom)
├── ai-service/              # TorchXRayVision classifier + autoencoder + Grad-CAM + calibration
├── queue-service/           # Priority-formula scoring API (FastAPI)
├── digital-twin/            # SimPy discrete-event simulator + dashboard
├── viewer/                  # OHIF fork/extension: worklist panel, queue-explainability, bandwidth mode
├── audit/                   # Hash-chained log service
└── docs/                    # This file, paper drafts, architecture diagrams
```

### Quick start (once an AWS account + CDK bootstrap exist)
```bash
# 1. Clone AWS's own HealthImaging samples as the infra starting point
git clone https://github.com/aws-samples/aws-healthimaging-samples.git infra/upstream-reference

# 2. Bootstrap CDK in ap-southeast-2 (nearest GA region to India)
cd infra/datastore-stack
cdk bootstrap aws://<ACCOUNT_ID>/ap-southeast-2
cdk deploy

# 3. De-identify a batch of public DICOM files before import
python deident/run_deid.py --input ./raw_dicom/ --output ./deid_dicom/

# 4. Kick off a HealthImaging import job (after de-id, never before)
aws medical-imaging start-dicom-import-job \
  --datastore-id <DATASTORE_ID> \
  --input-s3-uri s3://<staging-bucket>/deid_dicom/ \
  --output-s3-uri s3://<output-bucket>/import-results/ \
  --data-access-role-arn <ROLE_ARN> \
  --region ap-southeast-2

# 5. Install the AI service (TorchXRayVision + calibration + Grad-CAM)
pip install torchxrayvision --break-system-packages
python ai-service/run_pipeline.py --image-set-id <ID>

# 6. Run the digital twin locally to sanity-check the priority formula
pip install simpy --break-system-packages
python digital-twin/simulate.py --policy aperture --policy fifo --policy naive-ai-sort
```

---

## 15. Ethical Guardrails and Clinical Disclaimers

APERTURE is a decision-support and workflow-prioritization tool, full stop — it does not diagnose, and every surface of the product says so. The persistent UI banner, the explainability panel, and this document all state the same thing: model outputs are probabilistic triage signals intended to help a qualified clinician decide what to look at next, not a replacement for their judgment. The "model disagreement" flag exists specifically so uncertainty is surfaced rather than hidden behind a single confident-looking number. No real patient data is used at any stage of development, testing, or demonstration. As noted in Section 7, the OOD safety net has a documented failure mode in the wider literature and is presented with that caveat rather than as an infallible check.

---

## 16. Cost Budget (student-team AWS spend)

AWS HealthImaging pricing (as of 2026, us-east-1 rates; ap-southeast-2 comparable): Frequent Access tier ≈ **$0.105/GB-month**, Archive Instant Access tier ≈ **$0.006/GB-month** (auto-tiered after 30 days of no access), **imports are free**, API calls ≈ **$0.005 per 1,000 requests**, each image set billed at a 5 MB minimum. For a PoC using a few hundred de-identified NIH ChestX-ray14 studies (a few GB total), storage cost is a few dollars a month — the real budget risk is CloudFront/data-transfer egress and running inference compute, not HealthImaging itself.

- Use AWS Educate / AWS Activate for Startups (if eligible) or student credits to cover the account.
- Keep the HealthImaging datastore small and delete it between working sessions if credits are tight (imports are free, so re-importing a curated subset is cheap).
- Route all viewer traffic through CloudFront (same-region CloudFront transfer from HealthImaging avoids the worst of S3-style public egress rates).
- Prefer Lambda/Fargate Spot or a small SageMaker Serverless Inference endpoint for the AI service over an always-on EC2 instance.
- Set a CloudWatch Billing Alarm at a conservative threshold (e.g., $20) on day one — this is also worth mentioning in the paper as a sign of production-mindedness.

---

## 17. Risks & Honest Limitations

| Risk | Mitigation |
|---|---|
| AWS HealthImaging not GA in India → higher latency, harder to demo live on poor conference wifi | This is *the reason* the bandwidth-adaptive mode exists; have a pre-recorded fallback demo clip of the low-bandwidth mode in case live conference wifi fails |
| OOD autoencoder can under-flag anomalies it reconstructs too well (Bouman & Heskes, 2025) | Stated openly in Section 7; latent-space Mahalanobis distance scoped as a stretch mitigation |
| TorchXRayVision classifiers were trained on specific institutional datasets and can have calibration drift on out-of-cohort data | Calibration reliability diagrams shown on an admin dashboard; flagged as a known limitation, not hidden |
| De-identification pipeline (OCR pass on burned-in pixel text) is genuinely time-consuming to get right | Scoped explicitly as a Week 1 PoC priority, not left for the last days |
| 4-person team, ambitious scope | Clear ownership split (Section 12); Round 1/2 deliverables do not require working infrastructure, buying time before the PoC crunch |
| Live demo dependent on conference network conditions | Pre-recorded backup clips for the digital twin and bandwidth-mode benchmark, alongside the live version |

---

## 18. Judging Alignment — Talking Points for the Pitch

1. "We didn't build a classifier that outputs 'urgent.' We built a **scheduler** that answers 'what should the radiologist read next, right now, given how much time they have' — the same class of problem the FDA uses queueing theory to evaluate its own cleared devices against."
2. "We can show you this working, live, on our own model's real outputs, not just cite a number from someone else's paper." *(→ run the digital twin dashboard)*
3. "AWS HealthImaging doesn't exist in an Indian region yet. Instead of hiding that with a fake S3 substitute like most submissions will, we deployed against the real service in Sydney and turned the resulting latency into the reason our bandwidth-adaptive mode is not just a demo trick but a measured necessity."
4. "Our safety net has a known weakness in the wider literature, and we're telling you what it is and what we'd add next — because a triage tool that hides its own failure modes is the opposite of what a clinical safety tool should do."
5. "Every claim in this paper traces back to a real citation, a real AWS API, or a real open-source library — nothing here is aspirational vocabulary."

---

## 19. Sources and Further Reading

- Thompson, Y.L.E. et al., "Applying queueing theory to evaluate wait-time-savings of triage algorithms," *Queueing Systems*, 2024.
- Vasanawala, S.S. et al., "Accommodation of requests for emergency US and CT: applications of queueing theory to scheduling of urgent studies," *Radiology*, 2005.
- Baltruschat, I. et al., "Smart chest X-ray worklist prioritization using artificial intelligence: a clinical workflow simulation," *European Radiology*, 2020.
- Bilodeau, B. and Stanford, D.A., "High-Priority Expected Waiting Times in the Delayed Accumulating Priority Queue with Applications to Health Care KPIs," arXiv, 2020.
- "A Quantitative Framework to Predict Wait-Time Impacts Due to AI-Triage Devices in a Multi-AI, Multi-Disease Workflow," arXiv:2510.27104, 2025 — source for the "87+ FDA-cleared CADt devices" figure and the QuCAD methodology.
- "Evaluation of wait time saving effectiveness of triage algorithms," arXiv:2303.07050 — FDA-affiliated queueing framework for CADt devices.
- Wu, E. et al., "The clinician-AI interface: intended use and explainability in FDA-cleared AI devices for medical image interpretation," PMC, 2024 — source for CADt vs. CADe/CADx device-category distinctions.
- Bouman, R. and Heskes, T., "Autoencoders for Anomaly Detection are Unreliable," arXiv:2501.13864, 2025.
- Denouden, T. et al., "Improving Reconstruction Autoencoder Out-of-Distribution Detection with Mahalanobis Distance," arXiv:1812.02765, 2018.
- Cohen, J.P. et al., "TorchXRayVision: A library of chest X-ray datasets and models," *Medical Imaging with Deep Learning*, 2022; github.com/mlmed/torchxrayvision (Apache-2.0).
- AWS HealthImaging developer guide and sample projects (`aws-samples/aws-healthimaging-samples`), including OHIF/Cognito OIDC integration and HTJ2K tile-level-marker progressive loading samples.
- AWS HealthImaging "What is AWS HealthImaging?" and HTJ2K reference documentation — docs.aws.amazon.com/healthimaging.
- AWS HealthImaging pricing and region-availability pages — aws.amazon.com/healthimaging (5 GA regions as of 2026: us-east-1, us-west-2, eu-west-1, eu-west-2, ap-southeast-2).
- AWS Partner Network blog, "Building a Scalable DICOM Ingestion Pipeline for AWS HealthImaging with CitiusTech," 2024.
- DICOM PS3.15, Annex E — Attribute Confidentiality Profiles (NEMA); The Cancer Imaging Archive De-identification Knowledge Base.

Now make it

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1bf61eeb-ad70-4542-93c4-abb114f8d68f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
