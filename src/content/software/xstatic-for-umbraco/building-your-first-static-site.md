---
title: "Building your first static site"
description: "Setting up xStatic is easy, and following these steps you can configure your first static site within minutes."
cover:
  src: "../../../assets/media/egdifrhl/banner.avif"
  alt: "Building your first static site"
authorship: "sam"
status: "legacy"
archived: true
series: "xstatic-for-umbraco"
order: 1
blocks:
  - type: "hero"
    variant: "plain"
    heading: "Building your first static site"
    subheading: "Setting up xStatic is easy, and following these steps you can configure your first static site within minutes."
  - type: "body"
    surface: "default"
---

### Configuring a static site step by step

1.  First install Umbraco from NuGet and ensure that it is all set up. xStatic can only be installed once Umbraco is running correctly.
2.  Install the xStatic package to your Umbraco solution by installing the NuGet package "xStatic".
3.  Add "services.AddXStatic().Automatic().Build();" to the ConfigureServices method in your Startup.cs file. You will need to use "using XStatic.Core.App;".
4.  Build the project. Make sure that the folder "App\_Plugins/xStatic" is included in your project. These files need to be included for xStatic to appear as available sections.
5.  Deploy the solution.
6.  Go to the users section of Umbraco. In the top right click groups, select the administrators group and add the section "xStatic Generated Sites".
7.  Press save and reload the page.
8.  Click on the new "xStatic Generated Sites" section.
9.  On the Dashboard click "Create new site".
10.  At the very least, fill in a name, the root node of the site and choose "HTML site" as the Export format. The you can press create.
11.  Click xStatic Generated Sites to go back to the dashboard.
12.  Press "Build" on your newly set up site configuration. This will create a static version of the site in the App\_Data folder ready for deploying in a later stage.

-   [xStatic for Umbraco](/software/xstatic-for-umbraco/)

-   [Building your first static site](/software/xstatic-for-umbraco/building-your-first-static-site/)
-   [Deploying to Netlify](/software/xstatic-for-umbraco/deploying-to-netlify/)
-   [Deploying using Git](/software/xstatic-for-umbraco/deploying-using-git/)
-   [Deploying to FTP server](/software/xstatic-for-umbraco/deploying-to-ftp-server/)
-   [Image crops](/software/xstatic-for-umbraco/image-crops/)
-   [Troubleshooting](/software/xstatic-for-umbraco/troubleshooting/)
-   [Extending xStatic](/software/xstatic-for-umbraco/extending-xstatic/)
-   [Extending xStatic 2+](/software/xstatic-for-umbraco/extending-xstatic-2/)
