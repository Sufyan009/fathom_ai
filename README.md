<div align="center">

# Fathom (Rebuild)

**An independent rebuild of [Fathom](https://fathom.ai), the AI meeting notetaker.**

Next.js 16 · TypeScript · Tailwind CSS v4 · Static export

Not affiliated with or endorsed by Fathom Inc.

</div>

---

## Overview

This project rebuilds Fathom's product surface end to end: a meeting library,
synced transcript playback, templated AI summaries, action items, highlights
and playlists, cross-meeting search, a retrieval-based "Ask Fathom" assistant,
and a lightweight CRM pipeline for sales and customer success calls. It also
includes a marketing landing page whose design system (typeface, color,
spacing, motion) was reverse-engineered from fathom.ai's own computed CSS.

The recording bot itself is stubbed. Fathom's real capture layer requires
installing a desktop app and joining a live call, so this rebuild seeds
realistic meetings and transcripts instead and spends its effort on the
product surface that is actually evaluated: playback, summaries, search, Ask,
deals, highlights, and sharing.

## Features

### Product

| Area | What it does |
| --- | --- |
| Library | Stat tiles, an upcoming-meetings strip, My/Team filters, sort, and tag filtering. |
| Playback | Transcript-synced play head, click-to-seek, in-call search, speed control, and per-speaker text-to-speech narration (the capture layer has no audio to play back). |
| Summaries | Six switchable templates (General, Sales Discovery, Standup, 1:1, Interview, Customer Success). Seeded summaries are authored; unseeded ones are generated on-device from the transcript and labeled as such. One-click copy of the summary or a follow-up email draft. |
| Action items | Toggle complete, jump to the source moment. |
| Highlights & playlists | Clip a moment from the player and collect highlights into shareable playlists. |
| Search | Keyword search across every transcript, title, and participant. |
| Ask Fathom | On-device retrieval Q&A, either across the whole library or scoped to a single call, with sourced and timestamped citations. No LLM call is made; this is honest retrieval, not generation. |
| Deals | A CRM-lite pipeline (Discovery through Closed Won) built from sales and CS calls, with a deal drawer for advancing stage and a mock "sync to Salesforce/HubSpot" affordance. Meetings tied to a deal link to it directly. |
| Keyword alerts | Flag meetings that mention a watched term, surfaced as a badge on the library card. |
| Sharing | Share a meeting or a clip via link. Timestamped comments on any call. |

### Marketing site

The landing page (`/`) matches fathom.ai's visual identity: a dark "space"
surface with a drifting starfield, the Sora typeface at light weight with
tight tracking, a cyan accent color, fully pill-shaped buttons and cards, and
a scroll-reveal / hover-lift / parallax motion system, all driven by design
tokens read directly from fathom.ai's computed styles rather than estimated
from screenshots.

## Tech stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4, CSS custom properties for the design system
- **State:** React context backed by `localStorage`, no backend or database
- **Fonts:** Sora (marketing and app UI)
- **Deployment:** static export, deployed via GitHub Actions to GitHub Pages

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build                       # standard build, outputs to .next
DEPLOY_TARGET=pages npm run build   # static export with a /fathom_ai base path, for GitHub Pages
```

## Project structure

```
app/
  (marketing)/     landing page at /, no app chrome
  (app)/           the product, wrapped in the sidebar layout
    library/       meeting library
    meeting/[id]/  meeting detail: playback, summary, actions, highlights, ask
    search/        cross-meeting search
    ask/           global Ask Fathom
    deals/         CRM-lite pipeline
    playlists/     highlight playlists
    record/        simulated live-recording flow
components/
  meeting/         Player, Transcript, RightPanel, ShareModal
  deals/           DealCard, DealDrawer
lib/
  seed.ts          meeting, user, and calendar seed data
  deals.ts         CRM deal seed data and helpers
  summarize.ts     on-device summary generation
  ask.ts           on-device retrieval for Ask Fathom
  followup.ts      follow-up email and export helpers
  store.tsx        app state and localStorage persistence
recon/             product research notes and the proposed data model
.agent-logs/       prompt and response capture for every build turn
```

## Design system

`app/globals.css` holds the full token set: typography scale, the cyan accent
(`#00beff`, matched to fathom.ai's own `--base-color-brand--cyan`), pill
button and card radii, and a shared easing curve
(`cubic-bezier(0.25, 0.46, 0.45, 0.94)`) used for every hover and entrance
animation. The in-app surfaces stay light, matching Fathom's own in-product
screenshots, while sharing the same typeface, accent, and shape language as
the marketing site so the whole product reads as one family.

## Data and persistence

There is no backend. Seed data lives in `lib/seed.ts` and `lib/deals.ts`.
Anything a user does in the app (highlights, comments, playlists, deal stage
changes, keyword alerts, meeting renames) is written to `localStorage` on the
client. Use the "reset" control in the sidebar to restore the seed state.

## Deployment

Pushing to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds the static export and publishes it to GitHub Pages. Enable it
once under **Settings → Pages → Build and deployment → Source: GitHub
Actions**. If you fork this into a repo with a different name, update the
`repo` constant in `next.config.ts` to match, or GitHub Pages asset URLs will
404.

## What is real and what is mocked

- Transcripts, summaries, search, and Ask Fathom all run on real (if simple)
  logic against the seeded transcripts. Nothing here is faked output.
- The recording bot, live transcription, and audio playback are stubbed by
  design. Playback narrates the transcript via the Web Speech API instead of
  playing a recording.
- The Salesforce/HubSpot sync in the Deals page is UI only. No external CRM
  connection exists.
