---
title: "Image crops"
description: "xStatic works with the built in Umbraco image cropping functionality, but you do need to do a little bit of configuration."
cover:
  src: "../../../assets/media/egdifrhl/banner.avif"
  alt: "The xStatic logo in pink and orange on a dark purple background"
authorship: "sam"
status: "legacy"
archived: true
series: "xstatic-for-umbraco"
order: 5
blocks:
  - type: "hero"
    variant: "plain"
    heading: "Image crops"
    subheading: "xStatic works with the built in Umbraco image cropping functionality, but you do need to do a little bit of configuration."
  - type: "body"
    surface: "default"
---

### How the image cropping works

When a build is triggered, xStatic copies all media from the selected media folders over to the temporary folder that will be deployed to Netlify. This means that by default all images on the remote server will be full resolution, no matter if cropped URLs are used.

To allow for some image cropping functionality you can define which crops you'd like to deploy as well as the full size image. When xStatic copies over the media, it will also crop images in each of the defined sizes, and rename the file to include this crop information.

When the pages are generated, there is a [transformer](/software/xstatic-for-umbraco/extending-xstatic/) that takes crop URLs and replaces them with the file names mentioned above.

### Configuring image crops

1.  Select the site that you want to define crops for in the dashboard and go to the edit page.
2.  In the 'Image Crops' field add a comma separated list of crops that should be generated. The format of each crop should be in the format {width}x{height}. If you are only cropping based on one dimension, use 0 rather than leaving blank.
3.  In your cshtml views, just use the GetCropUrl methods as usual, and just make sure that the dimensions match what you have set up in xStatic.

-   [xStatic for Umbraco](/software/xstatic-for-umbraco/)

-   [Building your first static site](/software/xstatic-for-umbraco/building-your-first-static-site/)
-   [Deploying to Netlify](/software/xstatic-for-umbraco/deploying-to-netlify/)
-   [Deploying using Git](/software/xstatic-for-umbraco/deploying-using-git/)
-   [Deploying to FTP server](/software/xstatic-for-umbraco/deploying-to-ftp-server/)
-   [Image crops](/software/xstatic-for-umbraco/image-crops/)
-   [Troubleshooting](/software/xstatic-for-umbraco/troubleshooting/)
-   [Extending xStatic](/software/xstatic-for-umbraco/extending-xstatic/)
-   [Extending xStatic 2+](/software/xstatic-for-umbraco/extending-xstatic-2/)
