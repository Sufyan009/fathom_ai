"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  IconLogo,
  IconArrowRight,
  IconSparkle,
  IconLightning,
  IconUsers,
  IconRocket,
  IconGlobe,
  IconShield,
  IconCheck,
  IconStar,
  IconPlay,
  IconSearch,
  IconChevron,
  IconClose,
} from "@/components/icons";

const SOLUTIONS_MENU = [
  { label: "For sales teams", href: "#solutions" },
  { label: "For customer success", href: "#solutions" },
  { label: "For product & eng", href: "#solutions" },
  { label: "For teams", href: "#teams" },
];

const INTEGRATIONS_MENU = [
  { label: "Zoom", href: "#integrations" },
  { label: "Google Meet", href: "#integrations" },
  { label: "Microsoft Teams", href: "#integrations" },
  { label: "Slack, Notion & more", href: "#integrations" },
];

const RESOURCES_MENU = [
  { label: "Meeting library", href: "/library" },
  { label: "Ask Fathom", href: "/ask" },
  { label: "Playlists", href: "/playlists" },
];

const PLATFORMS = ["Zoom", "Google Meet", "Microsoft Teams", "Slack", "Notion", "HubSpot"];

const SOLUTIONS = [
  { title: "Sales", icon: IconRocket, body: "Every discovery call scored for pain, budget and next steps, synced straight to the pipeline." },
  { title: "Customer Success", icon: IconShield, body: "Health signals, risks and expansion cues surfaced from the conversation, not a survey." },
  { title: "Product & Engineering", icon: IconLightning, body: "Standup blockers and roadmap decisions captured without anyone stepping away to type." },
];

const PILLARS = [
  {
    icon: IconSparkle,
    title: "Clarity",
    eyebrow: "Every word, organized",
    body: "A clean transcript synced to playback, plus a summary in the shape you actually need: sales discovery, standup, 1:1, interview.",
  },
  {
    icon: IconLightning,
    title: "Momentum",
    eyebrow: "Ask, don't dig",
    body: "Ask Fathom pulls sourced, timestamped answers from one call or your whole history. No scrubbing through recordings.",
  },
  {
    icon: IconUsers,
    title: "Ease",
    eyebrow: "Built to share",
    body: "Clip a moment, drop it in a playlist, or copy a ready-to-send follow-up email in a couple of clicks, not a couple of tabs.",
  },
];

const STATS = [
  { value: "0 tabs", label: "switched to write a recap", color: "#ff8f5c" },
  { value: "1 click", label: "from highlight to shareable clip", color: "#ff9fc7" },
  { value: "100%", label: "on-device, nothing leaves the page", color: "#4facfe" },
];

