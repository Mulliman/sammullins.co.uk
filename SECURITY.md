# Security policy

This repo builds a **static website**: plain HTML, CSS, a little first-party JavaScript and images, served by Netlify with strict security headers. There's no server code, no database, no forms and no user accounts.

## Reporting a vulnerability

Use **GitHub private vulnerability reporting** (Security → Report a vulnerability) on this repository. Please don't open a public issue.

In scope: anything that lets someone run script on www.sammullins.co.uk, bypass the Content Security Policy, tamper with the build or supply chain (dependencies, GitHub Actions), or leak personal data.

Out of scope: missing best-practice headers on third-party sites, social engineering, volumetric DoS, and reports from automated scanners without a demonstrated impact.

## Hardening in place

- Static output only; Netlify Functions, Forms and Identity are disabled
- Per-page CSP with hashed scripts and styles, `default-src 'self'`, `frame-ancestors 'none'`
- No third-party scripts, fonts or trackers (analytics: self-hosted GoatCounter script, cookieless)
- pnpm with a 7-day minimum release age, install scripts blocked except for `sharp`/`esbuild`, exact versions
- GitHub Actions pinned to commit SHAs with least-privilege tokens; CodeQL and OpenSSF Scorecard
