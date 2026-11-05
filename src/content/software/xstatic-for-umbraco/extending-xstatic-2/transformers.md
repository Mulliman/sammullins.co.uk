---
title: "Transformers"
description: "Transformers are xStatic components that take the static content for a content item, perform an operation, and return an altered string. These can be used to change hostnames, alter image URLs, or…"
authorship: "sam"
status: "legacy"
archived: true
series: "xstatic-for-umbraco/extending-xstatic-2"
order: 8
blocks:
  - type: "body"
    surface: "muted"
---

# Transformers

Transformers are xStatic components that take the static content for a content item, perform an operation, and return an altered string. These can be used to change hostnames, alter image URLs, or any other string manipulation you may need to do. Custom transformers are easy to create. Transformers need to be curated into \`TransfomerList\`s before they can be assigned to an export type; this simply defines which transformers need to run and in which order.

## Creating a new transformer

To add your own transformer, create a class that implements ITransformer.

```
public class ReplaceAWithETransformer : ITransformer
{
    public string Transform(string input, UmbracoContext context)
    {
        return input.Replace("a", "e");
    }
}
```

## Creating a transformer list

Once the transformer is created you need to create a transformer list factory, which tells xStatic which transformers should be run and in which order. The easiest way to do this for HTML sites would be to override the existing HTML transformer list factory as shown below. If you want full control, implement the interface ITransformerListFactory.

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

## Using the custom list

Implementations of ITransformerListFactory will automatically get discovered by xStatic and will be available for selection withing the export type dashboard with the CMS. If you are using parameters in the constructor you need to register this class in your Startup ConfigureServices method.

-   [Extending xStatic 2+](/software/xstatic-for-umbraco/extending-xstatic-2/)

-   [Actions](/software/xstatic-for-umbraco/extending-xstatic-2/actions/)
-   [Build Process](/software/xstatic-for-umbraco/extending-xstatic-2/build-process/)
-   [Deploy process](/software/xstatic-for-umbraco/extending-xstatic-2/deploy-process/)
-   [Deployers](/software/xstatic-for-umbraco/extending-xstatic-2/deployers/)
-   [File Name Generation](/software/xstatic-for-umbraco/extending-xstatic-2/file-name-generation/)
-   [Generators](/software/xstatic-for-umbraco/extending-xstatic-2/generators/)
-   [Site Storers](/software/xstatic-for-umbraco/extending-xstatic-2/site-storers/)
-   [Transformers](/software/xstatic-for-umbraco/extending-xstatic-2/transformers/)
