import { Fragment } from "react";
import { ArrowRight, CheckCircle2, ChevronDown, Hexagon, ShieldCheck } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import copyDeck from "../design_spec_package/optimized_copy_deck.json";
import surfaceStackUrl from "../design_spec_package/assets/surface-stack.svg";
import signalGridUrl from "../design_spec_package/assets/signal-grid.svg";
import { SCREEN_FAMILY_SPECS, WORKSPACE_INVARIANTS } from "./workspace/config";
import { NarrativeCard, ProofCard, SurfaceCard } from "./workspace/cardPrimitives";

const sectionFade: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

type CopyDeck = typeof copyDeck;

const proofCards = copyDeck.proof.cards;
const workflowSteps = copyDeck.workflow_section.steps;
const screenFamilyRows = [
  { label: "Role", key: "role" },
  { label: "Question", key: "question" },
  { label: "View", key: "view" },
  { label: "Geometry", key: "geometryBehavior" },
  { label: "Compare", key: "compareRole" },
] as const;

function SectionHeading(props: { eyebrow: string; headline: string; body?: string; centered?: boolean }) {
  const { eyebrow, headline, body, centered } = props;

  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <div className="inline-flex items-center gap-3 border-l-2 border-[var(--accent-secondary)] pl-3 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--text-muted)]">
        {eyebrow}
      </div>
      <h2 className="mt-4 text-[var(--display-mid)] font-semibold leading-[0.95] tracking-[-0.05em] text-[var(--text-primary)]">{headline}</h2>
      {body ? <p className="mt-4 text-[var(--body-lg)] leading-8 text-[var(--text-secondary)]">{body}</p> : null}
    </div>
  );
}

