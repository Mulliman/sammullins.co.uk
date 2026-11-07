---
title: "What's New in xStatic 3?"
description: "Umbraco is moving forward, and xStatic is following along too. Here's what's new in xStatic 3!"
date: "2022-12-04"
cover:
  src: "../../assets/media/nsipcjdg/banner.avif"
  alt: "The xStatic logo above the words xStatic v3"
authorship: "sam"
archived: true
blocks:
  - type: "hero"
    variant: "plain"
    heading: "What's New in xStatic 3?"
    subheading: "Umbraco is moving forward, and xStatic is following along too. Here's what's new in xStatic 3!"
  - type: "body"
    surface: "default"
  - type: "cards"
    variant: "full"
    surface: "muted"
    columns: 3
    items:
      - title: "xStatic for Umbraco"
        text: "xStatic is a free Umbraco package that generates static HTML sites from Umbraco content. This allows for very cheap and fast hosting of simple sites."
        href: "/software/xstatic-for-umbraco/"
        image:
          src: "../../assets/media/egdifrhl/banner.avif"
          alt: ""
          decorative: true
      - title: "What's New in xStatic 2?"
        text: "Upgrading xStatic to work on Umbraco 9 wasn't just a case of updating some NuGet packages... here's what's new."
        href: "/articles/what-s-new-in-xstatic-2/"
        image:
          src: "../../assets/media/xunjqeqi/xstatic2.avif"
          alt: ""
          decorative: true
      - title: "Extending xStatic 2+"
        text: "You can extend xStatic even more with the version 2 upgrade and this is the place to find out how."
        href: "/software/xstatic-for-umbraco/extending-xstatic-2/"
        image:
          src: "../../assets/media/nsipcjdg/banner.avif"
          alt: ""
          decorative: true
---

## 1\. The latest and greatest

xStatic 3 is targeting .net 6 and Umbraco 10.2. This means you can use it on the latest Umbraco versions. All breaking changes have been fixed and xStatic has been tested on both Umbraco 10 and 11.

## 2\. Auto publish actually works

When moving away from Umbraco 8 the auto publish functionality within xStatic broke. This has now been fixed and can now be used.

## 3\. Run on Linux

xStatic 2 didn't run correctly when hosted on Linux. The truth is, when I first built xStatic the idea of hosting on Linux never crossed my mind, but now seeing that it can it makes the possibility of xStatic being an even more cost effective way to run Umbraco sites.

A big thank you to Adam Werner for all the help and testing on this, xStatic v3 may not have been a thing without him! Not only is he using Linux as the host but is also running on Docker which has really pushed xStatic's boundaries and proven how easily it can be extended and customised.

Check out his new [AWS plugin for xStatic](https://www.nuget.org/packages/xStatic.AWSS3).

## 4\. File System Deployer

Do you want an easy way to experiment with xStatic without signing up to Netlify or other web host? You can now use the file system deployer to put the generated static site on your file system.

## 5\. Marketplace

xStatic now shows on [marketplace.umbraco.com](https://marketplace.umbraco.com/category/headless) in the headless section. To mark the special occasion xStatic has been updated with a new logo.

## 6\. Umbraco Content API

The built in JSON generator wasn't very clever or useful. If you want to statically generate JSON API with more flexibility then the UmbracoContentApi package is the way to go. The new NuGet package 'xStatic.UmbracoContentApi' integrates the two together allowing for easy JSON generation that can be built the same way you would in a non-static Umbraco site.

## 7\. New docs

With new features and techniques comes new documentation. If you're using the newer versions of xStatic make sure you're looking in [the correct place](/software/xstatic-for-umbraco/extending-xstatic-2/)!
