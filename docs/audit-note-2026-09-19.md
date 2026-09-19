## 2026-09-19 — Technical hygiene pass

**Context:** `docs/audit-log.md` (and `CLAUDE.md`, `README.md`, `llms.txt`,
`llms-full.txt`, `articles/09-summer-2024.html`) all still show uncommitted
local changes from the 2026-09-17 formatting/rendering pass — nothing has
been committed since `0e690cc` (2026-09-11). Per the standing instruction to
never touch a file `git status` shows as already locally modified, this
run skipped all six of those files entirely, **including this log itself**
— that's why today's entry is a separate file instead of an append to
`docs/audit-log.md`. Please fold this section in (and delete this file)
once you've reviewed/committed the pending 09-17 diffs.

Since the docs-heavy rotation slots ((d) stale content, and any further (c)
formatting work) mostly live in the now-locked files, this run picked (e)
technical hygiene instead — console errors, missing alt text, broken
CSS/JS references — since it mostly touches files that were still clean.

**Checked:**
- `<img>` tags across all 13 articles, `curious-writings.html`, and
  `index.html`: only one `<img>` on the whole site (the book cover on
  `curious-writings.html`) and it already has descriptive `alt` text.
- Every `<link rel="stylesheet">` / `<script src>` reference across all 13
  articles, `curious-writings.html`, and `css/styles.css` (including the
  Google Fonts `url()` import and the inline SVG data-URI caret) resolves
  to a real file — nothing broken.
- No duplicate `id` attributes on `curious-writings.html`.
- Live console + network check (via the built-in browser, against the
  deployed GitHub Pages site) on the homepage and an article page: page
  loads clean, CSS/JS both 200, zero console errors on load.
- Interactive check: clicked through the homepage's category filter
  buttons, the search box, and the theme toggle while watching the
  console.

**Fixed:**
- `curious-writings.html`: found a real, reproducible console error —
  clicking two filter buttons in quick succession (well within normal
  human click speed, reproduced with clicks 80ms apart, not just
  synthetic rapid-fire) throws `Uncaught (in promise) InvalidStateError:
  Transition was aborted because of invalid state`. Cause: the filter
  click handler calls `document.startViewTransition(() => doFilter())`
  on every click with no handling for the case where a previous
  transition is still in flight — the browser aborts the older
  transition and rejects its promise, and nothing was catching that
  rejection. The filter itself still ended up showing the correct final
  state in testing (last click wins), so this was a console-hygiene bug,
  not a functional one. Fix: capture the returned transition and attach
  `.catch(() => {})` to its `.ready` and `.finished` promises — this
  purely silences the expected-when-aborted rejection and changes no
  timing, animation, or visible behavior (verified: inline `<script>`
  block still balances braces/parens/brackets and parses as valid JS).
  `git diff` confirms this is the only change in the file — a 3-line
  addition, nothing else touched.

**Not fixed (flagged only):**
- No `<link rel="icon">` anywhere on the site and no `favicon.*` file in
  the repo root — browsers will silently 404 on the implicit
  `/favicon.ico` request. Didn't see it surface as a console error in
  testing (it's a network-tab 404, not a JS error), and fixing it means
  adding a new binary asset rather than a mechanical text/code fix, so
  left for Saumitra's call rather than done today.

**Verified:** `git status` after this run shows exactly one additional
file touched beyond the pre-existing 09-17 diffs: `curious-writings.html`.
`git diff` on it shows only the 3-line transition fix. No local http
server or other background process was left running on the machine
(spun one up briefly to consider live-testing the fix, decided against
it as unnecessary/risky, and confirmed it was killed with `pgrep`/`ps`
before finishing).

**Open questions / suggestions for Saumitra:**
- Same note as 09-17: six files (`CLAUDE.md`, `README.md`, `llms.txt`,
  `llms-full.txt`, `articles/09-summer-2024.html`, `docs/audit-log.md`)
  have been sitting uncommitted since 2026-09-17 (2 days as of today).
  Because the maintenance task is instructed never to touch a file with
  pending local changes, this is now shrinking what each daily run can
  safely do — today it blocked both the next stale-content rotation and
  even logging to the normal file. Worth committing (or discarding) that
  batch when you get a chance so the rotation can keep moving normally.
- No favicon on the site (see above) — low priority, but a quick add
  whenever convenient.
- Everything else from 09-17's open-questions list (the "3 Languages"
  claim in `llms-full.txt`, the stale Year column entries in
  `CLAUDE.md`/`README.md` for essays #02/#03/#04/#08, the second local
  clone at `Documents/GitHub/curious-writings`) is still open and
  untouched — all in files this run couldn't edit anyway.

**Not done this pass (next rotation):** stale content (dates/images/bio)
and any remaining formatting work — both mostly land in the currently-locked
docs files, so best picked up once those are committed.
