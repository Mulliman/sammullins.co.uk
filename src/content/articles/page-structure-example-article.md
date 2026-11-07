---
title: "[Article title]"
description: "[One or two sentences, up to 200 characters, on what the article covers and why it was written.]"
date: "2000-01-01" # [Replace with the publish date, as YYYY-MM-DD.]
series: "page-structure-example" # [Optional. Give the series a short slug, or delete this line and the order line.]
order: 1 # [Part number in the series.]
cover:
  src: "../../assets/demo/demo.jpg"
  alt: "[Describe the cover image for a screen reader.]"
authorship: "sam-ai" # [sam if Sam wrote the words, sam-ai if an AI drafted them.]
archived: false
hidden: true # [Example only. Remove for a real article.]
noindex: true # [Example only. Remove for a real article.]
blocks:
  - type: "hero"
    variant: "plain"
    heading: "[Article title]"
    subheading: "[Standfirst: the problem that started the work, or what the thing is, in one or two sentences.]"
  - type: "body"
    surface: "default"
  - type: "cards"
    heading: "[Heading for related reading]"
    variant: "text"
    surface: "muted"
    columns: 2
    query:
      from: "articles"
      kind: "article"
      limit: 2
  - type: "intro"
    heading: "[Give it a go!]"
    lead: "[One practical next step: a link, a command, or the thing the reader can try.]"
    cta:
      label: "[Button label]"
      href: "/articles/"
---

[Opening paragraph. Say what the thing is, or the problem that started it, in the first two sentences. No throat-clearing.]

## [First section heading]

[Explain what you built or tried, and name the tool, library or version it used. Say why it was chosen, in one clause.]

## [Second section heading]

[Say what broke or was harder than expected. Be honest about the limits.]

```text
[A short code sample, if the article needs one. The Code block adds a Copy button in the page.]
```

## [Closing section heading]

[One practical next step, once. Link to the thing it refers to.]
