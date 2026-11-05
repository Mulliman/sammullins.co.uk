---
title: "Deploy process"
description: "The deploy process is the second main process in xStatic. This stage takes the built output and pushes it to a location configured by the user. In the CMS dashboard you fill in these details in…"
authorship: "sam"
status: "legacy"
archived: true
series: "xstatic-for-umbraco/extending-xstatic-2"
order: 2
blocks:
  - type: "body"
    surface: "muted"
---

# Deploy process

The deploy process is the second main process in xStatic. This stage takes the built output and pushes it to a location configured by the user. In the CMS dashboard you fill in these details in the Deployment Target field. The options available in this field are determined by the \`IDeployer\` implementations present in the code base.

## Deployers

To learn about creating custom deployers, read the [Deployers page](/software/xstatic-for-umbraco/extending-xstatic-2/deployers/).

## Open source deployment options

Built in to xStatic is a very simple file system based deployer, but there are more powerful alternatives available on NuGet. Search for Netlify, Git, Amazon, and FTP xStatic packages and add these to your solution.

-   [Extending xStatic 2+](/software/xstatic-for-umbraco/extending-xstatic-2/)

-   [Actions](/software/xstatic-for-umbraco/extending-xstatic-2/actions/)
-   [Build Process](/software/xstatic-for-umbraco/extending-xstatic-2/build-process/)
-   [Deploy process](/software/xstatic-for-umbraco/extending-xstatic-2/deploy-process/)
-   [Deployers](/software/xstatic-for-umbraco/extending-xstatic-2/deployers/)
-   [File Name Generation](/software/xstatic-for-umbraco/extending-xstatic-2/file-name-generation/)
-   [Generators](/software/xstatic-for-umbraco/extending-xstatic-2/generators/)
-   [Site Storers](/software/xstatic-for-umbraco/extending-xstatic-2/site-storers/)
-   [Transformers](/software/xstatic-for-umbraco/extending-xstatic-2/transformers/)
