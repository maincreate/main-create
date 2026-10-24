# TinkerTunnel website

Public static site for **tinkertunnel.com** via GitHub Pages.

- Repository: `TinkerTunnel/tinkertunnel.github.io`
- Product source: `TinkerTunnel/tinkertunnel` (separate repository)
- Hosting: GitHub Pages, branch deployment from `main` at `/` (no GitHub Actions required)
- Custom domain: `tinkertunnel.com` configured through `CNAME`

The site is intentionally static and does not host the MCP gateway or managed relay.

## Publishing

Commit updates directly to `main` or merge reviewed pull requests. In repository Settings → Pages choose **Deploy from a branch**, `main`, `/ (root)`. Configure DNS with the registrar and enable HTTPS when the certificate is ready. The repository must be public for GitHub Pages on a GitHub Free organization.
