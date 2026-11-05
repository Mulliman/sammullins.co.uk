---
title: "What's New in xStatic 2?"
description: "Upgrading xStatic to work on Umbraco 9 wasn't just a case of updating some NuGet packages... here's what's new."
date: "2021-10-26"
cover:
  src: "../../assets/media/xunjqeqi/xstatic2.avif"
  alt: "What's New in xStatic 2?"
authorship: "sam"
archived: true
blocks:
  - type: "hero"
    variant: "plain"
    heading: "What's New in xStatic 2?"
    subheading: "Upgrading xStatic to work on Umbraco 9 wasn't just a case of updating some NuGet packages... here's what's new."
  - type: "body"
    surface: "default"
  - type: "gallery"
    images:
      - src: "../../assets/media/io5n4k4g/xstatic-export-types.avif"
        alt: "Xstatic Export Types"
      - src: "../../assets/media/1debwpsa/xstatic-export-type.avif"
        alt: "Xstatic Export Type"
  - type: "prose"
    markdown: |-
      ## 6\. Post generation actions

      A new feature added in the v2 release are 'Actions'. These are components that can be configured to run some extra processing once the site generation has completed. Built into the core package are actions for renaming, copying, or deleting files; the Netlify package has a specific action for creating the 404 page.

      It is really easy to create your own actions, simply implement the IPostGenerationAction interface's single RunAction method.

      These actions can specify a configuration model that will allow editors to configure them in the CMS. This allows you to run similar actions multiple times on a single site or reuse actions on multisite.

      Actions are perfect for final file alterations, generating sitemaps, sending notifications, and hopefully many more examples that I haven't listed here.
  - type: "gallery"
    images:
      - src: "../../assets/media/ikqhqwdt/xstatic-actions.avif"
        alt: "Xstatic Actions"
      - src: "../../assets/media/rg2mg4x3/xstatic-action-1.avif"
        alt: "Xstatic Action 1"
  - type: "prose"
    markdown: |-
      ## 7\. Settings tab

      Now that the packages are separated, a new section has been added to help with working out what components are installed.
  - type: "image"
    width: "wide"
    image:
      src: "../../assets/media/xducz1kz/xstatic-config.avif"
      alt: "Xstatic Config"
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
      - title: "Building your first static site"
        text: "Setting up xStatic is easy, and following these steps you can configure your first static site within minutes."
        href: "/software/xstatic-for-umbraco/building-your-first-static-site/"
        image:
          src: "../../assets/media/egdifrhl/banner.avif"
          alt: ""
          decorative: true
      - title: "Extending xStatic"
        text: "You can extend xStatic to generate and transform the output to fit your specific requirements."
        href: "/software/xstatic-for-umbraco/extending-xstatic/"
        image:
          src: "../../assets/media/egdifrhl/banner.avif"
          alt: ""
          decorative: true
---

## 1\. NuGet only

You can now install xStatic via NuGet, or more accurately you must! As part of this the plugins have been separated so you only need to install what you want.

**xStatic**

This is the package to install the static site generation functionality into your Umbraco website. 

**xStatic.Core**

This is the package to reference if you want to build your own deployers, transformers, generators etc. It contains a lot of the logic and interface classes used by the plugin.

**xStatic.\***

All other packages that start with xStatic are plugins; these will add certain functionality into your xStatic installation. Examples of this are xStatic.Netlify, xStatic.Git, and xStatic.Ftp.

![Xstatic Packages](../../assets/media/03taqad3/xstatic-packages.avif)

## 2\. You need to write code to make it work

In v1 of xStatic you didn't have to write a single line of code in order to start generating static versions of your Umbraco sites. This is no longer the case.

In order to get xStatic working in Umbraco 9 and still follow .Net 5 best practice you'll now have open an IDE. Don't fret though, it is only one single line in your Startup.cs file.

```
services.AddXStatic().Automatic().Build();
```

This line installs all the required services and automatically discovers what plugin components have been installed.

This allows coders to override the default classes with their own instances if required.

## 3\. No more dependencies

The xStatic plugin no longer relies on any other Umbraco packages. This means that it can now be used by gold partners and on Umbraco Cloud without any restrictions.

## 4\. No more JSON config file.

In v1, customisation of xStatic required the editing of a JSON file; if this JSON file was changed and xStatic was upgraded this would be overwritten which was a nuisance. 

This file no longer exists and has been replaced with more standard C# code or user friendly dashboards.

## 5\. CMS editable export types

Export types are the components that control how a static site will be generated when the build button is pressed. Previously these could only be changed by editing the config file, but this has now been replaced by a database table and editing interface inside Umbraco.

This makes it much easier to create your own generators as well as being able to make make changes without a code deployment.
