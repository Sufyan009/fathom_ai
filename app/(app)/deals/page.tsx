"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DEALS, STAGES, dealsByStage, type Deal, type DealStage } from "@/lib/deals";
import { fmtUsd } from "@/lib/format";
import { useStore } from "@/lib/store";
import { DealCard } from "@/components/deals/DealCard";
import { DealDrawer } from "@/components/deals/DealDrawer";
import { IconBriefcase, IconTrendUp, IconCheck, IconShield, IconSearch, IconClose } from "@/components/icons";

export default function DealsPage() {
  return (
    <Suspense fallback={null}>
      <DealsPageInner />
    </Suspense>
  );
}

function DealsPageInner() {
  const { dealStages, customDeals, currentUser, addDeal } = useStore();
  const searchParams = useSearchParams();
  const [openDealId, setOpenDealId] = useState<string | null>(searchParams.get("deal"));
  const [query, setQuery] = useState("");
  const [ownerFilter, setOwnerFilter] = useState<string>("all");
  const [addOpen, setAddOpen] = useState(false);

  const allDeals = useMemo<Deal[]>(() => [...DEALS, ...customDeals], [customDeals]);

  const deals = useMemo<Deal[]>(
    () => allDeals.map((d) => (dealStages[d.id] ? { ...d, stage: dealStages[d.id] } : d)),
    [allDeals, dealStages],
  );

  const owners = useMemo(() => Array.from(new Set(deals.map((d) => d.owner))).sort(), [deals]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return deals.filter((d) => {
      if (ownerFilter !== "all" && d.owner !== ownerFilter) return false;
      if (!q) return true;
      return d.company.toLowerCase().includes(q) || d.contactName.toLowerCase().includes(q) || d.owner.toLowerCase().includes(q);
    });
  }, [deals, query, ownerFilter]);

  const columns = useMemo(() => dealsByStage(filtered), [filtered]);
  const openDeal = deals.find((d) => d.id === openDealId) ?? null;

  const isOpenStage = (d: Deal) => d.stage !== "closed_won" && d.stage !== "closed_lost";
  const openValue = deals.filter(isOpenStage).reduce((s, d) => s + d.valueUsd, 0);
  const wonValue = deals.filter((d) => d.stage === "closed_won").reduce((s, d) => s + d.valueUsd, 0);
  const needsAttention = deals.filter((d) => d.health !== "green" && isOpenStage(d)).length;

  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-[var(--accent-soft)] text-[var(--accent)] grid place-items-center">
            <IconBriefcase width={19} height={19} />
          </span>
          <div>
            <h1 className="text-[26px] font-bold tracking-tight">Deals</h1>
            <p className="text-[14px] text-[var(--text-2)] mt-0.5">
              Sales and customer success calls, synced into a pipeline.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
            className="px-3 py-2 rounded-[10px] bg-[var(--surface)] border border-[var(--border)] text-[13.5px] outline-none focus:border-[var(--accent)] transition-colors"
          >
            <option value="all">All owners</option>
            {owners.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <div className="relative">
            <IconSearch width={15} height={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search deals..."
              className="w-[200px] pl-9 pr-3 py-2 rounded-[10px] bg-[var(--surface)] border border-[var(--border)] text-[13.5px] outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
          <button onClick={() => setAddOpen(true)} className="btn btn-primary">+ New deal</button>
        </div>
      </header>

      {/* CRM connection banner */}
      <div className="mt-5 card p-3.5 flex items-center gap-3">
        <span className="w-8 h-8 rounded-lg bg-[var(--surface-2)] grid place-items-center text-[var(--green)]">
          <IconShield width={16} height={16} />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold">Connected to Salesforce &amp; HubSpot</p>
          <p className="text-[11.5px] text-[var(--text-3)]">Deal fields sync automatically after every call. This is a local demo, not a real connection.</p>
        </div>
        <span className="ml-auto chip !text-[11px]"><span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] mr-1 inline-block" />Live</span>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <StatTile icon={<IconTrendUp width={18} height={18} />} label="Open pipeline" value={fmtUsd(openValue)} />
        <StatTile icon={<IconCheck width={18} height={18} />} label="Won this quarter" value={fmtUsd(wonValue)} />
        <StatTile icon={<IconBriefcase width={18} height={18} />} label="Needs attention" value={String(needsAttention)} tone={needsAttention > 0 ? "amber" : undefined} />
      </div>

      {/* Pipeline board */}
      <div className="mt-7 flex gap-4 overflow-x-auto scroll-thin pb-4">
        {STAGES.map((stage) => {
          const stageDeals = columns[stage.id];
          const total = stageDeals.reduce((s, d) => s + d.valueUsd, 0);
          return (
            <div key={stage.id} className="w-[280px] shrink-0 flex flex-col">
              <div className="flex items-center justify-between px-1 mb-2.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-[13px] font-semibold">{stage.label}</h3>
                  <span className="chip !text-[10.5px] !py-0.5">{stageDeals.length}</span>
                </div>
                <span className="text-[11.5px] text-[var(--text-3)] tabular-nums">{fmtUsd(total)}</span>
              </div>
              <div className="flex flex-col gap-2.5 flex-1 rounded-xl bg-[var(--surface-2)]/40 p-1.5 min-h-[80px]">
                {stageDeals.map((d) => (
                  <DealCard key={d.id} deal={d} onOpen={() => setOpenDealId(d.id)} />
                ))}
                {stageDeals.length === 0 && (
                  <div className="text-center text-[11.5px] text-[var(--text-3)] py-6">No deals</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {openDeal && <DealDrawer deal={openDeal} onClose={() => setOpenDealId(null)} />}
      {addOpen && (
        <AddDealModal
          defaultOwner={currentUser.name}
          onClose={() => setAddOpen(false)}
          onCreate={(deal) => { addDeal(deal); setAddOpen(false); }}
        />
      )}
    </div>
  );
}

function AddDealModal({
  defaultOwner,
  onClose,
  onCreate,
}: {
  defaultOwner: string;
  onClose: () => void;
  onCreate: (deal: Omit<Deal, "id" | "lastActivityAt">) => void;
}) {
  const [company, setCompany] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [valueUsd, setValueUsd] = useState(10000);
  const [stage, setStage] = useState<DealStage>("discovery");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim()) return;
    onCreate({
      company: company.trim(),
      contactName: contactName.trim() || "TBD",
      contactEmail: contactEmail.trim() || "-",
      owner: defaultOwner,
      stage,
      valueUsd,
      health: "green",
      crmSystem: "hubspot",
      meetingIds: [],
      nextStep: "Book a discovery call",
    });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <form onSubmit={submit} className="relative card !rounded-2xl w-full max-w-[420px] p-6 animate-in" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-[var(--text-3)] hover:text-[var(--text)]">
          <IconClose />
        </button>
        <h3 className="font-bold text-[17px]">New deal</h3>
        <p className="text-[13px] text-[var(--text-2)] mt-1">Adds a deal to the pipeline. No call linked yet.</p>
        <div className="mt-4 space-y-3">
          <Field label="Company"><input required value={company} onChange={(e) => setCompany(e.target.value)} className="inp" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Contact name"><input value={contactName} onChange={(e) => setContactName(e.target.value)} className="inp" /></Field>
            <Field label="Contact email"><input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="inp" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Value (USD)">
              <input type="number" min={0} value={valueUsd} onChange={(e) => setValueUsd(Number(e.target.value))} className="inp" />
            </Field>
            <Field label="Stage">
              <select value={stage} onChange={(e) => setStage(e.target.value as DealStage)} className="inp">
                {STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </Field>
          </div>
        </div>
        <button type="submit" className="btn btn-primary w-full justify-center mt-5">Create deal</button>
        <style>{`.inp{width:100%;padding:.5rem .7rem;border-radius:10px;background:var(--surface-2);border:1px solid var(--border);font-size:13.5px;outline:none}.inp:focus{border-color:var(--accent)}`}</style>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[11.5px] font-medium text-[var(--text-2)] mb-1">{label}</span>
      {children}
    </label>
  );
}

function StatTile({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: "amber";
}) {
  return (
    <div className="card px-4 py-3.5 flex items-center gap-3">
      <span
        className="w-9 h-9 rounded-[10px] grid place-items-center"
        style={
          tone === "amber"
            ? { background: "color-mix(in srgb, var(--amber) 15%, transparent)", color: "var(--amber)" }
            : { background: "var(--accent-soft)", color: "var(--accent)" }
        }
      >
        {icon}
      </span>
      <div>
        <div className="text-[20px] font-bold leading-none">{value}</div>
        <div className="text-[12px] text-[var(--text-3)] mt-1">{label}</div>
      </div>
    </div>
  );
}
