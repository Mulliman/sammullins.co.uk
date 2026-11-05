---
title: Media blocks demo
description: Every variant of the image, gallery, logo wall and embed blocks.
authorship: sam
noindex: true
hidden: true
blocks:
  - type: image
    image:
      src: ../../../assets/demo/demo.jpg
      alt: Demo photo, a beach portrait
    caption: Content width with a *caption*.
    width: content

  - type: image
    image:
      src: ../../../assets/demo/demo.jpg
      alt: Demo photo, a beach portrait
    caption: Wide width.
    width: wide

  - type: image
    image:
      src: ../../../assets/demo/demo.jpg
      alt: Demo photo, a beach portrait
    caption: Full bleed, breaking out of the container.
    width: full

  - type: image
    image:
      src: ../../../assets/demo/demo.jpg
      alt: ""
      decorative: true
    width: content

  - type: gallery
    heading: Gallery
    images:
      - src: ../../../assets/demo/demo.jpg
        alt: Demo gallery image one
        caption: First image, a beach portrait.
      - src: ../../../assets/demo/demo.jpg
        alt: Demo gallery image two
        caption: Second image.
      - src: ../../../assets/demo/demo.jpg
        alt: Demo gallery image three
        caption: Third image.
      - src: ../../../assets/demo/demo.jpg
        alt: Demo gallery image four
        caption: Fourth image.
      - src: ../../../assets/demo/demo.jpg
        alt: Demo gallery image five
        caption: Fifth image.
      - src: ../../../assets/demo/demo.jpg
        alt: Demo gallery image six
        caption: Sixth image, the last one.

  - type: logoWall
    heading: People I have worked with
    logos:
      - name: Client One
        logo: ../../../assets/demo/logo.jpg
      - name: Client Two
        logo: ../../../assets/demo/logo.jpg
        href: https://example.com/
      - name: Client Three
        logo: ../../../assets/demo/logo.jpg
      - name: Client Four
        logo: ../../../assets/demo/logo.jpg

  - type: embed
    provider: youtube
    id: dQw4w9WgXcQ
    title: Example video

  - type: embed
    provider: youtube
    id: dQw4w9WgXcQ
    title: Example video with a poster
    poster:
      src: ../../../assets/demo/demo.jpg
      alt: Poster frame, a beach portrait
---
