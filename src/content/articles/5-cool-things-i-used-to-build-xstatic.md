---
title: "5 cool things I used to build xStatic"
description: "As part of a series looking at some of the tech behind my open source projects, this article outlines my favourite products and services I used for the first time on xStatic."
date: "2021-04-07"
cover:
  src: "../../assets/media/zapplr3l/5-cool-things-purple.avif"
  alt: "5 cool things I used to build xStatic"
authorship: "sam"
archived: true
blocks:
  - type: "hero"
    variant: "plain"
    heading: "5 cool things I used to build xStatic"
    subheading: "As part of a series looking at some of the tech behind my open source projects, this article outlines my favourite products and services I used for the first time on xStatic."
  - type: "body"
    surface: "default"
  - type: "cards"
    variant: "image"
    surface: "default"
    columns: 2
    items:
      - title: "Install xStatic from the Umbraco Gallery"
        cta: "Our Umbraco"
        href: "https://our.umbraco.com/packages/backoffice-extensions/xstatic/"
        image:
          src: "../../assets/media/hddpv0gy/xstatic1.avif"
          alt: ""
          decorative: true
      - title: "Read more about xStatic"
        cta: "xStatic for Umbraco"
        href: "/software/xstatic-for-umbraco/"
        image:
          src: "../../assets/media/egdifrhl/banner.avif"
          alt: ""
          decorative: true
  - type: "intro"
    heading: "Other articles in the series"
    surface: "muted"
    align: "center"
  - type: "cards"
    variant: "full"
    surface: "muted"
    columns: 2
    items:
      - title: "5 cool things I used to build The Imposter"
        text: "Continuing the series looking at some of the tech behind my open source projects, this article includes the front end and back end technologies used to create my PWA party game."
        href: "/articles/5-cool-things-i-used-to-build-the-imposter/"
        image:
          src: "../../assets/media/zaqdt00v/5-cool-things-blue.avif"
          alt: ""
          decorative: true
      - title: "5 cool things I used to build PanoCapture and PostCapture"
        text: "Finishing the series looking at some of the tech behind my open source projects, PanoCapture and PostCapture are photo editing plugins for CaptureOne. These are some tools I found when moving away from my web comfort zone and developing desktop apps."
        href: "/articles/5-cool-things-i-used-to-build-panocapture-and-postcapture/"
        image:
          src: "../../assets/media/uiwmnegi/5-cool-things.avif"
          alt: ""
          decorative: true
---

## 1\. UI-O-Matic

When creating xStatic I needed to create an Umbraco back office extension that allowed users to manage their static site generation settings. These settings are stored in a SQL table and I then needed to write the AngularJs and web services to read and write from this table as well as configuring the tree and editor interface.

UI-O-Matic removes a huge amount of this manual effort. All you need to do is install the package via NuGet, and add a few attributes onto your POCO models. Once this is done, UI-O-Matic handles all the CRUD operations without you having to write a line of AngularJS.

It's extensible too; I created a couple of custom fields and they were very easy to integrate in.

UI-O-Matic is free and open source, however a recent change to the licence is something to be wary of. 

