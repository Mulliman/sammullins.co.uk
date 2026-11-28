---
title: "CV"
description: "Sitecore Team Lead at Tata Consultancy Services. A C# and TypeScript web developer since 2010, certified in Sitecore and Umbraco, with over a dozen production websites built, onboarded or supported."
authorship: "sam-ai"
blocks:
  # 1405 (symmetry, 27 November 2026): centred hero and band intros, newest employment first, icons on the skills.
  - type: "hero"
    variant: "plain"
    align: "center"
    heading: "CV"
    subheading: "A C# and TypeScript web developer since 2010, certified in Sitecore and Umbraco."
  - type: "section"
    surface: "default"
    blocks:
      - type: "intro"
        heading: "Education"
      - type: "cards"
        variant: "text"
        columns: 2
        items:
          - title: "Poole Grammar School (2002 to 2008)"
            text: |-
              **12 GCSEs**: all A\*-C, including A grades in Maths and English

              **1 AS Level**: Media Studies (B)

              **4 A Levels**: General Studies (A), Computing (B), Business Studies (B), Product Design (Graphics) (B)
          - title: "Bournemouth University (2008 to 2012)"
            text: |-
              **BSc (Hons) Computing, 1st class**

              Specialised in Advanced Development, Web Development, and Software Product Design.
      - type: "prose"
        markdown: "Sitecore Team Lead at Tata Consultancy Services (TCS), leading the team on the Allianz account, with over a dozen production websites built, onboarded or supported."
  - type: "section"
    surface: "muted"
    blocks:
      - type: "intro"
        heading: "Employment"
      # Sam (28 November 2026): one job per row, the years where the icons sit elsewhere.
      - type: "indexList"
        variant: "ruled"
        items:
          - title: "Sitecore team lead"
            marker: "25-now"
            text: |-
                **Tata Consultancy Services (TCS)**

                My role moved to Tata Consultancy Services under TUPE in 2025, and I carried on leading the team on the Allianz account.
          - title: "Sitecore team lead"
            marker: "23-25"
            text: |-
                **Allianz Technology**

                My role moved to Allianz Technology under TUPE in 2023, where I was the Sitecore team lead. Leader of a team of 7 Sitecore developers, supporting, mentoring, and managing them so that we could reliably maintain and deliver new functionality on our existing Sitecore estate.
          - title: "Senior analyst developer"
            marker: "21-23"
            text: |-
                **LV=**

                Main developer creating the new ElectriX website with Sitecore and React.Js. Part of the team upgrading the entire platform to Sitecore 10.2 and moving to Docker and Managed Cloud.
          - title: "Mid-level web developer"
            marker: "16-21"
            text: |-
                **Redweb**

                Built, onboarded, upgraded and supported a portfolio of Sitecore sites. Mentored and line managed up to three developers. Provided training and consultancy services for clients. Clients include The RNLI, The Royal College of Surgeons, Mace Group, and Guide Dogs.
          - title: "Web developer"
            marker: "13-16"
            text: |-
                **Redweb**

                Created large ecommerce integrated Sitecore projects with integration to an array of 3rd party and internal system. Worked off site in a contracting role to create an API for a client's internal system. Mentored student developers. Clients included The Royal College of Surgeons, City & Guilds, Farrow & Ball, and Action on Hearing Loss.
          - title: "Graduate developer"
            marker: "12-13"
            text: |-
                **Redweb**

                Built Sitecore and Umbraco sites as well as standalone web applications. Clients included Insight Vacations.
          - title: "Student developer"
            marker: "10-11"
            text: |-
                **Redweb**

                Built a variety of websites using Umbraco and Sitecore. Also built internal web applications and components. Worked for clients such as Aviagen Turkeys and Action on Hearing Loss.
  - type: "section"
    surface: "default"
    blocks:
      - type: "intro"
        heading: "Technical skills"
      - type: "indexList"
        variant: "columns"
        items:
          - title: "C#"
            icon: "braces"
            text: "I've written C# code for over a decade using both .Net Framework and .Net Core. I've got experience using WebForms, MVC, Web API, SignalR and a limited amount of WPF."
          - title: "JavaScript & TypeScript"
            icon: "file-code"
            text: "I've been using JavaScript for more than 10 years with frameworks such as jQuery and AngularJS. I now prefer to use TypeScript and have code in production using Angular, React, Next.js, Lit, and Ionic."
          - title: "HTML & CSS"
            icon: "palette"
            text: "I've created markup and styling ever since I started programming. I've also used Sass for both commercial and open source projects."
          - title: "Content management systems"
            icon: "layers"
            text: "I've now reached my 10 year anniversary using Umbraco and Sitecore, and I'm certified in both. I've released open source packages for Umbraco, most notably xStatic."
          - title: "Databases"
            icon: "database"
            text: "I've been using Microsoft SQL Server for years and have recently used Azure Cosmos DB for the first time as a NoSQL alternative."
          - title: "DevOps & Azure"
            icon: "cloud"
            text: "I've been involved in creating and managing the Azure infrastructure of both small personal projects and large Sitecore Experience Platform solutions. I've used both Azure DevOps and Octopus Deploy for automated releases."
      - type: "prose"
        markdown: "Don't just take my word for it, you can see all these skills demonstrated in my [open source pieces of software](/software/)."
  - type: "section"
    surface: "muted"
    blocks:
      - type: "intro"
        heading: "Soft skills"
      - type: "indexList"
        variant: "columns"
        items:
          - title: "Mentoring & line management"
            icon: "users"
            text: "I've been lucky enough to manage and mentor some talented developers over the years, helping them improve their technical and business skills."
          - title: "Public speaking"
            icon: "mic"
            text: "I have presented on multiple occasions to crowds of roughly 100 people and recently have remotely delivered demonstrations to crowds over video conferencing."
          - title: "Written communication"
            icon: "pen-line"
            text: "I have strong written English skills, shown over the years in technical specifications, proposals, and articles on the company blog."
  - type: "section"
    surface: "default"
    blocks:
      - type: "intro"
        heading: "My open source projects"
      - type: "cards"
        variant: "full"
        columns: 1
        items:
          - title: "xStatic for Umbraco"
            text: "A free package that generates static HTML sites from Umbraco content, so simple sites can be hosted cheaply and served fast."
            href: "/software/xstatic-for-umbraco/"
            cta: "See the package"
            award:
              label: "Winner"
              title: "Umbraco Package Award"
              detail: "Best newcomer 2021"
            image:
              src: "../../assets/media/egdifrhl/banner.avif"
              alt: ""
              decorative: true
      - type: "cards"
        variant: "row"
        columns: 2
        items:
          - title: "PostCapture"
            text: "A Capture One plugin and standalone program that adds watermarks and borders to photos based on their EXIF data."
            href: "/software/postcapture/"
            image:
              src: "../../assets/media/irbdcjra/postcapture.avif"
              alt: ""
              decorative: true
          - title: "PanoCapture"
            text: "A free and open source plugin for Capture One that makes panoramas from several photos."
            href: "/software/panocapture/"
            image:
              src: "../../assets/media/tolji2b5/panocapture.avif"
              alt: ""
              decorative: true
          - title: "Party games"
            text: "Four games for a room full of people, each on their own phone: The Imposter, It All Ends In Tiers, Blowhard and Spoof."
            href: "/party-games/"
            image:
              src: "../../assets/media/party-games/party-games.avif"
              alt: ""
              decorative: true
      - type: "intro"
        cta:
          label: "See all my software"
          href: "/software/"
  - type: "section"
    surface: "muted"
    blocks:
      - type: "intro"
        heading: "A bit about me"
      - type: "prose"
        markdown: "Born and bred in Dorset I currently live on the outskirts of Bournemouth. I'm a scratch handicap golfer and member at Dudsbury Golf Club. I like photography and photo editing and relax by walking around with a camera (or two) listening to audiobooks."
---
