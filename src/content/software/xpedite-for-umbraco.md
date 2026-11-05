---
title: "XPEDITE for Umbraco"
description: "Create Umbraco headless websites FAST! XPEDITE guides you through setting up headless Umbraco websites and automates building unit tested components."
cover:
  src: "../../assets/media/gaajlr4q/banner.avif"
  alt: "XPEDITE for Umbraco"
authorship: "sam"
status: "legacy"
archived: true
blocks:
  - type: "hero"
    variant: "plain"
    heading: "XPEDITE for Umbraco"
    subheading: "Create Umbraco headless websites FAST! XPEDITE guides you through setting up headless Umbraco websites and automates building unit tested components."
  - type: "body"
    surface: "default"
  - type: "cards"
    variant: "text"
    surface: "default"
    columns: 3
    items:
      - title: "Easy install"
        text: "All you need to do to install XPEDITE is add the NuGet package to your project. The section is automatically added to the admin user and if you use the XPEDITE.StarterKit package you will have some basic items installed automatically."
      - title: "Guided setup"
        text: "No need for a readme, XPEDITE gives you all the instructions you need on the dashboard. When you complete a step it automatically gets crossed off. Some parts of the process are even automated and can be completed with a single button click."
      - title: "A light framework"
        text: "A small amount of files are added to your Next.js project that give you the minimum functionality required to connect to Umbraco and render headless pages using a familiar templates, partials, and blocks convention similar to server side Umbraco sites."
      - title: "Automatic code generation"
        text: "XPEDITE generates unstyled react components based on settings configured by the developer in simple to use GUI in the Umbraco backoffice. This can be downloaded or directly applied to your codebase with a single button click."
      - title: "AUTOMATIC Unit test generation"
        text: "Based on React testing library and Jest, XPEDITE automatically generates the mock data and unit test files needed to unit test your components. The snapshot test is automatically configured, all you need to do is fill in your own assertions based on how you want your components to work."
      - title: "Helpful assistants"
        text: "Inbuilt assistants will check for missing configuration or best practices suggestions and allow these to be resolved with a click of a button. Examples include setting up blocks in all relevant data types and adding documentation pages."
  - type: "prose"
    markdown: "XPEDITE is very easy to set up. Below is a video showing how you can install, configure, and automatically generate code."
  - type: "embed"
    provider: "youtube"
    id: "uSQ823rxnVc"
    title: "XPEDITE for Umbraco (video)"
  - type: "prose"
    markdown: |-
      ## Install the XPEDITE StarterKit

      ```bash
      dotnet add package XPEDITE.StarterKit
      ```

      ## INSTALL UMBRACO WITH XPEDITE

      ```bash
      # Install Umbraco templates
      dotnet new install Umbraco.Templates::15.2.3 --force

      dotnet new umbraco --force -n "CMS"  --friendly-name "Administrator" --email "admin@admin.com" --password "1234567890" --development-database-type SQLite

      #Add Package
      dotnet add "CMS" package XPEDITE.StarterKit

      #Run
      dotnet run --project "CMS"
      ```

      or in one command

      ```bash
      dotnet new install Umbraco.Templates::15.2.3 --force && dotnet new umbraco --force -n "CMS"  --friendly-name "Administrator" --email "admin@admin.com" --password "1234567890" --development-database-type SQLite && dotnet add "CMS" package XPEDITE.StarterKit && dotnet run --project "CMS"
      ```
  - type: "intro"
    heading: "Documentation"
    surface: "default"
    align: "center"
  - type: "cards"
    variant: "text"
    surface: "default"
    columns: 2
    items:
      - title: "Autogenerate components with XPEDITE"
        text: "Why start from scratch when XPEDITE can create your Next.js components for you. You choose your Umbraco content types and XPEDITE outputs headless React components that consume the data from the Umbraco Delivery API."
        href: "/software/xpedite-for-umbraco/autogenerate-components/"
      - title: "Autogenerate tests with XPEDITE"
        text: "Creating mock data for unit testing is very tedious, so XPEDITE allows you to create test files with data that comes directly from items you've created in the CMS."
        href: "/software/xpedite-for-umbraco/autogenerate-tests/"
---

## Why use XPEDITE?

#### When you install XPEDITE you don't get a prebuilt website, you get a framework that allows you to build the components you need as quickly and robustly as possible. Here are some useful features that come installed as standard.
