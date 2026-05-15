# Anchor by Flux Forward

**A lightweight execution cockpit for people navigating international life.**

Built for international students, skilled migrants, newcomers, and founders dealing with the cognitive overload of relocation — visa deadlines, housing admin, career moves, language barriers, identity shifts, and a hundred open loops.

---

## The problem

International life fragments your attention. You have too many tabs, documents, deadlines, contacts, and decisions across too many systems. You need a private place to capture signals, sort them, and turn them into clear next actions.

Most productivity tools are built for people with stable lives. This one is built for people in motion.

---

## What it does

Paste anything. AI structures it.

```
"My BSN appointment is next Tuesday at the gemeente, need to bring rental contract"
→ Category: Visa & residence
→ Next action: Bring rental contract to BSN appointment
→ Date: 2026-05-20
```

Then it helps you decide what to do today, track what's waiting, and reflect on what moved and what didn't.

**Core loop:** Capture → Structure → Decide → Act → Reflect

---

## Features

- **Capture** — paste any thought, task, link, worry, or contact. AI classifies and extracts a next action.
- **Today view** — one Single Ask (your most urgent item), This Week, and an Action Queue (Now / Next / Later / Waiting)
- **12 migration-specific categories** — Visa, Career, Housing, Study, Finance, Health, Relationships, Documents, Resources, Ideas, Urgent, Later
- **Next action dates** with overdue/today/soon banners
- **Status tracking** — Active, Waiting, Done
- **Edit anything** — fix what AI got wrong in one click
- **Search** — across all items
- **Daily reflection** — 5 questions, 2 minutes
- **Export / Import** — your data as JSON, always
- **Dark mode**
- **Fully local** — nothing stored anywhere except your own browser

---

## Installation

Download [`anchor_v02.html`](./anchor_v02.html) and open it in any browser.

That's it.

No install. No server. No account. No subscription.

---

## Setup

1. Open the file in your browser
2. Click **⚙ Settings**
3. Paste your [OpenAI API key](https://platform.openai.com/api-keys)
4. Start capturing

Your API key is stored only in your browser's localStorage. It is never sent anywhere except directly to OpenAI when you capture an item.

---

## Privacy

- All data lives in your browser (`localStorage`)
- No backend, no database, no analytics
- No data is collected by Flux Forward
- You can export all your data as JSON at any time
- You can delete everything with one button

The only external service used is OpenAI (when you press Capture). You bring your own key and pay OpenAI directly. A typical capture costs less than $0.001 with `gpt-4o-mini`.

---

## Who this is for

- International students starting in the Netherlands (or anywhere new)
- Highly skilled migrants navigating IND, BSN, DigiD, housing, and work permits simultaneously
- International founders building while settling
- Newcomers dealing with relocation overload

This is not a generic productivity app. It is not a CRM. It is not a Notion clone. It is a focused tool for one specific kind of cognitive load: the overload of being foreign somewhere.

---

## Tech

Single HTML file. No framework. No build step. No dependencies except one Google Fonts import and the OpenAI API.

- Vanilla JS
- CSS custom properties (light/dark theme)
- `localStorage` for persistence
- OpenAI `/v1/chat/completions` with `response_format: json_object`

---

## Roadmap

| Version | Status | Description |
|---------|--------|-------------|
| v0.1 | ✅ Done | Single-file prototype. Capture + AI structure + categories |
| v0.2 | ✅ Done | Today view, Single Ask, Action Queue, Reflect, Edit, Search, Import/Export |
| v0.3 | Planned | Next.js + local SQLite. Installable desktop app via Tauri. |
| v0.4 | Planned | Link dashboard (curated resources for newcomers in NL) |

---

## About

Built by [Flux Forward](https://fluxforward.world) — a Netherlands-based organization working to close the Activation Gap: the structural disconnect between internationals arriving in the Netherlands and their ability to fully contribute.

This tool is a direct product of hundreds of conversations with internationals navigating Dutch systems. It started as an internal execution layer and became something portable.

---

## License

MIT — use it, fork it, adapt it for your community.

---

*"Not a productivity app. A place to drop anchor."*
