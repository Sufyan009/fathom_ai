"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { usePlayer } from "@/lib/usePlayer";
import { useNarration } from "@/lib/useNarration";
import { fmtDate, fmtDuration, fmtTime } from "@/lib/format";
import { downloadTextFile, transcriptToPlainText } from "@/lib/followup";
import { findDealByMeeting } from "@/lib/deals";
import { fmtUsd } from "@/lib/format";
import { PlayerView } from "./meeting/Player";
import { Transcript } from "./meeting/Transcript";
import { RightPanel } from "./meeting/RightPanel";
import { ShareModal } from "./meeting/ShareModal";
import { AvatarStack, PlatformBadge } from "./ui";
import { IconChevron, IconShare, IconEdit, IconDownload, IconBriefcase } from "./icons";

export function MeetingDetail({ id }: { id: string }) {
  const { getMeeting, addHighlight: addHighlightToStore, renameMeeting, hydrated } = useStore();
  const meeting = getMeeting(id);
  const durationMs = (meeting?.durationS ?? 0) * 1000;
  const player = usePlayer(durationMs);
  const [shareOpen, setShareOpen] = useState(false);
  const [audioOn, setAudioOn] = useState(true);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");

  const currentCue = useMemo(
    () => meeting?.transcript.find((c) => player.currentMs >= c.startMs && player.currentMs < c.endMs),
    [meeting, player.currentMs],
  );

  useNarration({
    enabled: audioOn,
    playing: player.playing,
    currentCue,
    attendees: meeting?.attendees ?? [],
    rate: player.rate,
  });

  if (!meeting) {
    if (!hydrated) {
      return <div className="p-10 text-center text-[var(--text-3)]">Loading meeting…</div>;
    }
    return (
      <div className="p-10 text-center text-[var(--text-3)]">
        Meeting not found.{" "}
        <Link href="/library" className="text-[var(--accent)]">Back to library</Link>
      </div>
    );
  }

  const deal = findDealByMeeting(meeting.id);

  const addHighlight = () => {
    const cue = currentCue ?? meeting.transcript[0];
    if (!cue) return;
    const words = cue.text.split(/\s+/).slice(0, 7).join(" ");
    player.pause();
    // gather cues within the same ~15s window for a tighter clip
    const windowCues = meeting.transcript.filter(
      (c) => c.startMs >= cue.startMs && c.startMs < cue.startMs + 15000,
    );
    addHighlightToStore(meeting.id, {
      startMs: cue.startMs,
      endMs: windowCues[windowCues.length - 1]?.endMs ?? cue.endMs,
      label: `${cue.speaker}: ${words}${cue.text.split(/\s+/).length > 7 ? "…" : ""}`,
      cueIds: windowCues.map((c) => c.id),
    });
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="px-6 py-3.5 border-b border-[var(--border)] flex items-center gap-4 bg-[var(--surface)]">
        <Link href="/library" className="btn btn-ghost !px-2 -ml-2 rotate-180" title="Back">
          <IconChevron />
        </Link>
        <div className="min-w-0 flex-1">
          {editingTitle ? (
            <input
              autoFocus
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={() => {
                if (titleDraft.trim()) renameMeeting(meeting.id, titleDraft.trim());
                setEditingTitle(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
                if (e.key === "Escape") setEditingTitle(false);
              }}
              className="font-bold text-[16px] leading-tight bg-[var(--surface-2)] rounded-md px-1.5 -mx-1.5 outline-none w-full"
            />
          ) : (
            <button
              onClick={() => { setTitleDraft(meeting.title); setEditingTitle(true); }}
              className="group/title flex items-center gap-1.5 max-w-full"
              title="Rename meeting"
            >
              <h1 className="font-bold text-[16px] truncate leading-tight">{meeting.title}</h1>
              <IconEdit width={13} height={13} className="shrink-0 text-[var(--text-3)] opacity-0 group-hover/title:opacity-100 transition-opacity" />
            </button>
          )}
          <div className="flex items-center gap-2.5 text-[12px] text-[var(--text-3)] mt-0.5">
            <span>{fmtDate(meeting.startedAt)}</span>
            <span>·</span>
            <span>{fmtTime(meeting.startedAt)}</span>
            <span>·</span>
            <span>{fmtDuration(meeting.durationS)}</span>
            <PlatformBadge platform={meeting.platform} />
            {deal && (
              <Link
                href={`/deals?deal=${deal.id}`}
                className="inline-flex items-center gap-1 chip hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] transition-colors"
              >
                <IconBriefcase width={11} height={11} /> {deal.company} · {fmtUsd(deal.valueUsd)}
              </Link>
            )}
          </div>
        </div>
        <AvatarStack attendees={meeting.attendees} max={5} />
        <button
          onClick={() => downloadTextFile(`${meeting.title.replace(/[^\w\- ]/g, "")}.txt`, transcriptToPlainText(meeting))}
          className="btn btn-ghost"
          title="Download transcript as .txt"
        >
          <IconDownload width={16} height={16} /> Transcript
        </button>
        <button onClick={() => setShareOpen(true)} className="btn btn-primary">
          <IconShare width={16} height={16} /> Share
        </button>
      </header>

      {/* Body */}
      <div className="flex-1 min-h-0 grid grid-cols-[1fr_400px] gap-4 p-4">
        <div className="flex flex-col gap-4 min-h-0">
          <div className="shrink-0">
          <PlayerView
            player={player}
            durationMs={durationMs}
            hue={meeting.thumbnailHue}
            attendees={meeting.attendees}
            currentCue={currentCue}
            highlights={meeting.highlights}
            onAddHighlight={addHighlight}
            audioOn={audioOn}
            onToggleAudio={() => setAudioOn((v) => !v)}
          />
          </div>
          <div className="flex-1 min-h-0">
            <Transcript
              cues={meeting.transcript}
              attendees={meeting.attendees}
              currentMs={player.currentMs}
              onSeek={player.seek}
              highlights={meeting.highlights}
            />
          </div>
        </div>

        <RightPanel meeting={meeting} currentMs={player.currentMs} onSeek={player.seek} />
      </div>

      {shareOpen && <ShareModal meeting={meeting} onClose={() => setShareOpen(false)} />}
    </div>
  );
}
