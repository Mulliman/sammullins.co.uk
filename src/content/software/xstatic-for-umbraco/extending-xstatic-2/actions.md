---
title: "Actions"
description: |-
  An action is an async operation that can be run as part of the build process. Currently this is limited to PostGenerationActions that run after the build process is complete.

  This can be used to…
authorship: "sam"
status: "legacy"
archived: true
series: "xstatic-for-umbraco/extending-xstatic-2"
order: 3
blocks:
  - type: "body"
    surface: "muted"
---

# Actions

An action is an async operation that can be run as part of the build process. Currently this is limited to PostGenerationActions that run after the build process is complete.

  

This can be used to rename / move / delete files which can be very useful for sitemaps, redirects, or files required for certain hosting providers.

For example, the Netlify xStatic package has a post action that creates the 404 page.

## Create a Post Generation Action

To create an action that is run after a build has completed you need to implement the IPostGenerationAction interface.

If your action requires user input for you can decorate your class with multiple \[XStaticEditableField("YourFieldName")\] attributes and these will be shown as text boxes in the Umbraco interface.

These are then passed in as a dictionary to your RunAction method.

## Register the Post Generation Action

All created post generations are automatically found by xStatic so you don't need to do any further configuration.  
However, if you have a custom constructor for your action then you need to register the class on startup.

E.g. `services.AddTransient<Netlify404Action>();`

## Configure within xStatic dashboard

With this class created you can now create an action within Umbraco.

Go to the Actions dashboard, create a new action, fill in the fields and save.

You can now add this action to your static site definitions.

## Example

```csharp
[XStaticEditableField("FilePath")]
    public class FileDeleteAction : IPostGenerationAction
    {
        private readonly IStaticSiteStorer _staticSiteStorer;

        public virtual string Name => nameof(FileDeleteAction);

        public FileDeleteAction(IStaticSiteStorer staticSiteStorer)
        {
            _staticSiteStorer = staticSiteStorer;
        }

        public virtual async Task<XStaticResult> RunAction(int staticSiteId, Dictionary<string, string> parameters)
        {
            var existingFilePath = parameters["FilePath"];

            return await DeleteFile(staticSiteId, existingFilePath);
        }

        protected virtual async Task<XStaticResult> DeleteFile(int staticSiteId, string existingFilePath)
        {
            var absoluteFilePath = FileHelpers.PathCombine(_staticSiteStorer.GetStorageLocationOfSite(staticSiteId), existingFilePath);

            try
            {
                await _staticSiteStorer.DeleteFile(absoluteFilePath);
            }
            catch (Exception e)
            {
                return XStaticResult.Error("Error running file delete action", e);
            }

            return XStaticResult.Success();
        }
    }
```

-   [Extending xStatic 2+](/software/xstatic-for-umbraco/extending-xstatic-2/)

-   [Actions](/software/xstatic-for-umbraco/extending-xstatic-2/actions/)
-   [Build Process](/software/xstatic-for-umbraco/extending-xstatic-2/build-process/)
-   [Deploy process](/software/xstatic-for-umbraco/extending-xstatic-2/deploy-process/)
-   [Deployers](/software/xstatic-for-umbraco/extending-xstatic-2/deployers/)
-   [File Name Generation](/software/xstatic-for-umbraco/extending-xstatic-2/file-name-generation/)
-   [Generators](/software/xstatic-for-umbraco/extending-xstatic-2/generators/)
-   [Site Storers](/software/xstatic-for-umbraco/extending-xstatic-2/site-storers/)
-   [Transformers](/software/xstatic-for-umbraco/extending-xstatic-2/transformers/)
