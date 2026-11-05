# Migration script (ticket 501)

One-shot conversion of the legacy xStatic/Umbraco output into `src/content/**`.

```bash
node scripts/migrate/migrate.mjs "<path>/App_Data/xStatic/output/1"
```

**Don't re-run it blindly.** After the first run these files were edited by hand, and re-running would overwrite them:

- `src/content/pages/articles.md` (rebuilt around listing queries)
- `src/content/pages/archive.md` (new)
- `src/content/pages/home.md` (title and alt text)
- `src/content/articles/xstatic-introduces-git-and-ftp-support.md` deleted (merged; see `src/data/redirects.yaml`)

The report is in `_docs/legacy/migration-report.md`. Delete this folder after launch (ticket 1205).
