# Changelog

All notable operations and modifications performed by the agent on the `elainxi-events-site` project will be documented in this file.

## [2026-03-22] - Initial Docs Setup

### Added
- Created the initial `docs/changelog.md` to begin tracking agent operations.
- Added strict Documentation Requirements rules to `AGENTS.md`.

### Changed
- Renamed the agent guideline file from `AGENT.md` to `AGENTS.md`.
- Updated `AGENTS.md` with guidelines instructing all agents to continually document architecture and design decisions in this `docs/` repository, including chronological updates in this changelog.

## [2026-03-22] - Seeded Initial Documentation

### Added
- Created `docs/architecture.md` to detail Hexo framework and GitHub Actions integration.
- Created `docs/components.md` to document the layout engine and available modular block tags.
- Created `docs/configuration.md` to map the site hierarchy of config files.

## [2026-03-22] - Enforced Mise CLI Tooling

### Changed
- Updated `AGENTS.md` to explicitly ban `npx` and mandate `mise` for all CLI tool executions.
- Updated `docs/architecture.md` to document `mise` as the project's nodejs version and CLI manager.

## [2026-03-22] - GitHub Actions CI/CD & DNSControl Setup

### Added
- Created `.github/workflows/deploy.yml` — builds Hexo site via `mise` + deploys to GitHub Pages using the Actions-based deployment API (no `gh-pages` branch).
- Created `.github/workflows/dns-gate.yml` — label-blocker approval gate for DNS changes. Runs `dnscontrol preview` on PRs touching `dns/dnsconfig.js`, posts output as a PR comment, and requires the `approved-dns` label before merge is allowed.
- Created `.github/workflows/dns-push.yml` — runs `dnscontrol push` to Cloudflare when DNS config changes are merged to `main`.
- Created `dns/dnsconfig.js` — DNSControl configuration with GitHub Pages A/AAAA/CNAME records for `elainxi.com`.
- Created `dns/creds.json` — Cloudflare credentials using `$CLOUDFLARE_API_TOKEN` env var reference.
- Created `source/CNAME` — custom domain file for GitHub Pages (`elainxi.com`).
- Added `github-actions` package ecosystem to `.github/dependabot.yml`.

### Changed
- Rewrote `docs/architecture.md` "Deployment & CI/CD" section to document all three workflows and the DNSControl integration.

## [2026-03-22] - Migrated to Cloudflare Pages

### Added
- Created `docs/manual-setup.md` — comprehensive from-scratch setup checklist for Cloudflare, GitHub secrets, branch protection, auto-merge, and DNS.

### Changed
- Rewrote `.github/workflows/deploy.yml` to deploy to Cloudflare Pages via `cloudflare/wrangler-action` (project: `elainxi-events-site`) instead of GitHub Pages.
- Replaced GitHub Pages A/AAAA records in `dns/dnsconfig.js` with a CNAME to `elainxi-events-site.pages.dev`.
- Updated `docs/architecture.md` to reflect Cloudflare Pages as the deployment target.

### Removed
- Deleted `source/CNAME` (not needed for Cloudflare Pages — custom domain is configured in the Cloudflare dashboard).

## [2026-03-22] - Reverted to GitHub Pages

### Added
- Added `LICENSE` file containing an "All Rights Reserved" clause, as the repository will be made public to support branch protection rules on GitHub Free limits.
- Re-added `source/CNAME` with `elainxi.com` for GitHub Pages.

### Changed
- Reverted `.github/workflows/deploy.yml` back to GitHub Pages deployment using `actions/upload-pages-artifact` and `actions/deploy-pages`.
- Reverted `dns/dnsconfig.js` back to GitHub Pages A and AAAA records, maintaining the www CNAME to apex.
- Updated `docs/manual-setup.md` to instruct making the repository public and configuring GitHub Pages instead of Cloudflare Pages.
- Updated `docs/architecture.md` to reflect GitHub Pages deployment.

## [2026-03-22] - Changed Main Domain to elainxi.events

### Changed
- Updated `_config.yml` URL to `https://elainxi.events`.
- Updated `source/CNAME` to `elainxi.events`.
- Expanded `dns/dnsconfig.js` to manage both `elainxi.events` (as the primary GitHub Pages zone) and `elainxi.com` (as an alias redirecting to `.events`).
- Updated `docs/manual-setup.md` to reflect the new domain, multi-zone Cloudflare token, and an updated redirect rule on the `.com` zone.
- Replaced `elainxi.com` references with `elainxi.events` in `docs/architecture.md` and `docs/configuration.md`.

## [2026-03-22] - Strict CI Validation and Dependabot Auto-Merge

### Added
- Created `.github/workflows/pr-check.yml` to run a strict "Sanity Check" (Hexo generation) on all PRs to support content creators utilizing GitHub's auto-merge.
- Created `.github/workflows/dependabot-merge.yml` to specifically handle Dependabot PRs using a Zero-Baseline Dynamic Diff.
- Added `@playwright/test`, `http-server`, and `wait-on` to `package.json` devDependencies.
- Created `playwright.config.js` and `tests/visual.spec.js` to execute automated UI screenshots and pixel matching.

### Changed
- Updated `docs/architecture.md` to document the new `pr-check.yml` and `dependabot-merge.yml` workflows.
- Configured `.gitignore` to ignore Playwright `test-results/` and `playwright-report/` artifacts.
- Created `docs/mistakes.md` to catalog AI agent errors and updated standard operating instructions in `AGENTS.md` to enforce reviewing this log prior to taking action.

