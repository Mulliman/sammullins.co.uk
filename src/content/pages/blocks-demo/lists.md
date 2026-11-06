---
title: Lists blocks demo
description: Demo of the cards, listing, nextPrev and timeline blocks.
authorship: sam
noindex: true
hidden: true
blocks:
  - type: cards
    heading: Full cards, manual
    variant: full
    columns: 3
    surface: muted
    items:
      - title: Beach portrait
        text: A **manual** card with an image, text and a link.
        image:
          src: ../../../assets/demo/demo.jpg
          alt: A portrait on a beach at dusk
        href: /
      - title: Client logo
        text: "Plain text under the frame. Links in text stay clickable: [see the home page](/)."
        image:
          src: ../../../assets/demo/logo.jpg
          alt: A client logo
        href: /
      - title: No link yet
        text: A card without an href shows the title only.
        image:
          src: ../../../assets/demo/demo.jpg
          alt: ""
          decorative: true

  - type: cards
    heading: Image cards, manual
    variant: image
    columns: 2
    items:
      - title: Title on a dark bar
        image:
          src: ../../../assets/demo/demo.jpg
          alt: A portrait on a beach at dusk
        href: /
      - title: Second image card
        image:
          src: ../../../assets/demo/demo.jpg
          alt: A portrait on a beach at dusk
        href: /

  - type: cards
    heading: Text cards, manual
    variant: text
    columns: 4
    items:
      - title: Four columns
        text: Text-only cards collapse to fewer columns as the width shrinks.
        href: /
      - title: Second
        text: Each card is one link.
        href: /
      - title: Third
        text: Markdown works *here* too.
      - title: Fourth
        text: A card with no link.

  - type: cards
    heading: From a query
    variant: full
    columns: 3
    query:
      from: articles
      limit: 3

  - type: listing
    heading: Notes feed
    variant: notes
    query:
      from: articles
      kind: note

  - type: listing
    heading: List with query
    variant: list
    query:
      from: software
      limit: 4

  - type: nextPrev
    prev:
      title: Previous part
      href: /
    next:
      title: Next part
      href: /


  - type: timeline
    heading: Timeline
    items:
      - when: "2019 to present"
        title: Senior developer
        org: Example Studio
        kind: role
        body: Leads the **front-end** work on client sites.
      - when: "2021"
        title: Accessibility certification
        org: Example Institute
        kind: cert
        body: Passed the practitioner exam.
      - when: "March 2022"
        title: First major launch
        kind: milestone
        body: Shipped the first product to production.
      - when: "2015 to 2018"
        title: BSc Computing
        org: Example University
        kind: education
---
Body.
