---
title: "Software"
description: "As well as spending my career building production websites for others I also like to build software for myself. If I build something that could be used by anyone else, I try to make the code open…"
authorship: "sam-ai"
blocks:
  # 509-symmetry (ticket 1406): plain hero, then one centred intro per band, one balanced component
  # and optional left-aligned prose. Bands alternate default and muted; the last band is never dark.
  - type: "hero"
    variant: "plain"
    align: "center"
    heading: "Software"
    subheading: "Free, open source products for web developers, photographers and people who want a bit of fun."
  - type: "section"
    surface: "default"
    blocks:
      - type: "prose"
        markdown: |-
          As well as spending my career building production websites for others I also like to build software for myself. If I build something that could be used by anyone else, I try to make the code open source and release it as a free product. I've built products that can be used by web developers, photographers and people just looking for a bit of fun.
  - type: "section"
    surface: "muted"
    blocks:
      - type: "intro"
        heading: "For families"
        lead: "Find a book with a little one's name in it."
        align: "center"
      - type: "cards"
        variant: "row"
        columns: 1
        items:
          - title: "Is Baby In A Book"
            text: "Struggling to find that perfect gift for a little one? Find a book with their name in it using Is Baby In A Book!"
            href: "/software/is-baby-in-a-book/"
            image:
              src: "../../assets/media/ycspud32/biab-sam-site.avif"
              alt: ""
              decorative: true
  - type: "section"
    surface: "default"
    blocks:
      - type: "intro"
        heading: "For web developers"
        lead: "Two free, open source Umbraco packages I built."
        align: "center"
      - type: "cards"
        variant: "row"
        columns: 2
        items:
          - title: "xStatic for Umbraco"
            text: "xStatic is a free Umbraco package that generates static HTML sites from Umbraco content. This allows for very cheap and fast hosting of simple sites."
            href: "/software/xstatic-for-umbraco/"
            award:
              label: "Winner"
              title: "Umbraco Package Award"
              detail: "Best newcomer 2021"
            image:
              src: "../../assets/media/egdifrhl/banner.avif"
              alt: ""
              decorative: true
          - title: "XPEDITE for Umbraco"
            text: "Create Umbraco headless websites FAST! XPEDITE guides you through setting up headless Umbraco websites and automates building unit tested components."
            href: "/software/xpedite-for-umbraco/"
            image:
              src: "../../assets/media/gaajlr4q/banner.avif"
              alt: ""
              decorative: true
      - type: "prose"
        markdown: |-
          This site used to be built with two of my own open source projects, [UmbracoFolio](/software/umbracofolio/) and [xStatic](/software/xstatic-for-umbraco/). I started both so that I could build and host it for free.

          The current version is built with [Astro](https://astro.build/), and the source is on [GitHub](https://github.com/Mulliman/sammullins.co.uk). If you'd rather run your own site on Umbraco, UmbracoFolio and xStatic are still there: anyone with a bit of ASP.Net knowledge should be able to set one up within an hour.

          Umbraco is a fantastic CMS that can handle pretty much any task you throw at it, and like my two products is open source and free! You can install Umbraco via NuGet or by visiting [their website](https://umbraco.com/).
  - type: "section"
    surface: "muted"
    blocks:
      - type: "intro"
        heading: "For photographers"
        lead: "Two Capture One plugins for panoramas and watermarks."
        align: "center"
      - type: "cards"
        variant: "row"
        columns: 2
        items:
          - title: "PanoCapture"
            text: "PanoCapture is a free and open source plugin for CaptureOne that allows users to create panoramas from multiple photos."
            href: "/software/panocapture/"
            image:
              src: "../../assets/media/tolji2b5/panocapture.avif"
              alt: ""
              decorative: true
          - title: "PostCapture"
            text: "PostCapture is a CaptureOne plugin (and standalone program) that applies different watermarks and borders to images depending on EXIF data."
            href: "/software/postcapture/"
            image:
              src: "../../assets/media/irbdcjra/postcapture.avif"
              alt: ""
              decorative: true
      - type: "prose"
        markdown: |-
          Both these CaptureOne plugins are Windows only.

          You can purchase CaptureOne directly from [their website](https://www.captureone.com/).
  - type: "section"
    surface: "default"
    blocks:
      - type: "intro"
        heading: "For everyone"
        lead: "Games for a room full of people, each on their own phone."
        align: "center"
      - type: "cards"
        variant: "row"
        columns: 1
        items:
          - title: "Party games"
            text: "Four games for a room full of people, each on their own phone: The Imposter, It All Ends In Tiers, Blowhard and Spoof."
            href: "/party-games/"
            image:
              src: "../../assets/media/party-games/party-games.avif"
              alt: ""
              decorative: true
---
