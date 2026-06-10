import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import { useSlidePageNumber } from '@open-slide/core';

export const design: DesignSystem = {
  palette: { bg: '#FFFFFF', text: '#3B2517', accent: '#8D57FB' },
  fonts: {
    display: "Geist, 'Inter', system-ui, -apple-system, sans-serif",
    body: "Inter, system-ui, -apple-system, sans-serif",
  },
  typeScale: { hero: 180, body: 36 },
  radius: 16,
};

const muted = '#57534E';
const border = '#EDE8E0';
const ACCENT_BG = 'rgba(141, 87, 251, 0.08)';

const fill: React.CSSProperties = {
  width: '100%',
  height: '100%',
  background: 'var(--osd-bg)',
  color: 'var(--osd-text)',
  fontFamily: 'var(--osd-font-body)',
};

const Title = ({ children }: { children: React.ReactNode }) => (
  <h1
    style={{
      fontFamily: 'var(--osd-font-display)',
      fontSize: 'var(--osd-size-hero)',
      fontWeight: 900,
      lineHeight: 1.05,
      letterSpacing: '-0.02em',
      margin: 0,
      color: 'var(--osd-text)',
    }}
  >
    {children}
  </h1>
);

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 28,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: 'var(--osd-accent)',
    }}
  >
    {children}
  </div>
);

const Footer = () => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      data-slide-footer
      style={{
        position: 'absolute',
        left: 120,
        right: 120,
        bottom: 60,
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 24,
        color: muted,
      }}
    >
      <span>Hypajump · AI Microapps</span>
      <span>{String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
    </div>
  );
};

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      display: 'inline-block',
      background: 'var(--osd-accent)',
      color: '#FFFFFF',
      padding: '12px 24px',
      borderRadius: 999,
      fontSize: 28,
      fontWeight: 600,
    }}
  >
    {children}
  </span>
);

const PageWrap = ({ children }: { children: React.ReactNode }) => (
  <div data-slide-page style={{ ...fill, position: 'relative', padding: '120px 140px' }}>
    <div data-slide-content>{children}</div>
    <Footer />
  </div>
);

// ── Page 1: Cover ──────────────────────────────────────────────

