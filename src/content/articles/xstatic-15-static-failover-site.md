---
title: "xStatic for Umbraco 15: a static failover site"
description: "Why show an error page when Umbraco goes down? Serve a static copy instead, using xStatic, .NET Aspire, YARP and an Azure Function."
date: "2024-11-24"
cover:
  src: "../../assets/media/youtube/xstatic-15-static-failover-site.avif"
  alt: "Video thumbnail for xStatic for Umbraco 15 - No more server down pages with a static failover site"
authorship: "sam-ai"
archived: true
tags: ["video", "umbraco", "xstatic", "aspire"]
blocks:
  - type: "hero"
    variant: "plain"
    heading: "xStatic for Umbraco 15: a static failover site"
    subheading: "Why show an error page when Umbraco goes down? Serve a static copy instead, using xStatic, .NET Aspire, YARP and an Azure Function."
  - type: "embed"
    provider: "youtube"
    id: "B2poMuqLeW8"
    title: "xStatic for Umbraco 15 - No more server down pages with a static failover site"
    poster:
      src: "../../assets/media/youtube/xstatic-15-static-failover-site.avif"
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
When an Umbraco site goes down, visitors connected straight to it get an error page and no content at all. Sites built with xStatic run separately from any Umbraco instance, so I wanted to see whether one could stand in as a failover. Put a reverse proxy in front of both: visitors get Umbraco while it's healthy, the static copy when it isn't, and Umbraco again once it's fixed.

The stack:

- **[.NET Aspire](https://learn.microsoft.com/dotnet/aspire/)** orchestrates every project and service.
- **[YARP](https://github.com/microsoft/reverse-proxy)**, Microsoft's reverse proxy library, sends traffic to whichever site is healthy.
- **An Umbraco 15 API user** lets a remote service call xStatic without a real person's login.
- **An Azure Function** generates and deploys the static site on a schedule, using the new xStatic Remote Operations NuGet package.

The code is on GitHub at [Mulliman/xstatic-15-failover-demo](https://github.com/Mulliman/xstatic-15-failover-demo).

## The two sites

The solution starts from the empty Aspire project template. One project is Umbraco with Paul Seal's Clean Starter Kit and xStatic installed. The other is an empty ASP.NET Core web app that serves whatever files xStatic deploys into it. The xStatic site is configured as normal and deploys to a folder on disk; not what you'd do in production, but fine for a demo. You can tell the static copy apart by the "cached by xStatic" comment at the bottom of the HTML.

The idea is that the failover only needs to be roughly up to date. Turning on auto-publish would rebuild the whole static site every time an editor published something, so instead the site is backed up once a night, when hardly anyone is editing or visiting.

## Wiring up Aspire

Projects added through Visual Studio can be enlisted in Aspire with a checkbox, but the Umbraco templates can't yet, so there are a few manual steps:

1. Reference the ServiceDefaults project from the Umbraco project.
2. Call `builder.AddServiceDefaults()` and `app.MapDefaultEndpoints()` in its `Program.cs`.
3. Reference the Umbraco project from the AppHost and add it there.
4. Add an `https` launch profile to the Umbraco project. Aspire takes each project's ports from its launch settings.

Run the AppHost and the Aspire dashboard lists every resource, with links straight to both versions of the site.

## Adding YARP

Each site still has its own port, so the next job is one address in front of both. For this I used a YARP resource extensions file by David Fowler, which I updated from .NET 8 to .NET 9. It lets you configure the proxy in the AppHost and refer to the other projects by reference, so no URLs are hard-coded anywhere.

The proxy has one catch-all route and one cluster with two destinations, primary (Umbraco) and secondary (static). The load balancing policy is **FirstAlphabetical**, which picks the first healthy destination by name, so naming them primary and secondary gives the priority for free. A health check requests the home page every 10 seconds, and three failures take a destination out of the pool.

To test it, I changed some Umbraco content to "This is live content" and loaded the site through the proxy. Then I stopped the Umbraco resource in the Aspire dashboard. The first request hung and failed, as expected, but within about 30 seconds the proxy switched to the static copy. Starting Umbraco again switched it back.

## Scheduling the backup

The Azure Function uses the xStatic Remote Operations package. The working part is two lines: create a remote operations client, then ask it to generate and deploy every site it can find. The client needs Umbraco's base URI, a client ID and a client secret.

API users are new in Umbraco 15. In the Users section, create an API user (I made mine an administrator for the demo; in real life give it only what it needs), then add client credentials. Pass the base URI, client ID and secret to the function as environment variables with Aspire's `WithEnvironment`. In production those belong in something like Key Vault, not hard-coded.

For the demo the timer fires every minute; in real life once a day is plenty. After the first run, the static site showed the same "This is live content" text as Umbraco.

## Warning visitors

A static copy can't run forms or search. Rather than let them fail, an xStatic transformer swaps every form for a message saying the site is having difficulties. The transformer implements `ITransformer` from xStatic Core in about three lines: a regex finds each form and replaces it with the message. To make sure it runs after the built-in transformers, take the defaults from the default HTML transformer list factory and append the new one.

Select the new factory in the export type, generate, deploy, and the search and contact pages now show the warning instead of a broken form. Visitors can still read all your content, which is far better than a generic outage page.

Clone the [demo repository](https://github.com/Mulliman/xstatic-15-failover-demo) and give it a go.
