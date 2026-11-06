---
title: "Is Baby In A Book?"
description: "Struggling to find that perfect gift for a little one? Find a book with their name in it using Is Baby In A Book!"
cover:
  src: "../../assets/media/ycspud32/biab-sam-site.avif"
  alt: "Is Baby In A Book?"
authorship: "sam"
blocks:
  - type: "body"
    surface: "muted"
  - type: "image"
    surface: "inverse"
    width: "wide"
    image:
      src: "../../assets/media/3gyc45vu/biab-thin-banner.avif"
      alt: "Biab Thin Banner"
  - type: "prose"
    markdown: |-
      ## What is 'Is Baby In A Book'?

      In 2022 we welcomed our little twins into the world. Since then we have been building up our home library full of baby books to try and give our boys the best start.

      While books with characters called Sam are found in bookstores and charity shops throughout the land, we struggled to find any books with Soraya, Jasper, or Xander.

      This gave Soraya the idea to compile a list of books for new parents and then I decided to turn it in to a website.

      [Search for your name in a book now!](https://isbabyinabook.co.uk)

      ## How was it built?

      This site was originally built as a standard React application hooked up to a Postgres Supabase Database. However I have recently turned this into a Next.js static site. This has dramatically improved the Lighthouse scores for the site and reduced the load on the database.

      ## Efficient Content Population

      One problem we faced during the build was allowing my wife to efficiently populate the data without SQL management skills. The way I achieved this was by creating a Chrome extension that she could trigger on the amazon page for the book; this would then auto-populate most of the data allowing her to add a book to the site in seconds.
---

# Is Baby In A Book?

Struggling to find that perfect gift for a little one? Find a book with their name in it using Is Baby In A Book!
