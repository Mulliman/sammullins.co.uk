---
title: "Troubleshooting"
description: "xStatic should work out of the box, but if it doesn't, this is the place to check first."
cover:
  src: "../../../assets/media/egdifrhl/banner.avif"
  alt: "The xStatic logo in pink and orange on a dark purple background"
authorship: "sam"
status: "legacy"
archived: true
series: "xstatic-for-umbraco"
order: 6
blocks:
  - type: "hero"
    variant: "plain"
    heading: "Troubleshooting"
    subheading: "xStatic should work out of the box, but if it doesn't, this is the place to check first."
  - type: "body"
    surface: "default"
---

### Old pages are still showing on site

xStatic does not automatically delete pages (or any other data). If you want to do a clean rebuild from scratch you can use the "(Clean up)" option that is shown next to the site size value of each site on the dashboard.

Then when you next run a build and deploy all old data will no longer be present.

### Pages are not generated when using HTTPS

If you're using local self signed certificates that are not configured to perfection xStatic may struggle to retrieve the web pages and resized images.

If you find this is the case you can add the following to the web.config file and all HTTPS traffic will be trusted. Consider any security implications before making this change.

```html
<appSettings>
    ...
    <add key="xStatic.TrustSsl" value="true" />
</appSettings>
```

The value doesn't not matter, xStatic only checks for the presence of this app setting. If you want to disable this functionality, remove the setting entirely, don't just set to false.

-   [xStatic for Umbraco](/software/xstatic-for-umbraco/)

-   [Building your first static site](/software/xstatic-for-umbraco/building-your-first-static-site/)
-   [Deploying to Netlify](/software/xstatic-for-umbraco/deploying-to-netlify/)
-   [Deploying using Git](/software/xstatic-for-umbraco/deploying-using-git/)
-   [Deploying to FTP server](/software/xstatic-for-umbraco/deploying-to-ftp-server/)
-   [Image crops](/software/xstatic-for-umbraco/image-crops/)
-   [Troubleshooting](/software/xstatic-for-umbraco/troubleshooting/)
-   [Extending xStatic](/software/xstatic-for-umbraco/extending-xstatic/)
-   [Extending xStatic 2+](/software/xstatic-for-umbraco/extending-xstatic-2/)
