# EC1 + EC2 interne links — 24 november 2026

Alleen `<a>`-tags toegevoegd. Geen tekst, titles, meta, H1's, koppen, URL's, canonicals of schema gewijzigd.

## EC1

- Volledige URL: https://eyecolorscanner.com/guides/baby-eye-color-predictor.html
- Bestand: `website/guides/baby-eye-color-predictor.html`
- Ankertekst: `different eye colors` → `/guides/eye-color-chart.html`

Oude HTML-regel:

```html
  <p>Eye color comes from how much melanin the iris produces, and that production is controlled by many genes working together. Two genes on chromosome 15, <strong>OCA2</strong> and <strong>HERC2</strong>, carry the most weight; variants that reduce melanin push toward blue and green, and variants that boost it push toward brown. Dozens of other genes fine-tune the result, which is why siblings with the same parents can have clearly different eye colors.</p>
```

Nieuwe HTML-regel:

```html
  <p>Eye color comes from how much melanin the iris produces, and that production is controlled by many genes working together. Two genes on chromosome 15, <strong>OCA2</strong> and <strong>HERC2</strong>, carry the most weight; variants that reduce melanin push toward blue and green, and variants that boost it push toward brown. Dozens of other genes fine-tune the result, which is why siblings with the same parents can have clearly <a href="eye-color-chart.html">different eye colors</a>.</p>
```

## EC2

- Volledige URL: https://eyecolorscanner.com/tools/eye-color-scanner.html
- Bestand: `website/tools/eye-color-scanner.html`
- Ankertekst: `hazel green` → `/guides/hazel-vs-green-eyes.html`
- JSON-LD FAQ-schema: ongewijzigd

Oude HTML-regel:

```html
  <p>Brown, blue, hazel, amber, green, and gray, plus in-between shades like hazel green, steel blue, ice blue, sage green, and honey amber.</p>
```

Nieuwe HTML-regel:

```html
  <p>Brown, blue, hazel, amber, green, and gray, plus in-between shades like <a href="../guides/hazel-vs-green-eyes.html">hazel green</a>, steel blue, ice blue, sage green, and honey amber.</p>
```
