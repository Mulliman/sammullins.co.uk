---
title: "TagCapture: machine learning image tagging for Capture One"
description: "A proof of concept that tags photos in Capture One automatically, using an offline Inception v4 TensorFlow model."
date: "2021-02-21"
cover:
  src: "../../assets/media/youtube/tagcapture-proof-of-concept.avif"
  alt: "Video thumbnail for TagCapture proof of concept - Machine learning based image tagging"
authorship: "sam-ai"
archived: true
tags: ["video", "capture-one", "machine-learning"]
blocks:
  - type: "hero"
    variant: "plain"
    heading: "TagCapture: machine learning image tagging for Capture One"
    subheading: "A proof of concept that tags photos in Capture One automatically, using an offline Inception v4 TensorFlow model."
  - type: "embed"
    provider: "youtube"
    id: "mb-dPQU-3Tc"
    title: "TagCapture proof of concept - Machine learning based image tagging"
    poster:
      src: "../../assets/media/youtube/tagcapture-proof-of-concept.avif"
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
      - title: "PanoCapture"
        text: "Stitch panoramas with Hugin without leaving Capture One."
        href: "/software/panocapture/"
      - title: "PostCapture"
        text: "Borders and watermarks for Capture One, chosen by each image’s metadata."
        href: "/software/postcapture/"
---
TagCapture was a proof of concept for generating keywords for photos in Capture One automatically.

It uses a prebuilt Inception v4 model, an image classification network, running offline in TensorFlow. Because nothing is uploaded to a cloud service, tagging should be faster, with no usage limits and no costs.

## What the video shows

The test set was a handful of zoo photos: a chimpanzee, a lioness, cheetahs, a macaque, a crocodile, a red panda, a cockatoo and meerkats. With the images selected, I ran the plugin's auto tag option from Capture One's context menu. A console window opens while the model works through each image, and when it finishes the suggested keywords appear in Capture One's keywords tool for each photo.

It stayed a proof of concept. If you want something that is finished, [PanoCapture](/software/panocapture/) and [PostCapture](/software/postcapture/) are the Capture One plugins I did release.
