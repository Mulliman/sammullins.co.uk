---
title: "xStatic v1 released with wildcard asset paths"
description: "Now that xStatic has been public for a while I've decided to take it out of beta. This release also includes wildcard support for static asset paths."
date: "2021-02-18"
cover:
  src: "../../assets/media/hddpv0gy/xstatic1.avif"
  alt: "The xStatic logo above the version number 1.0.0"
authorship: "sam"
archived: true
blocks:
  - type: "hero"
    variant: "plain"
    heading: "xStatic v1 released with wildcard asset paths"
    subheading: "Now that xStatic has been public for a while I've decided to take it out of beta. This release also includes wildcard support for static asset paths."
  - type: "body"
    surface: "default"
---

## Wildcard paths for asset files

Specifying asset paths is now easier than in the beta version of xStatic. You can still comma separate a list of directories or filenames as before, but now you can use wildcards too.

So for example:

```
/css/main.css,/css/lib/bootstrap.css,/js/scripts.js

/css,/css/lib,/js

/css/*,/js/*
```

And you can mix and match:

```
/css/*,/js/scripts.js
```

## No more beta!

I've been using xStatic for a while now without issues and now with more downloads in the community I think it is time to remove the beta tag from the releases. From now on breaking changes will result in a new major version number.

## Install now

[Download xStatic on Our.Umbraco](https://our.umbraco.com/packages/backoffice-extensions/xstatic/)
