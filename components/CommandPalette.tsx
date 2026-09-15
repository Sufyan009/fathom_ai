"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import {
  IconHome,
  IconSearch,
  IconSparkle,
  IconPlaylist,
  IconBriefcase,
  IconSettings,
  IconCommand,
} from "./icons";

interface Item {
  id: string;
  label: string;
  hint?: string;
  icon: typeof IconHome;
  go: () => void;
}

export function CommandPalette() {
  const router = useRouter();
  const { meetings } = useStore();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => {
          if (v) return false;
          setQuery("");
          setIndex(0);
          setTimeout(() => inputRef.current?.focus(), 10);
          return true;
        });
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const staticItems: Item[] = useMemo(
    () => [
      { id: "library", label: "Go to Library", icon: IconHome, go: () => router.push("/library") },
      { id: "search", label: "Search meetings", icon: IconSearch, go: () => router.push("/search") },
      { id: "ask", label: "Ask Fathom", icon: IconSparkle, go: () => router.push("/ask") },
      { id: "deals", label: "Go to Deals", icon: IconBriefcase, go: () => router.push("/deals") },
      { id: "playlists", label: "Go to Playlists", icon: IconPlaylist, go: () => router.push("/playlists") },
      { id: "settings", label: "Open Settings", icon: IconSettings, go: () => router.push("/settings") },
    ],
    [router],
  );

  const meetingItems: Item[] = useMemo(
    () =>
      meetings.map((m) => ({
        id: m.id,
        label: m.title,
        hint: "Meeting",
        icon: IconHome,
        go: () => router.push(`/meeting/${m.id}`),
      })),
    [meetings, router],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const all = [...staticItems, ...meetingItems];
    if (!q) return staticItems.concat(meetingItems.slice(0, 5));
    return all.filter((i) => i.label.toLowerCase().includes(q)).slice(0, 8);
  }, [query, staticItems, meetingItems]);

  const select = (item: Item) => {
    item.go();
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[14vh] px-4" onClick={() => setOpen(false)}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div
        className="relative w-full max-w-[560px] rounded-2xl bg-[var(--surface)] shadow-[var(--shadow-lg)] border border-[var(--border)] overflow-hidden animate-in"
        style={{ animationDuration: "0.15s" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[var(--border)]">
          <IconSearch width={17} height={17} className="text-[var(--text-3)] shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setIndex(0); }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setIndex((i) => Math.min(i + 1, results.length - 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setIndex((i) => Math.max(i - 1, 0)); }
              if (e.key === "Enter" && results[index]) select(results[index]);
            }}
            placeholder="Jump to a meeting or a page..."
            className="flex-1 bg-transparent text-[14.5px] outline-none"
          />
          <kbd className="text-[10.5px] font-semibold px-1.5 py-0.5 rounded bg-[var(--surface-2)] text-[var(--text-3)]">esc</kbd>
        </div>
        <div className="max-h-[360px] overflow-y-auto scroll-thin p-1.5">
          {results.length === 0 && (
            <div className="py-8 text-center text-[13px] text-[var(--text-3)]">No matches.</div>
          )}
          {results.map((item, i) => (
            <button
              key={item.id}
              onMouseEnter={() => setIndex(i)}
              onClick={() => select(item)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors"
              style={i === index ? { background: "var(--accent-soft)" } : undefined}
            >
              <span
                className="w-7 h-7 rounded-lg grid place-items-center shrink-0"
                style={i === index ? { background: "var(--accent)", color: "#fff" } : { background: "var(--surface-2)", color: "var(--text-3)" }}
              >
                <item.icon width={14} height={14} />
              </span>
              <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium">{item.label}</span>
              {item.hint && <span className="text-[11px] text-[var(--text-3)] shrink-0">{item.hint}</span>}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 px-4 py-2.5 border-t border-[var(--border)] text-[11px] text-[var(--text-3)]">
          <span className="inline-flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-[var(--surface-2)]">↑</kbd><kbd className="px-1.5 py-0.5 rounded bg-[var(--surface-2)]">↓</kbd> navigate</span>
          <span className="inline-flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-[var(--surface-2)]">↵</kbd> select</span>
          <span className="inline-flex items-center gap-1 ml-auto"><IconCommand width={11} height={11} />K to toggle</span>
        </div>
      </div>
    </div>
  );
}
