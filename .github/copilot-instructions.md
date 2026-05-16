<!-- Copilot instructions for Hugoplate-based Food Foundations Project -->
# Copilot: Project Guidance

Purpose: quick, actionable instructions to help AI coding agents be productive in this Hugo + Tailwind (Hugoplate) repository.

- **Big picture:** This repo is a Hugoplate Hugo boilerplate. The source includes a top-level theme and an `exampleSite/` that contains a runnable example. Styling tokens live in `exampleSite/data/theme.json` (when present) and are turned into CSS via `scripts/themeGenerator.js` which writes `assets/css/generated-theme.css`.

- **Dev vs Example:** Use `yarn dev` to run the theme generator and Hugo server for the root project; use `yarn dev:example` to run the generator and serve `exampleSite` specifically. Builds use `yarn build` and `yarn build:example` respectively.

- **Key files & patterns:**
  - Theme tokens: [exampleSite/data/theme.json](exampleSite/data/theme.json)
  - Token generator: [scripts/themeGenerator.js](scripts/themeGenerator.js) — run directly or via `--watch`.
  - Generated CSS: [assets/css/generated-theme.css](assets/css/generated-theme.css) (auto-generated — do not edit)
  - Hugo example content: [exampleSite/content/english/sections](exampleSite/content/english/sections)
  - Partials and overrides: [layouts/partials](layouts/_partials) and [layouts/essentials](layouts/_partials/essentials) — override module files by creating same-path files here.
  - Build scripts: [package.json](package.json) contains scripts such as `dev`, `dev:example`, `build`, `build:example`, `update-modules`, `remove-darkmode`.

- **Important behaviors for code changes**
  - Token workflow: edit `exampleSite/data/theme.json` → run `node scripts/themeGenerator.js` (or `yarn dev*`) → check `assets/css/generated-theme.css` updates. The generator detects exampleSite vs root theme automatically.
  - Watch mode: `node scripts/themeGenerator.js --watch` observes `theme.json` and rewrites output on changes (debounced).
  - Do not hand-edit `generated-theme.css`; change tokens in `theme.json` instead.

- **Tailwind / CSS notes**
  - This project uses Tailwind v4 with the `@theme` pattern; avoid adding a separate `tailwind.config.js` unless you understand the integration.
  - If new Tailwind classes appear missing in production, trigger a full build; the Hugo/Tailwind pipeline relies on `hugo_stats.json` and a full rebuild to capture classes.

- **Module & maintenance commands**
  - Refresh Hugo modules: `yarn run update-modules` (invokes `hugo mod clean/get/tidy` and clears modules script).
  - Removal helpers: `yarn run remove-darkmode` and `yarn run remove-multilang` exist to strip features — inspect `scripts/*.js` before running.

- **Where to change templates**
  - Homepage sections are assembled from `exampleSite/content/english/sections` and pulled into `layouts/index.html`. For visual changes, prefer editing section files not hardcoding markup into `layouts/index.html`.
  - Partial lookup rule: to override an imported module partial, add a file under `layouts/<module-path>` matching the partial path.

- **Testing / verification**
  - Quick dev check: run `yarn dev:example` and visit the local Hugo server output. Verify `generated-theme.css` changes and ensure Tailwind classes render.
  - Production build: `yarn build:example` runs the theme generator then `hugo --minify`.

- **Agent behavior rules (practical constraints)**
  - Preserve token-first approach: prefer editing `data/theme.json` over editing CSS.
  - Keep changes minimal and targeted; many templates are generic and intended to be overridden.
  - When modifying CSS or Tailwind, run the generator and build commands locally to confirm results.

If anything in these notes is unclear or you want more examples (e.g., concrete partial to edit for header/footer), tell me which area and I will expand.
