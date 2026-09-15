"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { Avatar } from "./ui";
import {
  IconHome,
  IconSearch,
  IconSparkle,
  IconPlaylist,
  IconBriefcase,
  IconLogo,
  IconSettings,
  IconMenu,
  IconClose,
  IconCommand,
} from "./icons";

const NAV = [
  { href: "/library", label: "Home", icon: IconHome, exact: true },
  { href: "/search", label: "Search", icon: IconSearch },
  { href: "/ask", label: "Ask Fathom", icon: IconSparkle },
  { href: "/deals", label: "Deals", icon: IconBriefcase },
  { href: "/playlists", label: "Playlists", icon: IconPlaylist },
];

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser, meetings, reset } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  const openPalette = () => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 h-14 bg-[var(--surface)] border-b border-[var(--border)]">
        <button onClick={() => setMobileOpen(true)} className="text-[var(--text-2)]" aria-label="Open menu">
          <IconMenu width={22} height={22} />
        </button>
        <Link href="/" className="flex items-center gap-2">
          <IconLogo />
          <span className="font-bold text-[16px]">Fathom</span>
        </Link>
        <button onClick={openPalette} className="ml-auto text-[var(--text-2)]" aria-label="Search">
          <IconSearch width={19} height={19} />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`w-[248px] shrink-0 h-screen md:sticky top-0 flex flex-col bg-[var(--surface)] border-r border-[var(--border)] fixed z-50 transition-transform md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="px-5 pt-5 pb-4 flex items-center gap-2.5">
          <Link href="/" className="flex items-center gap-2.5 min-w-0">
            <IconLogo />
            <span className="font-bold text-[17px] tracking-tight">Fathom</span>
          </Link>
          <span className="chip ml-auto !text-[10px] !py-0.5 shrink-0">rebuild</span>
          <button onClick={() => setMobileOpen(false)} className="md:hidden text-[var(--text-3)] shrink-0">
            <IconClose width={16} height={16} />
          </button>
        </div>

        <div className="px-3">
          <button
            onClick={openPalette}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-[13px] text-[var(--text-3)] bg-[var(--surface-2)] hover:text-[var(--text)] transition-colors"
          >
            <IconSearch width={15} height={15} />
            <span className="flex-1 text-left">Jump to...</span>
            <kbd className="hidden md:inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)]">
              <IconCommand width={9} height={9} />K
            </kbd>
          </button>
        </div>

        <nav className="px-3 mt-2 flex flex-col gap-0.5">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-[10px] text-[14px] font-medium transition-colors"
                style={
                  active
                    ? { background: "var(--accent-soft)", color: "var(--accent)" }
                    : { color: "var(--text-2)" }
                }
              >
                <Icon width={19} height={19} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 mt-3">
          <Link href="/record" onClick={() => setMobileOpen(false)} className="btn btn-primary w-full justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-white/90" /> New recording
          </Link>
        </div>

        <div className="px-5 mt-6 mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-3)]">
          Library
        </div>
        <div className="px-3 flex-1 overflow-y-auto scroll-thin flex flex-col gap-0.5">
          {meetings.map((m) => (
            <Link
              key={m.id}
              href={`/meeting/${m.id}`}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-[9px] text-[13px] transition-colors hover:bg-[var(--surface-2)]"
              style={
                isActive(`/meeting/${m.id}`)
                  ? { background: "var(--surface-2)", color: "var(--text)" }
                  : { color: "var(--text-2)" }
              }
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: `hsl(${m.thumbnailHue} 65% 58%)` }}
              />
              <span className="truncate">{m.title}</span>
            </Link>
          ))}
        </div>

        <div className="p-3 border-t border-[var(--border)] flex items-center gap-2.5">
          <Avatar name={currentUser.name} color={currentUser.avatarColor} size={30} />
          <div className="min-w-0">
            <div className="text-[13px] font-semibold truncate">{currentUser.name}</div>
            <div className="text-[11px] text-[var(--text-3)] truncate">Free plan</div>
          </div>
          <Link
            href="/settings"
            onClick={() => setMobileOpen(false)}
            title="Settings"
            className="ml-auto text-[var(--text-3)] hover:text-[var(--text)] transition-colors"
            style={isActive("/settings") ? { color: "var(--accent)" } : undefined}
          >
            <IconSettings width={17} height={17} />
          </Link>
          <button
            onClick={reset}
            title="Reset demo data"
            className="text-[11px] text-[var(--text-3)] hover:text-[var(--text)] transition-colors"
          >
            reset
          </button>
        </div>
      </aside>
    </>
  );
}
