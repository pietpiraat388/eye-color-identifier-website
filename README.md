# Eye Color Identifier - Website

Marketing and SEO website for the [Eye Color Identifier iOS app](https://apps.apple.com/app/id6752604522).

## Structure

- `website/` - the static site (deployed to GitHub Pages).
- `website/index.html` - homepage.
- `website/guides/` - SEO guides for the main search intents.
- `website/assets/` - app icon, App Store screenshots, shared stylesheet.
- `app.md` - App Store listing analysis and keyword research.
- `.github/workflows/deploy-pages.yml` - deploys `website/` to GitHub Pages on every push to `main`.

## Local preview

```sh
cd website
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Custom domain

Canonical URLs, Open Graph URLs, `sitemap.xml`, and `robots.txt` currently point to the GitHub Pages URL.
If a custom domain is attached later, search-replace `https://pietpiraat388.github.io/eye-color-identifier-website` with the new origin and add a `CNAME` file to `website/`.
