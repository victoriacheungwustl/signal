# Signal

**Your feedback, distilled.**

![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-F38020?style=flat&logo=cloudflare&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)

---

Signal is a feedback intelligence dashboard built for product managers who are drowning in user feedback across multiple channels. It aggregates raw feedback from email, GitHub, support tickets, and social media into a single AI-powered digest — surfacing the top themes, urgency signals, sentiment trends, and period-over-period comparisons so you can spend less time triaging and more time acting.

## Live Demo

🔗 [signal.victoriacheung0304.workers.dev](https://signal.victoriacheung0304.workers.dev/)

## Built With

- [Cloudflare Workers](https://workers.cloudflare.com/) — edge compute runtime
- [Cloudflare D1](https://developers.cloudflare.com/d1/) — serverless SQLite database
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/) — inference on `@cf/meta/llama-3.1-8b-instruct`
- [Cloudflare KV](https://developers.cloudflare.com/kv/) — low-latency key-value cache
- [TypeScript](https://www.typescriptlang.org/) — end-to-end type safety across Worker, database bindings, and AI responses

## Features

- **AI-powered digest** — Llama 3.1 analyzes all feedback for the selected time window and surfaces the top 3 themes with specific, actionable summaries grounded in real user quotes
- **Urgency scoring & trend indicators** — each theme card shows urgency (High / Medium / Low) and a period-over-period trend (↑ 40% vs last week) so you can spot emerging problems instantly
- **Sentiment analysis** — an overall sentiment bar breaks down positive, neutral, and negative feedback as percentages that always sum to 100
- **Multi-channel aggregation** — consolidates feedback from Email, GitHub, Support, and Twitter into one unified view
- **Filterable feedback table** — filter any combination of date range, source, urgency, theme, and sentiment with a single compact filter bar; clicking a theme card auto-filters the table
- **Digest time windows** — toggle between Today, This Week, and This Month; each window triggers its own AI analysis and caches independently
- **KV caching** — digests are cached in Cloudflare KV (1 hour for Today / This Week / This Month, 24 hours for All Time) to keep response times fast and AI costs low

## Architecture

| Layer | Technology | Role |
|---|---|---|
| Runtime | Cloudflare Workers | Serves the entire application — routing, HTML rendering, and API endpoints from a single edge function |
| Database | D1 (SQLite) | Stores all feedback entries with source, content, timestamp, sentiment, theme, and urgency |
| AI | Workers AI — Llama 3.1 8B | Analyzes per-theme feedback excerpts and generates actionable digest summaries |
| Cache | KV | Caches generated digests per time window to avoid redundant AI calls on every page load |


## Local Development

```bash
# Install dependencies
npm install

# Apply the database schema locally
npx wrangler d1 migrations apply signal-db --local

# Start the dev server
npx wrangler dev
```

The local dev server starts at `http://localhost:8787`. The first page load seeds the database with 100 synthetic feedback entries spanning the past 90 days across all channels and themes.
