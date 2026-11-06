---
title: "5 cool things I used to build PanoCapture and PostCapture"
description: "Finishing the series looking at some of the tech behind my open source projects, PanoCapture and PostCapture are photo editing plugins for CaptureOne. These are some tools I found when moving away…"
date: "2021-04-07"
cover:
  src: "../../assets/media/uiwmnegi/5-cool-things.avif"
  alt: "5 cool things I used to build PanoCapture and PostCapture"
authorship: "sam"
archived: true
blocks:
  - type: "hero"
    variant: "plain"
    heading: "5 cool things I used to build PanoCapture and PostCapture"
    subheading: "Finishing the series looking at some of the tech behind my open source projects, PanoCapture and PostCapture are photo editing plugins for CaptureOne. These are some tools I found when moving away from my web comfort zone and developing desktop apps."
  - type: "body"
    surface: "default"
  - type: "cards"
    variant: "full"
    surface: "default"
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
  - type: "section"
    surface: "muted"
    blocks:
      - type: "intro"
        heading: "Other articles in the series"
        align: "center"
      - type: "cards"
        variant: "full"
        columns: 2
        items:
          - title: "5 cool things I used to build The Imposter"
            text: "Continuing the series looking at some of the tech behind my open source projects, this article includes the front end and back end technologies used to create my PWA party game."
            href: "/articles/5-cool-things-i-used-to-build-the-imposter/"
            image:
              src: "../../assets/media/zaqdt00v/5-cool-things-blue.avif"
              alt: ""
              decorative: true
          - title: "5 cool things I used to build xStatic"
            text: "As part of a series looking at some of the tech behind my open source projects, this article outlines my favourite products and services I used for the first time on xStatic."
            href: "/articles/5-cool-things-i-used-to-build-xstatic/"
            image:
              src: "../../assets/media/zapplr3l/5-cool-things-purple.avif"
              alt: ""
              decorative: true
---

## 1\. CaptureOne SDK

[CaptureOne](https://www.captureone.com/en) is a photo editing program known for its lovely rendering of photos and set of powerful tools. However, it is not as feature rich as it's main competition in Adobe Lightroom. Luckily they have an SDK which allows developers to create plugins to fill in a few of these gap.

This SDK is fairly limited however, with the possibilities mainly limited to performing actions on a file that has already been processed and exported from C1.

The method for creating plugins for Windows and Mac is also different, meaning that you have to build 2 versions in two different languages if you want your plugin to be cross platform.

I only used the [Windows SDK](https://www.captureone.com/en/partnerships/developer), and the process for creating the extensions and installing them is very simple, especially if you have C# knowledge.

## 2\. Hugin

[Hugin](http://hugin.sourceforge.net/) is a cross platform, open source photo stitcher with a comprehensive suite of command line tools.

There is a huge amount of customisation available and performing a task often requires calling multiple programs to get the desired output. Stacking and blending only took a couple of steps, but creating a panorama required 9 separate steps.

It's not as fast as some other alternatives, but as a free option is seems to be very accurate and produce great images.

## 3\. WPFDarkTheme

This was my first time using WPF to build a desktop app, and I wanted it to look similar to CaptureOne. Using WPF you can control the rendering of all the standard windows controls, however this would take quite a bit of work.

Luckily I found the [WPFDarkTheme](https://github.com/AngryCarrot789/WPFDarkTheme) Github repo which did a great job of resetting all the controls to a theme that I really liked.

Once I used this on PostCapture I was able to make a few small tweaks to my taste and it resulted in an interface that closely matched what I had in mind before starting.

This saved me a lot of time, and I think it's a good starting point if you're looking to stylise your own WPF app.

## 4\. Magick.NET

[ImageMagick](https://imagemagick.org/) is a free piece of software that can be used to edit digital images. [Magick.NET](https://github.com/dlemstra/Magick.NET) is a C# wrapper around this library that makes image manipulation very easy when developing .Net applications. 

I found that creating borders, making composite images, and persisting the files was easier than with the standard .Net libraries.

Originally I also used ImageMagick to handle image metadata, but I changed to using [MetaDataExtactor](https://www.nuget.org/packages/MetadataExtractor/) as I found that superior for that specific role.

## 5\. ML.Net & Tensorflow

Strictly speaking I haven't used either of these machine learning (ML) technologies in either PanoCapture or PostCapture, however I've recently created a proof of concept for a new extension called [TagCapture](https://youtu.be/mb-dPQU-3Tc) which uses ML to automatically tag images in CaptureOne.

In the very first POC I used an existing pretrained Inception v4 TensorFlow model. This model categorised images based on 1000 labels. This proved that it could be done, but the labels in this model didn't really match the terms that photographers would use.

I then used transfer learning to use this Inception model, but train it to categorise into the kind of terms that photographers would use, for instance portrait, food, or landscape. This seemed to work pretty well.

I then went one stage further by attempting to train a multi-label ML model to try and add multiple tags to any image detected as a landscape. This would enable an image to be tagged with labels such as water, river, mountain, golden hour. This didn't work as well, potentially as I only ran the training for 1 hour.

TagCapture is still in the preliminary stage with experiments like the above assessing the viability of the idea.
