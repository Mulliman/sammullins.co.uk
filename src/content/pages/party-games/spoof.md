---
title: "Spoof"
description: "The classic pub bluffing game for three to ten people in one room. Everyone hides coins and calls the total, and the last one left is the Spoofer."
authorship: "sam-ai"
blocks:
  - type: "hero"
    variant: "plain"
    align: "center"
    heading: "Spoof"
    subheading: "Hide some coins. Call the total. Don't be the last one left."
  - type: "section"
    surface: "default"
    blocks:
      - type: "figures"
        variant: "columns"
        align: "center"
        items:
          - title: "Players"
            value: "3 to 10"
            suffix: "players"
            text: "Each on their own phone."
          - title: "Length"
            value: "10 to 25"
            suffix: "minutes"
            text: "A typical game."
          - title: "Status"
            value: "In beta"
            text: "Play it at the link below."
  - type: "section"
    surface: "muted"
    blocks:
      - type: "intro"
        heading: "How to play"
      - type: "prose"
        markdown: |-
          Each round, everyone secretly holds up to three coins. Zero is always allowed. Nobody sees how many coins anyone else is holding.

          Then, one at a time round the table, each player calls a total: a guess at the number of coins held by everyone still in the round. Calls can't be repeated within a round.

          Call the total exactly and you're safe. You hold no coins and don't call any more, but you can keep scoring with side guesses at the total.

          If nobody calls the total, nobody goes safe, and the same players play another round.

          The rounds carry on with fewer and fewer players until one is left. That player is the Spoofer, and loses the game.

          The safe players aren't out of it. An exact side guess scores a point, so the game also has a winner: the safe player with the most points. Ties go to whoever went safe first.
  - type: "section"
    surface: "default"
    blocks:
      - type: "intro"
        heading: "Give it a go"
        lead: "Open the game on each phone, and join with the code."
        cta:
          label: "Play Spoof"
          href: "https://spoof.sammullinsai.workers.dev"
---