export default function MarketingHome() {
  const [audience, setAudience] = useState<"teams" | "solo">("teams");

  return (
    <div className="space-surface">
      <SiteNav />
      <Hero />

      {/* Product strip */}
      <section id="product" className="relative border-t border-[var(--space-border)] py-20 px-6">
        <Reveal className="max-w-[1100px] mx-auto">
          <p className="pill-badge mx-auto w-fit">
            <IconPlay width={12} height={12} /> See it in action
          </p>
          <h2 className="text-center text-[clamp(28px,4.5vw,52px)] font-light tracking-[-0.025em] mt-4">
            Capture the call. Skip the typing.
          </h2>
          <p className="text-center text-[15px] text-[var(--space-text-2)] mt-3 max-w-[540px] mx-auto">
            Every meeting becomes a searchable transcript, a template-driven summary
            and a list of action items, automatically, while you stay in the conversation.
          </p>
          <div className="mt-10 grid md:grid-cols-2 gap-5">
            <MockSummaryCard />
            <MockAskCard />
          </div>
        </Reveal>
      </section>

      <Marquee />

      {/* For teams / for individuals */}
      <section id="teams" className="relative border-t border-[var(--space-border)] py-20 px-6 overflow-hidden">
        <div className="absolute -left-32 top-10 w-[420px] h-[420px] orb orb-float opacity-30 blur-[80px]" />
        <Reveal className="relative max-w-[1100px] mx-auto">
          <h2 className="text-[clamp(28px,4.5vw,52px)] font-light tracking-[-0.025em] max-w-[640px]">
            Whether it&rsquo;s one call or a hundred, the record stays straight.
          </h2>

          <div className="mt-8 inline-flex rounded-full border border-[var(--space-border)] p-1 bg-white/[0.03]">
            {(["teams", "solo"] as const).map((a) => (
              <button
                key={a}
                onClick={() => setAudience(a)}
                className="px-4 py-2 rounded-full text-[13.5px] font-semibold transition-colors"
                style={
                  audience === a
                    ? { background: "var(--accent-gradient)", color: "#fff" }
                    : { color: "var(--space-text-2)" }
                }
              >
                {a === "teams" ? "Fathom for teams" : "Fathom for individuals"}
              </button>
            ))}
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {audience === "teams" ? (
              <>
                <FeatureRow icon={IconLightning} title="One shared source of truth" body="Every call, decision and follow-up lives in one library your whole team can search. Nothing stuck in someone's notebook." />
                <FeatureRow icon={IconRocket} title="Faster follow-through" body="Action items carry an owner and a timestamp, so who's doing this is never a separate Slack thread." />
                <FeatureRow icon={IconSearch} title="Search across every call" body="Ask Fathom answers from your whole call history with sourced, clickable moments, not a guess." />
                <FeatureRow icon={IconUsers} title="Built for handoffs" body="New teammate, different timezone, missed the call: the recap and the highlights reel do the catching up." />
              </>
            ) : (
              <>
                <FeatureRow icon={IconSparkle} title="Stay in the conversation" body="Stop typing while someone's talking. The summary and action items are ready the moment the call ends." />
                <FeatureRow icon={IconStar} title="Clip what matters" body="Mark a moment as it happens; it lands as a highlight you can replay or drop into a playlist later." />
                <FeatureRow icon={IconLightning} title="A template for every call" body="Switch between general, sales discovery, standup, 1:1, interview and customer success summaries instantly." />
                <FeatureRow icon={IconGlobe} title="Works with your stack" body="Zoom, Google Meet or Microsoft Teams: the transcript and summary look the same either way." />
              </>
            )}
          </div>
        </Reveal>
      </section>

      {/* Clarity, Momentum, Ease: accordion list + circular orb mock */}
      <PillarsOrb />

      {/* Stats: ascending bubbles on a light surface, like the reference */}
      <StatsBubbles />

      {/* Big single app screenshot */}
      <BigScreenshot />

      {/* Works where you meet: node graph */}
      <NodeGraph />

      {/* Solutions grid */}
      <section id="solutions" className="border-t border-[var(--space-border)] py-20 px-6">
        <Reveal className="max-w-[1100px] mx-auto">
          <p className="text-[13px] font-semibold uppercase tracking-wider text-center" style={{ color: "#7db4ff" }}>
            Every team in flow
          </p>
          <h2 className="text-center text-[clamp(28px,4vw,46px)] font-light tracking-[-0.025em] mt-2">
            One notetaker, tuned to how each team actually talks.
          </h2>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {SOLUTIONS.map((s, i) => (
              <Reveal key={s.title} delay={i * 90} className="rounded-[28px] overflow-hidden hover-lift" style={{ background: "var(--space-surface)", border: "1px solid var(--space-border)" } as React.CSSProperties}>
                <div className="h-24" style={{ background: [
                  "linear-gradient(135deg, #ff8fd8, #7c3aed)",
                  "linear-gradient(135deg, #4facfe, #2f7bff)",
                  "linear-gradient(135deg, #ffb35c, #ff6f6f)",
                ][i] }} />
                <div className="p-5">
                  <span className="w-9 h-9 -mt-9 relative rounded-lg grid place-items-center shadow-lg" style={{ background: "var(--space-surface)", border: "1px solid var(--space-border)" }}>
                    <s.icon width={16} height={16} style={{ color: "#7db4ff" }} />
                  </span>
                  <h3 className="text-[15.5px] font-semibold mt-3">{s.title}</h3>
                  <p className="text-[13px] text-[var(--space-text-2)] mt-1.5 leading-relaxed">{s.body}</p>
                  <Link href="/library" className="btn btn-primary !text-[12.5px] !py-1.5 mt-4 inline-flex">
                    See it in the library <IconArrowRight width={12} height={12} />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Trust */}
      <section className="border-t border-[var(--space-border)] py-16 px-6">
        <Reveal className="max-w-[900px] mx-auto grid sm:grid-cols-3 gap-6 text-center">
          <TrustItem icon={IconShield} title="Local-first" body="Highlights, comments and playlists live in your browser. Nothing is uploaded." />
          <TrustItem icon={IconSparkle} title="No hidden model calls" body="Ask Fathom and template summaries run as on-device retrieval, and say so." />
          <TrustItem icon={IconGlobe} title="Open transcript" body="Export or copy any transcript, summary or follow-up email. Your words, portable." />
        </Reveal>
      </section>

      {/* Final CTA: radiating rings */}
      <section className="relative py-28 px-6 overflow-hidden border-t border-[var(--space-border)]" style={{ background: "linear-gradient(160deg, #2f1a4a, #4a1f5c 45%, #ff6fae 100%)" }}>
        <Rings />
        <Reveal className="relative max-w-[640px] mx-auto text-center">
          <h2 className="text-[clamp(28px,4.5vw,52px)] font-light tracking-[-0.025em]">
            Stop guessing. Ask Fathom.
          </h2>
          <p className="text-[15px] text-white/85 mt-3">
            Jump into the library with seeded example meetings. No signup required.
          </p>
          <Link href="/library" className="btn btn-lg mt-6 inline-flex" style={{ background: "#fff", color: "#14161f" }}>
            Start today, for free <IconArrowRight width={16} height={16} />
          </Link>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}

function Reveal({
  children,
  delay = 0,
  className = "",
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${visible ? "in-view" : ""} ${className}`} style={{ ...style, transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function PromoBar({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div
      className="relative flex items-center justify-center gap-2 px-10 py-2 text-[12.5px] font-medium text-center"
      style={{ background: "#f4f1ea", color: "#14161f" }}
    >
      <IconSparkle width={13} height={13} />
      <span>
        This is an independent rebuild of Fathom, built as a take-home assessment.{" "}
        <Link href="/library" className="underline font-semibold">Open the app</Link>
      </span>
      <button
        onClick={onDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        <IconClose width={14} height={14} />
      </button>
    </div>
  );
}

function NavDropdown({ label, items }: { label: string; items: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="flex items-center gap-1 hover:text-white fathom-link">
        {label}
        <IconChevron width={12} height={12} className={`transition-transform ${open ? "-rotate-90" : "rotate-90"}`} />
      </button>
      {open && (
        <div
          className="absolute left-0 top-full pt-2 w-[200px] animate-in"
          style={{ animationDuration: "0.12s" }}
        >
          <div className="rounded-xl p-1.5" style={{ background: "var(--space-surface)", border: "1px solid var(--space-border)" }}>
            {items.map((it) =>
              it.href.startsWith("/") ? (
                <Link key={it.label} href={it.href} className="block px-3 py-2 rounded-lg text-[13px] text-[var(--space-text-2)] hover:bg-white/[0.06] hover:text-white transition-colors">
                  {it.label}
                </Link>
              ) : (
                <a key={it.label} href={it.href} className="block px-3 py-2 rounded-lg text-[13px] text-[var(--space-text-2)] hover:bg-white/[0.06] hover:text-white transition-colors">
                  {it.label}
                </a>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SiteNav() {
  const [promoOpen, setPromoOpen] = useState(true);
  return (
    <header className="sticky top-0 z-20">
      {promoOpen && <PromoBar onDismiss={() => setPromoOpen(false)} />}
      <div className="backdrop-blur-md" style={{ background: "rgba(5,6,10,0.72)", borderBottom: "1px solid var(--space-border)" }}>
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <IconLogo />
            <span className="font-bold text-[17px] tracking-tight">Fathom</span>
          </Link>

          <nav
            className="hidden md:flex items-center gap-6 text-[13.5px] font-medium text-[var(--space-text-2)] rounded-full px-5 py-2.5"
            style={{ border: "1px solid var(--space-border)" }}
          >
            <a href="#product" className="hover:text-white fathom-link nav-underline">Overview</a>
            <NavDropdown label="Solutions" items={SOLUTIONS_MENU} />
            <NavDropdown label="Integrations" items={INTEGRATIONS_MENU} />
            <NavDropdown label="Resources" items={RESOURCES_MENU} />
            <a href="#pricing" className="hover:text-white fathom-link nav-underline">Pricing</a>
          </nav>

          <div className="ml-auto flex items-center gap-2.5">
            <Link href="/library" className="hidden sm:inline-flex text-[13.5px] font-semibold text-[var(--space-text-2)] hover:text-white transition-colors px-3 py-2">
              Log in
            </Link>
            <Link
              href="/library"
              className="btn !text-[13.5px]"
              style={{ background: "transparent", border: "1px solid var(--accent)", color: "#7db4ff" }}
            >
              Sign up free
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setTilt({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
  };

  return (
    <section className="relative overflow-hidden px-6 pt-20 pb-24">
      <div className="starfield" />
      <div className="relative max-w-[1200px] mx-auto grid lg:grid-cols-[1fr_460px] gap-12 items-center">
        <div className="reveal in-view">
          <p className="pill-badge">
            <IconSparkle width={12} height={12} /> A from-scratch rebuild, not affiliated with Fathom Inc.
          </p>
          <h1 className="text-[clamp(40px,6.5vw,84px)] font-light tracking-[-0.03em] leading-[0.98] mt-5">
            Meeting notes that keep up with the conversation.
          </h1>
          <p className="text-[16px] md:text-[18px] text-[var(--space-text-2)] mt-5 max-w-[520px]">
            Fathom summarizes your calls so you can focus on the people in them:
            synced transcript, switchable summaries, action items and answers
            sourced straight from what was said.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/library" className="btn btn-primary btn-lg">
              Get started, it&rsquo;s free <IconArrowRight width={16} height={16} />
            </Link>
            <Link href="/record" className="btn btn-lg" style={{ border: "1px solid var(--space-border)", color: "#fff" }}>
              <IconPlay width={15} height={15} /> Watch it summarize a call
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-[var(--space-text-2)]">
            <span className="inline-flex items-center gap-1.5"><IconCheck width={13} height={13} /> No account required</span>
            <span className="inline-flex items-center gap-1.5"><IconCheck width={13} height={13} /> Runs entirely in your browser</span>
            <span className="inline-flex items-center gap-1.5"><IconCheck width={13} height={13} /> Seeded with real example calls</span>
          </div>
        </div>

        <div ref={wrapRef} onMouseMove={handleMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })} className="relative hidden lg:block h-[420px]">
          <div
            className="absolute right-0 top-0 w-[380px] h-[380px] orb orb-float blur-[10px] opacity-90"
            style={{ transform: `translate(${tilt.x * 16}px, ${tilt.y * 16}px)`, transition: "transform 0.3s var(--ease-fathom)" }}
          />
          <div
            className="absolute right-6 top-6 w-[340px] rounded-[28px] p-4 shadow-2xl hover-lift"
            style={{ background: "var(--space-surface)", border: "1px solid var(--space-border)", transform: `translate(${tilt.x * 10}px, ${tilt.y * 10}px)`, transition: "transform 0.3s var(--ease-fathom)" }}
          >
            <div className="flex items-center gap-2 text-[11px] text-[var(--space-text-2)]">
              <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
              <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
              <span className="w-2 h-2 rounded-full bg-[#28c840]" />
              <span className="ml-2">Q3 Roadmap Planning</span>
            </div>
            <div className="mt-3 space-y-2">
              <div className="h-2.5 rounded-full bg-white/10 w-[92%]" />
              <div className="h-2.5 rounded-full bg-white/10 w-[78%]" />
              <div className="h-2.5 rounded-full bg-white/10 w-[85%]" />
            </div>
            <div className="mt-4 rounded-lg px-3 py-2 text-[12px] font-medium" style={{ background: "var(--accent-gradient)" }}>
              3 action items assigned
            </div>
          </div>
          <div
            className="absolute left-0 bottom-4 w-[220px] rounded-[28px] p-3.5 hover-lift"
            style={{ background: "var(--space-surface)", border: "1px solid var(--space-border)", transform: `translate(${tilt.x * -12}px, ${tilt.y * -12}px)`, transition: "transform 0.3s var(--ease-fathom)" }}
          >
            <div className="flex items-center gap-1.5 text-[12px] font-semibold">
              <IconSparkle width={13} height={13} style={{ color: "#7db4ff" }} /> Ask Fathom
            </div>
            <p className="text-[11.5px] text-[var(--space-text-2)] mt-1.5 leading-snug">
              &ldquo;What did we decide about pricing?&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function MockSummaryCard() {
  return (
    <div className="rounded-[28px] p-5 hover-lift" style={{ background: "var(--space-surface)", border: "1px solid var(--space-border)" }}>
      <div className="flex items-center gap-1.5 text-[11.5px] font-semibold" style={{ color: "#7db4ff" }}>
        <IconSparkle width={13} height={13} /> SUMMARY
      </div>
      <h4 className="text-[15px] font-semibold mt-2">Discovery — Brightwave (Series B)</h4>
      <ul className="mt-3 space-y-2 text-[13px] text-[var(--space-text-2)]">
        <li className="flex gap-2"><span className="mt-1.5 w-1 h-1 rounded-full bg-white/40 shrink-0" />Manual call notes are costing reps hours every week.</li>
        <li className="flex gap-2"><span className="mt-1.5 w-1 h-1 rounded-full bg-white/40 shrink-0" />Champion identified; procurement wants a security review first.</li>
      </ul>
      <div className="mt-4 flex gap-2">
        <span className="pill-badge !py-1.5 !px-3 !text-[11.5px]">General</span>
        <span className="pill-badge !py-1.5 !px-3 !text-[11.5px]" style={{ background: "var(--accent-gradient)", color: "#fff", border: "none" }}>Sales discovery</span>
      </div>
    </div>
  );
}

function MockAskCard() {
  return (
    <div className="rounded-[28px] p-5 hover-lift" style={{ background: "var(--space-surface)", border: "1px solid var(--space-border)" }}>
      <div className="flex items-center gap-1.5 text-[11.5px] font-semibold" style={{ color: "#7db4ff" }}>
        <IconSparkle width={13} height={13} /> ASK FATHOM
      </div>
      <p className="text-[13.5px] mt-3">What are the open action items?</p>
      <div className="mt-3 rounded-lg p-3 text-[12.5px] leading-relaxed" style={{ background: "rgba(255,255,255,0.04)" }}>
        Three open items across two calls. Most relevant: Sam owns the usage-based
        pricing experiment from &ldquo;Q3 Roadmap Planning.&rdquo;
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-[11px]" style={{ color: "#7db4ff" }}>
        <IconPlay width={10} height={10} /> 15:00 · Q3 Roadmap Planning
      </div>
    </div>
  );
}

function Marquee() {
  const items = ["Work forward faster", "Move meetings forward", "Never re-explain a decision", "Ask instead of scrubbing"];
  const loop = [...items, ...items];
  return (
    <div className="border-t border-b border-[var(--space-border)] py-4 overflow-hidden" style={{ background: "#0b0c14" }}>
      <div className="marquee-track">
        {loop.map((t, i) => (
          <span key={i} className="flex items-center gap-3 px-6 text-[22px] font-bold tracking-tight whitespace-nowrap">
            <span style={{ color: i % 2 === 0 ? "#ff9f5c" : "#fff" }}>{t}</span>
            <IconRocket width={18} height={18} style={{ color: "#7db4ff" }} />
          </span>
        ))}
      </div>
    </div>
  );
}

function PillarsOrb() {
  const [active, setActive] = useState(0);
  const p = PILLARS[active];
  return (
    <section className="relative border-t border-[var(--space-border)] py-20 px-6 overflow-hidden">
      <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-[460px] h-[460px] orb orb-float opacity-25 blur-[90px]" />
      <Reveal className="relative max-w-[1100px] mx-auto grid lg:grid-cols-[1fr_420px] gap-12 items-center">
        <div className="space-y-1">
          {PILLARS.map((pillar, i) => {
            const isActive = i === active;
            return (
              <button
                key={pillar.title}
                onClick={() => setActive(i)}
                className="block w-full text-left rounded-xl px-4 py-3.5"
                style={{ transition: "background 0.3s var(--ease-fathom)", ...(isActive ? { background: "rgba(255,255,255,0.04)" } : {}) }}
              >
                <h3 className="text-[32px] font-light tracking-[-0.02em]" style={{ color: isActive ? "#fff" : "var(--space-text-2)" }}>
                  {pillar.title}
                </h3>
                {isActive && (
                  <div className="mt-2 animate-in">
                    <p className="text-[13px] font-semibold" style={{ color: "#7db4ff" }}>+ {pillar.eyebrow}</p>
                    <p className="text-[14px] leading-relaxed text-[var(--space-text-2)] mt-2 max-w-[420px]">{pillar.body}</p>
                    <Link href="/library" className="btn btn-primary !text-[12.5px] !py-2 mt-4 inline-flex">
                      Get started free <IconArrowRight width={13} height={13} />
                    </Link>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="relative w-[380px] h-[380px] mx-auto orb orb-float grid place-items-center shrink-0">
          <div className="w-[300px] rounded-[28px] p-4 shadow-2xl hover-lift" style={{ background: "var(--space-surface)", border: "1px solid var(--space-border)" }}>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: "#7db4ff" }}>
              <p.icon width={13} height={13} /> {p.title.toUpperCase()}
            </div>
            <div className="mt-3 space-y-2">
              <div className="h-2 rounded-full bg-white/10 w-[88%]" />
              <div className="h-2 rounded-full bg-white/10 w-[70%]" />
              <div className="h-2 rounded-full bg-white/10 w-[80%]" />
              <div className="h-2 rounded-full bg-white/10 w-[60%]" />
            </div>
            <div className="mt-3 rounded-lg px-3 py-2 text-[11.5px] font-medium" style={{ background: "var(--accent-gradient)" }}>
              {p.eyebrow}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function StatsBubbles() {
  return (
    <section className="border-t border-[var(--space-border)] py-20 px-6" style={{ background: "#f4f1ea", color: "#14161f" }}>
      <Reveal className="max-w-[900px] mx-auto text-center">
        <h2 className="text-[clamp(26px,4vw,44px)] font-light tracking-[-0.025em]">
          What Fathom teams optimize for
        </h2>
        <div className="mt-14 flex items-end justify-center gap-8 sm:gap-14 flex-wrap">
          {STATS.map((s, i) => {
            const size = 120 + i * 30;
            return (
              <Reveal
                key={s.label}
                delay={i * 110}
                className="rounded-full grid place-items-center text-center px-4 shrink-0 transition-transform duration-300 hover:scale-105"
                style={{ width: size, height: size, background: s.color, marginBottom: i * 18 } as React.CSSProperties}
              >
                <div>
                  <div className="font-bold" style={{ fontSize: 15 + i * 2 }}>{s.value}</div>
                  <div className="text-[10.5px] font-medium mt-1 opacity-90 leading-snug">{s.label}</div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}

function BigScreenshot() {
  return (
    <section className="relative border-t border-[var(--space-border)] py-20 px-6 text-center">
      <Reveal>
      <h2 className="text-[clamp(26px,4vw,44px)] font-light tracking-[-0.025em]">Make your team unstoppable</h2>
      <p className="text-[14px] text-[var(--space-text-2)] mt-2 max-w-[480px] mx-auto">
        Accurate meeting notes, call summaries and keyword alerts mean your team
        stays aligned without the extra meeting about the meeting.
      </p>
      <div className="mt-10 max-w-[900px] mx-auto rounded-[28px] overflow-hidden shadow-2xl hover-lift" style={{ background: "var(--space-surface)", border: "1px solid var(--space-border)" }}>
        <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "var(--space-border)" }}>
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 text-[12px] text-[var(--space-text-2)]">Q3 Roadmap Planning — Product &amp; Engineering</span>
        </div>
        <div className="grid md:grid-cols-[1fr_260px] text-left">
          <div className="p-5 space-y-3">
            <div className="flex gap-2">
              {["Summary", "Actions", "Highlights", "Ask"].map((t, i) => (
                <span key={t} className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full" style={i === 0 ? { background: "var(--accent-gradient)", color: "#fff" } : { color: "var(--space-text-2)" }}>
                  {t}
                </span>
              ))}
            </div>
            {[92, 76, 84, 60, 70].map((w, i) => (
              <div key={i} className="h-2.5 rounded-full bg-white/10" style={{ width: `${w}%` }} />
            ))}
            <div className="mt-3 rounded-lg px-3 py-2 text-[12px] font-medium inline-block" style={{ background: "var(--accent-gradient)" }}>
              4 action items · 3 highlights
            </div>
          </div>
          <div className="border-t md:border-t-0 md:border-l p-5" style={{ borderColor: "var(--space-border)" }}>
            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#7db4ff" }}>Attendees</p>
            <div className="mt-2.5 flex -space-x-2">
              {["#4facfe", "#ff9fc7", "#ffb35c", "#a78bfa"].map((c, i) => (
                <span key={i} className="w-7 h-7 rounded-full ring-2" style={{ background: c, ringColor: "var(--space-surface)" } as React.CSSProperties} />
              ))}
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wider mt-4" style={{ color: "#7db4ff" }}>Keyword alert</p>
            <p className="text-[12.5px] mt-1.5">&ldquo;pricing&rdquo; mentioned at 15:00</p>
          </div>
        </div>
      </div>
      <Link href="/library" className="btn btn-primary btn-lg mt-8 inline-flex">
        See it live <IconArrowRight width={16} height={16} />
      </Link>
      </Reveal>
    </section>
  );
}

function NodeGraph() {
  const nodes = PLATFORMS;
  const radius = 160;
  return (
    <section id="integrations" className="relative border-t border-[var(--space-border)] py-24 px-6 overflow-hidden">
      <Reveal className="relative max-w-[600px] mx-auto" style={{ height: 380 } as React.CSSProperties}>
        {nodes.map((label, i) => {
          const angle = (i / nodes.length) * 2 * Math.PI - Math.PI / 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <svg key={`line-${label}`} className="absolute left-1/2 top-1/2 -z-10" width={radius * 2} height={radius * 2} style={{ transform: "translate(-50%,-50%)" }}>
              <line x1={radius} y1={radius} x2={radius + x} y2={radius + y} stroke="var(--space-border)" strokeWidth={1} />
            </svg>
          );
        })}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-[28px] grid place-items-center orb-float" style={{ background: "var(--accent-gradient)" }}>
          <IconLogo width={30} height={30} />
        </div>
        {nodes.map((label, i) => {
          const angle = (i / nodes.length) * 2 * Math.PI - Math.PI / 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <span
              key={label}
              className="pill-badge absolute !py-2 !px-3.5 !text-[12.5px]"
              style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: "translate(-50%,-50%)", background: "var(--space-surface)" }}
            >
              {label}
            </span>
          );
        })}
      </Reveal>
      <Reveal className="relative text-center mt-2" delay={150}>
        <h2 className="text-[clamp(26px,3.6vw,40px)] font-light tracking-[-0.025em]">Fathom adapts to your workflow,<br />not the other way around.</h2>
        <Link href="/library" className="btn btn-primary btn-lg mt-6 inline-flex">
          Explore integrations <IconArrowRight width={16} height={16} />
        </Link>
      </Reveal>
    </section>
  );
}

function Rings() {
  const sizes = [140, 280, 420, 560, 700];
  return (
    <div className="rings">
      {sizes.map((s) => (
        <span key={s} style={{ width: s, height: s }} />
      ))}
    </div>
  );
}

function FeatureRow({ icon: Icon, title, body }: { icon: typeof IconSparkle; title: string; body: string }) {
  return (
    <div className="flex gap-3.5">
      <span className="w-9 h-9 rounded-xl grid place-items-center shrink-0" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--space-border)" }}>
        <Icon width={16} height={16} style={{ color: "#7db4ff" }} />
      </span>
      <div>
        <h4 className="text-[14.5px] font-semibold">{title}</h4>
        <p className="text-[13px] text-[var(--space-text-2)] mt-0.5 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

function TrustItem({ icon: Icon, title, body }: { icon: typeof IconSparkle; title: string; body: string }) {
  return (
    <div>
      <span className="w-10 h-10 rounded-xl grid place-items-center mx-auto" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--space-border)" }}>
        <Icon width={18} height={18} style={{ color: "#7db4ff" }} />
      </span>
      <h4 className="text-[14.5px] font-semibold mt-3">{title}</h4>
      <p className="text-[13px] text-[var(--space-text-2)] mt-1.5 leading-relaxed">{body}</p>
    </div>
  );
}

const FOOTER_COLS = [
  { heading: "Product", links: ["Library", "Search", "Ask Fathom", "Playlists"] },
  { heading: "Company", links: ["About this rebuild", "Product recon", "Agent logs"] },
  { heading: "Resources", links: ["README", "Data model"] },
];

function SiteFooter() {
  return (
    <footer className="border-t border-[var(--space-border)] py-14 px-6">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid sm:grid-cols-[1.4fr_repeat(3,1fr)] gap-8">
          <div>
            <div className="flex items-center gap-2">
              <IconLogo />
              <span className="font-bold text-[16px]">Fathom</span>
            </div>
            <p className="text-[12.5px] text-[var(--space-text-2)] mt-3 max-w-[240px] leading-relaxed">
              An independent, unaffiliated rebuild of fathom.video built as a
              take-home assessment. Not the real product.
            </p>
          </div>
          {FOOTER_COLS.map((col) => (
            <div key={col.heading}>
              <h5 className="text-[12px] font-semibold uppercase tracking-wider text-white/70">{col.heading}</h5>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link href="/library" className="text-[13px] text-[var(--space-text-2)] hover:text-white fathom-link">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-[var(--space-border)] text-[12px] text-[var(--space-text-2)]">
          Built for an assessment · not affiliated with or endorsed by Fathom Inc.
        </div>
      </div>
    </footer>
  );
}
