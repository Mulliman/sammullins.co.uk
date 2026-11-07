---
title: "Extending xStatic v1"
description: "You can extend xStatic to generate and transform the output to fit your specific requirements."
cover:
  src: "../../../assets/media/egdifrhl/banner.avif"
  alt: "The xStatic logo in pink and orange on a dark purple background"
authorship: "sam"
status: "legacy"
archived: true
series: "xstatic-for-umbraco"
order: 7
blocks:
  - type: "hero"
    variant: "plain"
    heading: "Extending xStatic v1"
    subheading: "You can extend xStatic to generate and transform the output to fit your specific requirements."
  - type: "body"
    surface: "default"
---

### The build and deploy process

When a rebuild is triggered a job is created in memory containing all the pages, media items, and asset files that will be built. Then transformers are added to the job definition too. Once the job is completely set up, the job runner calls the appropriate generator for each item in the job.

Currently only two parts of the process are extensible, generators and transformers. In the App\_Plugins/xStatic/xStaticConfig.json file you can set up extra export types and you can define what generator to use and what transformers should be run. Note, in the beta, all generated files for any additional export types will use the EverythingIsIndexHtmlFileNameGenerator which creates index.html files, not .json.

### Create a custom transformer

A transformer takes the raw output data from the generator and makes changes to the textual content. These transformers can be chained so that multiple text changes are made before being saved to disk, or exported to Netlify.

The standard HTML export type uses the following transformers:

-   CachedTimeTransformer - Adds a comment to the file saying when it was generated.
-   CroppedImageUrlTransformer - Replaces standard Umbraco image crop URLs with the filenames of versions created by xStatic.
-   HostnameTransformer - Replaces instances of the local hostname with the one configured for the site being generated. 

To add your own transformer, create a class that implements XStatic.Generator.Transformers.ITransformer. For example: 

```
public class ReplaceAWithETransformer : ITransformer
    {
        public string Transform(string input, UmbracoContext context)
        {
            return input.Replace("a", "e");
        }
    }
```

Once this is created you need to create a transformer list factory, which tell xStatic which transformers should be run and in what order. The easiest way to do this would be to override the existing HTML transformer list factory as shown below. If you want full control , implement the interface ITransformerListFactory.

```csharp
public class CustomTransformerListFactory : DefaultHtmlTransformerListFactory
    {
        public override IEnumerable<ITransformer> BuildTransformers(ISiteConfig siteConfig)
        {
            var customTransformers = new List<ITransformer>();

            customTransformers.AddRange(base.BuildTransformers(siteConfig));

            customTransformers.Add(new YourTransformer());

            return customTransformers;
        }
    }
```

You can then add this new factory to the xStaticConfig.json file in App\_Plugins by replacing the value for the "transformerFactory" property.

### Create a custom Deployer

Creating a custom deployer is as simple as creating a single class with a single method and registering it in the xStatic config.

First create a new class that implements the interface XStatic.Deploy.IDeployer. This class will be instantiated with a dictionary of settings which you also define in the xStatic config.

For example, the class may look something like the below:

```csharp
public class ExampleDeployer : IDeployer
    {
        private readonly string _username;
        private readonly string _password; 

        public ExampleDeployer(Dictionary<string, string> parameters)
        {
            _username = parameters["Username"];
            _password = parameters["Password"];
        }

        public virtual async Task<XStaticResult> DeployWholeSite(string folderPath)
        {
            // TODO: Deploy the folder (folderPath) to somewhere using _username and _password to authenticate.

            return XStaticResult.Success("Site deployed.");
        }
    }
```

You then need to register this class, along with the parameters it requires the user to fill in in the xStaticConfig.json file.

```
"deployers": [
    ...
    {
      "id": "example",
      "name": "Example",
      "help": "Some help text here",
      "fields": {
        "Username": "",
        "Password": ""
      },
      "deployer": "XStatic.Deploy.ExampleDeployer, XStatic.Deploy"
    }
  ]
```

### Create a custom generator

It is less likely that you'll need to create a custom generator, but this can be done by inheriting from the XStatic.Generator.GeneratorBase class and implementing the abstract methods.

You can then set this as the generator by updating the "generator" property of each site in the xStaticConfig.json file in App\_Plugins.

-   [xStatic for Umbraco](/software/xstatic-for-umbraco/)

-   [Building your first static site](/software/xstatic-for-umbraco/building-your-first-static-site/)
-   [Deploying to Netlify](/software/xstatic-for-umbraco/deploying-to-netlify/)
-   [Deploying using Git](/software/xstatic-for-umbraco/deploying-using-git/)
-   [Deploying to FTP server](/software/xstatic-for-umbraco/deploying-to-ftp-server/)
-   [Image crops](/software/xstatic-for-umbraco/image-crops/)
-   [Troubleshooting](/software/xstatic-for-umbraco/troubleshooting/)
-   [Extending xStatic](/software/xstatic-for-umbraco/extending-xstatic/)
-   [Extending xStatic 2+](/software/xstatic-for-umbraco/extending-xstatic-2/)
