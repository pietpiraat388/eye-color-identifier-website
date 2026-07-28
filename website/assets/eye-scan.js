/* Eye Color Identifier - iris reading
 *
 * Pure analysis layer for the online eye color scanner. Given a 2D canvas
 * context and a circular selection {x, y, r} in canvas pixels, it returns a
 * reading: colour family, shade name, pigment mix, palette and confidence.
 *
 * Kept separate from the page so it can be exercised directly by tests.
 */
(function (global) {
  "use strict";

  var INNER = 0.38;   // start of the sampled annulus; matches the dashed guide circle
  var OUTER = 0.98;   // end of the annulus the reading is based on
  var BEYOND = 1.20;  // peeked at only to catch a hazel rim clipped by a too-small circle

  // share  = rough global percentage of people with this colour
  // rarer  = cumulative percentage with this colour *or a rarer one*, which is
  //          what "top X%" actually means. Blue is 9% of people but sits in the
  //          top 22%, because hazel, amber, green and gray are all rarer.
  var FAMILIES = {
    brown: { label: "Brown", share: 79, rarer: null, blurb: "The most common eye color on earth, built on a thick layer of melanin." },
    blue:  { label: "Blue",  share: 9,  rarer: 22,   blurb: "There is no blue pigment in your iris. The color comes from light scattering." },
    hazel: { label: "Hazel", share: 5,  rarer: 13,   blurb: "Not one color but several, zoned across the iris. That is what makes hazel shift with the light." },
    amber: { label: "Amber", share: 5,  rarer: 8,    blurb: "A uniform golden iris, driven by lipochrome rather than melanin." },
    green: { label: "Green", share: 2,  rarer: 3,    blurb: "Low melanin, a little gold pigment, and scattered blue light combining into one even color." },
    gray:  { label: "Gray",  share: 1,  rarer: 1,    blurb: "The rarest everyday eye color: almost no pigment, with a dense iris that scatters light evenly." }
  };

  /* ---------------- colour helpers ---------------- */

  function rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var d = max - min, h = 0;
    if (d !== 0) {
      if (max === r) h = ((g - b) / d) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
      if (h < 0) h += 360;
    }
    return { h: h, s: max === 0 ? 0 : d / max, v: max };
  }

  function hueDelta(a, b) {
    var d = Math.abs(a - b) % 360;
    return d > 180 ? 360 - d : d;
  }

  function toHex(r, g, b) {
    return "#" + [r, g, b].map(function (c) {
      return Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, "0");
    }).join("").toUpperCase();
  }

  var isWarm  = function (h) { return h >= 5 && h <= 62; };
  var isGreen = function (h) { return h > 62 && h <= 165; };
  var isCool  = function (h) { return h > 165 && h <= 268; };

  /* ---------------- statistics ---------------- */

  function describe(list) {
    if (!list.length) return null;
    var sumV = 0, sumS = 0, sinH = 0, cosH = 0, wSum = 0;
    var warm = 0, green = 0, cool = 0;

    for (var i = 0; i < list.length; i++) {
      var p = list[i];
      sumV += p.v;
      sumS += p.s;
      var w = p.s * p.v + 0.02;          // grey pixels should not steer the hue
      var rad = p.h * Math.PI / 180;
      sinH += Math.sin(rad) * w;
      cosH += Math.cos(rad) * w;
      wSum += w;
      if (p.s > 0.10) {
        if (isWarm(p.h)) warm++;
        else if (isGreen(p.h)) green++;
        else if (isCool(p.h)) cool++;
      }
    }

    var hue = Math.atan2(sinH / wSum, cosH / wSum) * 180 / Math.PI;
    if (hue < 0) hue += 360;

    return {
      n: list.length,
      meanV: sumV / list.length,
      meanS: sumS / list.length,
      hue: hue,
      warmFrac: warm / list.length,
      greenFrac: green / list.length,
      coolFrac: cool / list.length
    };
  }

  function classify(s, inner, outer, beyond) {
    // Hazel is a pattern, not a hue: warm centre, cooler rim. Test that first.
    if (inner && outer) {
      var warmCentre = inner.warmFrac >= 0.38;
      var coolerRim = (outer.greenFrac + outer.coolFrac) >= 0.26;
      var zoneShift = (inner.warmFrac - outer.warmFrac) >= 0.12;
      if (warmCentre && coolerRim && zoneShift && s.meanV < 0.72) return "hazel";
    }

    // A circle drawn too small clips the green rim off a hazel iris, leaving a
    // gold centre that reads as amber or brown. Peek just outside the selection:
    // if a genuine cooler iris band sits there, it is hazel after all.
    if (inner && beyond && beyond.n >= 40 && beyond.meanS >= 0.12) {
      var rimOutside = (beyond.greenFrac + beyond.coolFrac) >= 0.30;
      var bigShift = (inner.warmFrac - beyond.warmFrac) >= 0.20;
      if (rimOutside && bigShift && s.meanV < 0.72 && isWarm(s.hue)) return "hazel";
    }
    if (s.meanS < 0.16) return s.meanV > 0.26 ? "gray" : "brown";
    if (isCool(s.hue)) return s.meanS < 0.20 ? "gray" : "blue";
    if (isGreen(s.hue)) return "green";
    if (s.meanV < 0.42) return "brown";
    if (s.meanS >= 0.42) return "amber";
    return "brown";
  }

  function shadeName(family, s, inner, outer) {
    var v = s.meanV, sat = s.meanS;
    if (family === "brown") {
      if (v < 0.17) return "Near-Black Brown";
      if (v < 0.27) return "Dark Brown";
      if (v < 0.38) return "Chocolate Brown";
      if (sat > 0.45) return "Chestnut Brown";
      return "Light Brown";
    }
    if (family === "blue") {
      if (v > 0.70 && sat < 0.26) return "Ice Blue";
      if (sat < 0.34) return "Steel Blue";
      if (v > 0.55) return "Light Blue";
      return "Deep Blue";
    }
    if (family === "green") {
      if (sat > 0.44 && v > 0.42) return "Emerald Green";
      if (sat < 0.28) return "Sage Green";
      if (v < 0.38) return "Deep Green";
      return "Forest Green";
    }
    if (family === "amber") {
      if (v > 0.62) return "Honey Amber";
      if (v < 0.44) return "Copper Amber";
      return "Golden Amber";
    }
    if (family === "gray") {
      if (v > 0.62) return "Silver Gray";
      if (outer && outer.coolFrac > 0.30) return "Blue-Gray";
      return "Steel Gray";
    }
    // hazel
    if (outer && outer.greenFrac >= outer.coolFrac && outer.greenFrac > 0.22) return "Hazel Green";
    if (inner && inner.meanV < 0.34) return "Hazel Brown";
    if (s.hue >= 30 && s.hue <= 55 && sat > 0.40) return "Golden Hazel";
    return "Hazel";
  }

  function pigmentMix(s, valid) {
    var gold = 0;
    for (var i = 0; i < valid.length; i++) {
      var p = valid[i];
      var dh = hueDelta(p.h, 45);
      gold += p.s * Math.exp(-(dh * dh) / (2 * 30 * 30));
    }
    gold /= valid.length;

    var melanin = Math.max(0.02, (1 - s.meanV) * 1.20 + s.warmFrac * 0.50);
    var lipochrome = Math.max(0.02, gold * 1.55 + s.greenFrac * 0.28);
    var structural = Math.max(0.02, s.meanV * (0.45 + s.coolFrac * 1.05) + (1 - s.meanS) * 0.55);

    var total = melanin + lipochrome + structural;
    var m = Math.round(melanin / total * 100);
    var l = Math.round(lipochrome / total * 100);
    var st = 100 - m - l;
    if (st < 0) { m += st; st = 0; }
    return { melanin: m, lipochrome: l, structural: st };
  }

  function dominantColors(valid) {
    var buckets = new Map();
    for (var i = 0; i < valid.length; i++) {
      var p = valid[i];
      var key = ((p.r >> 4) << 8) | ((p.g >> 4) << 4) | (p.b >> 4);
      var bucket = buckets.get(key);
      if (!bucket) { bucket = { r: 0, g: 0, b: 0, n: 0 }; buckets.set(key, bucket); }
      bucket.r += p.r; bucket.g += p.g; bucket.b += p.b; bucket.n++;
    }

    var sorted = Array.from(buckets.values()).sort(function (a, b) { return b.n - a.n; });
    var picked = [];
    for (var j = 0; j < sorted.length && picked.length < 5; j++) {
      var c = {
        r: sorted[j].r / sorted[j].n,
        g: sorted[j].g / sorted[j].n,
        b: sorted[j].b / sorted[j].n
      };
      var tooClose = picked.some(function (q) {
        return Math.abs(q.r - c.r) + Math.abs(q.g - c.g) + Math.abs(q.b - c.b) < 46;
      });
      if (!tooClose) picked.push(c);
    }
    if (!picked.length && sorted.length) {
      picked.push({ r: sorted[0].r / sorted[0].n, g: sorted[0].g / sorted[0].n, b: sorted[0].b / sorted[0].n });
    }
    return picked.map(function (c) { return toHex(c.r, c.g, c.b); });
  }

  function confidenceFor(s, count, family) {
    var bounds = [5, 62, 165, 268];
    var margin = Math.min.apply(null, bounds.map(function (b) { return hueDelta(s.hue, b); }));
    var hueClarity = Math.min(1, margin / 42);
    var satClarity = Math.min(1, s.meanS / 0.42);
    var sampleQuality = Math.min(1, count / 1400);

    if (family === "gray") hueClarity = Math.min(1, (0.20 - s.meanS) / 0.14 + 0.5);

    var score = 62 + hueClarity * 16 + satClarity * 12 + sampleQuality * 8;
    return Math.max(54, Math.min(97, Math.round(score)));
  }

  /* ---------------- entry point ---------------- */

  /**
   * @param {CanvasRenderingContext2D} ctx  context holding the photo
   * @param {{x:number,y:number,r:number}} sel  iris circle in canvas pixels
   * @param {{width:number,height:number}} size  canvas dimensions
   * @returns {{ok:true, ...reading}|{ok:false, error:string}}
   */
  function readIris(ctx, sel, size) {
    var x0 = Math.max(0, Math.floor(sel.x - sel.r));
    var y0 = Math.max(0, Math.floor(sel.y - sel.r));
    var x1 = Math.min(size.width, Math.ceil(sel.x + sel.r));
    var y1 = Math.min(size.height, Math.ceil(sel.y + sel.r));
    var w = x1 - x0, h = y1 - y0;

    if (w < 8 || h < 8) {
      return { ok: false, error: "That circle is too small or sits outside the photo. Move it onto an iris and make it bigger." };
    }

    var data = ctx.getImageData(x0, y0, w, h).data;
    var stride = Math.max(1, Math.round(Math.sqrt(w * h / 50000)));
    var samples = [];

    for (var y = 0; y < h; y += stride) {
      for (var x = 0; x < w; x += stride) {
        var px = x0 + x, py = y0 + y;
        var dx = px - sel.x, dy = py - sel.y;
        var d = Math.sqrt(dx * dx + dy * dy) / sel.r;
        if (d < INNER || d > BEYOND) continue;

        var i = (y * w + x) * 4;
        if (data[i + 3] < 200) continue;
        var r = data[i], g = data[i + 1], b = data[i + 2];
        var hsv = rgbToHsv(r, g, b);
        samples.push({ r: r, g: g, b: b, h: hsv.h, s: hsv.s, v: hsv.v, d: d });
      }
    }

    var inside = samples.filter(function (p) { return p.d <= OUTER; });
    if (inside.length < 60) {
      return { ok: false, error: "Not enough of the iris is inside the circle. Make it bigger or move it onto an eye." };
    }

    // Drop the pupil / lashes (darkest) and reflections / sclera (brightest, unsaturated).
    // The brightness threshold comes from inside the circle only, so the white of
    // the eye in the peeked-at band cannot drag it around.
    var vs = inside.map(function (p) { return p.v; }).sort(function (a, b) { return a - b; });
    var medV = vs[Math.floor(vs.length / 2)];
    var darkCut = Math.max(0.05, medV * 0.42);

    // The halo around a catchlight is near-neutral and much brighter than the
    // iris around it. Judging it relative to this iris rather than by a fixed
    // threshold keeps genuinely pale gray eyes intact.
    var glareCut = medV * 1.45;

    var keep = function (p) {
      if (p.v < darkCut) return false;
      if (p.v > 0.93 && p.s < 0.16) return false;      // blown-out catchlight
      if (p.v > glareCut && p.s < 0.22) return false;  // its softer halo
      if (p.s < 0.05 && p.v > 0.85) return false;      // white of the eye
      return true;
    };

    var valid = inside.filter(keep);

    if (valid.length < 40) {
      return { ok: false, error: "That photo is too dark or too washed out to read. Try a sharper close-up in daylight." };
    }

    var stats = describe(valid);
    var inner = describe(valid.filter(function (p) { return p.d < 0.63; }));
    var outer = describe(valid.filter(function (p) { return p.d >= 0.67; }));
    var beyond = describe(samples.filter(function (p) { return p.d >= 1.02 && keep(p); }));
    var family = classify(stats, inner, outer, beyond);

    // Skip the outer tenth for the palette: the limbal ring and the blur into
    // the sclera are not iris colour and would pollute it.
    var core = valid.filter(function (p) { return p.d <= 0.90; });
    if (core.length < 20) core = valid;

    return {
      ok: true,
      family: family,
      info: FAMILIES[family],
      shade: shadeName(family, stats, inner, outer),
      stats: stats,
      pigments: pigmentMix(stats, valid),
      palette: dominantColors(core),
      confidence: confidenceFor(stats, valid.length, family)
    };
  }

  global.EyeScan = { readIris: readIris, FAMILIES: FAMILIES };
})(this);
