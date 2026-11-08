# Main{Create} public website

Static public website for **maincreate.com**, including the product homepage and builder documentation. The private self-hosted application lives separately in [maincreate/main-platform](https://github.com/maincreate/main-platform).

## Design

The public site shares the controller's **Cool Mist** color tokens: `#f4f6f7` background, `#fcfdfe` surfaces, `#20292d` text, `#53636b` muted text, `#d9e2e6` borders, and `#2d6279` accent. Marketing illustrations are explicitly marked as concept views; alpha and planned features are not represented as production-ready.

## CI and deployment

`.github/workflows/pages.yml` runs on the existing organization runner labels `[self-hosted, ci, linux-x64]`. A branch named `design/**` runs validation and assembles `_site/` without deploying. A `main` push validates and deploys to GitHub Pages using `actions/upload-pages-artifact` and `actions/deploy-pages`. Workflow dispatch is also available. No Node package installation is required.

Locally, run:

```sh
python3 scripts/build-site.py
```

The build validates local HTML paths, the `CNAME` file, and the complete list of intended publishable files. It copies only the homepage, CSS, docs, and `CNAME` into `_site/`. Keep repository secrets and application configuration out of the public site.

## One-time GitHub Pages setup

1. In **maincreate/main-create → Settings → Pages**, enable Pages and choose **GitHub Actions** as its source.
2. Set **Custom domain** to `maincreate.com` and save. When publishing with Actions, the repository's `CNAME` file is *not* a replacement for setting the custom domain in Pages settings.
3. Confirm the organization plan allows GitHub Pages for this repository. GitHub Free for organizations generally requires the repository to be **public**; GitHub Team or other eligible plans can host a publicly accessible Pages site from a private repository. **Do not change repository visibility without reviewing its contents and authorizing that change.**
4. Check the production workflow run and successful Pages deployment before changing DNS.

## Cloudflare DNS (publish only after Pages is configured)

For the active `maincreate.com` Cloudflare zone, use the official GitHub Pages targets, initially **DNS only** (not proxied). Do not point a domain at an unclaimed Pages site.

| Type | Host | Target |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |
| CNAME | www | maincreate.github.io |

After Pages custom domain and DNS are verified, enable **Enforce HTTPS** in GitHub Pages settings. Cloudflare proxying can be assessed separately after origin HTTPS is confirmed. No Cloudflare API token is needed on the CI runner because DNS is a one-time domain configuration, not part of each site publish.

## Troubleshooting

- **Build passes, deploy skipped**: expected on `design/**`; merge to `main`.
- **Configure GitHub Pages fails**: first enable Pages via repository Settings. The default `GITHUB_TOKEN` cannot automatically initialize Pages.
- **Build stays queued**: check that the organization runner is online and exposes `self-hosted`, `ci`, and `linux-x64` labels to this repository.
- **Site unreachable**: check Cloudflare's authoritative DNS, then Pages custom domain and certificate provisioning.
