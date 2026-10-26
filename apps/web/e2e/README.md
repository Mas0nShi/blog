# Visual regression tests

Full-page screenshots of key pages (desktop and mobile, light and dark), compared against the baselines in `__screenshots__/`. They run on every PR in CI and guard refactors that should not change how the site looks.

## Determinism

- **Server data** — with `NOTION_FIXTURES=replay`, Notion pages, search results, LQIP preview images and tweets are read from `fixtures/server/` (see `lib/fixtures.ts`); nothing is fetched from Notion.
- **Browser traffic** — every request outside the app (images, Waline comments, avatars, tweet media) is replayed from `fixtures/har/`; unknown requests are aborted and analytics are always blocked. In fixture mode `next/image` serves original URLs, so the HARs don't depend on the host.
- **Time** — the browser clock is fixed; the footer copyright year is masked.
- **Rendering** — browsers always run in the Playwright Docker image matching `@playwright/test`, locally and in CI, so fonts and anti-aliasing match.

## Commands

Run from `apps/web` (needs Docker):

```sh
e2e/run.sh                      # compare against baselines
e2e/run.sh --update-snapshots   # accept intentional visual changes
e2e/run.sh record               # re-record server fixtures and HAR traffic
```

Extra arguments go to `playwright test`, e.g. `e2e/run.sh -g links`. Diffs are in `e2e/.report` (`pnpm exec playwright show-report e2e/.report`).

Pages under test are listed in `pages.json`; the `search` test opens the search dialog on the home page. Re-record when their content changes in Notion or a page is added: `e2e/run.sh record` (it fails on missing baselines, which is expected), then `e2e/run.sh --update-snapshots` to capture baselines from the replay, then `e2e/run.sh` to confirm they are stable. Recording also post-processes the HARs (`clean-har.mjs`): incomplete requests are dropped and animated GIFs/SVGs are frozen.
