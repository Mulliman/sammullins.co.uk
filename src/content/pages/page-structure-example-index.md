---
title: "[Index page title]"
description: "[One or two sentences, up to 200 characters, that say what the reader will find on this index page.]"
authorship: "sam-ai" # [sam if Sam wrote the words, sam-ai if an AI drafted them.]
hidden: true # [Example only. Remove for a real index page.]
noindex: true # [Example only. Remove for a real index page.]
blocks:
  - type: "hero"
    variant: "plain"
    heading: "[Index page title]"
    subheading: "[One line on what is listed here.]"
  - type: "listing"
    variant: "grid"
    query:
      from: "articles"
      kind: "article"
  - type: "listing"
    heading: "[Notes]"
    variant: "notes"
    query:
      from: "articles"
      kind: "note"
      limit: 20
  - type: "listing"
    heading: "[From the archive]"
    variant: "grid"
    surface: "muted"
    query:
      from: "articles"
      archived: "only"
---
