"use client";

import { useState } from "react";
import Link from "next/link";
import type { Deal } from "@/lib/deals";
import { STAGES } from "@/lib/deals";
import { useStore } from "@/lib/store";
import { fmtUsd, fmtDaysAgo, fmtDate } from "@/lib/format";
import { Avatar } from "../ui";
import { IconClose, IconPlay, IconRefresh, IconCheck, IconAlert } from "../icons";

const CRM_LABEL: Record<NonNullable<Deal["crmSystem"]>, string> = {
  salesforce: "Salesforce",
  hubspot: "HubSpot",
};

export function DealDrawer({ deal, onClose }: { deal: Deal; onClose: () => void }) {
  const { getMeeting, setDealStage, syncDeal, dealSyncedAt } = useStore();
  const [justSynced, setJustSynced] = useState(false);
  const stageIndex = STAGES.findIndex((s) => s.id === deal.stage);
  const meetings = deal.meetingIds.map((id) => getMeeting(id)).filter(Boolean) as NonNullable<ReturnType<typeof getMeeting>>[];
  const syncedAt = dealSyncedAt[deal.id];

  const advance = () => {
    const next = STAGES[stageIndex + 1];
    if (next) setDealStage(deal.id, next.id);
  };

  const handleSync = () => {
    syncDeal(deal.id);
    setJustSynced(true);
    setTimeout(() => setJustSynced(false), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
      <div
        className="relative w-full max-w-[420px] h-full bg-[var(--surface)] shadow-2xl flex flex-col animate-in"
        style={{ animationDuration: "0.25s" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-[var(--border)] flex items-start justify-between">
          <div>
            <h2 className="font-bold text-[18px]">{deal.company}</h2>
            <p className="text-[13px] text-[var(--text-2)] mt-0.5">{deal.contactName} · {deal.contactEmail}</p>
          </div>
          <button onClick={onClose} className="text-[var(--text-3)] hover:text-[var(--text)]">
            <IconClose />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scroll-thin p-5 space-y-5">
          {/* Stage progress */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[var(--text-3)] mb-2">
              <span>Pipeline stage</span>
              {stageIndex < STAGES.length - 1 && (
                <button onClick={advance} className="text-[var(--accent)] normal-case font-semibold hover:underline">
                  Advance stage →
                </button>
              )}
            </div>
            <div className="flex items-center gap-1">
              {STAGES.map((s, i) => (
                <div
                  key={s.id}
                  className="flex-1 h-1.5 rounded-full"
                  style={{ background: i <= stageIndex ? "var(--accent)" : "var(--surface-2)" }}
                  title={s.label}
                />
              ))}
            </div>
            <p className="text-[13px] font-semibold mt-2">{STAGES[stageIndex].label}</p>
          </div>

          {/* Deal value + owner */}
          <div className="grid grid-cols-2 gap-3">
            <div className="card p-3">
              <p className="text-[11px] text-[var(--text-3)]">Deal value</p>
              <p className="text-[18px] font-bold mt-0.5">{fmtUsd(deal.valueUsd)}</p>
            </div>
            <div className="card p-3">
              <p className="text-[11px] text-[var(--text-3)]">Owner</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Avatar name={deal.owner} color="#574bd6" size={18} />
                <span className="text-[13px] font-medium truncate">{deal.owner}</span>
              </div>
            </div>
          </div>

          {/* Next step */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-3)] mb-1.5">Next step</p>
            <p className="text-[13.5px]">{deal.nextStep}</p>
          </div>

          {/* CRM sync */}
          {deal.crmSystem && (
            <div className="card p-3.5">
              <div className="flex items-center justify-between">
                <p className="text-[12.5px] font-semibold">Synced to {CRM_LABEL[deal.crmSystem]}</p>
                <button onClick={handleSync} className="btn btn-soft !py-1 !text-[11.5px]">
                  <IconRefresh width={12} height={12} /> {justSynced ? "Synced!" : "Sync now"}
                </button>
              </div>
              <p className="text-[11.5px] text-[var(--text-3)] mt-1">
                {syncedAt ? `Last synced ${fmtDaysAgo(syncedAt)}` : "Not synced this session"} · Amount, Stage, Next Step, Contact
              </p>
            </div>
          )}

          {/* Linked calls */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-3)] mb-1.5">
              Linked calls ({meetings.length})
            </p>
            {meetings.length === 0 && (
              <div className="flex items-center gap-2 text-[12.5px] text-[var(--amber)] card p-3">
                <IconAlert width={13} height={13} /> No call recorded against this deal yet.
              </div>
            )}
            <div className="space-y-2">
              {meetings.map((m) => (
                <Link
                  key={m.id}
                  href={`/meeting/${m.id}`}
                  className="block card p-3 hover:border-[var(--accent)] transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-medium truncate">{m.title}</span>
                    <IconPlay width={12} height={12} className="text-[var(--accent)] shrink-0" />
                  </div>
                  <p className="text-[11.5px] text-[var(--text-3)] mt-0.5">{fmtDate(m.startedAt)}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[var(--border)]">
          <button onClick={onClose} className="btn btn-soft w-full justify-center">
            <IconCheck width={14} height={14} /> Done
          </button>
        </div>
      </div>
    </div>
  );
}
