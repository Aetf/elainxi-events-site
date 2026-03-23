# Architecture Overview

This document outlines the high-level architecture of `elainxi-events-site`.

## Framework Stack
- **Static Site Generator:** Hexo (v8.1.1)
- **Primary Theme:** `story` (a highly customized fork of HTML5 UP's "Story")
- **Package Manager:** NPM
- **CLI & Version Manager:** `mise` is used to manage Node.js versions and securely execute CLI tools.

## Theme Architecture (`story`)
The `story` theme is constructed to decouple standard Markdown editing from the HTML/CSS complexity of modern responsive layouts:
- **Renderer Dependencies:** It uses `hexo-renderer-dartsass`, `hexo-renderer-nunjucks`, and `hexo-renderer-marked`.
- **Custom Tag Engine:** Instead of forcing content creators to write HTML `div` blocks, the theme relies on Hexo custom tags (e.g., `{% asbanner %}`). These tags parse the markdown content and inject it into pre-built Nunjucks templates inside `themes/story/layout/`.
- **Styling:** CSS is completely modularized via Dart Sass within `themes/story/source/`.

## Deployment & CI/CD

### Hexo Site Deployment
The project uses **GitHub Actions** with the newer **Actions-based Pages deployment** (not the legacy `gh-pages` branch approach):

1. **Trigger:** Push to `main` or manual `workflow_dispatch`.
2. **Build:** `jdx/mise-action` installs Node.js and hexo-cli from `mise.toml`, then `npm ci` + `hexo generate` produces the static site in `public/`.
3. **Deploy:** `actions/upload-pages-artifact` + `actions/deploy-pages` deploy directly via the GitHub Pages API.
4. **Custom Domain:** `source/CNAME` contains `elainxi.events`, which Hexo copies to the deploy root.

### DNS Management (DNSControl)
DNS records are managed as code via [DNSControl](https://dnscontrol.org/) with Cloudflare as the DNS provider:

- **Config:** `dns/dnsconfig.js` defines all DNS records for `elainxi.events`.
- **Credentials:** `dns/creds.json` references `$CLOUDFLARE_API_TOKEN` (stored as a GitHub Secret).
- **Preview on PR:** `dns-gate.yml` runs `dnscontrol preview`, posts output as a PR comment, and enforces an `approved-dns` label before merge is allowed (label-blocker pattern).
- **Push on Merge:** `dns-push.yml` runs `dnscontrol push` when DNS files change on `main`.

### Workflows Summary

| Workflow | Trigger | Purpose |
|---|---|---|
| `deploy.yml` | Push to `main` | Build Hexo site + deploy to GitHub Pages |
| `pr-check.yml` | Pull Request | "Sanity Check" ensuring Hexo gracefully compiles without syntax errors |
| `dependabot-merge.yml`| Dependabot PR | Runs Playwright to compare `main` against PR for pixel-perfect dynamic visual regression. Auto-merges on success; uploads visual diffs and comments on failure |
| `dns-gate.yml` | PR to `main` | DNSControl preview + label-blocker approval gate |
| `dns-push.yml` | Push to `main` (DNS paths only) | Apply DNS changes via `dnscontrol push` |
