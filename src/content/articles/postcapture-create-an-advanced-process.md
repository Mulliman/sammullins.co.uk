---
title: "PostCapture: create an advanced process"
description: "How to copy an existing PostCapture process, set its rule from an example image, and stack borders and watermarks."
date: "2020-05-09"
cover:
  src: "../../assets/media/youtube/postcapture-create-an-advanced-process.avif"
  alt: "Video thumbnail for PostCapture - Create advanced process"
authorship: "sam-ai"
archived: true
tags: ["video", "capture-one", "postcapture"]
blocks:
  - type: "hero"
    variant: "plain"
    heading: "PostCapture: create an advanced process"
    subheading: "How to copy an existing PostCapture process, set its rule from an example image, and stack borders and watermarks."
  - type: "embed"
    provider: "youtube"
    id: "ThFwQhkOg1E"
    title: "PostCapture - Create advanced process"
    poster:
      src: "../../assets/media/youtube/postcapture-create-an-advanced-process.avif"
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
This builds on [your first process](/articles/postcapture-create-your-first-process/). Two options in PostCapture Studio save most of the work: copying settings from another process, and filling in the rule from an example image so you don't need to know the metadata names.

## Copy and match

1. Select the existing process, tick **Copy settings from selected process** and **Populate rule from example image**, and pick an image.
2. Choose the metadata field to match from the list. I picked the colour label (`xmpLabel`), which on my example image was Yellow.
3. Name the process ("Yellow") and press **Create copy**. It starts with the red border from the original and a rule that matches yellow labelled photos.
4. Give it a lower priority than the default (I used 0), so it's checked first.

## Stack the operations

1. Change the border colour to yellow.
2. Add a **Watermark** step. Choose the image file, then set its margin, size and location; I put a small logo in the bottom left.
3. Add a second **PercentageBorder**, thin and black, and use the arrows to move it above the yellow one. Operations run in order, top to bottom, so this gives a black line inside the yellow border.
4. Check the preview and **Save**.

Now yellow labelled photos get the yellow border and logo, and everything else falls through to the default. Next, [open Studio from Capture One](/articles/postcapture-open-studio-from-capture-one/).

Download PostCapture from the [GitHub page](https://mulliman.github.io/PostCapture/).
