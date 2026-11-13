---
title: "The Imposter"
description: "The Imposter is a party game for 4 to 7 people, each playing on their own phone. I built it by hand in 2019, then rebuilt it with coding agents in 2026."
cover:
  src: "../../assets/media/xwceuizg/imposter.avif"
  alt: "The Imposter logo on a green background"
authorship: "sam-ai"
blocks:
  - type: "body"
    surface: "muted"
  - type: "cards"
    variant: "full"
    surface: "default"
    columns: 2
    items:
      - title: "Give it a go!"
        text: "The Imposter is free to play, and doesn't require anything to be installed. All you need is 3 other friends."
        href: "https://imposter.sammullinsai.workers.dev/"
        image:
          src: "../../assets/media/sa5htm0x/play-imposter.avif"
          alt: ""
          decorative: true
---

# The Imposter

The Imposter is a party game for 4 to 7 people, each playing on their own phone. Each round one player is randomly chosen as the imposter, and that player needs to discover the secret word without attracting suspicion from the others.

I've built it twice: once by hand in 2019, and again with coding agents in October 2026. The game and the look are the same; almost everything underneath is different.

## The first version (2019)

The original was an [Ionic](https://ionicframework.com/) app on Angular, with an ASP.NET Core back end, [SignalR](https://dotnet.microsoft.com/apps/aspnet/signalr) for the real time updates and Cosmos DB for storage, hosted on Firebase. Getting every phone to move to the next screen at the same moment, without anyone pressing refresh, was the hard part, and SignalR did most of that work. I wrote about it in [5 cool things I used to build The Imposter](/articles/5-cool-things-i-used-to-build-the-imposter/).

It worked, but it was a lot of moving parts for a party game: two languages, generated REST client code and a database.

## The rebuild (2026)

The new version is one [Cloudflare Worker](https://workers.cloudflare.com/) that serves a React PWA and runs each game in its own Durable Object, a small stateful server addressed by the 5 digit game code. Players connect over WebSockets, so there's no database and no REST layer, and it's TypeScript end to end.

I built it with coding agents, porting the game rules and the original Ionic look from the old code. The rules now have unit tests, every deploy runs a smoke test that plays a full round against the live site, and each player's phone only ever receives what that player is allowed to see. The old site now points players to the new one.

[How long the rebuild took compared with the original, in your words.]

[One thing the new version does better that players will notice.]
