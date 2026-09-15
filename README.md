# Fathom — rebuild

A rebuild of [Fathom](https://fathom.ai), the AI meeting notetaker: the
in-product surface (library, synced playback, summaries, search, Ask, deals,
sharing) plus a marketing landing page matching fathom.ai's own dark, Sora-set
design language. Built with **Next.js 16 + TypeScript + Tailwind v4**, shipped
as a static export.

**Live (original deployment):** https://mjunaidarif.github.io/fathom-ai-rework/
**Agent logs:** [`.agent-logs/`](.agent-logs/) — raw prompt/response capture for every build turn.

---

## What it does

### Marketing site (`/`)
A dark, space-themed landing page built to match fathom.ai's real design
language — verified from its own computed styles, not guessed: the **Sora**
typeface, light-weight tracked-tight display headlines, a true cyan accent
(`#00beff`), fully pill-shaped buttons, a drifting starfield, a scrolling
marquee, an interactive Clarity/Momentum/Ease panel, a node-graph integrations
section, and scroll-reveal / hover / parallax motion throughout.

### Product (`/library` and onward)
- **Meeting library** — everything captured, with stat tiles, an "upcoming —
  notetaker joining" strip, My/Team filters, sort (newest/oldest/longest), and
  tag filtering.
- **Meeting playback synced to the transcript** — a play head that advances a
  clock; the current line highlights and the transcript auto-follows; click any
  line to seek; search within the call; speed control. Since the capture layer
  is stubbed (no recorded audio), playback **narrates the active line** aloud via
  the Web Speech API — a distinct voice per speaker, with a mute toggle.
- **AI summaries with switchable templates** — General, Sales Discovery, Standup,
  1:1, Interview, Customer Success. Authored summaries where seeded; other
  templates are generated on-device from the transcript (labeled as such).
  Copy the summary or a ready-to-send follow-up email in one click.
- **Action items** — toggle done, jump to the moment each came from.
- **Highlights → playlists** — clip a moment from the player; collect highlights
  into shareable playlists.
- **Cross-meeting search** — keyword search across every transcript, title, and
  participant, returning timestamped moments.
- **Ask Fathom** — natural-language Q&A via on-device retrieval, either across
  all calls (`/ask`) or scoped to a single meeting (the "Ask" tab on any call),
  answering with sourced, timestamped moments (no LLM call; honest retrieval).
- **Deals (CRM-lite)** — `/deals`: a stage pipeline (Discovery → Qualified →
  Proposal → Negotiation → Closed Won) built from sales/CS calls, with a deal
  drawer for advancing stage and a mock "sync to Salesforce/HubSpot" — the
  kind of CRM sync Fathom's real Business plan does, built as local UI with
  no real CRM connection. Meetings tied to a deal show a linking chip.
- **Keyword alerts** — flag meetings that mention a watched word (e.g.
  "pricing"), surfaced as a badge on the library card.
- **Sharing** — share a meeting or a clip via link (share modal).
- **Comments** — timestamped comments on a call.
- **Transcript export** — download any meeting's transcript as `.txt`.
- **Inline rename** — click a meeting title to edit it.

State (highlights, action-item toggles, comments, playlists, deal stages,
keyword alerts) persists in `localStorage`.

## The capture layer is stubbed — on purpose

The brief explicitly allows faking the recording bot. Fathom's real web app is
gated behind installing an Electron desktop app and recording a live call, so
the capture layer here is stubbed with realistic **seed data** ([`lib/seed.ts`](lib/seed.ts))
— including an 8-person, ~1-hour roadmap call, a sales discovery call, a customer
success check-in, and a 1:1. All the time went into the product surface that gets
judged: the library, playback, summaries, search, Ask, deals, highlights, and sharing.

## Design language

The marketing page's design tokens were pulled from fathom.ai's own computed
CSS (font, weight, tracking, accent color, radii, easing), not eyeballed from
screenshots — see `app/globals.css` for the full token set. The in-app surfaces
stay light — matching Fathom's own in-product screenshots — but share the same
Sora typeface, cyan accent, and pill-button language, so the whole product
reads as one family.

## Run locally

```bash
npm install
npm run dev
```

Build the static export:

```bash
npm run build          # outputs to ./out
DEPLOY_TARGET=pages npm run build   # same, with the /fathom-ai-rework base path for GitHub Pages
```

## Deploy

Pushing to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds the static export and publishes it to GitHub Pages. Enable it once
under **Settings → Pages → Build and deployment → Source: GitHub Actions**.

If you fork or push this to a differently-named repo, update the `repo`
constant in `next.config.ts` to match before enabling Pages — the GitHub Pages
base path has to equal the repo name or asset URLs will 404.

## Project structure

```
app/
  (marketing)/  the landing page — / — dark, space-themed, no app chrome
  (app)/        the product — /library, /meeting/[id], /search, /ask,
                /deals, /playlists, /record — wrapped in the Sidebar layout
components/     UI + meeting/ (Player, Transcript, RightPanel, ShareModal)
                + deals/ (DealCard, DealDrawer)
lib/            types, seed data, summarizer, retrieval, deals, follow-up
                email, player hook, store
recon/          product recon notes + proposed data model
.agent-logs/    committed prompt/response capture
```
