---
title: "5 cool things I used to build The Imposter"
description: "Continuing the series looking at some of the tech behind my open source projects, this article includes the front end and back end technologies used to create my PWA party game."
date: "2021-04-07"
series: "5-cool-things"
order: 2
cover:
  src: "../../assets/media/zaqdt00v/5-cool-things-blue.avif"
  alt: "Banner on blue: The 5 cool things series"
authorship: "sam"
archived: true
blocks:
  - type: "hero"
    variant: "plain"
    heading: "5 cool things I used to build The Imposter"
    subheading: "Continuing the series looking at some of the tech behind my open source projects, this article includes the front end and back end technologies used to create my PWA party game."
  - type: "body"
    surface: "default"
  - type: "cards"
    variant: "full"
    surface: "default"
    columns: 2
    items:
      - title: "Give it a go!"
        text: "The Imposter is free to play, and doesn't require anything to be installed. All you need is 3 other friends."
        href: "https://the-imposter.web.app/"
        image:
          src: "../../assets/media/sa5htm0x/play-imposter.avif"
          alt: ""
          decorative: true
      - title: "Learn more about The Imposter"
        text: "Learn more about how to play The Imposter and what tech was used to create it."
        href: "/software/the-imposter/"
        image:
          src: "../../assets/media/xffg40lh/imposter-head.avif"
          alt: ""
          decorative: true
  - type: "section"
    surface: "muted"
    blocks:
      - type: "intro"
        heading: "Other articles in the series"
        align: "center"
      - type: "cards"
        variant: "full"
        columns: 2
        items:
          - title: "5 cool things I used to build PanoCapture and PostCapture"
            text: "Finishing the series looking at some of the tech behind my open source projects, PanoCapture and PostCapture are photo editing plugins for CaptureOne. These are some tools I found when moving away from my web comfort zone and developing desktop apps."
            href: "/articles/5-cool-things-i-used-to-build-panocapture-and-postcapture/"
            image:
              src: "../../assets/media/uiwmnegi/5-cool-things.avif"
              alt: ""
              decorative: true
          - title: "5 cool things I used to build xStatic"
            text: "As part of a series looking at some of the tech behind my open source projects, this article outlines my favourite products and services I used for the first time on xStatic."
            href: "/articles/5-cool-things-i-used-to-build-xstatic/"
            image:
              src: "../../assets/media/zapplr3l/5-cool-things-purple.avif"
              alt: ""
              decorative: true
---

## 1\. SignalR

