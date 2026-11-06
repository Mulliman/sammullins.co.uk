Fenced code is highlighted by Prism at build time, using classes rather than inline styles, so it works under the strict Content Security Policy. The first five languages are the ones the site's articles already use. The CSS and diff samples are there only so that every Prism token class the stylesheet styles has an example to check against.

```csharp
using System;
using System.Collections.Generic;

namespace Sample.Umbraco
{
    // Returns the packages that are still in use.
    public class PackageSelector
    {
        public IEnumerable<string> ActivePackages(IEnumerable<string> names)
        {
            bool includeOld = true;
            char separator = '-';
            string fallback = null;
            int count = 3;

            foreach (var name in names)
            {
                if (name is not null && name.Length > 0)
                {
                    yield return name.Trim();
                }
            }
            Console.WriteLine(fallback ?? separator.ToString());
        }
    }
}
```

```bash
# Install from the lockfile, then run the checks before a build.
cd "$HOME"
export MODE=production
pnpm install --frozen-lockfile
pnpm check && pnpm lint
pnpm build
echo "$MODE"
```

```powershell
# Find the built pages that mention a guide route.
$enabled = $true
$files = Get-ChildItem -Path .\dist -Recurse -Filter *.html
foreach ($file in $files) {
    if (Select-String -Path $file.FullName -Pattern 'style-guide' -Quiet) {
        Write-Output $file.FullName
    }
}
```

```js
// Toggle a theme and remember the choice for this browser only.
const theme = 'dark';
const enabled = true;
const pattern = /^[a-z]+$/i;
const token = Symbol('token');
const MAX_ITEMS = 10;
const root = document.documentElement;
root.dataset.theme = enabled ? theme : 'light';
const config = { hidden: false, retries: 3 };
console.log(Math.max(1, MAX_ITEMS), pattern.test(theme), token, config);
try {
  localStorage.setItem('theme', root.dataset.theme);
} catch {
  // Storage is blocked. The theme still changes for this page.
}
```

```html
<?xml version="1.0" encoding="utf-8"?>
<!doctype html>
<html lang="en-GB">
  <head>
    <title>Elements sample</title>
    <script>
      // <![CDATA[ inline data for the sample ]]>
    </script>
  </head>
  <body>
    <!-- A short note for the next person reading the markup. -->
    <p class="note">Some text, with <strong>strong</strong> inside it.</p>
  </body>
</html>
```

```css
@media (min-width: 960px) {
  .button:hover {
    color: var(--color-link-hover);
    margin-top: 1em !important;
  }
}
```

```diff
- .old-rule { margin-top: 2em; }
+ .new-rule { margin-top: 1.5em; }
```
