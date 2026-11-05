---
title: "Site Storers"
description: "Site storers are the component that stores the generated files ready for use by the deployer process in xStatic."
authorship: "sam"
status: "legacy"
archived: true
series: "xstatic-for-umbraco/extending-xstatic-2"
order: 7
blocks:
  - type: "body"
    surface: "muted"
---

# Site Storers

Site storers are the component that stores the generated files ready for use by the deployer process in xStatic.

By default the files are stored in numbered folders in the App\_Data folder of an Umbraco site. If you need to store the generated files in alternative locations you can implement the \`IStaticSiteStorer\` interface.

  

You will then need to register this service instead of the default AppDataSiteStorer registration. In order to do this you'll have to manually call the separate methods in GeneratorServiceBuilder rather than relying on the Automatic() method normally used.

-   [Extending xStatic 2+](/software/xstatic-for-umbraco/extending-xstatic-2/)

-   [Actions](/software/xstatic-for-umbraco/extending-xstatic-2/actions/)
-   [Build Process](/software/xstatic-for-umbraco/extending-xstatic-2/build-process/)
-   [Deploy process](/software/xstatic-for-umbraco/extending-xstatic-2/deploy-process/)
-   [Deployers](/software/xstatic-for-umbraco/extending-xstatic-2/deployers/)
-   [File Name Generation](/software/xstatic-for-umbraco/extending-xstatic-2/file-name-generation/)
-   [Generators](/software/xstatic-for-umbraco/extending-xstatic-2/generators/)
-   [Site Storers](/software/xstatic-for-umbraco/extending-xstatic-2/site-storers/)
-   [Transformers](/software/xstatic-for-umbraco/extending-xstatic-2/transformers/)