const Cover: Page = () => (
  <div
    data-slide-page
    style={{
      ...fill,
      position: 'relative',
      background: 'radial-gradient(circle at 22% 28%, #FC7824 0%, #FCA89C 42%, #FCD8B4 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 160px',
    }}
  >
    <div data-slide-content>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FFFFFF', marginBottom: 32 }}>PROSPECT DISCOVERY PIPELINE</div>
      <h1 style={{ fontFamily: "var(--osd-font-display)", fontSize: 160, fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.02em', margin: 0, color: '#FFFFFF' }}>
        Oz Oils<br />Lead Gen
      </h1>
      <p style={{ fontSize: 44, color: 'rgba(255,255,255,0.9)', marginTop: 48, marginBottom: 0, maxWidth: 1200 }}>
        Build targeted prospect lists of cooking-oil-using businesses across South East Queensland &amp; Northern NSW
      </p>
    </div>
    <div style={{ position: 'absolute', left: 120, right: 120, bottom: 60, display: 'flex', justifyContent: 'space-between', fontSize: 24, color: 'rgba(255,255,255,0.75)' }}>
      <span>Hypajump · AI Microapps</span>
      <span>7 days · 1 dev</span>
    </div>
  </div>
);

// ── Page 2: What We Build — Modules ────────────────────────────

const ModuleCard = ({ name, desc }: { name: string; desc: string }) => (
  <div
    style={{
      border: `1px solid ${border}`,
      borderRadius: 16,
      padding: '32px 40px',
      background: ACCENT_BG,
      flex: 1,
    }}
  >
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, color: 'var(--osd-accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>{name}</div>
    <p style={{ fontSize: 30, lineHeight: 1.5, margin: 0, color: 'var(--osd-text)' }}>{desc}</p>
  </div>
);

const WhatWeBuild: Page = () => (
  <PageWrap>
    <Eyebrow>WHAT WE BUILD</Eyebrow>
    <h2 style={{ fontFamily: "var(--osd-font-display)", fontSize: 80, fontWeight: 800, margin: '16px 0 48px', lineHeight: 1.1 }}>Four pipeline modules</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
      <ModuleCard name="01 · Discover" desc="Find every cooking-oil business in a region via Apify Google Maps scraping — 30+ data fields per listing" />
      <ModuleCard name="02 · Enrich" desc="Cross-reference each business against ABN Lookup + council food registers to verify legitimacy" />
      <ModuleCard name="03 · Extract" desc="Crawl websites for contact emails; fall back to contact form URLs and phone numbers" />
      <ModuleCard name="04 · Score &amp; Export" desc="Confidence-scored, deduplicated prospect CSV ready for cold outreach" />
    </div>
  </PageWrap>
);

// ── Page 3: User Flow ──────────────────────────────────────────

const FlowStep = ({ num, text }: { num: number; text: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 28 }}>
    <div style={{ width: 56, height: 56, borderRadius: 999, background: 'var(--osd-accent)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 600, flexShrink: 0 }}>{num}</div>
    <p style={{ fontSize: 34, lineHeight: 1.4, margin: 0 }}>{text}</p>
  </div>
);

const UserFlow: Page = () => (
  <PageWrap>
    <Eyebrow>USER FLOW</Eyebrow>
    <h2 style={{ fontFamily: "var(--osd-font-display)", fontSize: 80, fontWeight: 800, margin: '16px 0 56px', lineHeight: 1.1 }}>Admin journey</h2>
    <FlowStep num={1} text="Pick target area and segments (e.g. Brisbane · fish &amp; chips)" />
    <FlowStep num={2} text="Run discovery — system scrapes Google Maps via Apify (10–30 min)" />
    <FlowStep num={3} text="Pipeline auto-enriches: ABN lookup, council validation, email extraction" />
    <FlowStep num={4} text="Review scored list, filter by segment, merge duplicates manually" />
    <FlowStep num={5} text="Export cleaned CSV → import into outreach tool or share with sales team" />
  </PageWrap>
);

// ── Page 4: Core Engine ────────────────────────────────────────

const CoreEngine: Page = () => (
  <PageWrap>
    <Eyebrow>CORE ENGINE</Eyebrow>
    <h2 style={{ fontFamily: "var(--osd-font-display)", fontSize: 80, fontWeight: 800, margin: '16px 0 48px', lineHeight: 1.1 }}>Multi-source discovery pipeline</h2>
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 48 }}>
      <StepBadge label="DISCOVER" color="#FC7824" />
      <Arrow />
      <StepBadge label="ENRICH" color="#8D57FB" />
      <Arrow />
      <StepBadge label="VALIDATE" color="#8D57FB" />
      <Arrow />
      <StepBadge label="SCORE" color="#3B2517" />
    </div>
    <p style={{ fontSize: 36, lineHeight: 1.6, margin: 0, color: muted, maxWidth: 1400 }}>
      No single source gives us everything. The pipeline chains <strong style={{ color: 'var(--osd-text)' }}>Apify Maps scraping</strong> (discovery) → <strong style={{ color: 'var(--osd-text)' }}>ABN Lookup + council data</strong> (enrichment) → <strong style={{ color: 'var(--osd-text)' }}>website crawl</strong> (email) → <strong style={{ color: 'var(--osd-text)' }}>Hunter.io validation</strong>. Each stage adds a layer of confidence. The final output is a CRM-ready CSV of scored prospects.
    </p>
  </PageWrap>
);

const StepBadge = ({ label, color }: { label: string; color: string }) => (
  <div style={{ padding: '16px 32px', borderRadius: 12, background: color, color: '#FFFFFF', fontSize: 26, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', textAlign: 'center' }}>{label}</div>
);

const Arrow = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" style={{ flexShrink: 0 }}>
    <path d="M8 16h14M20 8l8 8-8 8" stroke={muted} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── Page 5: Source Data Gate ───────────────────────────────────

const DataRow = ({ label, source, status, note }: { label: string; source: string; status: string; note: string }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '340px 280px 100px 1fr', gap: 24, padding: '20px 0', borderBottom: `1px solid ${border}`, alignItems: 'center', fontSize: 30 }}>
    <div style={{ fontWeight: 600 }}>{label}</div>
    <div style={{ fontSize: 26, color: muted }}>{source}</div>
    <div style={{ fontSize: 26 }}>{status}</div>
    <div style={{ fontSize: 26, color: muted }}>{note}</div>
  </div>
);

const SourceData: Page = () => (
  <PageWrap>
    <Eyebrow>SOURCE DATA</Eyebrow>
    <h2 style={{ fontFamily: "var(--osd-font-display)", fontSize: 80, fontWeight: 800, margin: '16px 0 8px', lineHeight: 1.1 }}>Five integration points</h2>
    <p style={{ fontSize: 30, color: muted, margin: '0 0 40px' }}>All APIs confirmed available. No blocked endpoints.</p>
    <div style={{ marginBottom: 20 }}>
      <DataRow label="Business discovery" source="Apify Maps" status="✅" note="$2.50/1K · 30+ fields" />
      <DataRow label="Entity verification" source="ABN Lookup" status="✅" note="Free API · JSON" />
      <DataRow label="Food licence check" source="Brisbane open data" status="✅" note="CSV · Eat Safe stars" />
      <DataRow label="Email extraction" source="Website crawl" status="✅" note="30–50% yield" />
      <DataRow label="Email validation" source="Hunter.io" status="✅" note="$49/mo Starter" />
    </div>
  </PageWrap>
);

// ── Page 6: Operations & Security ──────────────────────────────

const OpsRow = ({ label, value }: { label: string; value: string }) => (
  <div style={{ padding: '16px 0', borderBottom: `1px solid ${border}`, display: 'flex', gap: 40, fontSize: 32 }}>
    <div style={{ width: 360, fontWeight: 600, flexShrink: 0 }}>{label}</div>
    <div style={{ color: muted }}>{value}</div>
  </div>
);

const SecurityOps: Page = () => (
  <PageWrap>
    <Eyebrow>OPERATIONS &amp; SECURITY</Eyebrow>
    <h2 style={{ fontFamily: "var(--osd-font-display)", fontSize: 80, fontWeight: 800, margin: '16px 0 48px', lineHeight: 1.1 }}>How it runs</h2>
    <OpsRow label="Database" value="PostgreSQL · single prospects table with discovery-run grouping" />
    <OpsRow label="Auth" value="Clerk · admin-only dashboard; no public endpoints" />
    <OpsRow label="API keys" value="Apify token + Hunter.io key, stored encrypted at rest" />
    <OpsRow label="Audit log" value="Full enrichment trail per prospect: source, date, validation status" />
    <OpsRow label="Hosting" value="Dokploy on DigitalOcean Sydney · $24/mo droplet" />
    <OpsRow label="Backup" value="Daily pg_dump · 30-day retention" />
  </PageWrap>
);

// ── Page 7: Delivery Scope ─────────────────────────────────────

const Milestone = ({ week, label }: { week: string; label: string }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, marginBottom: 28 }}>
    <div style={{ width: 120, fontSize: 26, fontFamily: "'JetBrains Mono', monospace", color: 'var(--osd-accent)', letterSpacing: '0.1em', textTransform: 'uppercase', flexShrink: 0, paddingTop: 4 }}>{week}</div>
    <p style={{ fontSize: 32, lineHeight: 1.4, margin: 0 }}>{label}</p>
  </div>
);

