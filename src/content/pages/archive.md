---
title: "Archive"
description: "Older articles, Umbraco packages, documentation and photography from earlier chapters of Sam Mullins' work."
authorship: "sam-ai"
blocks:
  - type: "hero"
    variant: "plain"
    heading: "Archive"
    subheading: "Earlier chapters: Umbraco packages, their docs, older articles and a year of photos. Kept here so the links keep working."
  - type: "listing"
    heading: "Articles"
    variant: "list"
    query:
      from: "articles"
      archived: "only"
  - type: "listing"
    heading: "Software and documentation"
    variant: "grid"
    query:
      from: "software"
      archived: "only"
      topLevelOnly: true
      sort: "title"
  - type: "cards"
    heading: "Photography"
    variant: "text"
    surface: "muted"
    columns: 2
    items:
      - title: "Photography"
        text: "Cameras, kingfishers and the odd reptile."
        href: "/photography/"
      - title: "PhotoShare21"
        text: "My 2021 resolution: a new album every week."
        href: "/photography/photoshare21/"
---
