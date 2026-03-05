# OpenMacaw

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Website](https://img.shields.io/badge/Website-openmacaw.com-green)](https://openmacaw.com)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen)](#)

**A self-hosted, security-first AI agent platform with granular MCP server permission control.**

OpenMacaw is an open-source web-based AI agent runtime that connects to LLM providers, orchestrates MCP servers, and enforces fine-grained permission policies — all through a clean browser UI. No desktop client required.

---

## What It Does

OpenMacaw lets you run an AI agent locally that can use tools via the [Model Context Protocol (MCP)](https://modelcontextprotocol.io). Every tool call goes through a configurable permission guard before it executes — giving you precise, auditable control over what the agent can and cannot do.

**Core capabilities:**
- Connect to any MCP server (stdio or HTTP/SSE transport)
- Control exactly what each server can access: paths, commands, domains, and more
- Stream agent responses and tool calls in real time via WebSocket
- Approve or deny individual tool calls with inline editing before execution
- Run autonomous agentic plans with a drag-to-reorder step editor and optional final checkpoint
- Log every tool call with timestamp, outcome, latency, and full payload
- Pipe the agent into Discord, Telegram, or LINE via the Pipelines system

---

## Features

### Chat Interface
- Full streaming chat with live tool call events shown inline
- **Human-in-the-Loop approval cards** — review and edit tool arguments before execution
- **Agentic Mode** — propose a multi-step plan, reorder steps by dragging, add custom steps, set a mid-run checkpoint for final review
- Auto-generated conversation titles
- Session sidebar for managing multiple conversations
- Code blocks with one-click copy
- Collapsible tool call summaries per response (tools used, server, input)
- Hallucination detection for local Ollama models with automatic retry

### MCP Servers
- Register stdio or HTTP/SSE servers with name, command, args, and env vars
- One-click start/stop/restart per server
- Inline edit mode for updating server config
- Live status badges: `running`, `stopped`, `error`, `unhealthy`
- Tool count display per server
- Auto-reconnect on startup
- Environment variable JSON editor with format/validation

### Permission Editor
- Per-server permission policies stored in SQLite
- **Filesystem:** allowed/denied path lists with per-operation toggles (read, write, create, delete, list)
- **Bash:** toggle + glob-pattern allowlist for commands
- **Web Fetch:** toggle + optional domain allowlist
- **Network & Subprocess:** individual toggles
- **Rate Limits:** max calls per minute and max tokens per call
- **Prompt Injection Prevention (PIP):** server-wide toggle with per-tool overrides (inherit / enable / disable)
- **Auto-Approve Reads:** trusted-path zone for read-only tools that skip the approval prompt
- Auto-saves on every change with toast confirmation

### MCP Catalog
- Curated library of popular MCP servers grouped by category (Dev, Web, Data, Productivity, Security, AI)
- One-click **Add & Start** installs the server and connects it immediately
- Detects already-installed servers
- Required environment variable keys highlighted per entry
- Links to upstream repositories
- Search and category filtering
- Link to [mcp.so](https://mcp.so) for discovering more servers

### Audit Log
- Live feed of every tool call across all sessions
- Columns: timestamp, tool name, target server, outcome (`ALLOWED` / `⚡ AUTO` / `403 DENIED`), latency
- Click any row to expand the full input payload and denial reason
- Filter by server, outcome, or free-text search
- Auto-refreshes every 3 seconds

### Pipelines
- Connect the agent to external chat platforms without code changes
- **Discord** — bot responds in a channel or DM; supports per-reaction approval gate
- **Telegram** — long-polling bot with optional chat ID allowlist
- **LINE** — inbound webhook with signature verification
- Each pipeline shares a conversation session and runs the agent in auto-execute mode
- Start, stop, restart, and edit config without redeploying

### Settings
- Per-user API key overrides for Anthropic and OpenAI (server keys used as fallback)
- UI preference toggles (auto-scroll, raw JSON in audit log)
- PWA install prompt for Android / Chrome
- Push notification permission management with test notification

### LLM Providers
- **Anthropic** (Claude) — full streaming, native tool use blocks
- **OpenAI** (GPT-4o, o-series) — streaming with tool calls
- **Ollama** — local model support with hallucination retry loop

---

## Deployment

### Docker (Recommended)

**Prerequisites:** Docker v20+ and Docker Compose.

1. Clone the repository:
   ```bash
   git clone https://github.com/OpenMacaw/OpenMacaw.git
   cd OpenMacaw
   ```

2. Create a `.env` file:
   ```env
   AUTH_TOKEN=your_secret_token
   ANTHROPIC_API_KEY=sk-ant-...
   OPENAI_API_KEY=sk-...
   OLLAMA_BASE_URL=http://localhost:11434
   DEFAULT_MODEL=claude-3-5-sonnet-20241022
   DEFAULT_PROVIDER=anthropic
   ```

   | Variable | Default | Description |
   |---|---|---|
   | `AUTH_TOKEN` | *(none)* | Token to protect the web UI and API |
   | `ANTHROPIC_API_KEY` | *(none)* | Anthropic API key |
   | `OPENAI_API_KEY` | *(none)* | OpenAI API key |
   | `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama server URL |
   | `DEFAULT_MODEL` | `claude-3-5-sonnet-20241022` | Default LLM model |
   | `DEFAULT_PROVIDER` | `anthropic` | Default LLM provider |

3. Start:
   ```bash
   docker compose up -d
   ```
   The app is available at **[http://localhost:3000](http://localhost:3000)**. Data persists in `./data`.

4. Stop:
   ```bash
   docker compose down
   ```

### Manual Docker Build

```bash
docker build -t openmacaw .

docker run -d \
  -p 3000:3000 \
  -v $(pwd)/data:/data \
  -e ANTHROPIC_API_KEY=sk-ant-... \
  --restart unless-stopped \
  openmacaw
```

> On Windows PowerShell, replace `$(pwd)` with `${PWD}`.

### Local Development

```bash
npm install
npm run dev        # starts both server (port 3000) and web (port 5173) with hot reload
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js 20+, Fastify, TypeScript |
| MCP | `@modelcontextprotocol/sdk` |
| Database | SQLite via `better-sqlite3` + Drizzle ORM |
| Frontend | React 18, Vite, Tailwind CSS, shadcn/ui |
| State | Zustand + React Query |
| Auth | JWT (`@fastify/jwt`) |
| Streaming | Native WebSocket |

---

## Roadmap

### Completed
- [x] Streaming agent runtime with Planner-Executor architecture
- [x] MCP client with stdio and HTTP/SSE transports
- [x] PermissionGuard with filesystem, bash, web, subprocess, and rate limit policies
- [x] Real-time WebSocket chat with inline tool call approval UI
- [x] Agentic mode with drag-to-reorder plan editor and mid-run checkpoint
- [x] Prompt Injection Prevention (PIP) with per-tool overrides
- [x] Auto-approve reads for trusted path zones
- [x] Activity audit log with search, filter, and payload inspection
- [x] Discord, Telegram, and LINE pipeline integrations
- [x] MCP Catalog with one-click install
- [x] Hallucination detection and retry for Ollama models
- [x] PWA support with push notifications
- [x] JWT authentication with per-user API key overrides

### In Progress / Planned
- [ ] Team support — multi-user with role-based access control
- [ ] Advanced session management — tagging, archiving, and search
- [ ] Sandbox mode — isolated execution environments for high-risk tool calls
- [ ] Enhanced canary leak detection pipeline
- [ ] Marketplace — community MCP server sharing
- [ ] Native desktop client

---

[Open an Issue](https://github.com/OpenMacaw/OpenMacaw/issues) | [Website](https://openmacaw.com)

---
*Inspired by OpenClaw. Reimagined for safety and precision.*
