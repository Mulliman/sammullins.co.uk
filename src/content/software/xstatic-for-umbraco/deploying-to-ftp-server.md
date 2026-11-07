---
title: "Deploying to FTP server"
description: "if you have an existing server with FTP access, this may an easy option. xStatic will update the remote server to mirror the files built locally; this seems to be slower than the Git and Netlify…"
cover:
  src: "../../../assets/media/egdifrhl/banner.avif"
  alt: "The xStatic logo in pink and orange on a dark purple background"
authorship: "sam"
status: "legacy"
archived: true
series: "xstatic-for-umbraco"
order: 4
blocks:
  - type: "hero"
    variant: "plain"
    heading: "Deploying to FTP server"
    subheading: "if you have an existing server with FTP access, this may an easy option. xStatic will update the remote server to mirror the files built locally; this seems to be slower than the Git and Netlify deployment methods."
  - type: "body"
    surface: "default"
---

## Configuring an FTP deployment step by step

1.  Within the xStatic section of Umbraco, open your site configuration in edit mode by selecting from the tree or using the edit button on the dashboard.
2.  In the Deployment Target field, select FTP and fill in the fields with the details of your FTP server. For the hostname don't include the scheme, for example you only need to specify 'ftp.mywebsite.com'. If you don't specify a port number, 21 is used. Press Save.
3.  Return to the xStatic dashboard, and press the deploy button. If the deploy button isn't showing, make sure you have built the site before.
4.  You should now be able to see that the files on the FTP server match the structure of your Umbraco site.
5.  Remember, you'll need to fill in the "Asset Paths" field in order for your styles to also be deployed to the Git repo.

-   [xStatic for Umbraco](/software/xstatic-for-umbraco/)

-   [Building your first static site](/software/xstatic-for-umbraco/building-your-first-static-site/)
-   [Deploying to Netlify](/software/xstatic-for-umbraco/deploying-to-netlify/)
-   [Deploying using Git](/software/xstatic-for-umbraco/deploying-using-git/)
-   [Deploying to FTP server](/software/xstatic-for-umbraco/deploying-to-ftp-server/)
-   [Image crops](/software/xstatic-for-umbraco/image-crops/)
-   [Troubleshooting](/software/xstatic-for-umbraco/troubleshooting/)
-   [Extending xStatic](/software/xstatic-for-umbraco/extending-xstatic/)
-   [Extending xStatic 2+](/software/xstatic-for-umbraco/extending-xstatic-2/)
