"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MEETINGS as SEED_MEETINGS, USERS, CURRENT_USER_ID } from "./seed";
import type { ActionItem, Comment, Highlight, Meeting } from "./types";
import type { DealStage } from "./deals";

const LS_KEY = "fathom-rework-state-v1";

interface Playlist {
  id: string;
  name: string;
  highlightRefs: { meetingId: string; highlightId: string }[];
}

interface PersistState {
  meetings: Meeting[];
  playlists: Playlist[];
  keywordAlerts: string[];
  dealStages: Record<string, DealStage>;
  dealSyncedAt: Record<string, string>;
}

interface StoreValue extends PersistState {
  currentUser: (typeof USERS)[number];
  hydrated: boolean;
  getMeeting: (id: string) => Meeting | undefined;
  addMeeting: (meeting: Meeting) => void;
  renameMeeting: (meetingId: string, title: string) => void;
  toggleActionItem: (meetingId: string, itemId: string) => void;
  addHighlight: (meetingId: string, h: Omit<Highlight, "id" | "createdAt" | "createdBy">) => void;
  removeHighlight: (meetingId: string, highlightId: string) => void;
  addComment: (meetingId: string, atMs: number, body: string) => void;
  createPlaylist: (name: string) => string;
  addToPlaylist: (playlistId: string, meetingId: string, highlightId: string) => void;
  addKeywordAlert: (keyword: string) => void;
  removeKeywordAlert: (keyword: string) => void;
  setDealStage: (dealId: string, stage: DealStage) => void;
  syncDeal: (dealId: string) => void;
  reset: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

// Deterministic seed state — used for SSR and the first client render so
// hydration always matches. Persisted state is loaded after mount.
function seedState(): PersistState {
  return {
    meetings: structuredClone(SEED_MEETINGS),
    playlists: [
      {
        id: "pl_wins",
        name: "Team wins & decisions",
        highlightRefs: [
          { meetingId: "m_roadmap_q3", highlightId: "h1" },
          { meetingId: "m_cs_acme", highlightId: "h2" },
        ],
      },
    ],
    keywordAlerts: ["pricing", "competitor", "churn"],
    dealStages: {},
    dealSyncedAt: {},
  };
}

function loadPersisted(): PersistState {
  const base = seedState();
  if (typeof window === "undefined") return base;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (raw) return { ...base, ...(JSON.parse(raw) as Partial<PersistState>) };
  } catch {
    /* ignore */
  }
  return base;
}

