---
title: "xStatic 14: get started"
description: "How to install xStatic 14 into an existing Umbraco site, configure a site and a deployment target, and use actions and plugins."
date: "2024-08-24"
cover:
  src: "../../assets/media/youtube/xstatic-14-get-started.avif"
  alt: "Video thumbnail for xStatic 14 - Get Started"
authorship: "sam-ai"
archived: true
tags: ["video", "umbraco", "xstatic"]
blocks:
  - type: "hero"
    variant: "plain"
    heading: "xStatic 14: get started"
    subheading: "How to install xStatic 14 into an existing Umbraco site, configure a site and a deployment target, and use actions and plugins."
  - type: "embed"
    provider: "youtube"
    id: "_BW8oV3LI1Q"
    title: "xStatic 14 - Get Started"
    poster:
      src: "../../assets/media/youtube/xstatic-14-get-started.avif"
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
xStatic has been rebuilt for Umbraco 14. This guide covers installing it into an existing Umbraco site and getting your first static site generated and deployed.

## Install

In Visual Studio, open **Manage NuGet Packages** and search for xStatic. There are several packages:

- **xStatic**: the one to add to your Umbraco project.
- **xStatic Core**: for building your own generators or deployers.
- **xStatic Netlify**, **xStatic Git** and **xStatic FTP**: deployers for each of those. Git lets you push to repositories for things like GitHub Pages.
- **xStatic AWS S3**: created by Adam Werner. It needs updating to work with version 14.
- **xStatic Content API**: useful if you want to deploy JSON.
- **xStatic Client**: the front end for the new Umbraco 14 backoffice.

After installing the main package, add the configuration line to `Program.cs` to register xStatic's services with the default settings, along with its `using` statement. That's all. Umbraco runs exactly as before.

## Get the section to show

There's a new xStatic section, but it won't appear until a user group has access. You can add it to the Administrators group by hand, but there's a better way in xStatic 14: the **secure user groups** setting. Give it the email address of your admin user, and xStatic creates its user groups automatically and adds that user. Log in and the section is there.

This creates two groups, xStatic admin and xStatic normal user. Deployment targets and actions are admin only, because they often hold personal access tokens or passwords.

## The sections

- **Sites**: configure each site you want to turn into HTML (or another format).
- **Export types**: how a site goes from running Umbraco to static files. You won't need to touch these for a basic HTML site.
- **Deployment targets**: where the static files go, such as Netlify or a Git repository.
- **Actions**: operations that run on the files after generation, such as copying them.
- **Config**: what's installed. The architecture is pluggable, so this shows the plugins in use.
- **Documentation**: links to the guides on my site.

## Configure a site

Give the site a name, pick the root node to export (the starter kit only has one), pick the media folders it uses and choose the HTML export type. If your site has styling, add the **asset paths** too; for the starter kit that's the CSS and scripts folders. The target host name is only needed if you want absolute links rather than relative ones.

Press **Generate** and xStatic walks the Umbraco tree, writing a static HTML version of each page. The dashboard shows the size of the output, and **Download** gives you a zip. Inside, each page is a folder with an `index.html`, so paths work the same as before, and the CSS and scripts folders are included. That's a static copy of an existing Umbraco site with no changes to the site itself.

## Configure a deployment target

To deploy somewhere useful, create a deployment target. I used the built-in file system deployer and pointed it at a local folder; imagine a network drive, or a folder IIS serves. Edit the site with the yellow brush icon, pick the target and save. Press **Deploy** and the folder fills with the generated files.

Serving that folder with a simple Node HTTP server shows the Umbraco site, but noticeably faster, since there's no server side processing. The links and content all work.

## Post generation actions

Actions change the generated files after generation. A common use is a not found page, since hosts expect it in a particular place. I made a simple 404 page in Umbraco, created a file copy action to copy it to `404.html`, selected the action on the site, then generated and deployed again. The page appears where the host expects it.

## Plugins

The Netlify, Git and FTP plugins I maintain each add a deployer and its settings. Install them from NuGet, matching the version of xStatic you have, and you shouldn't need any code changes. If one isn't picked up, add a `using` for its namespace (`XStatic.Netlify`, `XStatic.Git` or `XStatic.FTP`) to make sure it's loaded.

Each deployer shows its own fields when you create a target. Plugins can also bring actions: the Netlify one includes a 404 action that puts your page where Netlify expects it, so you can swap it in for the generic one.

There's more documentation on [the xStatic page](/software/xstatic-for-umbraco/), including how to extend it. Give it a go, and enjoy cheaper, faster Umbraco sites.
