# Loom Walkthrough Script — Fathom rebuild (casual, ~4 min)

**Target: ~4:00, well under the 5:00 limit. Camera on. Talk like you're showing
a friend, not presenting.**
`[...]` = do it, don't read it. Start on the **marketing homepage** (`/`).

---

## 0:00 — Hey  (~15s)
> Hey — I'm Sufyan. I spent the last day rebuilding Fathom, the AI meeting
> notetaker. Let me just show you what I made.

## 0:15 — The one big call  (~20s)
> Quick thing up front: real Fathom hides everything behind a desktop app and a
> live recording. The brief said I could fake that part — so I did, on purpose,
> and put my time into what happens *after* a call: the notes, the summary,
> the search, and a couple of things Fathom itself charges extra for. That's
> the stuff that actually matters.

## 0:35 — The landing page  (~20s)
> [On `/`, scroll slowly] I also rebuilt the marketing site — I pulled the
> actual fonts, colors, and animations straight from fathom.ai's own CSS
> instead of eyeballing it, so this isn't a rough copy. [Scroll to the
> integrations section] Even little things like this node graph are matched
> detail for detail.

## 0:55 — Library  (~20s)
> [Click "Open the app" → Library] This is the actual product — the meeting
> library. Seeded with real-feeling data: sales calls, a customer check-in, a
> one-on-one, and the big one — an eight-person, hour-long roadmap call. Stat
> tiles up top, what's coming up, filters for your calls versus the team's.

## 1:15 — The meeting itself  (~45s)
> [Open the Q3 Roadmap meeting] Here's where it gets good. Player on the left,
> transcript synced to it. [Hit play] As it plays, the line lights up and the
> transcript follows — and since there's no real audio, I have it read each
> line out loud, a different voice per person. [Click a transcript line] Click
> anywhere in the transcript and it jumps right there.
> [Point to summary] This is the AI summary. The fun part is templates —
> [click Sales Discovery, then Standup] watch it completely re-shape for a
> sales call or a standup. Where I didn't hand-write one, it's generated from
> the transcript, and I say so. [Click "Copy follow-up email"] And I can grab
> a ready-to-send recap in one click.

## 2:00 — The quick hits  (~25s)
> [Click Actions] Action items get pulled out with owners. [Cmd+K, type a
> meeting name] There's a command palette to jump anywhere instantly. [Close
> it, click Search, type "security"] Search runs across every call and drops
> me on the exact moment. [Click Ask Fathom] And I can just ask questions
> across all my meetings — sourced, timestamped answers, no guessing.

## 2:25 — Deals — the CRM piece  (~25s)
> [Click Deals in the sidebar] One thing I added that real Fathom actually
> gates behind its most expensive plan: this call became a deal automatically.
> [Click a deal] Pipeline stage, an AI coaching scorecard pulled straight from
> the call, and a mock sync to Salesforce — so sales calls don't just get
> summarized, they move the deal forward.

## 2:50 — Recording a new one  (~35s)
> [Click New recording] Best part — I can make a new one. [On /record] Give it
> a title, pick a template, drop in a transcript — this one's a one-on-one —
> and record. [Start recording] It captures live... [Stop & summarize] then it
> writes the summary, pulls the action items, and the finished meeting shows
> up right back in my library. That's the whole loop.

## 3:25 — Wrap  (~20s)
> Oh — and the raw prompt-and-response log the assignment asked for is
> committed in the repo under `.agent-logs`. Repo's public, it's deployed and
> live on Vercel, both links are in the submission. That's it — thanks for
> watching!

---

### Delivery tips
- **Keep the tab in front** during the record demo — background tabs stream slow.
- Do one quick dry run of the clicks so it flows before hitting record for real.
- Running long? Cut the landing-page beat at 0:35 first, then the Deals beat at
  2:25 — protect the meeting-detail walkthrough and the record loop, those are
  the core of the product.
- Loose and friendly beats polished. Let the product carry it.