let uid = 0;
const nextId = (p: string) => `${p}_${Date.now().toString(36)}_${uid++}`;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistState>(() => seedState());
  const [hydrated, setHydrated] = useState(false);

  // Re-read from localStorage after mount (SSR/first render use the seed).
  // Intentional two-pass hydration, not a synchronization effect: server and
  // first client render must match exactly, so the real (persisted) value
  // can only be swapped in once we know we're on the client.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(loadPersisted());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  const getMeeting = useCallback(
    (id: string) => state.meetings.find((m) => m.id === id),
    [state.meetings],
  );

  const addMeeting = useCallback((meeting: Meeting) => {
    setState((s) => ({ ...s, meetings: [meeting, ...s.meetings] }));
  }, []);

  const mutateMeeting = useCallback(
    (meetingId: string, fn: (m: Meeting) => Meeting) => {
      setState((s) => ({
        ...s,
        meetings: s.meetings.map((m) => (m.id === meetingId ? fn(m) : m)),
      }));
    },
    [],
  );

  const renameMeeting = useCallback(
    (meetingId: string, title: string) =>
      mutateMeeting(meetingId, (m) => ({ ...m, title })),
    [mutateMeeting],
  );

  const toggleActionItem = useCallback(
    (meetingId: string, itemId: string) =>
      mutateMeeting(meetingId, (m) => ({
        ...m,
        actionItems: m.actionItems.map((a: ActionItem) =>
          a.id === itemId ? { ...a, done: !a.done } : a,
        ),
      })),
    [mutateMeeting],
  );

  const addHighlight = useCallback(
    (meetingId: string, h: Omit<Highlight, "id" | "createdAt" | "createdBy">) =>
      mutateMeeting(meetingId, (m) => ({
        ...m,
        highlights: [
          ...m.highlights,
          {
            ...h,
            id: nextId("h"),
            createdAt: new Date().toISOString(),
            createdBy: USERS.find((u) => u.id === CURRENT_USER_ID)!.name,
          },
        ].sort((a, b) => a.startMs - b.startMs),
      })),
    [mutateMeeting],
  );

  const removeHighlight = useCallback(
    (meetingId: string, highlightId: string) =>
      mutateMeeting(meetingId, (m) => ({
        ...m,
        highlights: m.highlights.filter((h: Highlight) => h.id !== highlightId),
      })),
    [mutateMeeting],
  );

  const addComment = useCallback(
    (meetingId: string, atMs: number, body: string) =>
      mutateMeeting(meetingId, (m) => ({
        ...m,
        comments: [
          ...m.comments,
          {
            id: nextId("cm"),
            atMs,
            author: USERS.find((u) => u.id === CURRENT_USER_ID)!.name,
            body,
            createdAt: new Date().toISOString(),
          } as Comment,
        ].sort((a, b) => a.atMs - b.atMs),
      })),
    [mutateMeeting],
  );

  const createPlaylist = useCallback((name: string) => {
    const id = nextId("pl");
    setState((s) => ({ ...s, playlists: [...s.playlists, { id, name, highlightRefs: [] }] }));
    return id;
  }, []);

  const addToPlaylist = useCallback(
    (playlistId: string, meetingId: string, highlightId: string) => {
      setState((s) => ({
        ...s,
        playlists: s.playlists.map((p) =>
          p.id === playlistId &&
          !p.highlightRefs.some((r) => r.meetingId === meetingId && r.highlightId === highlightId)
            ? { ...p, highlightRefs: [...p.highlightRefs, { meetingId, highlightId }] }
            : p,
        ),
      }));
    },
    [],
  );

  const addKeywordAlert = useCallback((keyword: string) => {
    const k = keyword.trim().toLowerCase();
    if (!k) return;
    setState((s) =>
      s.keywordAlerts.includes(k) ? s : { ...s, keywordAlerts: [...s.keywordAlerts, k] },
    );
  }, []);

  const removeKeywordAlert = useCallback((keyword: string) => {
    setState((s) => ({ ...s, keywordAlerts: s.keywordAlerts.filter((k) => k !== keyword) }));
  }, []);

  const setDealStage = useCallback((dealId: string, stage: DealStage) => {
    setState((s) => ({ ...s, dealStages: { ...s.dealStages, [dealId]: stage } }));
  }, []);

  const syncDeal = useCallback((dealId: string) => {
    setState((s) => ({ ...s, dealSyncedAt: { ...s.dealSyncedAt, [dealId]: new Date().toISOString() } }));
  }, []);

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(LS_KEY);
    } catch {
      /* ignore */
    }
    setState(seedState());
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      ...state,
      currentUser: USERS.find((u) => u.id === CURRENT_USER_ID)!,
      hydrated,
      getMeeting,
      addMeeting,
      renameMeeting,
      toggleActionItem,
      addHighlight,
      removeHighlight,
      addComment,
      createPlaylist,
      addToPlaylist,
      addKeywordAlert,
      removeKeywordAlert,
      setDealStage,
      syncDeal,
      reset,
    }),
    [
      state,
      hydrated,
      getMeeting,
      addMeeting,
      renameMeeting,
      toggleActionItem,
      addHighlight,
      removeHighlight,
      addComment,
      createPlaylist,
      addToPlaylist,
      addKeywordAlert,
      removeKeywordAlert,
      setDealStage,
      syncDeal,
      reset,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export type { Playlist };
