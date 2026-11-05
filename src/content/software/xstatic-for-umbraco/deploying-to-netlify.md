---
title: "Deploying to Netlify"
description: "Setting up a Netlify site is free, and should only take a few minutes to create and configure within xStatic."
cover:
  src: "../../../assets/media/egdifrhl/banner.avif"
  alt: "Deploying to Netlify"
authorship: "sam"
status: "legacy"
archived: true
series: "xstatic-for-umbraco"
order: 2
blocks:
  - type: "hero"
    variant: "plain"
    heading: "Deploying to Netlify"
    subheading: "Setting up a Netlify site is free, and should only take a few minutes to create and configure within xStatic."
  - type: "body"
    surface: "default"
---

### Configuring a Netlify deployment step by step

1.  If you don't already have a Netlify account create one and log in.
2.  Create a folder on your local machine, and add an index.html file. The content of this file are not important.
3.  Go to the sites section of Netlify and drag this folder into the section that says "Want to deploy a new site without connecting to Git? Drag and drop your site folder here"
4.  Navigate to the site settings of this site within Netlify, on this page there should be a section called Site Information, which includes a field called API ID. Copy this ID and store somewhere safe.
5.  Open the user applications section of Netlify at the following URL: [https://app.netlify.com/user/applications](https://app.netlify.com/user/applications). You can access this page from the user settings section too. In the Personal Access Tokens section create a new access token. Copy the generated key and store for later use. 
6.  Within the xStatic section of Umbraco, open your site configuration in edit mode by selecting from the tree or using the edit button on the dashboard.
7.  In the Deployment Target field, select Netlify and paste the two values acquired above into the correct fields. Press Save.
8.  Return to the xStatic dashboard, and press the deploy button. If the deploy button isn't showing, make sure you have built the site before.
9.  You can now navigate to the static version of you Umbraco site using the URL Netlify has given your application.
10.  Remember, you'll need to fill in the "Asset Paths" field in order for your styles to also be deployed to Netlify.

-   [xStatic for Umbraco](/software/xstatic-for-umbraco/)

-   [Building your first static site](/software/xstatic-for-umbraco/building-your-first-static-site/)
-   [Deploying to Netlify](/software/xstatic-for-umbraco/deploying-to-netlify/)
-   [Deploying using Git](/software/xstatic-for-umbraco/deploying-using-git/)
-   [Deploying to FTP server](/software/xstatic-for-umbraco/deploying-to-ftp-server/)
-   [Image crops](/software/xstatic-for-umbraco/image-crops/)
-   [Troubleshooting](/software/xstatic-for-umbraco/troubleshooting/)
-   [Extending xStatic](/software/xstatic-for-umbraco/extending-xstatic/)
-   [Extending xStatic 2+](/software/xstatic-for-umbraco/extending-xstatic-2/)
