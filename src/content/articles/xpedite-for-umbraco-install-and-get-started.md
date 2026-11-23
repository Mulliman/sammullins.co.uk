---
title: "XPEDITE for Umbraco: install and get started"
description: "How to install and configure XPEDITE, then generate a Next.js template, partial and block from Umbraco content types."
date: "2025-03-09"
cover:
  src: "../../assets/media/youtube/xpedite-for-umbraco-install-and-get-started.avif"
  alt: "Video thumbnail for XPEDITE for Umbraco - Create headless sites FAST! How to install and get started."
authorship: "sam-ai"
archived: true
tags: ["video", "umbraco", "xpedite", "nextjs"]
blocks:
  - type: "hero"
    variant: "plain"
    heading: "XPEDITE for Umbraco: install and get started"
    subheading: "How to install and configure XPEDITE, then generate a Next.js template, partial and block from Umbraco content types."
  - type: "embed"
    provider: "youtube"
    id: "uSQ823rxnVc"
    title: "XPEDITE for Umbraco - Create headless sites FAST! How to install and get started."
    poster:
      src: "../../assets/media/youtube/xpedite-for-umbraco-install-and-get-started.avif"
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
      - title: "XPEDITE for Umbraco"
        text: "The package page, with the guides to code and test generation."
        href: "/software/xpedite-for-umbraco/"
      - title: "Autogenerate tests with XPEDITE"
        text: "The written guide to the generated test files."
        href: "/software/xpedite-for-umbraco/autogenerate-tests/"
---
XPEDITE is a lightweight framework and code generator for Umbraco. It builds headless sites with a Next.js front end on top of Umbraco's Delivery API, with a guided setup, generated code and generated tests. This walkthrough covers installing it, configuring it and generating each kind of component.

## Installing

It takes one command, which you can generate with [Paul Seal's Package Script Writer](https://psw.codeshare.co.uk/). The script downloads the Umbraco templates, creates a project called `CMS`, sets the values for an unattended install and adds the XPEDITE starter kit. Run the project, open the URL it gives you, sign in, and you land on the XPEDITE home page in the backoffice.

## Configuring

XPEDITE walks you through setup one step at a time, and the steps update as each one is done.

1. **Install the Delivery API.** A copy and paste into `Program.cs`.
2. **Enable the Delivery API** in `appsettings.json`. Also copy and paste, though you'll want to change some values if you secure the API with a key.
3. **Create the Next.js app.** Go up a level, outside the CMS project, and run the command shown. The suggested values are fine unless you know you want something else.
4. **Tell XPEDITE where the app lives.** Put the path in the development transform of your app settings, since it differs per developer. Escape the backslashes by doubling them. Restart Umbraco (I used `dotnet run`) so it picks up the change.
5. **Install the unit test libraries.** In the Next.js folder, install Jest, run its init (the defaults on screen are fine), add the Jest types and replace the Jest config with the Next.js version. Double check it if you changed any earlier settings.

After that, one button creates the `.env` file pointing at your Umbraco instance and another creates every remaining file the app needs.

## How the app is structured

- `app/layout.tsx` is the standard Next.js base file, and `app/page.tsx` is the root of the site.
- **getContentItemAsync** fetches content from the Delivery API, and also gives you a Next.js friendly slug for an Umbraco route.
- **TemplateRenderer** picks which template to render. Templates are mapped to document types in one file, and the page's document type decides which one is used. A catch-all `[...slug]/page.tsx` handles every other route.
- **Templates** render a page. **Partials** share code between templates, such as a page heading or the block list renderer. **Blocks** are the items content editors add to block lists.
- **Components** hold reusable React components, including the built-in Umbraco image and link helpers.
- An Umbraco properties JSON helper shows the full data passed to a page. It's very useful for debugging and you remove it before going live.

Run `npm run dev` and the starter site comes up, with templates, partials and blocks outlined in different colours so you can tell them apart. Take those styles out once a component is finished.

## Generating a template

Templates are tied to a document type. I picked the documentation page, chose which fields to include, and XPEDITE generated the TSX component, an example CSS file and sample tests, all wired together. One button also creates a content blueprint for the page.

I recommend a documentation page for each type of content you have. When the site is handed over, editors have a working example of every page and block to copy from.

You can download the code as a zip, but **Apply to code base** writes it straight into your configured folder. The one manual step is adding the line shown to `templates.ts`, the map between document types and React components.

## Generating a partial

Partials work with any document or element type, but compositions are the best fit because pages share them. I generated one from the page title composition, renamed the component to `Header` (the props were renamed to match) and ticked generic page data so the partial knows about the page it sits on. Then I added it to the documentation template, passing the props straight through.

## Generating a block

Blocks take an element type for content and, optionally, a settings type. Both arrive as props. If the settings data type doesn't exist yet, one button adds it to all your block lists.

My heading block has a heading level setting. Rather than display that value, I used it as the tag: uppercase the variable name so React treats it as a component, default it to `h1`, and render the heading with it. Add the block to its map, as with templates, and it's done.

## Putting it together

I added a title and a heading block to the documentation page, set the block to `h2`, published, and followed the link to the page in the Next.js app. Because it's a block list, editors can add as many as they like, so I added an `h3` underneath to prove it.

Search NuGet for the XPEDITE starter kit and give it a go!
