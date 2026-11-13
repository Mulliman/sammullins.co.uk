---
title: "Software"
description: "Software I've built for myself and released, from an award-winning Umbraco package to party games, a golf app and CaptureOne plugins. Most of it is free and open source."
authorship: "sam-ai"
blocks:
  - type: "hero"
    variant: "plain"
    heading: "Software"
    subheading: "As well as spending my career building production websites for others, I like to build software for myself. If something could be useful to anyone else, I try to make the code open source and release it for free. These days most of it is built with coding agents, and anything unfinished is marked as a beta."
  - type: "body"
    surface: "default"
  - type: "cards"
    variant: "full"
    surface: "default"
    columns: 2
    items:
      - title: "xStatic for Umbraco"
        text: "xStatic is a free Umbraco package that generates static HTML sites from Umbraco content. This allows for very cheap and fast hosting of simple sites."
        href: "/software/xstatic-for-umbraco/"
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
    markdown: "Umbraco is a fantastic CMS that can handle pretty much any task you throw at it, and like my two products is open source and free! You can install Umbraco via NuGet or by visiting [their website](https://umbraco.com/)."
  - type: "section"
    surface: "muted"
    blocks:
      - type: "intro"
        heading: "For everyone"
        lead: "Party games for playing in the same room, each one on its own phone. They're installable web apps, so nobody has to download anything from an app store."
        align: "center"
      - type: "image"
        frame: "none"
        image:
          src: "../../assets/media/gccp2anv/imposter-promo.avif"
          alt: "The Imposter logo between two phones showing the game's round overview, with two cartoon players in the middle"
      - type: "prose"
        markdown: |-
          #### The Imposter is a party game for 4 to 7 people, based on the Big Potato classic 'The Chameleon' with a few different rules and a more fun scoring system.

          Each round, one player is randomly chosen as the imposter, and that player needs to discover the secret word without attracting suspicion from the others.

          I first built it in 2019 with Ionic, Angular and .NET Core. In October 2026 I rebuilt it with coding agents on a single Cloudflare Worker, and the page below compares the two.
      - type: "cards"
        variant: "full"
        columns: 2
        items:
          - title: "Give it a go!"
            text: "The Imposter is free to play, and doesn't require anything to be installed. All you need is 3 other friends."
            href: "https://imposter.sammullinsai.workers.dev/"
            image:
              src: "../../assets/media/sa5htm0x/play-imposter.avif"
              alt: ""
              decorative: true
          - title: "The Imposter, built twice"
            text: "How the 2019 version was built by hand, and what changed when I rebuilt it with agents."
            href: "/software/the-imposter/"
            image:
              src: "../../assets/media/xffg40lh/imposter-head.avif"
              alt: ""
              decorative: true
      - type: "cards"
        variant: "text"
        columns: 2
        items:
          - title: "Ends In Tiers (beta)"
            text: "A party game about ranking things into tiers. [One or two lines on how a round works, and a link once it's live.]"
          - title: "Blowhard (beta)"
            text: "The third party game. [One line that gives nothing away, and a link once it's live.]"
  - type: "section"
    surface: "default"
    blocks:
      - type: "intro"
        heading: "For golfers"
        align: "center"
      - type: "cards"
        variant: "text"
        columns: 1
        items:
          - title: "ForeSins (beta)"
            text: "Golf stats for the mistakes you could have avoided. After a round you record your six \"sins\", each round gets a grade from G to S, and your recent rounds give you a Horndicap. It's a local-first web app on a Cloudflare Worker, rewritten from a Blazor app I built in 2021. [Link once it's live.]"
  - type: "section"
    surface: "muted"
    blocks:
      - type: "intro"
        heading: "For families"
        align: "center"
      - type: "cards"
        variant: "full"
        columns: 2
        items:
          - title: "Is Baby In A Book"
            text: "Struggling to find that perfect gift for a little one? Find a book with their name in it using Is Baby In A Book!"
            href: "/software/is-baby-in-a-book/"
            image:
              src: "../../assets/media/ycspud32/biab-sam-site.avif"
              alt: ""
              decorative: true
      - type: "cards"
        variant: "text"
        columns: 1
        items:
          - title: "Mini apps (beta)"
            text: "A collection of small apps for learning and playing, grouped by subject: games, maths, music, science, logic, and letters and numbers. Many started life in Google AI Studio, including Poly-rizzems, a music app. [Link once it's live.]"
  - type: "section"
    surface: "default"
    blocks:
      - type: "intro"
        heading: "For photographers"
        align: "center"
      - type: "cards"
        variant: "full"
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
---

## For Web Developers

#### xStatic is the project I'm proudest of. It won best newcomer at the Umbraco Package Awards in 2021, it's used on real production sites, and I still maintain it: [the Umbraco 18 update is in progress].

I started xStatic, and [UmbracoFolio](/software/umbracofolio/), so that I could build and host this site for free. The current version of the site is built with [Astro](https://astro.build/), and the source is on [GitHub](https://github.com/Mulliman/sammullins.co.uk). If you'd rather run your own site on Umbraco, UmbracoFolio and xStatic are still there: anyone with a bit of ASP.Net knowledge should be able to set one up within an hour.
