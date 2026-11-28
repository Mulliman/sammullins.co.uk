---
title: "Archive"
description: "Older articles, Umbraco packages, documentation and photography from earlier chapters of Sam Mullins' work."
authorship: "sam-ai"
blocks:
  # 509-symmetry (ticket 1407): centred hero, each listing in a centred band, bands alternate default and muted.
  - type: "hero"
    variant: "plain"
    align: "center"
    heading: "Archive"
    subheading: "Earlier chapters: Umbraco packages, their docs, older articles and a year of photos. Kept here so the links keep working."
  - type: "section"
    surface: "default"
    blocks:
      - type: "intro"
        heading: "Articles"
      - type: "listing"
        variant: "list"
        query:
          from: "articles"
          archived: "only"
  - type: "section"
    surface: "muted"
    blocks:
      - type: "intro"
        heading: "Software and documentation"
      - type: "listing"
        variant: "grid"
        query:
          from: "software"
          archived: "only"
          topLevelOnly: true
          sort: "title"
  - type: "section"
    surface: "default"
    blocks:
      - type: "intro"
        heading: "Photography"
      - type: "cards"
        variant: "text"
        columns: 2
        items:
          - title: "Photography"
            text: "Cameras, kingfishers and the odd reptile."
            href: "/photography/"
          - title: "PhotoShare21"
            text: "My 2021 resolution: a new album every week."
            href: "/photography/photoshare21/"
---
