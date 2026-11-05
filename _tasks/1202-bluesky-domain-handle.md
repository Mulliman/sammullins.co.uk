---
id: "1202"
title: Bluesky domain handle
epic: Launch
status: todo
priority: p2
size: S
owner: pair
depends_on: ["701"]
---

## Why

A verified `@sammullins.co.uk` Bluesky handle, free and on-brand for a static site.

## Scope

- **Sam:** provide the current Bluesky handle and DID (Settings → Account → Handle → "I have my own domain").
- Serve `/.well-known/atproto-did` (plain text DID, `Content-Type: text/plain`) from `public/`. Alternatively use the DNS TXT `_atproto` record in Netlify DNS; pick one and document it.
- Update the social link in site settings (103).

## Acceptance criteria

- [ ] Bluesky shows `@sammullins.co.uk` as verified.
- [ ] The footer link uses the new handle with `rel="me"`.
