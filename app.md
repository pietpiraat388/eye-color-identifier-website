# Eye Color Identifier - App Store Analysis

Source: https://apps.apple.com/app/id6752604522 (analyzed 2026-07-12 via iTunes Lookup API + App Store web listing).

## Core Metadata

| Field | Value |
| --- | --- |
| App name | Eye Color Identifier ° |
| Developer / seller | Patrick van der Ploeg (Vejo Apps) |
| App Store URL | https://apps.apple.com/app/id6752604522 |
| Price | Free (with Pro upgrade shown in UI) |
| Category | Lifestyle (secondary: Utilities) |
| Current version | 1.0.4 |
| First release | 2025-09-20 |
| Latest update | 2026-07-09 |
| Size | ~25.3 MB |
| Minimum OS | iOS 18.5 |
| Devices | iPhone, iPad, iPod touch |
| Age rating | 4+ |
| Languages | English |
| Terms of service | https://www.vejoapps.com/terms |

Note: the listing shows an average rating of 4.5 from 8 ratings.
Too few to use as a marketing claim on the website, so the site does not show ratings.

## App Store Description (verbatim summary)

Tagline: "Eye Color Identifier - Discover the True Shade of Your Eyes".

Positioning: capture, analyze, and explore your unique eye color.
Smart color detection shows the precise shade and gives details about your look.

How it works per the listing: take a clear photo of your eyes, the app instantly detects your eye color, shows exact shades, and provides color values you can save.
Works for blue, green, hazel, brown, and rare mixed colors.

### Key features (from the description)

- Instant Eye Scan: accurate analysis of your eye color with one tap.
- Detailed Color Report: exact color values and names for your eyes.
- History Tracking: save scans and compare over time or in different lighting.
- Personalized Results: learn about the meaning and uniqueness of your color.
- Shareable Results: share your eye color card with friends or on social media.

### Target audience (from the description)

Anyone curious about their true eye shade: makeup lovers, photographers, and anyone asking "what color are my eyes?".

## Screenshots (7, iPhone 6.5")

Downloaded to `website/assets/screenshot-1.webp` ... `screenshot-7.webp` (600x1300) plus `-small` variants (300x650).

1. Scan screen: "Read an iris", live iris detection frame, "Scan eye" button, Your Circle preview, eye color library.
2. Analyze: iris analysis result "Hazel Green", melanin dominant, 98.0% match with high confidence, iris composition donut (melanin 48%, lipochrome 34%, structural 22%).
3. Rarity: global rarity "Top 3%", rarer than 97 in every 100 people, distribution curve, spectral signature (590 nm dominant), copyable hex color palette.
4. Compare: side-by-side comparison of two profiles (color, shade, rarity, pigment breakdown), "Sophie's eyes are 3x rarer than Daan's".
5. Circle: "Your Circle" grid of saved family/friend profiles with rarity badges, Compare and Predict actions.
6. Scans: saved scan history with shade names, dates, palettes, rarity badges, unassigned scans.
7. Predict: child eye color prediction from two profiles (Blue 40%, Hazel 32%, Brown 16%, Green 12%) with a disclaimer that it uses a simplified inheritance model, just for fun, not medical advice.

## Feature Set (consolidated for marketing)

- AI-style iris scan from a photo: detects the iris and names the exact shade.
- Confidence score and pigment composition (melanin, lipochrome, structural scattering).
- Rarity score: how your eye color ranks globally, with a distribution curve.
- Spectral signature (dominant wavelength) and copyable hex color palette.
- Compare any two saved profiles side by side.
- Circle: save family and friends' eye profiles in one place.
- Predict a child's likely eye color from two parent profiles (for fun, simplified genetics model).
- Scan history journal: track shades across lighting conditions and time.
- Shareable result cards.

## Icon and assets

- App icon: stylized blue-green iris on blue background. `website/assets/app-icon-512.webp` (+ jpg, 180px variants).
- Open Graph fallback image: `website/assets/og-image.png` (1200x630, Apple-generated from icon).

---

# Keyword Research (International English)

Goal: organic traffic from people who want to identify their eye color, plus adjacent informational queries that can convert to app downloads.
Sources: query patterns from Google/YouTube/People-Also-Ask conventions, App Store search behavior, and the app's own vocabulary.
No fabricated volume numbers; grouping is by intent strength and funnel position.

## Primary keywords (high intent, homepage)

- eye color identifier
- eye color scanner (app)
- what color are my eyes
- identify my eye color
- eye color test / eye color detector app
- what is my eye color

These share one intent: "tell me my exact eye color". The homepage targets this cluster directly.

## Guide clusters (one page per intent, similar keywords merged)

1. **What color are my eyes?** (`guides/what-color-are-my-eyes.html`)
   - what color are my eyes, how to tell what color your eyes are, identify my eye color, eye color test, eye color scanner, why do my eyes change color, am I blue or gray eyed
2. **Rare eye colors** (`guides/rare-eye-colors.html`)
   - rare eye colors, rarest eye color, what is the rarest eye color, gray eyes rarity, amber eyes, violet eyes real, heterochromia, green eyes percentage
3. **Hazel vs green eyes** (`guides/hazel-vs-green-eyes.html`)
   - hazel vs green eyes, difference between hazel and green eyes, are my eyes hazel or green, hazel eye color meaning, do hazel eyes change color
4. **Eye color chart** (`guides/eye-color-chart.html`)
   - eye color chart, eye color percentages, all eye colors, shades of blue eyes, shades of brown eyes, eye color names, most common eye color
5. **Baby eye color predictor** (`guides/baby-eye-color-predictor.html`)
   - what color eyes will my baby have, baby eye color predictor, baby eye color calculator, eye color genetics, can two brown eyed parents have a blue eyed baby, when do babies eyes change color

## Long-tail questions used in FAQs

- How do I find out my exact eye color?
- Why do my eyes look different colors in different light?
- Is hazel a mix of green and brown?
- What percentage of people have green eyes?
- Can eye color change with age?
- Is the eye color scan free?
- Does the app work with photos from my camera roll?

## Notes for GEO (AI search optimization)

- Every guide opens with a direct 2-3 sentence answer to the head question (snippet/AI-overview friendly).
- Factual statements about eye color science stay conservative and cite widely accepted ranges (AAO-style figures) without invented precision.
- FAQPage + Article structured data on guides, SoftwareApplication + FAQPage on the homepage.
- Internal links between all guides and back to the download CTA.
