# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Dev (all apps + Convex backend)
pnpm run dev

# First-time Convex setup (opens browser to authenticate)
pnpm run dev:setup

# Type-check all packages
pnpm run check-types

# Build all
pnpm run build

# Single package
pnpm -F web dev
pnpm -F @plantchain-new/backend dev
```

No test runner is configured yet. Type-check is the primary correctness gate.

## Architecture

pnpm monorepo with Turborepo. Four packages:

- `apps/web` — React 19 + Vite + TanStack Router (file-based routing in `src/routes/`)
- `packages/backend` — Convex backend (functions, schema, auth, AI verification)
- `packages/ui` — shared shadcn/ui primitives; import as `@plantchain-new/ui/components/<name>`
- `packages/config` / `packages/env` — shared TS config and env validation

## Convex Backend

All backend logic lives in `packages/backend/convex/`. Key files:

- `schema.ts` — single `plantings` table; statuses: `pending | verified | rejected`
- `plantings.ts` — public mutations (`submit`, `generateUploadUrl`) and queries (`list`, `listMine`, `stats`); internal helpers for verification
- `verification.ts` — `internalAction` that calls Gemini 2.5 Flash (`@ai-sdk/google`) with the photo URL to verify plantings; duplicate detection within 5m radius
- `auth.ts` — Better-Auth via `@convex-dev/better-auth`; email+password only; `authComponent.safeGetAuthUser(ctx)` for auth checks
- `http.ts` — registers Better-Auth HTTP routes with CORS
- `convex.config.ts` — registers `betterAuth` and `agent` Convex components

Convex components used: `@convex-dev/better-auth`, `@convex-dev/agent`.

Generated types live in `convex/_generated/` — never edit manually.

## Verification Flow

1. User submits → `plantings.submit` mutation inserts with `status: "pending"`
2. Immediately schedules `internal.verification.verify`
3. Verify action: fetches photo URL from Convex storage, checks for nearby duplicates (5m radius), calls Gemini with vision prompt
4. Updates planting to `verified` or `rejected` via `plantings.updateVerification`
5. Auth0 client credentials are used as agent identity (falls back to `"local-dev-agent"` if env vars absent)

## Frontend Patterns

- Auth state: use `<Authenticated>`, `<Unauthenticated>`, `<AuthLoading>` from `convex/react`
- Data: `useQuery(api.plantings.*)` and `useMutation(api.plantings.*)`
- Routes are file-based; add new routes as files in `apps/web/src/routes/`
- Shared UI components: `import { Button } from "@plantchain-new/ui/components/button"`
- App-specific shadcn blocks: run shadcn CLI from `apps/web`; shared primitives from `packages/ui`

## Environment Variables

Convex env vars (set via `pnpm convex env set`):
- `BETTER_AUTH_SECRET`, `SITE_URL`, `GOOGLE_GENERATIVE_AI_API_KEY` — required
- `AUTH0_DOMAIN`, `AUTH0_AGENT_CLIENT_ID`, `AUTH0_AGENT_CLIENT_SECRET`, `AUTH0_AUDIENCE` — optional, for agent identity

Web app (`apps/web/.env`):
- `VITE_CONVEX_URL`, `VITE_CONVEX_SITE_URL` — copied from `packages/backend/.env.local` after setup

## Solana Integration

`solanaTxSignature` field exists on plantings but is not yet implemented. The on-chain recording feature is planned.

<!-- rtk-instructions v2 -->
# RTK (Rust Token Killer) - Token-Optimized Commands

## Golden Rule

**Always prefix commands with `rtk`**. If RTK has a dedicated filter, it uses it. If not, it passes through unchanged. This means RTK is always safe to use.

**Important**: Even in command chains with `&&`, use `rtk`:
```bash
# ❌ Wrong
git add . && git commit -m "msg" && git push

