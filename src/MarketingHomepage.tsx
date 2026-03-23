import { ArrowRight, CheckCircle2, ChevronDown, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import copyDeck from "../design_spec_package/optimized_copy_deck.json";
import surfaceStackUrl from "../design_spec_package/assets/surface-stack.svg";
import signalGridUrl from "../design_spec_package/assets/signal-grid.svg";
import IntelligenceWorkspace from "./IntelligenceWorkspace";

type CopyDeck = typeof copyDeck;

const proofCards = copyDeck.proof.cards;
const featureItems = copyDeck.feature_section.items;
const workflowSteps = copyDeck.workflow_section.steps;

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

  return (
    <section className="relative overflow-hidden border-b border-[var(--border-subtle)] bg-[var(--surface-canvas)]">
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: `url(${signalGridUrl})`, backgroundSize: "min(960px, 100%)", backgroundPosition: "top center" }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(209,177,109,0.18),transparent_34%)]" />

      <div className="relative mx-auto grid max-w-[var(--container-max)] gap-12 px-5 py-16 md:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:items-center lg:gap-16 lg:px-10 lg:py-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-[14px] border border-[var(--border-strong)] bg-[rgba(27,28,22,0.9)] px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-[var(--text-secondary)]">
            <ShieldCheck className="h-4 w-4 text-[var(--accent-verified)]" />
            {deck.hero.eyebrow}
          </div>

          <h1 className="mt-6 max-w-[12ch] text-[var(--display-max)] font-semibold leading-[0.9] tracking-[-0.06em] text-[var(--text-primary)]">
            {deck.hero.headline}
          </h1>

          <p className="mt-6 max-w-2xl text-[var(--body-lg)] leading-8 text-[var(--text-secondary)]">{deck.hero.body}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#workspace-demo"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[16px] border border-[rgba(209,177,109,0.55)] bg-[var(--accent-primary)] px-6 py-3 text-sm font-semibold text-[var(--accent-primary-ink)] shadow-[var(--shadow-soft)] transition hover:translate-y-[-1px] hover:brightness-105"
            >
              {deck.hero.primary_cta}
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="https://github.com/augustave/GEOINT-PT/blob/main/prd_intelligence_workspace_screen_family_completion.md"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[16px] border border-[var(--border-strong)] bg-[rgba(27,28,22,0.82)] px-6 py-3 text-sm font-semibold text-[var(--text-primary)] transition hover:translate-y-[-1px] hover:border-[var(--accent-primary)]"
            >
              {deck.hero.secondary_cta}
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {deck.hero.supporting_points.map((point) => (
              <div
                key={point}
                className="inline-flex min-h-[44px] items-center rounded-[14px] border border-[var(--border-subtle)] bg-[rgba(32,31,24,0.78)] px-4 py-2 text-sm text-[var(--text-secondary)]"
              >
                {point}
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute inset-x-[7%] top-[6%] h-[88%] rotate-[-2deg] rounded-[30px] border border-[var(--border-subtle)] bg-[rgba(27,28,22,0.55)]" />
          <div className="absolute inset-x-[10%] top-[3%] h-[88%] rotate-[2deg] rounded-[30px] border border-[var(--border-subtle)] bg-[rgba(38,35,24,0.48)]" />
          <div className="relative overflow-hidden rounded-[32px] border border-[var(--border-strong)] bg-[linear-gradient(180deg,rgba(27,28,22,0.98),rgba(16,16,13,0.96))] p-5 shadow-[var(--shadow-strong)] lg:p-6">
            <div className="absolute inset-y-0 left-0 w-4 bg-[linear-gradient(180deg,rgba(209,177,109,0.88),rgba(239,143,69,0.72))]" />
            <div className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-muted)]">Preview Surface</div>
                <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">Indexed landing stack, live workspace below</div>
              </div>
              <div className="rounded-[14px] border border-[var(--border-subtle)] bg-[rgba(17,18,15,0.72)] px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-[var(--accent-secondary)]">
                Field archive
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-[24px] border border-[var(--border-subtle)] bg-[radial-gradient(circle_at_top,rgba(209,177,109,0.14),rgba(17,18,15,0.96)_62%)] p-4">
              <img src={surfaceStackUrl} alt="Preview of synchronized intelligence surfaces" className="h-auto w-full rounded-[20px] border border-[var(--border-subtle)]" />
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

      <div className="relative mx-auto flex max-w-[var(--container-max)] justify-center px-5 pb-6 md:px-8 lg:px-10">
        <a href="#proof-grid" className="inline-flex min-h-[44px] items-center gap-2 text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]">
          See proof and live demo
          <ChevronDown className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}