const DeliveryScope: Page = () => (
  <PageWrap>
    <Eyebrow>DELIVERY SCOPE</Eyebrow>
    <h2 style={{ fontFamily: "var(--osd-font-display)", fontSize: 80, fontWeight: 800, margin: '16px 0 48px', lineHeight: 1.1 }}>Pilot in 2 weeks</h2>
    <Milestone week="Week 1" label="Apify discovery pipeline + ABN enrichment. Trigger runs, see raw results." />
    <Milestone week="Week 1" label="Council data import + email extraction crawler + Hunter validation." />
    <Milestone week="Week 2" label="Scoring engine + dedup logic + admin dashboard with filter/search/export." />
    <Milestone week="Week 2" label="Pilot run on Brisbane, tune queries, fix edge cases, hand over CSV." />
  </PageWrap>
);

// ── Page 8: Build Estimate ─────────────────────────────────────

const EstRow = ({ item, days }: { item: string; days: string }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: `1px solid ${border}`, fontSize: 30 }}>
    <span>{item}</span>
    <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--osd-accent)' }}>{days}</span>
  </div>
);

const BuildEstimate: Page = () => (
  <PageWrap>
    <Eyebrow>BUILD ESTIMATE</Eyebrow>
    <h2 style={{ fontFamily: "var(--osd-font-display)", fontSize: 80, fontWeight: 800, margin: '16px 0 48px', lineHeight: 1.1 }}>7 days · 1 dev</h2>
    <EstRow item="Apify integration + discovery pipeline" days="1.5d" />
    <EstRow item="ABN enrichment + council data import" days="1d" />
    <EstRow item="Website email crawl + Hunter validation" days="1.5d" />
    <EstRow item="Scoring engine + dedup + dashboard" days="2d" />
    <EstRow item="QA + pilot run + CSV handover" days="1d" />
    <div style={{ marginTop: 32, display: 'flex', gap: 60 }}>
      <div>
        <div style={{ fontSize: 26, color: muted, marginBottom: 4 }}>Pilot infra cost</div>
        <div style={{ fontSize: 40, fontWeight: 700 }}>~$100–150</div>
      </div>
      <div>
        <div style={{ fontSize: 26, color: muted, marginBottom: 4 }}>Monthly (if scaled)</div>
        <div style={{ fontSize: 40, fontWeight: 700 }}>~$150–250</div>
      </div>
      <div>
        <div style={{ fontSize: 26, color: muted, marginBottom: 4 }}>Pilot output</div>
        <div style={{ fontSize: 40, fontWeight: 700 }}>500–1,000 prospects</div>
      </div>
    </div>
  </PageWrap>
);

