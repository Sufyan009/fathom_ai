"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Avatar } from "@/components/ui";
import {
  IconUser,
  IconBell,
  IconAlert,
  IconClose,
  IconCalendar,
  IconCheck,
  IconShield,
} from "@/components/icons";

const NOTIFICATION_DEFAULTS = {
  keywordEmail: true,
  weeklyDigest: true,
  dealActivity: false,
};

export default function SettingsPage() {
  const { currentUser, keywordAlerts, addKeywordAlert, removeKeywordAlert, reset } = useStore();
  const [keywordInput, setKeywordInput] = useState("");
  const [notifications, setNotifications] = useState(NOTIFICATION_DEFAULTS);
  const [confirmReset, setConfirmReset] = useState(false);

  const toggleNotification = (key: keyof typeof NOTIFICATION_DEFAULTS) =>
    setNotifications((n) => ({ ...n, [key]: !n[key] }));

  return (
    <div className="max-w-[720px] mx-auto px-6 md:px-8 py-8">
      <h1 className="text-[26px] font-bold tracking-tight">Settings</h1>
      <p className="text-[14px] text-[var(--text-2)] mt-0.5">
        Account, alerts, notifications and connected calendars.
      </p>

      {/* Profile */}
      <section className="card p-5 mt-6">
        <SectionHeader icon={IconUser} title="Profile" />
        <div className="mt-4 flex items-center gap-4">
          <Avatar name={currentUser.name} color={currentUser.avatarColor} size={52} />
          <div>
            <p className="font-semibold text-[15px]">{currentUser.name}</p>
            <p className="text-[13px] text-[var(--text-2)]">{currentUser.email}</p>
            <span className="chip mt-1.5 inline-block">Free plan</span>
          </div>
        </div>
      </section>

      {/* Keyword alerts */}
      <section className="card p-5 mt-4">
        <SectionHeader icon={IconAlert} title="Keyword alerts" />
        <p className="text-[13px] text-[var(--text-2)] mt-1">
          Flag meetings that mention a watched term, like a competitor name or &ldquo;pricing&rdquo;.
        </p>
        <form
          onSubmit={(e) => { e.preventDefault(); addKeywordAlert(keywordInput); setKeywordInput(""); }}
          className="mt-3 flex gap-2"
        >
          <input
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            placeholder="Add a keyword..."
            className="flex-1 px-3 py-2 rounded-lg bg-[var(--surface-2)] text-[13.5px] outline-none focus:ring-2 focus:ring-[var(--accent-soft)]"
          />
          <button type="submit" className="btn btn-primary">Add</button>
        </form>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {keywordAlerts.map((k) => (
            <span key={k} className="chip">
              {k}
              <button onClick={() => removeKeywordAlert(k)} className="text-[var(--text-3)] hover:text-[var(--red)]">
                <IconClose width={10} height={10} />
              </button>
            </span>
          ))}
          {keywordAlerts.length === 0 && (
            <span className="text-[12.5px] text-[var(--text-3)]">No keywords yet.</span>
          )}
        </div>
      </section>

      {/* Notifications */}
      <section className="card p-5 mt-4">
        <SectionHeader icon={IconBell} title="Notifications" />
        <div className="mt-3 divide-y divide-[var(--border)]">
          <ToggleRow
            label="Keyword alert emails"
            body="Get an email when a watched keyword is mentioned in a call."
            checked={notifications.keywordEmail}
            onToggle={() => toggleNotification("keywordEmail")}
          />
          <ToggleRow
            label="Weekly digest"
            body="A Monday recap of last week's meetings and open action items."
            checked={notifications.weeklyDigest}
            onToggle={() => toggleNotification("weeklyDigest")}
          />
          <ToggleRow
            label="Deal activity"
            body="Notify when a deal you own changes stage."
            checked={notifications.dealActivity}
            onToggle={() => toggleNotification("dealActivity")}
          />
        </div>
      </section>

      {/* Connected calendar */}
      <section className="card p-5 mt-4">
        <SectionHeader icon={IconCalendar} title="Calendar" />
        <div className="mt-3 flex items-center gap-3">
          <span className="w-9 h-9 rounded-lg bg-[var(--surface-2)] grid place-items-center text-[var(--green)]">
            <IconCheck width={16} height={16} />
          </span>
          <div className="min-w-0">
            <p className="text-[13.5px] font-semibold">Google Calendar connected</p>
            <p className="text-[12px] text-[var(--text-3)]">The notetaker joins meetings marked &ldquo;will record&rdquo; automatically.</p>
          </div>
        </div>
      </section>

      {/* Danger zone */}
      <section className="card p-5 mt-4 border-[var(--red)]/30">
        <SectionHeader icon={IconShield} title="Danger zone" />
        <div className="mt-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[13.5px] font-semibold">Reset demo data</p>
            <p className="text-[12px] text-[var(--text-3)]">Clears everything in this browser and restores the seeded meetings.</p>
          </div>
          {confirmReset ? (
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setConfirmReset(false)} className="btn btn-ghost !py-1.5 !text-[12.5px]">Cancel</button>
              <button
                onClick={() => { reset(); setConfirmReset(false); }}
                className="btn !py-1.5 !text-[12.5px]"
                style={{ background: "var(--red)", color: "#fff" }}
              >
                Confirm reset
              </button>
            </div>
          ) : (
            <button onClick={() => setConfirmReset(true)} className="btn btn-soft !py-1.5 !text-[12.5px] shrink-0">
              Reset
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: typeof IconUser; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-8 h-8 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] grid place-items-center">
        <Icon width={15} height={15} />
      </span>
      <h2 className="font-semibold text-[15px]">{title}</h2>
    </div>
  );
}

function ToggleRow({
  label,
  body,
  checked,
  onToggle,
}: {
  label: string;
  body: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-[13.5px] font-medium">{label}</p>
        <p className="text-[12px] text-[var(--text-3)] mt-0.5">{body}</p>
      </div>
      <button
        onClick={onToggle}
        className="shrink-0 w-10 h-6 rounded-full relative transition-colors"
        style={{ background: checked ? "var(--accent)" : "var(--surface-2)" }}
        aria-pressed={checked}
      >
        <span
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
          style={{ transform: checked ? "translateX(18px)" : "translateX(2px)" }}
        />
      </button>
    </div>
  );
}
