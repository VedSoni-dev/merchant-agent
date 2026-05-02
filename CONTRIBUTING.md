# Contributing

Thanks for considering a contribution. v0.1 is intentionally locked at four endpoints, but there's plenty of useful work that doesn't change the spec surface.

## What's open

- **Bug fixes in the SDK** — open a PR straight away.
- **Docs improvements** — clearer quickstarts, more framework adapters (Hono, Fastify, Cloudflare Workers, Bun, Deno), real-world deployment guides.
- **Adapter packages** — `merchant-agent-express`, `merchant-agent-nextjs`, `merchant-agent-hono` thin wrappers if the core handler needs a niche framework.
- **Reference merchants** — beyond GoldenHour, real or fictional fixtures showing how different verticals (apparel, software, food, services) write good cross-sell / brand-story / offer logic.
- **Buyer-agent clients** — browser extensions, MCP servers, Claude Desktop plugins that respect the discovery tag.

## What's not open in v0.1

- **New primitives.** Loyalty, reviews, subscriptions, returns are deferred to v0.2.
- **Spec changes.** v0.1 is locked. Open an issue tagged `v0.2` for spec proposals.
- **Auth.** v0.2 will add optional bearer-token + verified-buyer-agent identity.

## Process

1. Open an issue first for spec / API surface changes.
2. Small fixes (docs, bugs, adapters) can go straight to PR.
3. Tests required for any SDK change. Aim for 80%+ coverage on touched files.
4. Style: TypeScript strict mode, ESM, no default exports for new public API.

## Local dev

```bash
git clone https://github.com/VedSoni-dev/merchant-agent
cd spec
pnpm install
pnpm test
pnpm demo  # runs the local A/B comparison site at http://localhost:3000
```

## License

MIT. By contributing you agree that your contributions are licensed under the same terms.
