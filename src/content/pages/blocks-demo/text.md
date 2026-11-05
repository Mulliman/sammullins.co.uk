---
title: Text blocks demo
description: Kitchen-sink page for the hero, intro, prose, callout, quote and code blocks.
authorship: sam
noindex: true
hidden: true
blocks:
  - type: hero
    variant: blurred
    heading: Blurred hero
    subheading: The same photo, blurred behind a framed sharp copy.
    image:
      src: ../../../assets/demo/demo.jpg
      alt: A portrait of a person on a beach
    align: center
  - type: hero
    variant: image
    heading: Image hero
    subheading: Framed photo with the heading below it.
    image:
      src: ../../../assets/demo/demo.jpg
      alt: A portrait of a person on a beach
    align: left
  - type: hero
    variant: plain
    heading: Plain hero
    subheading: Text only, on the inverse surface.
    align: center
  - type: intro
    kicker: Kicker
    heading: Intro heading
    lead: A **lead paragraph** that is larger than body text, with a [link](https://example.com/).
    align: center
    surface: muted
  - type: intro
    heading: Left-aligned intro, default surface
    lead: Shorter lead with no kicker.
    align: left
    surface: default
  - type: intro
    kicker: Inverse
    heading: Intro on the inverse surface
    lead: Light text on a dark section.
    align: left
    surface: inverse
  - type: prose
    align: left
    markdown: |
      ## A prose heading

      Prose is rendered at build time at a readable measure. Raw HTML like <em>this</em> is escaped, not rendered.

      ### A smaller heading

      - A list item
      - Another list item with a [link](https://example.com/)

      Plain paragraph text to check the vertical rhythm.
  - type: prose
    align: center
    markdown: |
      A centred prose paragraph, for short statements.
  - type: callout
    tone: note
    title: Note title
    body: A note with a **title** and a body paragraph.
  - type: callout
    tone: tip
    body: A tip with no title.
  - type: callout
    tone: warning
    title: Careful
    body: A warning. The label and icon say so, not just the colour.
  - type: callout
    tone: legacy
    title: From the archive
    body: This page is from an earlier chapter of my work and may be out of date.
  - type: quote
    text: |
      Good design is as little design as possible.
    attribution: Dieter Rams
    source: https://www.vitsoe.com/
  - type: quote
    text: A quote without attribution or source.
  - type: code
    lang: js
    filename: example.js
    code: |
      const greet = (name) => `Hello, ${name}!`;
      console.log(greet('world'));
  - type: code
    lang: text
    code: |
      A long line that should scroll horizontally inside the block rather than widening the page: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
---
