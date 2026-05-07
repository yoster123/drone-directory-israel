# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Read the Next.js docs before writing code

This project uses **Next.js 16**, which has breaking changes versus Next.js 13/14/15. Before writing any Next.js-specific code, read the relevant guide in `node_modules/next/dist/docs/`. Heed deprecation notices.

## Commands

```bash
npm run dev       # Start dev server (Turbopack, outputs to .next/dev)
npm run build     # Production build (Turbopack by default)
npm start         # Start production server
npm run lint      # Run ESLint directly (next lint was removed in v16)
```

Node.js 20.9+ is required.

## Architecture

- **Framework**: Next.js 16 with App Router (`app/` directory). No Pages Router.
- **Language**: TypeScript (strict mode, path alias `@/*` → project root)
- **Styling**: Tailwind CSS v4 via PostCSS. No `tailwind.config.*` — theme is configured inline in `app/globals.css` using `@theme`. Import with `@import "tailwindcss"`.
- **React**: 19.2 (with View Transitions, `useEffectEvent`, Activity component available)
- **Linting**: ESLint 9 flat config (`eslint.config.mjs`). Uses `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`.

## Next.js 16 breaking changes

These differ from prior training data and will cause bugs if you use the old patterns:

### Async Request APIs (breaking)
`cookies()`, `headers()`, `draftMode()`, `params`, and `searchParams` are **fully async** — synchronous access is removed.

```tsx
// Correct in v16
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
  const query = await props.searchParams
}
```

Run `npx next typegen` to generate `PageProps`, `LayoutProps`, and `RouteContext` type helpers.

### `middleware` → `proxy` (breaking)
Rename `middleware.ts` → `proxy.ts` and the exported function from `middleware` to `proxy`. The `edge` runtime is **not** supported in `proxy` (use Node.js). Config flags renamed too: e.g. `skipMiddlewareUrlNormalize` → `skipProxyUrlNormalize`.

### `next lint` removed
`next build` no longer runs linting. Run `eslint` directly. `eslint` option in `next.config.*` is removed.

### Caching APIs
- `revalidateTag` now requires a second `cacheLife` profile argument: `revalidateTag('posts', 'max')`
- `cacheLife` and `cacheTag` are stable — drop the `unstable_` prefix
- `updateTag` is a new Server Action API for read-your-writes semantics
- `refresh()` from `next/cache` refreshes the client router from a Server Action
- `experimental.dynamicIO` renamed to top-level `cacheComponents`
- PPR (partial prerendering) enabled via `cacheComponents: true` (not `experimental.ppr`)

### Parallel routes
All parallel route slots require explicit `default.js` files or builds will fail.

### Turbopack is default
`--turbopack` flag no longer needed. Use `--webpack` to opt out.

### Removed APIs
- `next/legacy/image` — use `next/image`
- `images.domains` — use `images.remotePatterns`
- `serverRuntimeConfig` / `publicRuntimeConfig` — use env vars directly; prefix with `NEXT_PUBLIC_` for client-side access
- AMP support (`next/amp`, `useAmp`) — fully removed
- `devIndicators.appIsrStatus`, `buildActivity`, `buildActivityPosition`
- `unstable_rootParams`

### React Compiler (opt-in, stable)
Enable in `next.config.ts` with `reactCompiler: true`. Requires `babel-plugin-react-compiler` dev dependency.

### `next/image` defaults changed
- `minimumCacheTTL`: 60s → 4 hours
- `qualities` default: all → `[75]` only
- `imageSizes` default: removed `16`
- Local images with query strings require `images.localPatterns.search` config
- Local IP optimization blocked by default (`images.dangerouslyAllowLocalIP` to override)
- Max redirects: unlimited → 3
