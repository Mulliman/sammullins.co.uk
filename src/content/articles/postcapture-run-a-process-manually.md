---
title: "PostCapture: run a process manually"
description: "How to run PostCapture.Process yourself, outside Capture One, to apply borders based on each image’s metadata."
date: "2020-05-09"
cover:
  src: "../../assets/media/youtube/postcapture-run-a-process-manually.avif"
  alt: "Video thumbnail for PostCapture - Run process manually"
authorship: "sam-ai"
archived: true
tags: ["video", "postcapture"]
blocks:
  - type: "hero"
    variant: "plain"
    heading: "PostCapture: run a process manually"
    subheading: "How to run PostCapture.Process yourself, outside Capture One, to apply borders based on each image’s metadata."
  - type: "embed"
    provider: "youtube"
    id: "wQUsl2ntKBw"
    title: "PostCapture - Run process manually"
    poster:
      src: "../../assets/media/youtube/postcapture-run-a-process-manually.avif"
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
PostCapture doesn't need Capture One. The work is done by a separate program, `PostCapture.Process.exe`, which applies image changes based on the metadata of each image. Processes are made with `PostCapture.Studio.exe` and saved in the Processes folder next to them.

In the video I had two processes already made in Studio, and two test images: one with a red colour label and one with a yellow one. Dragging each image onto `PostCapture.Process.exe` applies the matching process, so the red tagged image gets a red border and the yellow tagged image gets a yellow one.

That's handy for scripting, or for photos edited outside Capture One. For the full set, start with [install it in Capture One](/articles/postcapture-install-in-capture-one/).

Download PostCapture from the [GitHub page](https://mulliman.github.io/PostCapture/).
