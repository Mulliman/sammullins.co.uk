---
title: "CMS first TDD with Umbraco and XPEDITE"
description: "Test driven development needs test data, and a CMS is a good place to make it. How XPEDITE turns Umbraco content into components and tests."
date: "2025-03-16"
cover:
  src: "../../assets/media/youtube/cms-first-tdd-with-umbraco-and-xpedite.avif"
  alt: "Video thumbnail for CMS first TDD with Umbraco and XPEDITE"
authorship: "sam-ai"
archived: true
tags: ["video", "umbraco", "xpedite", "testing"]
blocks:
  - type: "hero"
    variant: "plain"
    heading: "CMS first TDD with Umbraco and XPEDITE"
    subheading: "Test driven development needs test data, and a CMS is a good place to make it. How XPEDITE turns Umbraco content into components and tests."
  - type: "embed"
    provider: "youtube"
    id: "lAC5Gy7cHDA"
    title: "CMS first TDD with Umbraco and XPEDITE"
    poster:
      src: "../../assets/media/youtube/cms-first-tdd-with-umbraco-and-xpedite.avif"
      alt: ""
      decorative: true
  - type: "body"
    surface: "default"
  - type: "cards"
    heading: "Related"
    variant: "text"
    surface: "muted"
    columns: 2
    items:
      - title: "XPEDITE for Umbraco"
        text: "The package page, with the guides to code and test generation."
        href: "/software/xpedite-for-umbraco/"
      - title: "Autogenerate tests with XPEDITE"
        text: "The written guide to the generated test files."
        href: "/software/xpedite-for-umbraco/autogenerate-tests/"
---
Test driven development (TDD) is a way of working where you write the tests before the code. Part of writing a test is making up some input data, and with a content managed site that gets tedious fast. Umbraco already makes editing content easy, so I wanted XPEDITE to use that content as the test data and write the test files for me.

## The process

1. Gather your requirements.
2. Create the content types in Umbraco that fulfil them.
3. Create some content using those types.
4. Let XPEDITE generate the components and the test data from that content.
5. Add the assertions your requirements call for.
6. Update the generated components until every test passes.

When the requirements change, or you need a new component, start the loop again.

## Generating a partial

In the video I generate a partial. Picking the basic page type shows all four of its fields, and the generated tests include all four in the test data, along with two stub tests. Ticking **include generic page data** adds page level data as well as the properties.

Good practice is to build partials from compositions rather than whole pages, so they can be shared. So I picked the page title composition instead, ticked generic page data and named the component `PageTitle`. A composition has no content of its own, so the test data is empty until you choose a page to take it from. Your documentation page is ideal for this. Once chosen, the data object holds the real page title from that content item.

XPEDITE creates two test files: one with empty data and one with valid data. Then **Apply to code base** drops everything into the Next.js app.

## Making the tests pass

In VS Code I formatted the generated files to match the project's standards, then added a test that the component renders an `h1` containing the page title, using the generated test data.

The first run gave one failing test and one passing. Text fields render in a `span` by default in XPEDITE, so I changed it to an `h1`. That fixed the first test and broke the snapshot test, which is exactly its job; snapshot tests stop you introducing regressions without noticing. I updated the snapshot and everything went green.

The empty data test just passes an empty state and checks the component doesn't throw. Those empty tests have saved me from null reference exceptions more times than I'd like to admit.

## Checking it in the browser

Green tests are good, but you should still look at it. I added the new component to the page template, passed in the page title prop, ran the app in dev mode and the title appeared on the page as an `h1`.

Templates and blocks work the same way. A page can have more than one block, so XPEDITE creates data and tests for each one you include.

Install the XPEDITE starter kit from NuGet and give CMS first TDD a go.
