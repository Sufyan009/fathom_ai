import type { Deal } from "@/lib/deals";
import { fmtUsd, fmtDaysAgo } from "@/lib/format";
import { IconPlay, IconAlert } from "../icons";

const HEALTH_COLOR: Record<Deal["health"], string> = {
  green: "var(--green)",
  yellow: "var(--amber)",
  red: "var(--red)",
};

export function DealCard({ deal, onOpen }: { deal: Deal; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="w-full text-left card p-3.5 hover:border-[var(--accent)] transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-semibold text-[13.5px] leading-snug">{deal.company}</h4>
        <span
          className="w-2 h-2 rounded-full mt-1.5 shrink-0"
          style={{ background: HEALTH_COLOR[deal.health] }}
          title={`${deal.health} health`}
        />
      </div>
      <p className="text-[12px] text-[var(--text-3)] mt-0.5 truncate">{deal.contactName}</p>
      <div className="mt-2.5 flex items-center justify-between">
        <span className="text-[14px] font-bold tabular-nums">{fmtUsd(deal.valueUsd)}</span>
        <span className="text-[10.5px] text-[var(--text-3)]">{fmtDaysAgo(deal.lastActivityAt)}</span>
      </div>
      <div className="mt-2 flex items-center gap-2 text-[11px] text-[var(--text-3)]">
        {deal.meetingIds.length > 0 ? (
          <span className="inline-flex items-center gap-1">
            <IconPlay width={10} height={10} /> {deal.meetingIds.length} call{deal.meetingIds.length !== 1 ? "s" : ""}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[var(--amber)]">
            <IconAlert width={10} height={10} /> No call yet
          </span>
        )}
        <span className="chip !text-[10px] !py-0.5 ml-auto">{deal.owner.split(" ")[0]}</span>
      </div>
    </button>
  );
}
