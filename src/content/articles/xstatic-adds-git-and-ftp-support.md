---
title: "xStatic adds Git and FTP support"
description: "By popular demand Git and FTP support has been added to xStatic. This latest beta release also makes it possible to add in a custom deployer, and adds a little bit of logging and better error…"
date: "2021-02-01"
cover:
  src: "../../assets/media/nwbp04ek/xstaticwithgitandftp.avif"
  alt: "The xStatic logo above the words Now with Git and FTP!"
authorship: "sam"
archived: true
blocks:
  - type: "hero"
    variant: "plain"
    heading: "xStatic adds Git and FTP support"
    subheading: "By popular demand Git and FTP support has been added to xStatic. This latest beta release also makes it possible to add in a custom deployer, and adds a little bit of logging and better error handling."
  - type: "body"
    surface: "default"
  - type: "cards"
    variant: "full"
    surface: "default"
    columns: 3
    items:
      - title: "Deploying using Git"
        text: "Using Git to deploy your static site means that you can easily release to GitHub Pages, as well as any other continuous deployment platform."
        href: "/software/xstatic-for-umbraco/deploying-using-git/"
        image:
          src: "../../assets/media/egdifrhl/banner.avif"
          alt: ""
          decorative: true
      - title: "Deploying to FTP server"
        text: "if you have an existing server with FTP access, this may an easy option. xStatic will update the remote server to mirror the files built locally; this seems to be slower than the Git and Netlify deployment methods."
        href: "/software/xstatic-for-umbraco/deploying-to-ftp-server/"
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

## Use Git to deploy to GitHub Pages

The first new deployer added in the latest xStatic beta release is using Git. This will clone an existing repository from a remote source and commit/push all future deploys back to the origin. This allows you to easily use GitHub Pages, but it can also be used with a wide range of other continuous deliver platforms.

There are a few limitations to be aware of before choosing this over the preferred Netlify deployer. Firstly you need to be in 64 bit mode and you need to accept that the size on disk will be larger as the entire repo history will be stored alongside the files.

It is also recommended to use a custom hostname rather than the default GitHub Pages URL. If you want to deploy to a site to a location that isn't the root of the domain (e.g. {username}.github.io/{projectname}) you will likely need to write some custom transformers.

[Learn how to configure xStatic with Git](/software/xstatic-for-umbraco/deploying-using-git/)

## Utilise your existing hosting by deploying with FTP

If you have a more traditional hosting configuration, you can now deploy your xStatic site using FTP. This will mirror the remote FTP folder to match the built assets of your Umbraco instance.

FTP is the slowest of the deployment methods.

[Learn how to configure FTP](/software/xstatic-for-umbraco/deploying-to-ftp-server/)

## Error handling and logging improvements.

The deployment processes have all been improved to notify users of failures and log the exception in the standard Umbraco log. If you do have any issues with your deployments check App\_Data/Logs to pinpoint the reason.

## Create your own deployers

You can now create your own custom deployers without having to alter the core xStatic codebase. It is as simple as implementing a one method interface and configuring in the xStaticConfig.json file. The user interface is all handled by xStatic.

[Read about extending xStatic](/software/xstatic-for-umbraco/extending-xstatic/)

## Download today

The new beta package is now available on Our.Umbraco and has been tested with version 8.11.1 of Umbraco.

[Download](https://our.umbraco.com/packages/backoffice-extensions/xstatic/)
