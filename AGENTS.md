# Repository guidance

Agent Smart Fetch is a Bun monorepo: `packages/core` owns the shared TLS-fetch, Defuddle extraction, batching, formatting, and download pipeline; `packages/pi-smart-fetch`, `packages/openclaw-smart-fetch`, and `packages/smart-fetch` are the pi adapter, OpenClaw plugin, and CLI.

## Toolchain and commands

- Use Bun `1.3.9` (`packageManager` in the root `package.json`); supported package engines also require Node `>=24.18.0`.
- Install with `bun install`; use the root scripts rather than ad-hoc package-manager commands.
- Full verification is `bun run check` (`lint` → all tests → all builds → package smoke tests). CI also runs `bun run format:check`, `bun run coverage`, and `bun run pack:dry-run:all`.
- Focused checks: `bun run check:core`, `bun run check:pi`, `bun run check:openclaw`, `bun run check:cli`; focused tests are `bun run test:core`, `bun run test:pi`, `bun run test:openclaw`, `bun run test:cli`.
- Integration tests require the explicit command `bun run test:integration` (sets `RUN_INTEGRATION=1`); they perform real web requests and are also run before releases.
- Format with `bun run format`; inspect with `bun run format:check`. Type checks are available per package via `bun run typecheck:<package>`.

## Structure and wiring

- Start implementation tracing in `packages/core/src/extract.ts`, `format.ts`, `tool.ts`, and `types.ts`; `packages/core/src/index.ts` is the shared export surface.
- Adapter entrypoints are `packages/pi-smart-fetch/src/index.ts`, `packages/openclaw-smart-fetch/src/index.ts`, and the CLI is `packages/smart-fetch/src/cli.ts`.
- Core handles binary/attachment responses by writing sanitized, non-executable files to a temp directory; do not force non-text responses through Defuddle.
- Batch results preserve input order and use bounded concurrency (default `8`). Client-side meta redirects and qualified alternate-content fallbacks are bounded behaviors in the core pipeline.
- TypeScript uses strict mode, ESM, bundler resolution, and the `smart-fetch-core` path alias from `tsconfig.base.json`; preserve `.ts` import extensions and `verbatimModuleSyntax`.

## Workflow and release traps

- Development is Bun-first, but publishing intentionally uses `npm publish` for npm Trusted Publishing; do not replace the publish workflow with Bun publishing.
- Versions are locked across the monorepo, including `packages/openclaw-smart-fetch/openclaw.plugin.json`; use `bun run version:patch|minor|major` rather than editing one package version in isolation.
- Every merge to `main` releases by default as `patch`; add a `.changeset/*.md` whose first line is `patch`, `minor`, or `major` when the bump needs to differ. Release tags must match every package version.
- Install the local pre-commit hook with `bun run hooks:install` when working on commits.

## Maintenance

- After editing code, refresh the grep/symbol map for changed entrypoints and shared functions; add newly discovered, verified pitfalls here only when future agents are likely to miss them.
- Keep progress and next tasks in `LOG.md`, `WORKFLOW.md`, or another existing progress file; never use `AGENTS.md` as a progress log.
