import type { Meeting, Summary } from "./types";
import { fmtDate } from "./format";

// Fathom's signature "instant follow-up email" feature — drafts a send-ready
// recap from the summary + action items so the organizer doesn't retype it.
export function buildFollowUpEmail(meeting: Meeting, summary: Summary): string {
  const attendeeNames = meeting.attendees.map((a) => a.name.split(" ")[0]).join(", ");
  const lines: string[] = [];

  lines.push(`Subject: Recap — ${meeting.title} (${fmtDate(meeting.startedAt)})`);
  lines.push("");
  lines.push(`Hi ${attendeeNames},`);
  lines.push("");
  lines.push(`Thanks for the time today. Here's a quick recap of ${meeting.title.toLowerCase()}:`);
  lines.push("");

  for (const section of summary.sections) {
    if (section.bullets.length === 0) continue;
    lines.push(`${section.heading}:`);
    for (const b of section.bullets) lines.push(`- ${b}`);
    lines.push("");
  }

  const openItems = meeting.actionItems.filter((a) => !a.done);
  if (openItems.length > 0) {
    lines.push("Action items:");
    for (const a of openItems) lines.push(`- [ ] ${a.text}${a.assignee ? ` (${a.assignee})` : ""}`);
    lines.push("");
  }

  lines.push("Let me know if I missed anything.");
  lines.push("");
  lines.push("Best,");
  lines.push(meeting.attendees.find((a) => a.isHost)?.name.split(" ")[0] ?? "");

  return lines.join("\n");
}

export function summaryToPlainText(meeting: Meeting, summary: Summary): string {
  const lines: string[] = [`${meeting.title} — ${fmtDate(meeting.startedAt)}`, ""];
  for (const section of summary.sections) {
    if (section.bullets.length === 0) continue;
    lines.push(section.heading);
    for (const b of section.bullets) lines.push(`- ${b}`);
    lines.push("");
  }
  return lines.join("\n").trim();
}

export function transcriptToPlainText(meeting: Meeting): string {
  const lines = [`${meeting.title} — ${fmtDate(meeting.startedAt)}`, ""];
  for (const c of meeting.transcript) {
    lines.push(`[${msToClock(c.startMs)}] ${c.speaker}: ${c.text}`);
  }
  return lines.join("\n");
}

function msToClock(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
}

export function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
