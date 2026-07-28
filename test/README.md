# Scanner tests

Checks `website/assets/eye-scan.js` against synthetic irises of every colour family,
each at four circle placements (exact, too small, off-centre, too large).

Serve the repository root and open the page:

    python3 -m http.server 8899
    open http://localhost:8899/test/scan-test.html

The heading reports `RESULT n/24 correct family`. Anything below 24 is a regression.
The images are generated, not photographs, so they exercise the classifier
deterministically; they are not a substitute for checking real photos by hand.
