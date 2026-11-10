# Web Factory

A pnpm monorepo for spinning up statically generated sites, each one a **variant** built from a shared block library, edited in Sanity and deployed to Netlify.

The architecture and roadmap are in the *Personal Web Factory — Architecture* doc. This repo is **Phase 1**: the base template, five blocks, the theme system, and static production builds.

## Quick start

```bash
corepack enable          # once, makes pnpm available (or: npm i -g pnpm)
pnpm install
pnpm dev                 # http://localhost:3000
```

With no Sanity project connected, the site renders the starter content from `templates/seed/starter.ndjson`, and a banner at the top says so.

## Connect Sanity

1. Create a project at [sanity.io/manage](https://www.sanity.io/manage), or run `pnpm dlx sanity@latest init --bare`.
2. `cp apps/starter/.env.example apps/starter/.env.local`, then set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `SANITY_STUDIO_PROJECT_ID`.
3. Under **API → CORS origins**, add `http://localhost:3000` (allow credentials).
4. Import the starter content: `pnpm seed`. You need to be logged in, so run `pnpm --filter @factory/starter exec sanity login` first if prompted.
5. `pnpm dev`, then open [localhost:3000/studio](http://localhost:3000/studio).

### Live visual editing locally

Add these to `.env.local`:

```bash
NEXT_PUBLIC_SANITY_VISUAL_EDITING=true
SANITY_API_READ_TOKEN=<a Viewer token from sanity.io/manage → API → Tokens>
```

Restart, then open **Presentation** in the Studio. You can click any text to edit it, and drag blocks (hold Shift for the minimap) to reorder the page.

## Layout

```
packages/
  ui/              shadcn/ui primitives + theme engine (presets → OKLCH palette, contrast checks)
  blocks/          one folder per block: schema.ts, component.tsx, query.ts
  schemas/         page, siteSettings, theme (with the Studio theme picker)
  sanity-client/   env, client, GROQ queries, result types
apps/
  starter/         a variant: Next.js 16 app + embedded Studio at /studio
templates/seed/    starter content (edit build-seed.mjs, then run it)
scripts/factory/   pnpm factory:new <name>
```

## Everyday tasks

| Task | How |
| --- | --- |
| New variant | `pnpm factory:new my-site --title "My Site" --blocks hero,featureGrid,cta` |
| Change a variant's blocks | Edit `apps/<name>/factory.config.ts` |
| Brand a variant | Studio → **Theme**: preset, primary + accent colour, radius, fonts, mode |
| Add a shadcn component | `pnpm ui:add dialog` (writes to `packages/ui/src/components`) |
| Typecheck everything | `pnpm typecheck` |

## Adding a block

1. Create `packages/blocks/src/<block>/` with `schema.ts`, `component.tsx` and `query.ts`. Copy `cta/` as a starting point.
2. Register it in three places: `blockNames` + `blockQueries` in `src/index.ts`, `blockSchemas` in `src/schemas.ts`, and `registry` in `src/page-builder.tsx`.
3. Add the block name to a variant's `factory.config.ts`.

Two rules:

- **`stegaClean()` any CMS value used for logic or styling.** In preview, strings carry invisible characters that break `===` comparisons, class names and lookups.
- **Keep blocks as server components.** Only interactive shadcn parts (Accordion, Dialog, Carousel) should be client components.

## Deploying to Netlify (two sites per variant)

Both sites use the same repo, with **Base directory** `apps/<name>`.

| | Production | Preview |
| --- | --- | --- |
| `NEXT_PUBLIC_SANITY_VISUAL_EDITING` | `false` | `true` |
| `SANITY_API_READ_TOKEN` | not set | Viewer token |
| `NEXT_PUBLIC_SANITY_PREVIEW_URL` | preview site URL | preview site URL |
| Access | public | Netlify password protection |

Then:

1. In Netlify, open the production site → **Build hooks**, and create a hook.
2. In Sanity, go to **API → Webhooks** and create one that POSTs to the build hook on create/update/delete, with filter `_type in ["page", "siteSettings", "theme"]`.
3. Add both site URLs to Sanity's CORS origins.

Phase 4 of the roadmap automates all of this inside `factory:new`.
