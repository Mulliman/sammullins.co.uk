---
title: "xStatic for Umbraco 14.1: speedrun"
description: "xStatic 14.1 installs with no code changes and creates Netlify sites for you. From nothing to a deployed Umbraco site in under three minutes."
date: "2024-09-06"
cover:
  src: "../../assets/media/youtube/xstatic-14-1-speedrun.avif"
  alt: "Video thumbnail for xStatic for Umbraco 14.1 - Speedrun"
authorship: "sam-ai"
archived: true
tags: ["video", "umbraco", "xstatic", "netlify"]
blocks:
  - type: "hero"
    variant: "plain"
    heading: "xStatic for Umbraco 14.1: speedrun"
    subheading: "xStatic 14.1 installs with no code changes and creates Netlify sites for you. From nothing to a deployed Umbraco site in under three minutes."
  - type: "embed"
    provider: "youtube"
    id: "tYdYG3PgRcQ"
    title: "xStatic for Umbraco 14.1 - Speedrun"
    poster:
      src: "../../assets/media/youtube/xstatic-14-1-speedrun.avif"
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
xStatic 14.1 is all about getting started faster. The idea came from [Paul Seal's Package Script Writer](https://psw.codeshare.co.uk/), which builds a script that installs Umbraco with packages already in place. I was jealous of how other packages could be ready to use with no work in Visual Studio, so this release removes the manual steps from installing xStatic and automates creating Netlify sites from inside the backoffice.

## The script

In the Package Script Writer I skipped creating a solution, named the project, picked the latest Umbraco version and chose the starter kit. Under packages, searching for xStatic shows the main package and its extensions, so I added both xStatic and xStatic Netlify. The tool can output the script as a single line, so one paste runs everything.

## The attempt

The goal: install Umbraco and a starter kit, configure an xStatic site and deploy it to Netlify in about three minutes.

The script restores the NuGet packages, creates and builds the project, creates the database, installs the starter kit and adds the xStatic user groups. One quirk with Umbraco 14: on the first run the starter kit's styles and scripts weren't picked up, but running `dotnet run` a second time sorted it.

Once logged in, the xStatic section is already there; no user group changes needed. Then:

1. Open the new **automatically create deployment target** option and choose the Netlify site creator.
2. Follow the link in the help text to Netlify, create a personal access token and paste it back into Umbraco.
3. Enter a name for the new Netlify site. xStatic creates the site in Netlify and the matching deployment target in one go.
4. Create the xStatic site, add the CSS and scripts folders as asset paths and select the new target.
5. Generate, then deploy.

The site was live on Netlify in 2 minutes 55 seconds. The record is there to be beaten, so give it a go.
