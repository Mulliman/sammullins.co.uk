---
title: "PostCapture: use it in process recipes"
description: "How to add PostCapture to a Capture One process recipe, so borders and watermarks are applied as you export."
date: "2020-05-09"
cover:
  src: "../../assets/media/youtube/postcapture-in-process-recipes.avif"
  alt: "Video thumbnail for PostCapture - Adding to Process Recipes"
authorship: "sam-ai"
archived: true
tags: ["video", "capture-one", "postcapture"]
blocks:
  - type: "hero"
    variant: "plain"
    heading: "PostCapture: use it in process recipes"
    subheading: "How to add PostCapture to a Capture One process recipe, so borders and watermarks are applied as you export."
  - type: "embed"
    provider: "youtube"
    id: "8giv_z026D0"
    title: "PostCapture - Adding to Process Recipes"
    poster:
      src: "../../assets/media/youtube/postcapture-in-process-recipes.avif"
      alt: ""
      decorative: true
  - type: "body"
    surface: "default"
  - type: "cards"
    heading: "Related"
    variant: "text"
    surface: "muted"
    columns: 2
    items:
      - title: "PostCapture"
        text: "Borders and watermarks for Capture One, chosen by each image’s metadata."
        href: "/software/postcapture/"
      - title: "5 cool things I used to build PanoCapture and PostCapture"
        text: "The tools and libraries behind both plugins."
        href: "/articles/5-cool-things-i-used-to-build-panocapture-and-postcapture/"
---
Running PostCapture photo by photo is fine for a few images. For a whole shoot, add it to a process recipe so it runs as part of exporting.

1. Select a process recipe in Capture One.
2. Set its **Open with** option to the PostCapture process option.
3. Process your photos as normal.

When the export finishes, PostCapture runs over each output file and applies whichever process matches it. In the video, a photo with a red label and a photo with a yellow label came out with their different borders from a single export.

Next, [run a process manually](/articles/postcapture-run-a-process-manually/) without Capture One.

Download PostCapture from the [GitHub page](https://mulliman.github.io/PostCapture/).
