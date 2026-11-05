# Voice guide sources

Analysed for [voice.md](voice.md) (ticket 1001). Paths are relative to `src/content/`.

## Written sources

### Articles (8 files, 2021 to 2022)

The ticket mentions 9 legacy articles. The repo holds 8 article files in `articles/`, and all 8 were read.

- `articles/5-cool-things-i-used-to-build-panocapture-and-postcapture.md`
- `articles/5-cool-things-i-used-to-build-the-imposter.md`
- `articles/5-cool-things-i-used-to-build-xstatic.md`
- `articles/what-s-new-in-xstatic-2.md`
- `articles/what-s-new-in-xstatic-3.md`
- `articles/xstatic-adds-git-and-ftp-support.md`
- `articles/xstatic-v1-with-wildcard-asset-paths.md`
- `articles/xstatic-wins-an-umbraco-package-award.md`

### Top-level software pages (8 files)

Only the top-level product pages were read. Nested docs under `software/xstatic-for-umbraco/` and `software/xpedite-for-umbraco/` were out of scope.

- `software/is-baby-in-a-book.md`
- `software/panocapture.md`
- `software/postcapture.md`
- `software/sage-of-empires.md`
- `software/the-imposter.md`
- `software/umbracofolio.md`
- `software/xpedite-for-umbraco.md`
- `software/xstatic-for-umbraco.md`

### Pages (2 files)

- `pages/home.md`
- `pages/cv.md`

### Photography album intros (8 files)

Read for tone only. Photo captions were not treated as prose.

- `albums/reptiles.md`
- `albums/star-wars-day.md`
- `albums/around-the-disney-world.md`
- `albums/art-of-animation.md`
- `albums/disney-in-the-dark.md`
- `albums/festival-of-fantasy.md`
- `albums/kingfishers-in-winter.md`
- `albums/los-picos-piscinas-y-puertos-de-espana.md`

### Checks run

- A grep of `src/content` for em and en dashes found one occurrence, in `software/xstatic-for-umbraco/deploying-using-git.md`, which is outside the top-level set.
- A grep of the articles for "we" and British and American spellings. Results are reflected in the British spelling section of voice.md.

## YouTube

- Channel URL tried: https://www.youtube.com/@sam_mullins
- Status: not reachable for this run. The request redirected to Google's cookie consent page (`consent.youtube.com`). I did not follow the redirect or accept consent, so the channel's video list and About text were not read.
- A web search for "@sam_mullins YouTube channel" returned a channel at `youtube.com/channel/UCiyENpA3eWxskgaU1vMpqxQ` named "Sam Mullins", but the results did not connect it to this handle. Other results belonged to different people with the same name (a Toronto comedian, a home-services business owner, a museum director). None of them were used.
- Instead, the four videos linked from Sam's own site were checked with public oEmbed metadata (title and author name only). Each author is "Sam Mullins":
  - https://www.youtube.com/watch?v=LwaZ4JD5AeU: "PanoCapture - Capture One Installation And How To Use" (embedded in `software/panocapture.md`)
  - https://www.youtube.com/watch?v=AW3xLKlumw8: "PostCapture -  Run process on image" (embedded in `software/postcapture.md`)
  - https://youtu.be/mb-dPQU-3Tc: "TagCapture proof of concept - Machine learning based image tagging" (linked from `articles/5-cool-things-i-used-to-build-panocapture-and-postcapture.md`)
  - https://www.youtube.com/watch?v=uSQ823rxnVc: "XPEDITE for Umbraco - Create headless sites FAST! How to install and get started." (embedded in `software/xpedite-for-umbraco.md`)
- Tone notes from those titles: plain, product-first titles with a hyphen separator, and the occasional capitalised "FAST!" that matches the XPEDITE page copy.
- No video files, captions or transcripts were downloaded or stored.
