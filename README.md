# Agentic AI System — RAG Chat + Business Data Backend

A full-stack AI system made of three independently runnable projects: a React chat UI, a Retrieval-Augmented Generation (RAG) backend that answers questions by grounding Gemini responses in a semantically searched FAQ knowledge base, and a TypeScript "agentic" backend that exposes business data (customers, orders) and external tools (live weather) through a clean service layer. The agentic backend is being extended into a Model Context Protocol (MCP) server so that AI agents can consume that data as MCP resources and tools.

## Architecture

```
┌──────────────────────┐   POST /api/chat    ┌──────────────────────────┐
│  ai-chat-app         │ ──────────────────▶ │  ai-chat-app-backend     │
│  React + Vite        │ ◀────────────────── │  Express (JS) — RAG      │
│  :4200               │     { reply }       │  :3000                   │
└──────────────────────┘                     └───────────┬──────────────┘
                                                         │ embeddings + generation
                                                         ▼
                                                 Gemini API (OpenAI optional)

┌──────────────────────────────────────────────┐
│  agentic-app-backend  — Express (TypeScript) │   GET /api/weather ──▶ WeatherAPI.com
│  :3100 locally (see note below)              │   POST /api/chat   ──▶ Gemini API
│  controllers → services → data               │
└──────────────────────────────────────────────┘
```

| Component | Folder | Default port | Role |
|---|---|---|---|
| **Frontend** | [`ai-chat-app/`](ai-chat-app) | 4200 | React chat interface. Sends user messages to the backend URL configured in `VITE_API_URL`. |
| **RAG backend** | [`ai-chat-app-backend/`](ai-chat-app-backend) | 3000 | Embeds the user's question and every FAQ entry, ranks FAQs by cosine similarity, injects the top matches into the prompt, and returns the LLM's grounded answer. Pluggable LLM providers (Gemini by default, OpenAI supported). |
| **Agentic backend** | [`agentic-app-backend/`](agentic-app-backend) | 3000 (run on 3100 alongside the RAG backend) | Layered REST API over business data and external tools; foundation for the MCP server. |

### REST endpoints

**RAG backend (`ai-chat-app-backend`)**

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/chat` | Body `{ "message": string, "model"?: "gemini" \| "openai" }` → `{ "reply": string }` |

**Agentic backend (`agentic-app-backend`)**

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/chat` | Body `{ "message": string }` → `{ "reply": string }` (direct Gemini call) |
| `GET` | `/api/customers?limit=N` | Customers, newest first. Non-numeric `limit` → `400` |
| `GET` | `/api/customers/:id` | Single customer, `404` if not found |
| `GET` | `/api/orders?limit=N` | Orders, newest first. Non-numeric `limit` → `400` |
| `GET` | `/api/orders/:id` | Single order, `404` if not found |
| `GET` | `/api/weather?city=Cairo` | Current weather via WeatherAPI.com |

Service dependencies are strictly one-directional: `OrderService → CustomerService`, never the reverse.

### Roadmap: MCP server

`@modelcontextprotocol/sdk` and `zod` are already dependencies of `agentic-app-backend`. The next step is a `/mcp` (JSON-RPC over Streamable HTTP) endpoint that exposes customers and orders as MCP **resources** and the weather/order-lookup services as MCP **tools**, reusing the existing service layer.

## Tech stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS 4, Bootstrap Icons, Oxlint
- **RAG backend:** Node.js, Express 5, `@google/genai` (Gemini generation + `gemini-embedding-001` embeddings), `openai` SDK (optional provider), `compute-cosine-similarity`
- **Agentic backend:** Node.js (native TypeScript execution), TypeScript, Express 5, `@google/genai`, `@modelcontextprotocol/sdk`, `zod`, WeatherAPI.com
- **Runtime:** Node.js 24 (both backends use `node --env-file` and `--watch`; the agentic backend runs `.ts` files directly without a build step)

## Getting started

### Prerequisites

- Node.js 24+
- A [Google Gemini API key](https://aistudio.google.com/apikey)
- A [WeatherAPI.com](https://www.weatherapi.com/) key (only for the agentic backend's `/api/weather`)

### 1. RAG backend (`ai-chat-app-backend`)

```bash
cd ai-chat-app-backend
npm install
cp .env.example .env      # then fill in the values
npm run dev               # → http://localhost:3000
```

| Variable | Required | Description |
|---|---|---|
| `PORT` | no (default `3000`) | HTTP port |
| `GEMINI_API_KEY` | yes | Gemini API key |
| `GEMINI_MODEL` | yes | Gemini model name, e.g. `gemini-flash-latest` |
| `OPENAI_API_KEY`, `OPENAI_MODEL` | only for `"model": "openai"` | OpenAI provider |

### 2. Frontend (`ai-chat-app`)

```bash
cd ai-chat-app
npm install
cp .env.example .env      # VITE_API_URL=http://localhost:3000
npm run dev               # → http://localhost:4200
```

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | yes | Base URL of the RAG backend |

### 3. Agentic backend (`agentic-app-backend`)

Both backends default to port 3000. To run this one alongside the RAG backend, override the port. Node's `--env-file` doesn't overwrite variables already set in the shell.

```bash
cd agentic-app-backend
npm install
cp .env.example .env      # then fill in the values
PORT=3100 npm run dev     # PowerShell: $env:PORT=3100; npm run dev  → http://localhost:3100
npx tsc --noEmit          # type-check
```

| Variable | Required | Description |
|---|---|---|
| `PORT` | no (default `3000`) | HTTP port |
| `GEMINI_API_KEY` | yes | Gemini API key |
| `GEMINI_MODEL` | yes | Gemini model name |
| `WEATHER_API_KEY` | for `/api/weather` | WeatherAPI.com key |

### Try it

```bash
curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" \
     -d '{"message":"How long does shipping take?"}'

curl "http://localhost:3100/api/orders?limit=2"
```

The RAG knowledge base lives in [`ai-chat-app-backend/data/faqs.json`](ai-chat-app-backend/data/faqs.json). Questions about refunds, shipping, password resets, subscriptions, or the free trial are in scope.

## Repository layout

```
.
├── ai-chat-app/            # React + Vite frontend
├── ai-chat-app-backend/    # Express RAG backend (JavaScript)
└── agentic-app-backend/    # Express business-data backend (TypeScript, MCP in progress)
```
