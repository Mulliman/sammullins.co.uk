---
title: "xStatic for Umbraco: multi-language sites"
description: "xStatic 14 can export multi-language Umbraco sites. How to set up a second language, URLs and a switcher, then generate and host it statically."
date: "2024-08-26"
cover:
  src: "../../assets/media/youtube/xstatic-multi-language-sites.avif"
  alt: "Video thumbnail for xStatic for Umbraco - Create and host multi-language sites"
authorship: "sam-ai"
archived: true
tags: ["video", "umbraco", "xstatic"]
blocks:
  - type: "hero"
    variant: "plain"
    heading: "xStatic for Umbraco: multi-language sites"
    subheading: "xStatic 14 can export multi-language Umbraco sites. How to set up a second language, URLs and a switcher, then generate and host it statically."
  - type: "embed"
    provider: "youtube"
    id: "gQRVHEK0cSc"
    title: "xStatic for Umbraco - Create and host multi-language sites"
    poster:
      src: "../../assets/media/youtube/xstatic-multi-language-sites.avif"
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
Multi-language support is built into xStatic 14, so you can make static versions of sites in several languages and host them cheaply for visitors anywhere. I started from a standard Umbraco starter kit, cut down to a home page and one content page, with English as the only language.

## Add a language

In **Settings > Languages**, add the new language. It doesn't need to be the default or mandatory; I added Italian.

The language now shows at the tree level, but there's nowhere to pick it on an item yet. That's because each document type must be set to **vary by culture**. Do it for every document type you use, which is a bit tedious, but that's how Umbraco works.

Even then, the fields are still marked invariant. Open the document types (and any compositions) again, and turn on vary by culture for each field you want to translate.

## Add the content

On the home page, create the Italian version and fill it in. Do the same for the content page, which can have its own name ("Pagina uno"). Umbraco's split view puts two language versions side by side, which is handy if you're a translator.

## Set the URLs

On the home page, open **Culture and Hostnames** and give each language its own URL. It doesn't have to be a full host name; a path works. I used `/en` for English and `/it` for Italian. After saving, both versions load in the browser and the links stay inside their language.

## A language switcher

Most multi-language sites let visitors switch with one click. A short snippet loops through the cultures set up in Umbraco and links to the current page in each one. It's enough to test the export.

## Configure xStatic

It's still one xStatic site. Pick the home page as normal, then pick the cultures to include (you don't have to include them all). Add the media, choose the HTML export and include the CSS and scripts folders as asset paths. I skipped a deployment target and ran it locally.

After generating, the output has a folder per language, but nothing at the root, so the home page doesn't load.

## A default home page

Actions fix that. Create a new **file copy** action that copies the English home page to `index.html` at the root. Edit the xStatic site, select the action and generate again.

Now there's a root `index.html` in the default language, and the static site works like the Umbraco one, switcher included. Have a go!