> Please be aware of the [License Model](https://github.com/TimGeyssens/UIOMatic/blob/v3/LICENSE.md) before using this package since additional charges might apply if you are an Umbraco Gold Partner. And it is prohibited to use the Software on the Cloud offering of Umbraco.
> 
> Tim Geyssens [Github](https://github.com/TimGeyssens/UIOMatic)

There is good [documentation](https://timgeyssens.gitbook.io/ui-o-matic/) guiding you through all you need to know and the code is available on [Github.](https://github.com/TimGeyssens/UIOMatic)

## 2\. Umbraco Migrations

On xStatic I used Umbraco Database Migrations for the first time. This allowed me to not only create database tables in a very simple way, but it also allowed me to rollout updates to the database schema easily as the product evolves.

The setup is done completely within C# and is as simple a creating a migration plan class, which defines what order the changes are made in, and a collection of migration classes which do the database changes.

```csharp
public class XStaticDatabaseMigrationPlan : MigrationPlan
{
    public XStaticDatabaseMigrationPlan()
        : base("xStatic")
    {
        From(string.Empty)
            .To<MigrationCreateTable>("init")
            .To<MigrationAddTargetHostnameField>("Add Target Hostname field")
            .To<MigrationAddImageCropsField>("Add Image crops field")
            .To<MigrationMakeSomeFieldsLonger>("Make some fields longer");
    }
}
```

```csharp
public class MigrationAddImageCropsField : MigrationBase
{
    public MigrationAddImageCropsField(IMigrationContext context)
        : base(context)
    {
    }

    public override void Migrate()
    {
        if (TableExists("XStaticSiteConfigs"))
        {
            var builder = Alter.Table("XStaticSiteConfigs")
                .AddColumn("ImageCrops").AsString().Nullable();

            builder.Do();
        }
    }
}
```

Once this is done, all you have to do is set up a composer that makes this run on application initialization and you're set.

## 3\. Netlify HTTP API

Before I built xStatic I'd never even heard of [Netlify](https://www.netlify.com/), a serverless website hosting company with a generous free tier. The usual workflow is achieved using a Git repository, but the approach that appealed to me was their easy to use HTTP API that allows developers to push updates to their websites using a series of HTTP requests.

The process is fairly simple, but ensures that only new/changed files are uploaded to the service. The first step is to generate hashes for every file in your site; this collection of hashes is then POSTed to Netlify and the message returned specifies which files are not up to date, and need uploading. It's then a simple case of uploading each of these files.

Once these files are uploaded, a Netlify build is automatically triggered and a new version of your website will be visible within seconds.

Netlify stores the history of your website's files, so if there's an issue with the most recent deployment it's really easy to rollback to any previous version, just press a button!

[This article](https://www.arkleseizure.net/deploying-to-netlify-using-digest-from-c) was a really helpful introduction into deploying to Netlify using C# and it was a case of copy/paste/refactor to get the code working in xStatic.

## 4\. LibGit2Sharp

While on umbraCoffee a few xStatic improvements were suggested by the community, mainly FTP and Git support. [LibGit2Sharp](https://github.com/libgit2/libgit2sharp), a NuGet package that allows you to create and update Git repositories using C#, was suggested to me and I chose to give it a go.

Generally I found this library an easy to use alternative to interacting directly with the non-managed provider. I've had an occasional problem with a DLL getting locked, but other than that it seems to work really nicely.

If you need some sample code for creating a repo, committing some changes and pushing the changes to a remote you can look at the [GitDeployer code in xStatic](https://github.com/Mulliman/xStatic-for-Umbraco/blob/master/Source/XStatic/XStatic.Deploy/Git/GitDeployer.cs).

## 5\. ImageKit

In March I was kindly asked to present xStatic at the [Manchester and North West Umbraco Meetup](https://www.meetup.com/Manchester-Umbraco-Meetup/). Rather than just going over the basics I decided to give an example of how anyone can extend xStatic.

I decided that a nice addition would be to use a separate media provider so that only the pages and CSS/JS assets were stored on Netlify. Not only would it open up many image based possibilities (optimization, resizing, DAM) but it also means that you can use two different free tiers when hosting your site, potentially doubling your bandwidth allowance!

Even thought I only used [ImageKit](https://imagekit.io/) as a proof of concept, I was really impressed by the features that it gave me free of charge. The storage and bandwidth allowances are generous and you can easily resize and watermark images by adding query parameters to your images. My favourite feature is the automatic conversion from jpg to webp to reduce the page size for end users, all without a single line of code!

You can also manually browse and manage your media in a nice web user interface; you can view analytics of media requests, you can set compression quality (and even vary the quality based on network speed!), and much much more. 

It impressed me so much that I am thinking of transferring the media on this site to use ImageKit!