function Hero(props: { deck: CopyDeck }) {
  const { deck } = props;
  const tacticalStrip = [
    ["Selection", "Persistent"],
    ["Compare", "Recoverable"],
    ["Extent", "BBox-driven"],
  ];
  const coordinateReadout = [
    ["Grid", "31T CH 4821 1194"],
    ["Frame", "OPERATIONAL / 5 SURFACES"],
    ["Integrity", "GEOMETRY TRUE"],
  ];

  return (
    <section className="relative overflow-hidden border-b border-[var(--border-subtle)] bg-[var(--surface-canvas)]">
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: `url(${signalGridUrl})`, backgroundSize: "min(960px, 100%)", backgroundPosition: "top center" }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(209,177,109,0.18),transparent_34%)]" />

      <div className="relative mx-auto grid max-w-[var(--container-max)] gap-10 px-5 pb-12 pt-14 md:px-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(400px,0.9fr)] lg:items-center lg:gap-14 lg:px-10 lg:pb-16 lg:pt-20">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
          <div className="relative max-w-2xl">
            <div className="absolute inset-x-[6%] top-[5%] h-[92%] rotate-[-2deg] rounded-[30px] border border-[var(--border-subtle)] bg-[rgba(32,31,24,0.36)]" />
            <div className="absolute inset-x-[2%] top-[2%] h-[94%] rotate-[1.4deg] rounded-[30px] border border-[var(--border-subtle)] bg-[rgba(27,28,22,0.42)]" />
            <div className="relative rounded-[30px] border border-[var(--border-strong)] bg-[linear-gradient(180deg,rgba(27,28,22,0.96),rgba(17,18,15,0.98))] p-6 shadow-[var(--shadow-strong)] lg:p-8">
              <div className="absolute right-6 top-0 h-5 w-24 rounded-b-[12px] border-x border-b border-[var(--border-strong)] bg-[rgba(95,200,216,0.12)]" />
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <div
                    className="inline-flex min-h-[40px] items-center gap-2 border border-[var(--border-strong)] bg-[rgba(32,31,24,0.9)] px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-[var(--text-secondary)] shadow-[0_0_24px_rgba(209,177,109,0.06)]"
                    style={{ clipPath: "polygon(0 0,calc(100% - 16px) 0,100% 50%,calc(100% - 16px) 100%,0 100%)" }}
                  >
                    <ShieldCheck className="h-4 w-4 text-[var(--accent-verified)]" />
                    {deck.hero.eyebrow}
                  </div>
                  <div className="inline-flex min-h-[40px] items-center rounded-[12px] border border-[var(--border-subtle)] bg-[rgba(17,18,15,0.76)] px-3 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Archive tier A
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  <span>Sector 07</span>
                  <span className="h-1 w-1 rounded-full bg-[var(--accent-alert)]" />
                  <span>Range review</span>
                </div>
              </div>

              <h1 className="mt-6 max-w-[12ch] text-[var(--display-max)] font-semibold leading-[0.88] tracking-[-0.06em] text-[var(--text-primary)]">
                {deck.hero.headline}
              </h1>

              <p className="mt-5 max-w-xl text-[var(--body-lg)] leading-8 text-[var(--text-secondary)]">{deck.hero.body}</p>

              <div className="mt-6 grid gap-3 rounded-[20px] border border-[var(--border-subtle)] bg-[rgba(17,18,15,0.72)] p-4 sm:grid-cols-3">
                {tacticalStrip.map(([label, value], index) => (
                  <div key={label} className="rounded-[14px] border border-[var(--border-subtle)] bg-[rgba(32,31,24,0.6)] px-4 py-3">
                    <div className="flex items-center justify-between gap-2 text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                      <span>{label}</span>
                      <span className="text-[10px] text-[var(--accent-secondary)]">0{index + 1}</span>
                    </div>
                    <div className="mt-2 text-sm font-semibold text-[var(--text-primary)]">{value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[18px] border border-[rgba(95,200,216,0.18)] bg-[linear-gradient(90deg,rgba(95,200,216,0.07),rgba(17,18,15,0.08))] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
                  <div className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-muted)]">Instrument Readout</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent-secondary)]">Live surface continuity</div>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {coordinateReadout.map(([label, value]) => (
                    <div key={label} className="rounded-[12px] border border-[var(--border-subtle)] bg-[rgba(12,13,10,0.46)] px-3 py-2.5">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">{label}</div>
                      <div className="mt-1 text-xs font-medium text-[var(--text-primary)]">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/workspace"
                  className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[14px] border border-[rgba(209,177,109,0.55)] bg-[var(--accent-primary)] px-6 py-2.5 text-sm font-semibold text-[var(--accent-primary-ink)] shadow-[0_6px_24px_rgba(209,177,109,0.25)] transition hover:translate-y-[-1px] hover:shadow-[0_8px_32px_rgba(209,177,109,0.35)]"
                >
                  {deck.hero.primary_cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a
                  href="https://github.com/augustave/GEOINT-PT/blob/main/prd_intelligence_workspace_screen_family_completion.md"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[14px] border border-[var(--border-strong)] bg-[rgba(27,28,22,0.82)] px-6 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition hover:translate-y-[-1px] hover:border-[var(--accent-primary)]"
                >
                  {deck.hero.secondary_cta}
                </a>
              </div>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {deck.hero.supporting_points.map((point, index) => (
                  <div
                    key={point}
                    className="inline-flex min-h-[38px] items-center gap-2 border border-[var(--border-subtle)] bg-[rgba(32,31,24,0.78)] px-3.5 py-1.5 text-[13px] text-[var(--text-secondary)]"
                    style={{ clipPath: "polygon(0 0,calc(100% - 12px) 0,100% 50%,calc(100% - 12px) 100%,0 100%)" }}
                  >
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent-primary)]">0{index + 1}</span>
                    {point}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-4 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                <div className="flex flex-wrap items-center gap-3">
                  <span>Box frame retained</span>
                  <span className="h-1 w-1 rounded-full bg-[var(--accent-secondary)]" />
                  <span>Selection survives surface shift</span>
                </div>
                <div className="text-[var(--accent-primary)]">Ref: GEOINT-PT / Root marketing layer</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="relative"
        >
          <div className="absolute inset-x-[7%] top-[6%] h-[88%] rotate-[-2deg] rounded-[28px] border border-[var(--border-subtle)] bg-[rgba(27,28,22,0.55)]" />
          <div className="absolute inset-x-[10%] top-[3%] h-[88%] rotate-[2deg] rounded-[28px] border border-[var(--border-subtle)] bg-[rgba(38,35,24,0.48)]" />
          <div className="relative overflow-hidden rounded-[28px] border border-[var(--border-strong)] bg-[linear-gradient(180deg,rgba(27,28,22,0.98),rgba(16,16,13,0.96))] p-5 shadow-[0_32px_100px_rgba(0,0,0,0.5),0_0_60px_rgba(209,177,109,0.06)] lg:p-6">
            <div className="absolute inset-y-0 left-0 w-3 bg-[linear-gradient(180deg,rgba(209,177,109,0.88),rgba(239,143,69,0.72))]" />
            <div className="pointer-events-none absolute inset-6 rounded-[22px] border border-[rgba(95,200,216,0.12)]" />
            <div className="pointer-events-none absolute inset-x-6 top-[26%] h-px bg-[linear-gradient(90deg,transparent,rgba(95,200,216,0.24),transparent)]" />
            <div className="pointer-events-none absolute inset-x-6 top-[58%] h-px bg-[linear-gradient(90deg,transparent,rgba(95,200,216,0.14),transparent)]" />
            <div className="pointer-events-none absolute inset-y-6 left-[36%] w-px bg-[linear-gradient(180deg,transparent,rgba(95,200,216,0.18),transparent)]" />
            <div className="pointer-events-none absolute inset-y-6 right-[18%] w-px bg-[linear-gradient(180deg,transparent,rgba(209,177,109,0.18),transparent)]" />
            <div className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-muted)]">Preview Surface</div>
                <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">Indexed landing stack, workspace shell on separate route</div>
              </div>
              <div className="rounded-[14px] border border-[var(--border-subtle)] bg-[rgba(17,18,15,0.72)] px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-[var(--accent-secondary)]">
                Field archive
              </div>
            </div>

            <div className="relative mt-6 overflow-hidden rounded-[24px] border border-[var(--border-subtle)] bg-[radial-gradient(circle_at_top,rgba(209,177,109,0.14),rgba(17,18,15,0.96)_62%)] p-4">
              <div className="pointer-events-none absolute left-8 top-8 z-10 inline-flex min-h-[36px] items-center rounded-[10px] border border-[rgba(95,200,216,0.28)] bg-[rgba(8,14,16,0.72)] px-3 text-[10px] uppercase tracking-[0.18em] text-[var(--accent-secondary)]">
                Extent: selection / compare aware
              </div>
              <div className="pointer-events-none absolute right-8 top-8 z-10 inline-flex min-h-[36px] items-center rounded-[10px] border border-[rgba(209,177,109,0.24)] bg-[rgba(33,27,17,0.7)] px-3 text-[10px] uppercase tracking-[0.18em] text-[var(--accent-primary)]">
                Datum sync: preserved
              </div>
              <img src={surfaceStackUrl} alt="Preview of synchronized intelligence surfaces" className="relative z-[1] h-auto w-full rounded-[20px] border border-[var(--border-subtle)]" />
              <div className="pointer-events-none absolute inset-x-[18%] bottom-[22%] z-10 flex justify-center">
                <div className="relative h-20 w-20 rounded-full border border-dashed border-[rgba(209,177,109,0.45)]">
                  <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[rgba(95,200,216,0.2)]" />
                  <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[rgba(95,200,216,0.2)]" />
                  <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--accent-secondary)] bg-[rgba(95,200,216,0.16)]" />
                </div>
              </div>
              <div className="pointer-events-none absolute bottom-8 left-8 z-10 rounded-[12px] border border-[var(--border-subtle)] bg-[rgba(17,18,15,0.82)] px-3 py-2">
                <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Range ring</div>
                <div className="mt-1 text-xs font-medium text-[var(--text-primary)]">2.4km operational frame</div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Primary CTA", value: deck.hero.primary_cta },
                { label: "Signal", value: "Scarce" },
                { label: "Layout", value: "Z-pattern" },
              ].map((item) => (
                <div key={item.label} className="rounded-[18px] border border-[var(--border-subtle)] bg-[rgba(17,18,15,0.72)] p-4">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">{item.label}</div>
                  <div className="mt-2 text-base font-semibold text-[var(--text-primary)]">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative mx-auto flex max-w-[var(--container-max)] justify-center px-5 pb-8 md:px-8 lg:px-10">
        <motion.a
          href="#proof-grid"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          See proof and workspace shell
          <ChevronDown className="h-4 w-4" />
        </motion.a>
      </div>
    </section>
  );
}

export default function MarketingHomepage() {
  return (
    <div className="min-h-screen bg-[var(--surface-canvas)] text-[var(--text-primary)]">
      <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[rgba(16,17,13,0.84)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[var(--container-max)] items-center justify-between gap-4 px-5 py-3 md:px-8 lg:px-10">
          <a href="#" className="flex items-center gap-3 transition hover:opacity-80">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--accent-primary)]/40 bg-[rgba(209,177,109,0.12)]">
              <Hexagon className="h-4.5 w-4.5 text-[var(--accent-primary)]" />
            </div>
            <div>
              <div className="text-sm font-semibold leading-tight text-[var(--text-primary)]">GEOINT-PT</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Field Archive</div>
            </div>
          </a>
          <nav className="flex items-center gap-1.5 sm:gap-2">
            <a href="#proof-grid" className="hidden items-center px-3 py-2 text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)] md:inline-flex">
              Proof
            </a>
            <a href="#workspace-access" className="hidden items-center px-3 py-2 text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)] md:inline-flex">
              Workspace
            </a>
            <div className="mx-1 hidden h-5 w-px bg-[var(--border-subtle)] md:block" />
            <Link
              to="/workspace"
              className="hidden min-h-[36px] items-center rounded-[12px] border border-[var(--border-strong)] bg-[rgba(27,28,22,0.72)] px-3.5 py-1.5 text-sm text-[var(--text-secondary)] transition hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)] sm:inline-flex"
            >
              Launch Workspace
            </Link>
            <a href="https://github.com/augustave/GEOINT-PT" className="inline-flex min-h-[36px] items-center rounded-[12px] bg-[var(--accent-primary)] px-3.5 py-1.5 text-sm font-semibold text-[var(--accent-primary-ink)] transition hover:brightness-110">
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <main>
        <Hero deck={copyDeck} />

        <section id="proof-grid" className="border-b border-[var(--border-subtle)] bg-[var(--surface-base)]">
          <div className="mx-auto max-w-[var(--container-max)] px-5 py-16 md:px-8 lg:px-10 lg:py-20">
            <motion.div variants={sectionFade} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
              <SectionHeading eyebrow={copyDeck.proof.eyebrow} headline={copyDeck.proof.headline} />
            </motion.div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {proofCards.map((card, index) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.06 }}
                  className="group min-h-[180px]"
                >
                  <ProofCard className="relative h-full transition-all duration-300 group-hover:border-[var(--border-strong)] group-hover:shadow-[0_24px_64px_rgba(0,0,0,0.35)]">
                    <div className="absolute right-5 top-0 h-3 w-14 rounded-b-[8px] border-x border-b border-[var(--border-strong)] bg-[rgba(209,177,109,0.16)] transition-colors group-hover:bg-[rgba(209,177,109,0.28)]" />
                    <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">{card.label}</div>
                    <div className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[var(--text-primary)]">{card.value}</div>
                    <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">{card.body}</p>
                  </ProofCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--border-subtle)] bg-[linear-gradient(180deg,var(--surface-base),var(--surface-panel))]">
          <div className="mx-auto max-w-[var(--container-max)] px-5 py-16 md:px-8 lg:px-10 lg:py-20">
            <motion.div variants={sectionFade} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
              <SectionHeading eyebrow={copyDeck.feature_section.eyebrow} headline={copyDeck.feature_section.headline} />
            </motion.div>
            <NarrativeCard className="mt-10 overflow-hidden">
              <div className="grid gap-4 xl:grid-cols-[180px_repeat(5,minmax(0,1fr))]">
                <div className="hidden xl:block" />
                {SCREEN_FAMILY_SPECS.map((spec) => (
                  <SurfaceCard key={spec.id} className="min-h-[220px] border-[var(--border-strong)] bg-[rgba(24,25,19,0.82)]">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">{spec.shortName}</div>
                    <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">{spec.name}</h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{spec.behaviorSummary}</p>
                  </SurfaceCard>
                ))}
                {screenFamilyRows.map((row) => (
                  <Fragment key={row.key}>
                    <div className="hidden items-center rounded-[16px] border border-[var(--border-subtle)] bg-[rgba(17,18,15,0.7)] px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)] xl:flex">
                      {row.label}
                    </div>
                    {SCREEN_FAMILY_SPECS.map((spec) => (
                      <div key={`${spec.id}-${row.key}`} className="rounded-[16px] border border-[var(--border-subtle)] bg-[rgba(17,18,15,0.72)] px-4 py-3">
                        <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)] xl:hidden">{row.label}</div>
                        <div className="mt-1 text-sm font-medium text-[var(--text-primary)]">{spec[row.key]}</div>
                      </div>
                    ))}
                  </Fragment>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {WORKSPACE_INVARIANTS.map((item) => (
                  <div key={item} className="inline-flex min-h-[38px] items-center rounded-[12px] border border-[rgba(95,200,216,0.24)] bg-[rgba(17,18,15,0.72)] px-3.5 text-[12px] uppercase tracking-[0.18em] text-[var(--accent-secondary)]">
                    {item}
                  </div>
                ))}
              </div>
            </NarrativeCard>
          </div>
        </section>

        <section id="workspace-access" className="border-b border-[var(--border-subtle)] bg-[var(--surface-canvas)]">
          <div className="mx-auto max-w-[var(--container-max)] px-5 py-16 md:px-8 lg:px-10 lg:py-20">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-center">
              <motion.div variants={sectionFade} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
                <SectionHeading eyebrow={copyDeck.demo_section.eyebrow} headline="Enter the operational shell on its own route." body="The live workspace is no longer nested inside the marketing grid. Launching the shell now opens the full three-column application container with persistent selection, compare, extent, and dossier continuity." />
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/workspace"
                    className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[14px] border border-[rgba(209,177,109,0.55)] bg-[var(--accent-primary)] px-6 py-2.5 text-sm font-semibold text-[var(--accent-primary-ink)] shadow-[0_6px_24px_rgba(209,177,109,0.25)] transition hover:translate-y-[-1px] hover:shadow-[0_8px_32px_rgba(209,177,109,0.35)]"
                  >
                    Launch Workspace
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <a
                    href="https://github.com/augustave/GEOINT-PT"
                    className="group inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-[14px] border border-[var(--border-strong)] bg-[rgba(27,28,22,0.78)] px-6 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--accent-primary)]"
                  >
                    {copyDeck.demo_section.primary_cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.6 }}>
                <NarrativeCard className="overflow-hidden">
                  <div className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">Workspace Shell</div>
                      <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">Three-column operational application</div>
                    </div>
                    <div className="rounded-[14px] border border-[var(--border-subtle)] bg-[rgba(17,18,15,0.72)] px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-[var(--accent-secondary)]">
                      Separate route
                    </div>
                  </div>
                  <div className="mt-6 grid min-h-[320px] gap-3 lg:grid-cols-[22%_54%_24%]">
                    <div className="rounded-[18px] border border-[var(--border-subtle)] bg-[rgba(17,18,15,0.72)] p-4">
                      <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">Left Rail</div>
                      <div className="mt-3 space-y-2">
                        {["Screen Families", "Search", "Active Layers", "Operational Index"].map((item) => (
                          <div key={item} className="rounded-[12px] border border-[var(--border-subtle)] bg-[rgba(32,31,24,0.62)] px-3 py-2 text-sm text-[var(--text-secondary)]">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-[18px] border border-[var(--border-subtle)] bg-[rgba(17,18,15,0.72)] p-4">
                      <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">Main Surface</div>
                      <div className="mt-3 overflow-hidden rounded-[14px] border border-[var(--border-subtle)]">
                        <img src={surfaceStackUrl} alt="Operational shell preview" className="h-auto w-full" />
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {["Scope", "BBox", "Selection", "Compare"].map((item) => (
                          <div key={item} className="rounded-full border border-[rgba(95,200,216,0.24)] px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-[var(--accent-secondary)]">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-[18px] border border-[var(--border-subtle)] bg-[rgba(17,18,15,0.72)] p-4">
                      <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">Dossier</div>
                      <div className="mt-3 space-y-2">
                        {["Metadata", "Summary", "Evidence", "Compare Queue"].map((item) => (
                          <div key={item} className="rounded-[12px] border border-[var(--border-subtle)] bg-[rgba(32,31,24,0.62)] px-3 py-2 text-sm text-[var(--text-secondary)]">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </NarrativeCard>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--border-subtle)] bg-[var(--surface-panel)]">
          <div className="mx-auto grid max-w-[var(--container-max)] gap-10 px-5 py-16 md:px-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center lg:px-10 lg:py-20">
            <motion.div variants={sectionFade} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
              <SectionHeading eyebrow={copyDeck.workflow_section.eyebrow} headline={copyDeck.workflow_section.headline} body="This is the logic the root page now sells before the user reaches the full interactive workspace." />
            </motion.div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {workflowSteps.map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.08 }}
                  className="group rounded-[22px] border border-[var(--border-subtle)] bg-[rgba(27,28,22,0.78)] p-5 transition-all duration-300 hover:border-[var(--border-strong)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--accent-verified)]/30 bg-[rgba(214,221,123,0.08)] transition-colors group-hover:bg-[rgba(214,221,123,0.14)]">
                      <CheckCircle2 className="h-4 w-4 text-[var(--accent-verified)]" />
                    </div>
                    <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">Step 0{index + 1}</span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">{step}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[linear-gradient(180deg,var(--surface-panel-alt),var(--surface-elevated))]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(209,177,109,0.08),transparent_50%)]" />
          <div className="relative mx-auto max-w-[var(--container-max)] px-5 py-20 text-center md:px-8 lg:px-10 lg:py-28">
            <motion.div variants={sectionFade} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
              <SectionHeading eyebrow="Next Cycle" headline={copyDeck.final_cta.headline} body={copyDeck.final_cta.body} centered />
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to="/workspace"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-[14px] bg-[var(--accent-primary)] px-6 py-2.5 text-sm font-semibold text-[var(--accent-primary-ink)] shadow-[0_6px_24px_rgba(209,177,109,0.25)] transition hover:translate-y-[-1px] hover:shadow-[0_8px_32px_rgba(209,177,109,0.35)]"
                >
                  Launch Workspace
                </Link>
                <a
                  href="https://github.com/augustave/GEOINT-PT/blob/main/prd_intelligence_workspace_screen_family_completion.md"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-[14px] border border-[var(--border-strong)] px-6 py-2.5 text-sm font-semibold text-[var(--text-primary)] transition hover:translate-y-[-1px] hover:border-[var(--accent-primary)]"
                >
                  {copyDeck.final_cta.secondary_cta}
                </a>
              </div>
            </motion.div>
            <div className="mx-auto mt-12 flex items-center justify-center gap-6 text-[var(--text-muted)]">
              <div className="h-px w-16 bg-[var(--border-subtle)]" />
              <Hexagon className="h-4 w-4 text-[var(--accent-primary)]/50" />
              <div className="h-px w-16 bg-[var(--border-subtle)]" />
            </div>
            <p className="mt-6 text-xs text-[var(--text-muted)]">GEOINT-PT &middot; Field-Archive Geo-Intelligence Prototype</p>
          </div>
        </section>
      </main>
    </div>
  );
}
