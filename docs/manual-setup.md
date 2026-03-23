# Manual Setup Checklist

This document lists every manual configuration step needed to set up the project infrastructure from scratch. Complete these steps in order after pushing the repository code.

## 0. Make Repository Public
Since GitHub Free restricts branch protection rules to public repositories, ensure the repository visibility is set to **Public** in the repo settings.

## 1. Cloudflare API Token for DNSControl

Create a **single** API token for managing DNS.

1. Cloudflare dashboard → **My Profile → API Tokens → Create Token**
2. Select **Create Custom Token**
3. Permissions:
   - **Zone** · DNS · **Edit**
4. Zone resources: **Include** → All zones (or specifically select both `elainxi.events` and `elainxi.com`)
5. Create token and copy the value

## 2. GitHub Repository Secrets

Go to your repo → **Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | The token from step 1 |

## 3. GitHub Pages Setup

1. Go to repo → **Settings → Pages**
2. Under **Build and deployment → Source**, ensure **GitHub Actions** is selected.
3. Under **Custom domain**, enter `elainxi.events` and click **Save**.
4. GitHub will verify the DNS. Once complete, check ✅ **Enforce HTTPS**.

## 4. DNS Records (Automated)

DNS is managed by DNSControl in `dns/dnsconfig.js` and deployed by the `dns-push.yml` workflow. The initial deploy will create:

- `A` and `AAAA` records pointing `elainxi.events` to GitHub Pages IPs.
- `CNAME www` → `elainxi.events`
- `CNAME @` and `CNAME www` on `elainxi.com` pointing to `elainxi.events` (for redirect routing)

> **First-time bootstrap:** Since DNSControl runs on push to `main` (only when DNS files change), the records will be created on the first push that includes `dns/dnsconfig.js`. If you need to bootstrap DNS before the first push, run `dnscontrol push` locally with `CLOUDFLARE_API_TOKEN` set in your environment.

## 5. Cloudflare Redirect Rules (`elainxi.com` → `elainxi.events`)

In the Cloudflare dashboard for the `elainxi.com` zone:
1. Go to **Rules → Redirect Rules → Create rule**
2. Rule name: `Redirect to .events`
3. **When:** Custom filter expression
   - Field: `Hostname`
   - Operator: `contains`
   - Value: `elainxi.com`
4. **Then:** Dynamic redirect → Expression: `concat("https://elainxi.events", http.request.uri.path)`
5. Status code: **301**, Preserve query string: ✅
6. Ensure your Cloudflare SSL/TLS encryption mode is set to **Full (strict)** for both zones.

## 6. GitHub Branch Protection

1. Go to repo → **Settings → Rules → Rulesets → New ruleset**
2. Ruleset name: `main branch protection`
3. Enforcement status: **Active**
4. Target branches: `main`
5. Rules:
   - ✅ **Require status checks to pass before merging**
     - Add `dns-gate` as a required check
   - ✅ **Require branches to be up to date before merging** (recommended)

## 7. Enable Auto-merge

1. Go to repo → **Settings → General → Pull Requests**
2. ✅ **Allow auto-merge**

## 8. Create the `approved-dns` Label

1. Go to repo → **Issues → Labels → New label**
2. Name: `approved-dns`
3. Color: `#d93f0b`
4. Description: DNS changes reviewed and approved for deployment

## Verification

After all steps are complete and the first push to `main` has triggered the workflows:

- [ ] **Actions tab**: `Deploy Hexo to GitHub Pages` shows green ✅
- [ ] `https://elainxi.events` loads the site
- [ ] `https://elainxi.com` redirects to `https://elainxi.events`
- [ ] `https://www.elainxi.com` redirects to `https://elainxi.events`
- [ ] Create a test PR modifying `dnsconfig.js` → `DNS Change Gate` runs and blocks without label