# ✅ Correct
rtk git add . && rtk git commit -m "msg" && rtk git push
```

## RTK Commands by Workflow

### Build & Compile (80-90% savings)
```bash
rtk cargo build         # Cargo build output
rtk cargo check         # Cargo check output
rtk cargo clippy        # Clippy warnings grouped by file (80%)
rtk tsc                 # TypeScript errors grouped by file/code (83%)
rtk lint                # ESLint/Biome violations grouped (84%)
rtk prettier --check    # Files needing format only (70%)
rtk next build          # Next.js build with route metrics (87%)
```

### Test (90-99% savings)
```bash
rtk cargo test          # Cargo test failures only (90%)
rtk vitest run          # Vitest failures only (99.5%)
rtk playwright test     # Playwright failures only (94%)
rtk test <cmd>          # Generic test wrapper - failures only
```

### Git (59-80% savings)
```bash
rtk git status          # Compact status
rtk git log             # Compact log (works with all git flags)
rtk git diff            # Compact diff (80%)
rtk git show            # Compact show (80%)
rtk git add             # Ultra-compact confirmations (59%)
rtk git commit          # Ultra-compact confirmations (59%)
rtk git push            # Ultra-compact confirmations
rtk git pull            # Ultra-compact confirmations
rtk git branch          # Compact branch list
rtk git fetch           # Compact fetch
rtk git stash           # Compact stash
rtk git worktree        # Compact worktree
```

Note: Git passthrough works for ALL subcommands, even those not explicitly listed.

### GitHub (26-87% savings)
```bash
rtk gh pr view <num>    # Compact PR view (87%)
rtk gh pr checks        # Compact PR checks (79%)
rtk gh run list         # Compact workflow runs (82%)
rtk gh issue list       # Compact issue list (80%)
rtk gh api              # Compact API responses (26%)
```

### JavaScript/TypeScript Tooling (70-90% savings)
```bash
rtk pnpm list           # Compact dependency tree (70%)
rtk pnpm outdated       # Compact outdated packages (80%)
rtk pnpm install        # Compact install output (90%)
rtk npm run <script>    # Compact npm script output
rtk npx <cmd>           # Compact npx command output
rtk prisma              # Prisma without ASCII art (88%)
```

### Files & Search (60-75% savings)
```bash
rtk ls <path>           # Tree format, compact (65%)
rtk read <file>         # Code reading with filtering (60%)
rtk grep <pattern>      # Search grouped by file (75%)
rtk find <pattern>      # Find grouped by directory (70%)
```

### Analysis & Debug (70-90% savings)
```bash
rtk err <cmd>           # Filter errors only from any command
rtk log <file>          # Deduplicated logs with counts
rtk json <file>         # JSON structure without values
rtk deps                # Dependency overview
rtk env                 # Environment variables compact
rtk summary <cmd>       # Smart summary of command output
rtk diff                # Ultra-compact diffs
```

### Infrastructure (85% savings)
```bash
rtk docker ps           # Compact container list
rtk docker images       # Compact image list
rtk docker logs <c>     # Deduplicated logs
rtk kubectl get         # Compact resource list
rtk kubectl logs        # Deduplicated pod logs
```

### Network (65-70% savings)
```bash
rtk curl <url>          # Compact HTTP responses (70%)
rtk wget <url>          # Compact download output (65%)
```

### Meta Commands
```bash
rtk gain                # View token savings statistics
rtk gain --history      # View command history with savings
rtk discover            # Analyze Claude Code sessions for missed RTK usage
rtk proxy <cmd>         # Run command without filtering (for debugging)
rtk init                # Add RTK instructions to CLAUDE.md
rtk init --global       # Add RTK to ~/.claude/CLAUDE.md
```

## Token Savings Overview

| Category | Commands | Typical Savings |
|----------|----------|-----------------|
| Tests | vitest, playwright, cargo test | 90-99% |
| Build | next, tsc, lint, prettier | 70-87% |
| Git | status, log, diff, add, commit | 59-80% |
| GitHub | gh pr, gh run, gh issue | 26-87% |
| Package Managers | pnpm, npm, npx | 70-90% |
| Files | ls, read, grep, find | 60-75% |
| Infrastructure | docker, kubectl | 85% |
| Network | curl, wget | 65-70% |

Overall average: **60-90% token reduction** on common development operations.
<!-- /rtk-instructions -->