# Beerpong Score API

A lightweight serverless API built with **Next.js** and deployed on **Vercel** that acts as a middleware layer between a score tracker client and **Google Sheets** via Google Apps Script. Designed to log beer pong match results into separate league sheets in real time.

---

## Architecture

```
Score Tracker (client)
        │
        │  POST /api/handler
        ▼
┌─────────────────────┐
│   Vercel (Next.js)  │  ← This API
│   API Route         │
│  - CORS handling    │
│  - League routing   │
│  - Timestamp (CET)  │
└─────────────────────┘
        │
        │  POST (fetch)
        ▼
 Google Apps Script
        │
        ▼
   Google Sheets
  ┌────┬─────────┬──────────┐
  │ PL │ 2.League│ Sheet1   │
  └────┴─────────┴──────────┘
```

The API receives match results, determines the correct Google Sheet tab based on the league parameter, attaches a CET timestamp, and forwards the payload to a Google Apps Script web app which writes the data into the spreadsheet.

---

## Features

- **League-based routing** — automatically directs results to the correct sheet tab (`PL`, `2.League`, or a default fallback)
- **CET timezone normalization** — timestamps are always stored in `Europe/Prague` time regardless of the client's timezone
- **Flexible timestamping** — accepts a client-provided timestamp or generates one server-side
- **CORS enabled** — can be called from any browser-based score tracker
- **Serverless** — zero infrastructure to manage, deployed instantly via Vercel

---

## API Reference

### `POST /api/handler`

Receives match results and forwards them to Google Sheets.

**Request body**

```json
{
  "results": [...],
  "league": "PL",
  "timestamp": "2025-06-15T20:30:00.000Z"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `results` | `any` | `true` | Match result data (structure defined by score tracker) |
| `league` | `string` | `false` | `"PL"` or `"2.League"`. Omit to use default sheet |
| `timestamp` | `string` | `false` | ISO 8601 timestamp from client. If omitted, server time is used |

**Response — success**

```json
{
  "success": true,
  "data": "...",
  "sheetName": "PL",
  "timestamp": "2025-06-15 22:30:00"
}
```

**Response — error**

```json
{
  "success": false,
  "error": "Error: ..."
}
```

| Status | Meaning |
|--------|---------|
| `200` | Results successfully forwarded to Google Sheets |
| `405` | Method not allowed (only POST is accepted) |
| `500` | Internal server error (e.g. Google Apps Script unreachable) |

---

## League → Sheet Mapping

| `league` value | Target sheet tab |
|----------------|-----------------|
| `"PL"` | `PL` |
| `"2.League"` | `2.League` |
| anything else / omitted | `Sheet1` (default) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Vercel CLI](https://vercel.com/docs/cli) (optional, for local dev)
- A Google Sheets document with a deployed Google Apps Script web app

### Local development

```bash
git clone https://github.com/your-username/beerpong-score-api
cd beerpong-score-api
npm install
npx vercel dev
```

### Deploy to Vercel

```bash
npx vercel --prod
```

The API route will be available at `https://your-project.vercel.app/api/handler`.

---

## Example Request

```bash
curl -X POST https://your-project.vercel.app/api/handler \
  -H "Content-Type: application/json" \
  -d '{
    "results": [{ "team1": "Pandas", "team2": "Tigers", "score": "10-7" }],
    "league": "PL",
    "timestamp": "2025-06-15T20:30:00.000Z"
  }'
```

---

## Tech Stack

- **Runtime** — Node.js
- **Framework** — Next.js (API Routes)
- **Hosting** — Vercel (serverless)
- **Data sink** — Google Sheets via Google Apps Script
