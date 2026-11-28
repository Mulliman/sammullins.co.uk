---
title: "Articles"
description: "Articles and short notes by Sam Mullins on building software, AI-assisted development and the tools behind them."
authorship: "sam-ai"
blocks:
  # 509-symmetry (ticket 1407): centred hero, each listing in a centred band, bands alternate default and muted.
  - type: "hero"
    variant: "plain"
    align: "center"
    heading: "Articles"
    subheading: "Write-ups, notes and the occasional deep dive."
  - type: "section"
    surface: "default"
    blocks:
      - type: "intro"
        heading: "Articles"
      - type: "listing"
        variant: "grid"
        query:
          from: "articles"
          kind: "article"
  - type: "section"
    surface: "muted"
    blocks:
      - type: "intro"
        heading: "Notes"
      - type: "listing"
        variant: "notes"
        query:
          from: "articles"
          kind: "note"
          limit: 20
  - type: "section"
    surface: "default"
    blocks:
      - type: "intro"
        heading: "From the archive"
      - type: "listing"
        variant: "list"
        query:
          from: "articles"
          archived: "only"
---
