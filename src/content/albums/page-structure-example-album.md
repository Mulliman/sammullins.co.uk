---
title: "[Album title]"
description: "[One or two sentences, up to 200 characters, on where and when the photos were taken.]"
date: "2000-01-01" # [Optional. The date the photos were taken, as YYYY-MM-DD.]
cover:
  src: "../../assets/demo/demo.jpg"
  alt: "[Describe the cover photo for a screen reader.]"
authorship: "sam-ai" # [sam if Sam wrote the words, sam-ai if an AI drafted them.]
hidden: true # [Albums are hidden by default. Example only.]
noindex: true # [Example only. Remove for a real album.]
blocks:
  - type: "hero"
    variant: "blurred"
    heading: "[Album title]"
    subheading: "[Week or subtitle, for example a short line on the trip.]"
    image:
      src: "../../assets/demo/demo.jpg"
      alt: "[Describe the hero photo for a screen reader.]"
  - type: "gallery"
    columns: 2
    images:
      - src: "../../assets/demo/demo.jpg"
        alt: "[Describe this photo for a screen reader.]"
      - src: "../../assets/demo/demo.jpg"
        alt: "[Describe this photo for a screen reader.]"
  - type: "image"
    backdrop: "blurred"
    width: "wide"
    image:
      src: "../../assets/demo/demo.jpg"
      alt: "[Describe this photo for a screen reader.]"
    caption: "[Caption under the photo.]"
  - type: "cards"
    variant: "text"
    surface: "muted"
    columns: 2
    items:
      - title: "[Card title, for example the photo project this album belongs to]"
        text: "[One sentence on the project.]"
        href: "/photography/photoshare21/"
        cta: "[Button label]"
---