// ── Page 9: Next Steps ─────────────────────────────────────────

const DecisionCard = ({ q, detail }: { q: string; detail: string }) => (
  <div style={{ border: `1px solid ${border}`, borderRadius: 16, padding: '28px 36px', marginBottom: 20, background: ACCENT_BG }}>
    <div style={{ fontSize: 32, fontWeight: 600, marginBottom: 8 }}>{q}</div>
    <div style={{ fontSize: 28, color: muted, lineHeight: 1.5 }}>{detail}</div>
  </div>
);

const NextSteps: Page = () => (
  <PageWrap>
    <Eyebrow>NEXT STEPS</Eyebrow>
    <h2 style={{ fontFamily: "var(--osd-font-display)", fontSize: 80, fontWeight: 800, margin: '16px 0 48px', lineHeight: 1.1 }}>Decisions needed</h2>
    <DecisionCard q="1 · Apify scraping posture" detail="Google Maps scraping is the primary discovery path. Brett to confirm legal comfort for pilot." />
    <DecisionCard q="2 · Pilot area" detail="Brisbane recommended — strongest council open data coverage. Confirm or pick alternative." />
    <DecisionCard q="3 · Council audit scope" detail="Audit all SEQ councils pre-pilot, or extend council validation to other areas post-pilot?" />
    <div style={{ marginTop: 32, fontSize: 28, color: muted }}>
      Greenlit → start Monday · 2 weeks to pilot delivery
    </div>
  </PageWrap>
);

// ── Exports ────────────────────────────────────────────────────

export const meta: SlideMeta = {
  title: 'Oz Oils Lead Gen — Engineering Response',
  createdAt: '2026-06-10T02:08:16.826Z',
};

export default [
  Cover,
  WhatWeBuild,
  UserFlow,
  CoreEngine,
  SourceData,
  SecurityOps,
  DeliveryScope,
  BuildEstimate,
  NextSteps,
] satisfies Page[];
