import { useMemo } from "react";
import Link from "next/link";
import type { Meeting } from "@/lib/types";
import { fmtDuration, fmtRelative, fmtTime } from "@/lib/format";
import { useStore } from "@/lib/store";
import { AvatarStack, PlatformBadge, Tag, Thumbnail } from "./ui";
import { IconCheck, IconStar, IconAlert } from "./icons";

export function MeetingCard({ m }: { m: Meeting }) {
  const openItems = m.actionItems.filter((a) => !a.done).length;
  const { keywordAlerts } = useStore();
  const matchedAlert = useMemo(() => {
    if (keywordAlerts.length === 0) return null;
    const haystack = m.transcript.map((c) => c.text.toLowerCase());
    return keywordAlerts.find((k) => haystack.some((t) => t.includes(k))) ?? null;
  }, [keywordAlerts, m.transcript]);

  return (
    <Link
      href={`/meeting/${m.id}`}
      className="card p-3 flex gap-4 hover:shadow-[var(--shadow-md)] transition-shadow group"
    >
      <Thumbnail
        hue={m.thumbnailHue}
        duration={fmtDuration(m.durationS)}
        platform={m.platform}
        className="w-[168px] h-[104px] shrink-0"
      />
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start gap-2">
          <h3 className="font-semibold text-[15px] leading-snug group-hover:text-[var(--accent)] transition-colors truncate">
            {m.title}
          </h3>
          {m.isTeamShared && <span className="chip shrink-0">Team</span>}
          {matchedAlert && (
            <span
              className="chip shrink-0 inline-flex items-center gap-1 !text-[var(--amber)]"
              title={`Keyword alert: "${matchedAlert}" was mentioned`}
            >
              <IconAlert width={11} height={11} /> {matchedAlert}
            </span>
          )}
        </div>
        <div className="mt-1 flex items-center gap-2.5 text-[12.5px] text-[var(--text-3)]">
          <span>{fmtRelative(m.startedAt)}</span>
          <span>·</span>
          <span>{fmtTime(m.startedAt)}</span>
          <PlatformBadge platform={m.platform} />
        </div>
        <p className="mt-1.5 text-[13px] text-[var(--text-2)] line-clamp-2">{m.recap}</p>
        <div className="mt-auto pt-2 flex items-center gap-3">
          <AvatarStack attendees={m.attendees} />
          <div className="ml-auto flex items-center gap-3 text-[12px] text-[var(--text-3)]">
            {m.highlights.length > 0 && (
              <span className="inline-flex items-center gap-1">
                <IconStar width={14} height={14} /> {m.highlights.length}
              </span>
            )}
            {openItems > 0 && (
              <span className="inline-flex items-center gap-1">
                <IconCheck width={14} height={14} /> {openItems} open
              </span>
            )}
            {m.tags[0] && <Tag>{m.tags[0]}</Tag>}
          </div>
        </div>
      </div>
    </Link>
  );
}
