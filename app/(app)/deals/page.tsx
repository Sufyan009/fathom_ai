"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DEALS, STAGES, dealsByStage, type Deal } from "@/lib/deals";
import { fmtUsd } from "@/lib/format";
import { useStore } from "@/lib/store";
import { DealCard } from "@/components/deals/DealCard";
import { DealDrawer } from "@/components/deals/DealDrawer";
import { IconBriefcase, IconTrendUp, IconCheck, IconShield } from "@/components/icons";

export default function DealsPage() {
  return (
    <Suspense fallback={null}>
      <DealsPageInner />
    </Suspense>
  );
}

function DealsPageInner() {
  const { dealStages } = useStore();
  const searchParams = useSearchParams();
  const [openDealId, setOpenDealId] = useState<string | null>(searchParams.get("deal"));

  const deals = useMemo<Deal[]>(
    () => DEALS.map((d) => (dealStages[d.id] ? { ...d, stage: dealStages[d.id] } : d)),
    [dealStages],
  );

  const columns = useMemo(() => dealsByStage(deals), [deals]);
  const openDeal = deals.find((d) => d.id === openDealId) ?? null;

  const openValue = deals.filter((d) => d.stage !== "closed_won").reduce((s, d) => s + d.valueUsd, 0);
  const wonValue = deals.filter((d) => d.stage === "closed_won").reduce((s, d) => s + d.valueUsd, 0);
  const needsAttention = deals.filter((d) => d.health !== "green" && d.stage !== "closed_won").length;

  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto">
      <header>
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
    </div>
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
