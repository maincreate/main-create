# TinkerTunnel Portal — Developer Preview

This folder implements a real Cloudflare Worker portal (frontend plus backend), **not** an authenticated production control plane.

## Routes

- GET / — portal with Overview, Connections, Marketplace, Build nodes and Activity
- GET /api/v1/catalog — declarative framework catalog with OS/arch targets
- POST /api/v1/plans — validated *read-only* dry-run installation plan
- GET /api/v1/status — deliberately unconnected preview state
- GET /healthz — health response
- GET /mcp — 503 until remote authenticated MCP is implemented
- Installation, enrollment and OAuth endpoints — 503 until security is implemented

## Deploy

Worker name: tinkertunnel-portal. Suggested custom domain: portal.tinkertunnel.com. Upload the service-worker-format portal/worker.js to Cloudflare Workers, then associate the custom domain. **Do not enable installation by changing only the frontend**.

## Next gated milestones

1. Account/session model and GitHub App installation OAuth, using server-side credential storage and validated installation ownership.
2. Signed, short-lived agent pairing; outbound tunnel and per-device capability scopes; heartbeat/revoke lifecycle.
3. OAuth-authenticated MCP server with per-user, per-workspace resource authorization and auditable tool invocations. ChatGPT setup instructions must reflect current workspace/plan permissions. Connection proof from real authorized MCP request, not from UI clicks.
4. Approved catalog recipes: signed or content-hash pinned, dependency graph, immutable install plan, allowed effect types, dry-run/diff and approval. Specific Windows/Linux/macOS combinations must pass platform validation before becoming installable.
5. Idempotent job executor, status stream and artifact evidence. No arbitrary commands or broad sudo. Separate physical-device flash approval and lock.

## Product constraints

GitHub Actions self-hosted runners are for approved build jobs; TinkerTunnel agent is for scoped capabilities and workflow execution. They are separate trust surfaces. OAuth credentials and pairing tokens must never be stored in GitHub Pages static assets or browser local storage.

This preview intentionally reports no connected accounts or nodes, even if there are already home lab runners. Public JSON includes no personal hostnames or private network addresses.
