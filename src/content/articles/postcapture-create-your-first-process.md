---
title: "PostCapture: create your first process"
description: "How to create a simple PostCapture process in PostCapture Studio: a rule, a priority and a border."
date: "2020-05-09"
cover:
  src: "../../assets/media/youtube/postcapture-create-your-first-process.avif"
  alt: "Video thumbnail for PostCapture - Create your first new process"
authorship: "sam-ai"
archived: true
tags: ["video", "capture-one", "postcapture"]
blocks:
  - type: "hero"
    variant: "plain"
    heading: "PostCapture: create your first process"
    subheading: "How to create a simple PostCapture process in PostCapture Studio: a rule, a priority and a border."
  - type: "embed"
    provider: "youtube"
    id: "RIO7unaJuGY"
    title: "PostCapture - Create your first new process"
    poster:
      src: "../../assets/media/youtube/postcapture-create-your-first-process.avif"
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
A process in PostCapture is a rule plus a list of operations. When an image matches the rule, the operations, such as adding a border or a watermark, are applied to it. Processes are made in PostCapture Studio.

## Create the process

1. Type a name under **Create new process** (I used "Default") and press **Create**.
2. Set the rule. **The value in this category** is the metadata field to check, and **Matches this value** is what it must equal. In the video I used `Make` and `Sony`, so the process applies to photos from Sony cameras.
3. Set the **priority**. Processes are checked in ascending order and the first one that matches is applied, so a catch-all default wants a high number. I used 99999.
4. Under **Add extra steps to process**, choose **PercentageBorder**. Set the border width as a percentage of the image and pick the colour with the red, green and blue sliders. I went with a thick red border.
5. Watch the preview update as you go, then press **Save**.

Next, [create an advanced process](/articles/postcapture-create-an-advanced-process/) that copies this one.

Download PostCapture from the [GitHub page](https://mulliman.github.io/PostCapture/).
