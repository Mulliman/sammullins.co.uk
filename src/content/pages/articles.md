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
  # A listing with no entries renders nothing, heading included, so the Articles and Notes bands only
  # appear once there is something in them (every article is archived until the launch articles land).
  - type: "listing"
    heading: "Articles"
    variant: "grid"
    surface: "default"
    query:
      from: "articles"
      kind: "article"
  - type: "listing"
    heading: "Notes"
    variant: "notes"
    surface: "muted"
    query:
      from: "articles"
      kind: "note"
      limit: 20
  - type: "listing"
    heading: "From the archive"
    variant: "list"
    surface: "default"
    query:
      from: "articles"
      archived: "only"
---