export default function MarketingHomepage() {
  return (
    <div className="min-h-screen bg-[var(--surface-canvas)] text-[var(--text-primary)]">
      <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[rgba(8,17,26,0.82)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[var(--container-max)] items-center justify-between gap-4 px-5 py-4 md:px-8 lg:px-10">
          <div>
            <div className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-muted)]">Intelligence Workspace</div>
            <div className="mt-1 text-base font-semibold text-[var(--text-primary)]">Field-Archive Geo-Intelligence Prototype</div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a href="#workspace-demo" className="inline-flex min-h-[44px] items-center rounded-[14px] border border-[var(--border-strong)] bg-[rgba(27,28,22,0.72)] px-4 py-2 text-sm text-[var(--text-secondary)] transition hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)]">
              Launch Workspace Demo
            </a>
            <a
              href="https://github.com/augustave/GEOINT-PT"
              className="inline-flex min-h-[44px] items-center rounded-[14px] bg-[var(--accent-primary)] px-4 py-2 text-sm font-semibold text-[var(--accent-primary-ink)] transition hover:translate-y-[-1px]"
            >
              Open GitHub Repository
            </a>
          </div>
        </div>
      </header>

      <main>
        <Hero deck={copyDeck} />

        <section id="proof-grid" className="border-b border-[var(--border-subtle)] bg-[var(--surface-base)]">
          <div className="mx-auto max-w-[var(--container-max)] px-5 py-16 md:px-8 lg:px-10 lg:py-20">
            <SectionHeading eyebrow={copyDeck.proof.eyebrow} headline={copyDeck.proof.headline} />
            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {proofCards.map((card) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="relative rounded-[26px] border border-[var(--border-subtle)] bg-[linear-gradient(180deg,rgba(27,28,22,0.96),rgba(17,18,15,0.94))] p-6 shadow-[var(--shadow-soft)]"
                >
                  <div className="absolute right-5 top-0 h-4 w-16 rounded-b-[10px] border-x border-b border-[var(--border-strong)] bg-[rgba(209,177,109,0.16)]" />
                  <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">{card.label}</div>
                  <div className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[var(--text-primary)]">{card.value}</div>
                  <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">{card.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--border-subtle)] bg-[linear-gradient(180deg,var(--surface-base),var(--surface-panel))]">
          <div className="mx-auto max-w-[var(--container-max)] px-5 py-16 md:px-8 lg:px-10 lg:py-20">
            <SectionHeading eyebrow={copyDeck.feature_section.eyebrow} headline={copyDeck.feature_section.headline} />
            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {featureItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ delay: index * 0.04 }}
                  className="relative rounded-[24px] border border-[var(--border-subtle)] bg-[rgba(32,31,24,0.76)] p-5"
                >
                  <div className="absolute right-5 top-0 h-4 w-14 rounded-b-[10px] border-x border-b border-[var(--border-strong)] bg-[rgba(95,200,216,0.12)]" />
                  <div className="inline-flex h-11 min-w-[44px] items-center justify-center rounded-[14px] border border-[var(--border-strong)] bg-[rgba(209,177,109,0.12)] px-4 text-sm font-semibold text-[var(--accent-primary)]">
                    0{index + 1}
                  </div>
                  <h3 className="mt-5 text-[var(--display-small)] font-semibold tracking-[-0.04em] text-[var(--text-primary)]">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">{item.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--border-subtle)] bg-[var(--surface-panel)]">
          <div className="mx-auto grid max-w-[var(--container-max)] gap-10 px-5 py-16 md:px-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:px-10 lg:py-20">
            <SectionHeading eyebrow={copyDeck.workflow_section.eyebrow} headline={copyDeck.workflow_section.headline} body="This is the logic the root page now sells before the user reaches the full interactive workspace." />

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {workflowSteps.map((step, index) => (
                <div key={step} className="rounded-[24px] border border-[var(--border-subtle)] bg-[rgba(27,28,22,0.78)] p-5">
                  <div className="flex items-center gap-3 text-[var(--accent-verified)]">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">Step 0{index + 1}</span>
                  </div>
                  <p className="mt-5 text-sm leading-7 text-[var(--text-secondary)]">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="workspace-demo" className="border-b border-[var(--border-subtle)] bg-[var(--surface-canvas)]">
          <div className="mx-auto max-w-[var(--container-max)] px-5 py-16 md:px-8 lg:px-10 lg:py-20">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading eyebrow={copyDeck.demo_section.eyebrow} headline={copyDeck.demo_section.headline} body={copyDeck.demo_section.body} />
              <a
                href="https://github.com/augustave/GEOINT-PT"
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[16px] border border-[var(--border-strong)] bg-[rgba(27,28,22,0.78)] px-6 py-3 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--accent-primary)]"
              >
                {copyDeck.demo_section.primary_cta}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-10 overflow-hidden rounded-[36px] border border-[var(--border-strong)] bg-[var(--surface-base)] shadow-[var(--shadow-strong)]">
              <IntelligenceWorkspace />
            </div>
          </div>
        </section>

        <section className="bg-[linear-gradient(180deg,var(--surface-panel-alt),var(--surface-elevated))]">
          <div className="mx-auto max-w-[var(--container-max)] px-5 py-16 text-center md:px-8 lg:px-10 lg:py-20">
            <SectionHeading eyebrow="Next Cycle" headline={copyDeck.final_cta.headline} body={copyDeck.final_cta.body} centered />
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="https://github.com/augustave/GEOINT-PT"
                className="inline-flex min-h-[52px] items-center justify-center rounded-[16px] bg-[var(--accent-primary)] px-6 py-3 text-sm font-semibold text-[var(--accent-primary-ink)] transition hover:translate-y-[-1px]"
              >
                {copyDeck.final_cta.primary_cta}
              </a>
              <a
                href="https://github.com/augustave/GEOINT-PT/blob/main/prd_intelligence_workspace_screen_family_completion.md"
                className="inline-flex min-h-[52px] items-center justify-center rounded-[16px] border border-[var(--border-strong)] px-6 py-3 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--accent-primary)]"
              >
                {copyDeck.final_cta.secondary_cta}
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
