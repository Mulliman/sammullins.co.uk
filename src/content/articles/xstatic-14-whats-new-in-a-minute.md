---
title: "xStatic 14: what's new, in under a minute"
description: "A one minute tour of xStatic 14, rebuilt for Umbraco 14: a new interface, multi-language sites, role based security and more flexible editors."
date: "2024-08-24"
cover:
  src: "../../assets/media/youtube/xstatic-14-whats-new-in-a-minute.avif"
  alt: "Video thumbnail for xStatic 14 - What's new?"
authorship: "sam-ai"
archived: true
tags: ["video", "umbraco", "xstatic"]
blocks:
  - type: "hero"
    variant: "plain"
    heading: "xStatic 14: what's new, in under a minute"
    subheading: "A one minute tour of xStatic 14, rebuilt for Umbraco 14: a new interface, multi-language sites, role based security and more flexible editors."
  - type: "embed"
    provider: "youtube"
    id: "BhKlHbvK2yY"
    title: "xStatic 14 - What's new?"
    poster:
      src: "../../assets/media/youtube/xstatic-14-whats-new-in-a-minute.avif"
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
      - title: "xStatic 14"
        text: "What changed in the Umbraco 14 rebuild, with links to the guides."
        href: "/xstatic14/"
      - title: "xStatic for Umbraco"
        text: "The package page, with downloads, docs and guides."
        href: "/software/xstatic-for-umbraco/"
---
xStatic lets you create a static site from an Umbraco site. I rebuilt it for Umbraco 14, and this short video runs through what changed.

## A new headless interface

Umbraco 14's backoffice is new, so xStatic's is too. It's built with Lit, TypeScript and Umbraco's UI library (UUI), the same tools as the backoffice itself.

## Multi-language sites

You can choose which cultures to include when configuring a site, and xStatic generates each one. There's a full walkthrough in [multi-language sites](/articles/xstatic-multi-language-sites/).

## More secure

Sensitive settings such as deployment targets and actions often hold access tokens or passwords. xStatic 14 adds role based protection, with separate xStatic admin and normal user groups, so only admins can see them.

## More flexible

Actions and deployment types can now use different editors for their settings, so plugins can offer a better editing experience.

## The same integrations

Netlify, Git (for GitHub and other repositories) and FTP all still work.

To deploy your own site in minutes, read [xStatic 14: get started](/articles/xstatic-14-get-started/).
