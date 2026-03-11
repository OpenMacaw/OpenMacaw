# OpenMacaw — TODO

Based on a full codebase audit (March 2026). Items marked 🔴 are high priority.

---

## 🔴 UI/UX — Chat Sidebar Overflow

- [ ] **Add a Chat History page** (`/chat/history`) — paginated list of all sessions, like Google AI Studio. The sidebar should only show the most recent sessions (e.g. last 10–20).
- [ ] Add a "View all chats →" link at the bottom of the sidebar that navigates to `/chat/history`
- [ ] Chat History page: search by title, date filter, bulk delete
- [ ] Sidebar "Older" group: collapse by default, show count badge + "View all" link once it exceeds ~30 sessions

### General Chat UX
- [ ] Message branching / alternate responses (DB already has `parentId` + `isActive` — UI needs to expose a branching selector)
- [ ] Keyboard shortcut for new chat (`Ctrl/Cmd + N`)
- [ ] Conversation export to Markdown (currently only JSON)
- [ ] Session folders — `folderId` column exists in schema but UI has no folder create/manage UI
- [ ] Search messages within a session
- [ ] Voice input (Web Speech API)

---

## 🔴 Multi-Tenancy / Isolation

> **Current state**: Sessions and messages are scoped to `userId`. MCP servers, permissions, pipelines, and the audit log are **global** (shared across all users) — this causes bleed between accounts.

### Per-User MCP Servers
- [ ] Add nullable `userId` to `servers` table — `NULL` = workspace-wide (admin-managed), non-null = private to that user
- [ ] Server CRUD API must filter by `userId` for non-admin requests
- [ ] Admin panel: expose workspace-shared servers separately from user-private ones
- [ ] MCP Catalog: "Install as private (just me) or shared (workspace)?" prompt for admins

### Per-User Pipelines
- [ ] Add `userId` to `pipelines` table; scope pipeline CRUD to owner
- [ ] Admins see all pipelines; users see only their own

### Per-User Audit Log
- [ ] Add `userId` to `activity_log` table (denormalized from `sessionId → sessions.userId`)
- [ ] `/api/activity` must filter by `userId` for non-admin users; admins get a global view with user filter

### Config Clarity
- [ ] Settings page: clearly label which settings are workspace-wide vs. personal

---

## 🔴 Open WebUI Compatibility

> Implementing the Open WebUI API surface allows OpenMacaw to interoperate with Open WebUI frontends and tools.

### Tools API
- [ ] `GET /api/v1/tools` — list tools in Open WebUI format
- [ ] `POST /api/v1/tools` — register a custom tool
- [ ] `DELETE /api/v1/tools/:id`
- [ ] Map Open WebUI tool calls → MCP server calls through the PermissionGuard

### Functions API
- [ ] `GET/POST /api/v1/functions` — pipe, filter, and action function types
- [ ] Pipe: intercepts/transforms messages before/after LLM
- [ ] Filter: pre/post hooks on every message
- [ ] Action: button-triggered tool call from the UI

### Prompts API
- [ ] `GET/POST/PUT/DELETE /api/v1/prompts` — saved prompt templates
- [ ] Slash-command trigger in chat input (e.g. `/summarize`)
- [ ] Template variables: `{{USER_MESSAGE}}`, `{{CLIPBOARD}}`, etc.
- [ ] Add `prompts` table to DB schema

### Models API
- [ ] `GET /api/v1/models` — unified model list (Anthropic + OpenAI + Ollama) with capability flags (`vision`, `tool_use`, `json_mode`)

### Misc
- [ ] `POST /api/v1/chat/completions` — OpenAI-compatible completions endpoint
- [ ] Bearer token auth on `/api/v1/*` routes

---

## 🔒 Security

- [ ] **Canary token leak detection** — inject canary strings into tool results; alert if they appear in outbound requests
- [ ] **Sandbox mode** — wrap high-risk tool calls (bash, write, delete) in a container/VM before execution
- [ ] CSRF protection on all state-mutating REST endpoints
- [ ] Content-Security-Policy headers on all responses
- [ ] Rate limiting on all REST endpoints (not just login) — use `@fastify/rate-limit`
- [ ] Audit log tamper-evidence — HMAC-sign log entries
- [ ] Tool name collision protection — two servers with the same tool name must not silently alias
- [ ] Mask `isSecret` env var values in the Servers UI (show `••••••` instead of plaintext)
- [ ] Remove `[DEBUG]` console logs in `auth.ts` before any public release

---

## 🤖 Agent Capabilities

- [ ] **Context compaction** — summarize older messages when history grows large and continue seamlessly
- [ ] **Parallel tool calls** — execute multiple concurrent tool calls when the LLM requests them simultaneously
- [ ] Tool call retry on transient MCP failures (exponential backoff)
- [ ] Add Google Gemini as an LLM provider
- [ ] Add Mistral / Groq provider adapters
- [ ] Streaming token usage display (live counter during generation)
- [ ] Agent memory across sessions (native store or Memory MCP server integration)

---

## 🏗️ Infrastructure

- [ ] **Versioned DB migrations** — replace single-snapshot `migrate.ts` with a proper migration runner (e.g. `drizzle-kit migrate`)
- [ ] `GET /api/health` endpoint — DB status, MCP server statuses, uptime
- [ ] Graceful shutdown — drain in-flight requests and MCP connections before exit
- [ ] Structured logging — replace `console.log` with `pino` (Fastify native)
- [ ] Docker multi-arch build (`linux/amd64` + `linux/arm64`) for Raspberry Pi / Apple Silicon
- [ ] Optional PostgreSQL backend (Drizzle supports it — add a PG adapter + env toggle)
- [ ] S3/R2 storage for avatar images instead of base64-in-SQLite

---

## 🧪 Testing

- [ ] Unit tests for `PermissionGuard` evaluator (path traversal, glob matching, trust policy edge cases)
- [ ] Integration tests for auth flows (register, login, rate limit, pending approval)
- [ ] E2E test: start MCP server → chat message → tool call → approval → result
- [ ] Pipeline integration tests (Discord, Telegram mocks)
- [ ] Load test: WebSocket streaming under concurrent users
- [ ] Fuzz: tool inputs with path traversal payloads against the evaluator

---

## 📝 Developer Experience

- [ ] OpenAPI / Swagger spec at `/api/docs` (auto-generated from Fastify schemas)
- [ ] `CONTRIBUTING.md` — setup guide, conventions, PR checklist
- [ ] `CHANGELOG.md` with versioned release notes
- [ ] Dev seed script: demo users, servers, sessions for local testing
- [ ] Auto-generate env var docs from the Zod config schema

---

*Last updated: March 2026*
