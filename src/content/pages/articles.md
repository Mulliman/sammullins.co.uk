---
title: "Articles"
description: "Articles and short notes by Sam Mullins on building software, AI-assisted development and the tools behind them."
authorship: "sam-ai"
blocks:
  - type: "hero"
    variant: "plain"
    heading: "Articles"
    subheading: "Write-ups, notes and the occasional deep dive."
  - type: "listing"
    variant: "grid"
    query:
      from: "articles"
      kind: "article"
  - type: "listing"
    heading: "Notes"
    variant: "notes"
    query:
      from: "articles"
      kind: "note"
      limit: 20
  - type: "listing"
    heading: "From the archive"
    variant: "list"
    surface: "muted"
    query:
      from: "articles"
      archived: "only"
---
