---
title: "Deploy Umbraco to Netlify in under 5 minutes with xStatic"
description: "An early xStatic demo: install the package, configure a site and deploy an Umbraco site to Netlify in under five minutes."
date: "2020-12-11"
cover:
  src: "../../assets/media/youtube/deploy-umbraco-to-netlify-with-xstatic.avif"
  alt: "Video thumbnail for Set up Umbraco to deploy to Netlify in less than 5 minutes using xStatic"
authorship: "sam-ai"
archived: true
tags: ["video", "umbraco", "xstatic", "netlify"]
blocks:
  - type: "hero"
    variant: "plain"
    heading: "Deploy Umbraco to Netlify in under 5 minutes with xStatic"
    subheading: "An early xStatic demo: install the package, configure a site and deploy an Umbraco site to Netlify in under five minutes."
  - type: "embed"
    provider: "youtube"
    id: "XOwgBITayyc"
    title: "Set up Umbraco to deploy to Netlify in less than 5 minutes using xStatic"
    poster:
      src: "../../assets/media/youtube/deploy-umbraco-to-netlify-with-xstatic.avif"
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
      - title: "xStatic for Umbraco"
        text: "The package page, with downloads, docs and guides."
        href: "/software/xstatic-for-umbraco/"
      - title: "xStatic 14"
        text: "What changed in the Umbraco 14 rebuild, with links to the guides."
        href: "/xstatic14/"
---
This video is of an early version of xStatic. For up to date instructions, see [xStatic 14.1: speedrun](/articles/xstatic-14-1-speedrun/) and [multi-language sites](/articles/xstatic-multi-language-sites/).

xStatic for Umbraco deploys a version of your Umbraco site to static hosts such as Netlify. That makes scalable content cheap to serve, and means a small Umbraco site running on your own machine can go public without any hosting costs. This silent screen recording shows the whole setup in under five minutes.

## Install the package

The video starts with the Umbraco sample site. Upload the xStatic package from the **Packages** section, then give your user group access to the new **Generated Sites** section.

## Create a site

Create a generated site: give it a name, choose the root node and the media folders, set the export format to HTML and add the asset paths for the site's CSS and scripts.

## Connect Netlify

In Netlify, create a personal access token, then a new site. Back in Umbraco, choose Netlify as the deployment target and paste in the token and the site ID. (All the accounts and tokens in the video have since been deleted.)

## Generate and deploy

Generate the site, deploy it, and the Umbraco sample site is live on its Netlify address. To finish, I edited the home page heading in Umbraco, published, and generated and deployed again to show the change go live.

For the current version, start with [xStatic for Umbraco](/software/xstatic-for-umbraco/).