This wasn't the first time I'd used [SignalR](https://dotnet.microsoft.com/apps/aspnet/signalr), but it was the first time I'd used the ASP.Net Core version of the package. There are a few differences, but overall it still felt very familiar.

SignalR is the (to my knowledge) best way to provide real time functionality to a C# web application. In order for The Imposter to feel like a native app, and even more importantly feel like playing a real party game in person, it was important to reduce the amount of times the user has to press 'next' or 'refresh' buttons.

SignalR uses Web Sockets (or other fall-backs like long-polling) to send notifications to the users as soon as an event happened; examples of this might be a round starting or a player adding an answer. These notifications can then be used to update the game data on the user's device, redirecting them to the correct view at the correct time.

The client side library had all the TypeScript definitions, which allowed for a robust, strongly typed, user friendly building process and in general worked very nicely.

I did find that I had to use HTTPS to get the best reliability when using SignalR, but that's best practise anyway.

## 2\. Cosmos DB

All the game data is stored as an object within the code which can (fairly) easily be represented at JSON. For this reason I decided to use a NoSQL database store and thought [Cosmos DB](https://docs.microsoft.com/en-us/azure/cosmos-db/introduction) was worth a go.

The API I chose to use was the TablesDB version, as that provided the simplest way to store what is essentially simple data.

Whilst traditional SQL databases are more familiar to me, I didn't find it too hard to get started with Cosmos DB, and the querying interface within Azure meant I didn't have to learn a new language.

Overall I'd say it was worth a look if you think creating a relational SQL database is a bit over the top.

## 3\. Ionic

[Ionic](https://ionicframework.com/) is a framework that allows web developers to create cross platform mobile apps using the tools and languages they are already familiar with. The bonus is that you can also run these apps in the browser, so those that don't want to install an app for every service can use the app too!

Previously I'd used an older version of Ionic with the original AngularJs, and I found it very easy to use. The newer versions use web components and can use either Angular/React/Vue or no framework at all. It also now has CLI support built in, so ensuring that you follow best practise is very efficient and easy. I simplified this even more by adding a Powershell script that guides you through the file creation in a more user friendly manner. 

```powershell
$type = Read-Host 'Generate (p)age component, shared (c)omponent, (m)odal component or (s)ervice'

If($type -eq 'c'){
    $componentName = Read-Host 'Name of shared component'

    ionic g component components/$componentName --spec false
}
ElseIf($type -eq 'm'){
    $componentName = Read-Host 'Name of modal component'

    ionic g component components/modals/$componentName --spec false
}
ElseIf ($type -eq 'p'){
    $componentName = Read-Host 'Name of page'

    ionic g page pages/$componentName --spec false
}
ElseIf ($type -eq 's'){
    $serviceName = Read-Host 'Name of service'

    ionic g service services/$serviceName --spec false
}Else{
    Write-Host "Invalid choice."
}

Write-Host "Finished."
```

With its wide range of components and good documentation I really rate Ionic, and would certainly recommend it for any project that doesn't require the use of platform specific APIs.

## 4\. Angular

Before starting this version of The Imposter I actually created a couple of tester projects of the first few screens. One used [React](https://reactjs.org/), the other [Angular](https://angular.io/). 

Both can achieve the same quality of application, and the reasons I ended up choosing Angular are likely down to personal preference rather than either being objectively better.

Firstly, Angular uses TypeScript by default, and when it comes to building a fairly complicated app I find complexity is better managed than it is in pure JavaScript. TS can be used with React too, so alone this isn't a deciding factor. I preferred the separate files used by Angular over the JSX/TSX files of React, but again this is a preference as sometimes the single JSX files can make it very easy to make all your changes in one place.

The main deciding factor for me was the fact that Angular is more of a 'kitchen sink' than React. Both approaches have their advantages; with React you are in control of the framework components you want to use, but I didn't want to evaluate any options without a specific reason to do so. For me, it is easier to pick a framework, with all the documentation in one place, and use that.

## 5\. Swagger-Nodegen-CLI

When ASP.Net devs create web APIs they'll often install [Swashbuckle](https://github.com/domaindrivendev/Swashbuckle.AspNetCore) to autogenerate Swagger documentation for their API endpoints. Because this documentation is built to a standard, this actually makes it possible to run tasks on this generated documentation.

[Swagger-Nodegen-CLI](https://www.npmjs.com/package/swagger-nodegen-cli) is a NPM package that can take the Swagger JSON file generated by Swashbuckle and auto generate clients in a variety of different Languages and frameworks. In this case it allowed me to generate TS/Angular services to use within my app.

When the C# code is built I added two post built events to first generate the swagger JSON file, and then generate the Angular services for each API.

Because I used TypeScript, this meant that I would receive compile time errors if an API changed, making the process less error prone. It also meant that I'd get strongly typed intellisense for my Web APIs within TS, a big productivity boost for developers.

The generated code isn't the prettiest, and the naming convention isn't ideal but I'd say the these small cons are far outweighed by the benefits.

To install the generator run the following command:

```bash
npm i swagger-nodegen-cli
```

I then wrote a Powershell script to be called by the post build event. These will need to be changed depending on your folder structure, but you can use the following as a basis:

```powershell
$scriptpath = $MyInvocation.MyCommand.Path;
$dir = Split-Path $scriptpath;

Push-Location $dir

$generatorDir = resolve-path ".\ImposterGame.Website";
$outputDir = resolve-path ".\ImposterGame.App\Imposter\src\server";
$apiContractJsonFile = resolve-path ".\api-contract.json";
$ngConfigJsonFile = resolve-path ".\ImposterGame.App\Imposter\src\codegen\ng-config.json";

Push-Location $generatorDir

& swagger-nodegen-cli generate -i $apiContractJsonFile -l typescript-angular -o $outputDir -c $ngConfigJsonFile

Pop-Location
Pop-Location
```
