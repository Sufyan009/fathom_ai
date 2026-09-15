"use client";

import { useState } from "react";
import Link from "next/link";
import type { Deal } from "@/lib/deals";
import { OPEN_STAGE_FLOW, STAGES } from "@/lib/deals";
import { useStore } from "@/lib/store";
import { fmtUsd, fmtDaysAgo, fmtDate } from "@/lib/format";
import { Avatar } from "../ui";
import { IconClose, IconPlay, IconRefresh, IconCheck, IconAlert, IconGauge, IconRadar, IconEdit } from "../icons";

const CRM_LABEL: Record<NonNullable<Deal["crmSystem"]>, string> = {
  salesforce: "Salesforce",
  hubspot: "HubSpot",
};

// Deterministic per-deal scorecard numbers (no backend to compute a real one
// from) so the same deal always shows the same score within a session.
function scorecardFor(dealId: string) {
  let seed = 0;
  for (const c of dealId) seed = (seed * 31 + c.charCodeAt(0)) % 1000;
  const pick = (base: number, spread: number) => base + (seed % spread);
  return [
    { label: "Talk/listen ratio", value: pick(48, 30), color: "#00beff" },
    { label: "Questions asked", value: pick(55, 35), color: "#9600ff" },
    { label: "Next steps confirmed", value: pick(60, 38), color: "#ff9fc7" },
  ];
}

export function DealDrawer({ deal, onClose }: { deal: Deal; onClose: () => void }) {
  const { getMeeting, setDealStage, syncDeal, dealSyncedAt, dealNextSteps, setDealNextStep, dealNotes, addDealNote, currentUser } = useStore();
  const [justSynced, setJustSynced] = useState(false);
  const [editingNextStep, setEditingNextStep] = useState(false);
  const [nextStepDraft, setNextStepDraft] = useState("");
  const [noteDraft, setNoteDraft] = useState("");

  const isClosed = deal.stage === "closed_won" || deal.stage === "closed_lost";
  const flowIndex = OPEN_STAGE_FLOW.indexOf(deal.stage as (typeof OPEN_STAGE_FLOW)[number]);
  const stageIndex = flowIndex === -1 ? OPEN_STAGE_FLOW.length - 1 : flowIndex; // closed_lost renders as fully-lit but red
  const stageLabel = STAGES.find((s) => s.id === deal.stage)!.label;
  const meetings = deal.meetingIds.map((id) => getMeeting(id)).filter(Boolean) as NonNullable<ReturnType<typeof getMeeting>>[];
  const syncedAt = dealSyncedAt[deal.id];
  const nextStep = dealNextSteps[deal.id] ?? deal.nextStep;
  const notes = dealNotes[deal.id] ?? [];

  const advance = () => {
    const next = OPEN_STAGE_FLOW[flowIndex + 1];
    if (next) setDealStage(deal.id, next);
  };

  const markLost = () => setDealStage(deal.id, "closed_lost");

  const handleSync = () => {
    syncDeal(deal.id);
    setJustSynced(true);
    setTimeout(() => setJustSynced(false), 1800);
  };

  const saveNextStep = () => {
    if (nextStepDraft.trim()) setDealNextStep(deal.id, nextStepDraft.trim());
    setEditingNextStep(false);
  };

  const submitNote = (e: React.FormEvent) => {
    e.preventDefault();
    addDealNote(deal.id, noteDraft);
    setNoteDraft("");
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
              <div className="flex items-center gap-3">
                {!isClosed && flowIndex < OPEN_STAGE_FLOW.length - 1 && (
                  <button onClick={advance} className="text-[var(--accent)] normal-case font-semibold hover:underline">
                    Advance stage →
                  </button>
                )}
                {!isClosed && (
                  <button onClick={markLost} className="text-[var(--red)] normal-case font-semibold hover:underline">
                    Mark as lost
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {OPEN_STAGE_FLOW.map((s, i) => (
                <div
                  key={s}
                  className="flex-1 h-1.5 rounded-full"
                  style={{ background: i <= stageIndex ? (deal.stage === "closed_lost" ? "var(--red)" : "var(--accent)") : "var(--surface-2)" }}
                  title={STAGES.find((st) => st.id === s)!.label}
                />
              ))}
            </div>
            <p className="text-[13px] font-semibold mt-2" style={deal.stage === "closed_lost" ? { color: "var(--red)" } : undefined}>
              {stageLabel}
            </p>
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

          {/* Next step — editable */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-3)]">Next step</p>
              {!editingNextStep && (
                <button
                  onClick={() => { setNextStepDraft(nextStep); setEditingNextStep(true); }}
                  className="text-[var(--text-3)] hover:text-[var(--accent)]"
                  title="Edit next step"
                >
                  <IconEdit width={12} height={12} />
                </button>
              )}
            </div>
            {editingNextStep ? (
              <div className="flex gap-2">
                <input
                  autoFocus
                  value={nextStepDraft}
                  onChange={(e) => setNextStepDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") saveNextStep(); if (e.key === "Escape") setEditingNextStep(false); }}
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-[var(--surface-2)] text-[13.5px] outline-none focus:ring-2 focus:ring-[var(--accent-soft)]"
                />
                <button onClick={saveNextStep} className="btn btn-primary !py-1.5 !text-[12px]">Save</button>
              </div>
            ) : (
              <p className="text-[13.5px]">{nextStep}</p>
            )}
          </div>

          {/* Activity / notes */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-3)] mb-1.5">
              Activity ({notes.length})
            </p>
            {notes.length > 0 && (
              <div className="space-y-2.5 mb-2.5">
                {notes.map((n) => (
                  <div key={n.id} className="text-[13px]">
                    <p>{n.text}</p>
                    <p className="text-[11px] text-[var(--text-3)] mt-0.5">{n.author} · {fmtDaysAgo(n.at)}</p>
                  </div>
                ))}
              </div>
            )}
            <form onSubmit={submitNote} className="flex gap-2">
              <input
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder={`Log a note as ${currentUser.name.split(" ")[0]}...`}
                className="flex-1 px-2.5 py-1.5 rounded-lg bg-[var(--surface-2)] text-[13px] outline-none focus:ring-2 focus:ring-[var(--accent-soft)]"
              />
              <button type="submit" className="btn btn-soft !py-1.5 !text-[12px]" disabled={!noteDraft.trim()}>Add</button>
            </form>
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

          {/* AI Scorecard — only meaningful once there's a call to score */}
          {meetings.length > 0 && (
            <div className="card p-3.5">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg grid place-items-center" style={{ background: "var(--accent-gradient)" }}>
                  <IconGauge width={14} height={14} className="text-white" />
                </span>
                <p className="text-[12.5px] font-semibold">AI coaching scorecard</p>
              </div>
              <div className="mt-3 space-y-3">
                {scorecardFor(deal.id).map((m) => (
                  <div key={m.label}>
                    <div className="flex items-center justify-between text-[11.5px] mb-1">
                      <span className="text-[var(--text-3)]">{m.label}</span>
                      <span className="font-semibold">{m.value}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--surface-2)] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${m.value}%`, background: m.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-start gap-2">
                <IconRadar width={13} height={13} className="mt-0.5 shrink-0 text-[var(--text-3)]" />
                <p className="text-[11.5px] text-[var(--text-3)] leading-relaxed">
                  Generated from {meetings.length} linked call{meetings.length !== 1 ? "s" : ""}. Flagged for the team playbook.
                </p>
              </div>
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
