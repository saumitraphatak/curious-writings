# Audit Log — Curious Writings

Running log of the automated daily maintenance passes on this repo. Each entry
covers one focused pass (rotating through: links, typos, formatting, stale
content, technical hygiene). Never commits/pushes on its own — flags fixes as
plain diffs in the working tree for Saumitra to review and commit himself.

---

## 2026-09-08 — Links & stale-content pass

**Checked:**
- Internal links: every `href` in `curious-writings.html` and all 13
  `articles/*.html` pages resolves to an existing file (essay pages,
  css/js, `assets/book/*`). Prev-essay nav chain (01 → 13) is intact; essay
  #01 correctly has no "Previous essay" link, and the site's nav design is
  "previous-only" (no "next" links anywhere) — not a bug, just confirmed
  consistent across all 13 essays.
- `sitemap.xml`: lists homepage, `curious-writings.html`, the book PDF, and
  all 13 essays. Nothing stale, nothing missing.
- External links spot-checked live: curious96.com (loads), the GitHub Pages
  homepage (index.html → curious-writings.html redirect confirmed working;
  curious-writings.html itself loads with all 13 cards), essay #13 page
  (loads, correct title/meta). Instagram link (instagram.com/curious_poem)
  couldn't be verified via fetch — blocked by Instagram's robots.txt, not a
  site-side issue.
- `llms.txt` / `llms-full.txt` vs. actual site content.

**Fixed:**
- `llms.txt` was missing essay #13 ("Change Is the Only Constant") from the
  `## Essays` list entirely — added it, matching the existing entry format.
- `llms-full.txt` was stale in several places (predated essay #13's
  publication): file-tree comment said "12 essay HTML files" and omitted
  `13-learnings-of-education.html`; hero-stats section said "12 Essays"
  twice; filter-category comment said "show all 12"; section header said
  "ALL 12 ESSAYS"; and essay #13 had no full-description entry at all.
  Updated all of these to 13 and added essay #13's description block
  (sourced from the essay's own meta description / lede). Also bumped the
  "Generated" footer line to note the 2026-09-08 update.

**Open questions / suggestions for Saumitra:**
- `llms-full.txt`'s "3 Languages (English, Marathi, Hindi)" line — only one
  essay (#10) is actually written in Marathi, and none are written in
  Hindi (essay #13 just *mentions* writing poetry in Hindi). Left as-is
  since it may be intentional (the site's stated languages, not just essay
  languages) — worth double-checking whether that's accurate or a leftover.
- `CLAUDE.md` mentions a second clone at
  `/Users/curious/Documents/GitHub/curious-writings` that's behind
  `origin/main` with unpushed local diffs in `css/styles.css` and
  `curious-writings.html`. Not touched (out of scope / not the canonical
  working copy per CLAUDE.md), but flagging in case it's been forgotten —
  worth reconciling or deleting if it's stale.

**Not done this pass (next rotation):** typos, formatting/rendering
consistency, other stale content (dates/images/bio), technical hygiene
(console errors, alt text, CSS/JS refs).

---

## 2026-09-09 — Follow-up fix: forward-nav links on essays #11 & #12

**Context:** Yesterday's pass concluded the "previous-only" nav design was
intentional and consistent. On closer inspection that was wrong: essays
#01–#10 all have a "Next: <title> →" forward link in the footer
(`class="back-to-all"`, same class oddly reused for both the "Next" link
and the terminal "All essays" link) pointing to the following essay.
Essays #11 and #12 were the only two missing theirs — both dead-ended back
to `curious-writings.html` instead of advancing to the next essay, almost
certainly left over from when #11 and #12 were briefly the newest essay
before #12 and #13 were published and the forward link was never wired up.

**Fixed:**
- `articles/11-life-quantum-physics.html`: footer "Next" link now points to
  `12-boston-experience.html` ("Next: The Boston Experience →") instead of
  short-circuiting to the homepage.
- `articles/12-boston-experience.html`: footer "Next" link now points to
  `13-learnings-of-education.html` ("Next: Change Is the Only Constant →")
  instead of short-circuiting to the homepage.
- Essay #13 is genuinely the last essay, so its footer correctly has no
  "Next" link (unchanged).

**Verified:** `git diff` on both files shows only the single intended line
change each; div/footer/article/a tag counts balance on both files.

**Note on 2026-09-08's entry:** `llms.txt`/`llms-full.txt` changes from
that pass were still sitting uncommitted in the working tree as of this
run, along with a stale `.git/index.lock` (dated 2026-09-08 13:39) that
didn't block reads but may block `git add`/`commit` — worth deleting
before your next commit if it's still there.

## 2026-09-09 (second pass) — Typo pass

**Context:** This run started with a clean, up-to-date working tree — the
09-08/09-09 fixes above were already committed (in `53a4e806`). Per the
rotation, today's focus was (b) typos/spelling only, since links and one
stale-content item had already been covered.

**Checked:** All 13 essay bodies (English essays #01–#09, #11–#13, and the
Marathi essay #10), the homepage `curious-writings.html` (hero copy, all 13
card excerpts, timeline, reader-path cards, footer/script), and the repo's
meta docs (`README.md`, `CLAUDE.md`, `PROJECT_CONTEXT.md`, `llms.txt`,
`llms-full.txt`) for actual misspellings, doubled words, and encoding
corruption. No spellchecking tool or dictionary was available in this
sandbox (no network egress from `device_bash`, no `aspell`/`hunspell`/
`/usr/share/dict`), so this was a careful manual read-through plus targeted
grep patterns (common misspellings, doubled-word regex, replacement-
character scan) rather than an automated pass.

Deliberately left untouched: the essays' informal, non-native-English voice
(fragments, "no?", "gonna", "yah", "boss", British/Indian vs. American
spelling mixed across different years/essays, etc.) — none of that is a
typo, it's Saumitra's own voice and evolved over the 4+ years these were
written, so it stays exactly as written per the standing instruction.

**Fixed:**
- `articles/10-ek-unhali-sahal.html`: found genuine encoding corruption —
  "ठरल��लं" (two literal U+FFFD replacement characters embedded in the
  file, not a decode issue) in the closing paragraph. Restored to
  "ठरलेलं" ("...ठरलेलं असतं" = "...is [how it was] meant to be"), which
  fits the sentence and is the only plausible reconstruction. Flagging
  this one for a human glance since it's a judgment call, even though I'm
  fairly confident in it.
- `articles/13-learnings-of-education.html`: "Santa clause" → "Santa
  Claus" (homophone typo — "with an 'almost' Santa Claus in my book,"
  referring to being born on Boxing Day, the day after Christmas).
- `curious-writings.html`: essay #11's homepage card excerpt said "Eight
  fundamental principles of quantum physics," but the essay itself has 9
  numbered sections (confirmed via `<h2>` count) and essay #11's own meta
  description already correctly says "9 fundamental concepts." Fixed the
  homepage card to say "Nine" to match. Not strictly a spelling typo, but
  an obviously-correct one-word factual fix caught while reading the file
  for this pass, so fixed it now rather than leaving it stale.

**Verified:** `git diff` shows only these 3 single-line changes, nothing
else touched. Ran a tag-balance check (open vs. close counts for p, div,
article, header, footer, main, h2, strong, em, a, blockquote) on all three
edited files — all balanced.

**Open questions / suggestions for Saumitra (not touched, out of scope for
today's pass):**
- `llms.txt`'s description for essay #12 ("A trip to Boston — the city's
  history, the physics conference, the feeling of being a tourist in your
  own field") doesn't match the essay's actual content or its own meta
  description (which correctly says "an internship in quantum computing in
  Boston... river walk... public transport... horror story"). Looks like a
  stale/generic placeholder that was never updated when essay #12 was
  finalized. Worth fixing on a future stale-content pass.
- Still open from 09-08: `llms-full.txt`'s "3 Languages (English, Marathi,
  Hindi)" line — only essay #10 is actually written in Marathi, and none
  are in Hindi (essay #13 just mentions writing poetry in Hindi). Same
  language claim also appears in `llms.txt`'s header line and the
  README/CLAUDE.md "Three essays are in Marathi" phrasing is at least
  internally consistent even if "3 languages" isn't. Worth a decision on
  whether that's intentional (stated site languages vs. essay languages)
  or should be corrected.
- `<blockquote>` is used nested directly inside `<p>` tags in two places
  (`articles/09-summer-2024.html` and `articles/12-boston-experience.html`)
  — that's invalid HTML nesting (block-level element inside a `<p>`, which
  browsers silently "fix" by closing the `<p>` early). Doesn't visibly
  break rendering but worth a formatting-pass cleanup.
- Still noted from 09-08: the second local clone at
  `/Users/curious/Documents/GitHub/curious-writings` mentioned in
  `CLAUDE.md`. This run's connected folder was actually
  `/Users/curious/curious-writings` (not the `Documents/GitHub` path) —
  worth double-checking which of these is the real canonical clone, and
  whether the other is stale and safe to delete.

**Not done this pass (next rotation):** formatting/rendering consistency,
other stale content (dates/images/bio beyond the one item above), technical
hygiene (console errors, alt text, CSS/JS refs).

---

## 2026-09-17 — Formatting/rendering consistency pass

**Context:** Working tree was clean and up to date with `origin/main` at the
start of this run (last commit `0e690cc`, which had already folded in the
09-09 typo-pass fixes — thanks for committing those). No scheduled run
appears to have happened between 2026-09-09 and today; picking the rotation
back up at (c) formatting/rendering consistency, since links, typos, and a
first stale-content pass were already covered.

**Checked:**
- HTML tag balance (p, div, article, header, footer, main, h1–h3, strong,
  em, a, blockquote, span, ul/li/ol, section, nav, button) across all 13
  articles plus `curious-writings.html` and `index.html` — all balanced
  except the one issue below.
- `<head>` metadata consistency across all 13 essays: `<html lang>`,
  charset, viewport, `<title>` format, meta description, canonical URL —
  all present and consistently formatted.
- Essay footer nav chain (Previous/Next links) across all 13 essays —
  confirmed the 09-09 fix for essays #11/#12 is intact and the full
  01→13 chain is consistent (essay #1 has no "Previous," essay #13 has no
  "Next," matching the established pattern).
- Cross-referenced the actual `data-category` used on the homepage cards
  and each article's own `category-tag` (the site's real, live
  categorization) against the category columns in `CLAUDE.md`, `README.md`,
  and `llms-full.txt`.

**Fixed:**
- `articles/09-summer-2024.html`: found one instance of a `<blockquote>`
  nested inside a `<p>` (block element inside inline-flow content — invalid
  HTML that browsers silently "fix" by closing the `<p>` early, same class
  of bug as the one already known from the 09-09 pass in the other two
  files, except those two turned out to already be correctly structured on
  closer look — only this one was actually broken). Split it into
  `<p>...he remarked:</p>` + standalone `<blockquote>` + `<p>Such an
  interesting thought!...</p>`, matching the pattern already used
  elsewhere on the site (e.g. `12-boston-experience.html`). No wording
  changed, only the tag structure. Tag-balance re-checked after the edit.
- Category mismatches: essays **#03**, **#10**, and **#12** are tagged
  differently on the live site than in the docs. The site itself is
  internally consistent (homepage card `data-category` matches each
  article's own `category-tag` in all three cases) — it was `CLAUDE.md`,
  `README.md`, and `llms-full.txt` that were stale:
  - #03 "Trip Back Home": site = journey ("The Journey"), docs said
    "travel"/"Travel & Home" — corrected all three docs.
  - #10 "एक उन्हाळी सहल": site = marathi ("मराठी", its own dedicated filter
    category per `llms-full.txt`'s own Filter Categories legend), docs
    said "travel"/"Travel & Home" — corrected all three docs.
  - #12 "The Boston Experience": site = journey ("The Journey"), docs said
    "travel"/"Travel & Home" — corrected all three docs.
- `llms.txt` and `llms-full.txt`: essay #12's description was a stale,
  generic placeholder ("A trip to Boston — the city's history, the physics
  conference...") that doesn't match the essay at all (no physics
  conference, no Freedom Trail/Faneuil Hall/MIT/Harvard in the actual
  text) — this was flagged as an open item back on 2026-09-09 and left for
  a stale-content pass. Since it directly ties into today's docs/site
  sync check and the correct content was already clearly identified (the
  essay's own meta/OG description: first job at 28, quantum computing
  internship, river walk, public transport, the 3am intruder story),
  fixed both files to match.

**Verified:** `git diff --stat` shows exactly 5 files touched
(`CLAUDE.md`, `README.md`, `articles/09-summer-2024.html`, `llms-full.txt`,
`llms.txt`), all diffs reviewed line-by-line and match the intended fixes
above with nothing extra. Re-ran the tag-balance check on
`09-summer-2024.html` after editing — still balanced.

**Open questions / suggestions for Saumitra:**
- No scheduled maintenance run seems to have landed between 2026-09-09 and
  today (2026-09-17) — this audit log has no entries in between and the
  last commit before today's is from 2026-09-11 (which was you committing
  the 09-09 fixes, not a new automated pass). Worth checking the schedule
  is still firing if you expected daily runs.
- This run's connected folder was `/Users/curious/curious-writings` (the
  canonical one per `CLAUDE.md`), consistent with the last two runs — but
  the scheduling config for this task still references
  `/Users/curious/Documents/GitHub/curious-writings` (the known stale
  duplicate) as the "connected folder for context." It didn't cause a
  problem today since the actual mount pointed at the right repo, but
  worth updating that reference (or resolving/deleting the duplicate
  clone) so it doesn't cause confusion later.
- Still open from earlier passes: `llms-full.txt`'s "3 Languages (English,
  Marathi, Hindi)" line — only essay #10 is actually in Marathi, and none
  are in Hindi. Left untouched again pending your call on whether that's
  intentional framing.
- Not part of today's rotation but noticed in passing: several rows in the
  `CLAUDE.md`/`README.md` essay tables still show "—" for the Year column
  (essays #02, #03, #04, #08) even though the homepage cards now show
  actual dates/seasons for these (e.g. #02 "Sep 2021", #03 "Dec 2021", #04
  "Spring 2022", #08 "Spring 2024"). Not fixed today since it's more of a
  stale-content sync task than formatting — good candidate for the next
  (d) stale-content rotation.

**Not done this pass (next rotation):** other stale content beyond the
category/description fixes above (dates/images/bio), technical hygiene
(console errors, alt text, CSS/JS refs).

---

## 2026-09-19 — Technical hygiene pass

*(Folded in from `docs/audit-note-2026-09-19.md`, written as a standalone file that day because the six tracked files below were still locally uncommitted at the time. Saumitra committed everything the same evening (commit `5d26977`, 2026-09-19 17:49), so this run is merging that entry into the main log per its own request. The sandbox can't delete files, so `docs/audit-note-2026-09-19.md` itself is still sitting in the repo — safe to delete manually now that its content lives here too.)*

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

---

## 2026-09-20 — Stale-content pass

**Context:** Working tree was clean at the start of this run — Saumitra committed
the pending 09-17/09-19 batch (commit `5d26977`, 2026-09-19 17:49), which un-blocked
this rotation. Per the standing instruction, checked `git status`/`git log` first;
nothing was locally modified going in. Picked up the (d) stale-content slot, which
had been skipped twice in a row (09-17 and 09-19) because it landed in files that
were locked both times. Also folded the standalone `docs/audit-note-2026-09-19.md`
entry into this log above, per its own request (see note there — the file itself
is still on disk since this sandbox can't delete it).

**Checked:**
- Cross-referenced every essay's actual publish date (`.card-lang` span on each
  homepage card in `curious-writings.html`, e.g. "English · Sep 2021") against the
  Year column in the essay tables in `CLAUDE.md`, `README.md`, and the
  per-essay `**Year:**` fields in `llms-full.txt`/`llms.txt`.
- The "Three essays are in Marathi" / "3 Languages (English, Marathi, Hindi)"
  claim repeated across `README.md`, `CLAUDE.md`, `llms.txt`, and `llms-full.txt`
  — flagged as an open question in three prior passes (09-08, 09-17, 09-19) but
  never resolved. Checked it against hard evidence this time: `<html lang="...">`
  on all 13 article files (only `articles/10-ek-unhali-sahal.html` has `lang="mr"`,
  all 12 others are `lang="en"`), and against the essay tables in the same
  documents, which already list only essay #10 as Marathi. The "three
  essays"/"Hindi" claim contradicted the very tables sitting a few lines below
  it in each file — not a framing ambiguity, an internal inconsistency.
- The live site's actual hero stats (`curious-writings.html` `.hero-meta`:
  "1 Book / 13 Essays / 4+ Years") against `llms-full.txt`'s documented hero
  stats ("13 Essays, 4+ Years, 3 Languages") — the site doesn't show a
  Languages stat at all and does show a Book count that the doc omitted;
  `llms-full.txt` was describing a version of the hero that no longer exists.
- Ran `sitemap.xml` past a quick recount while in the area: 16 `<loc>` entries
  (home, main index, book PDF, 13 articles) — matches the current 13-essay
  site exactly, nothing stale or missing. No `<lastmod>` tags are used, so
  nothing to compare there.

**Fixed:**
- `CLAUDE.md` / `README.md`: filled in the Year column for essays #02 (Sep
  2021), #03 (Dec 2021), #04 (Spring 2022), #08 (Spring 2024), #10 (Summer
  2024), #11 (2025), and #12 (Fall 2025) — all were showing a placeholder
  "—" even though the live homepage cards have had real dates for a while.
  Values taken directly from each essay's own `.card-lang` span, no
  interpretation involved.
- `llms-full.txt`: added the matching `**Year:**` field to the same seven
  essays' full-description entries (previously the field was just missing
  for these seven, present for the other six) — brings that file in line
  with `CLAUDE.md`/`README.md`.
- `llms.txt`: added the matching `· <Year>` suffix to the same seven essays'
  one-line list entries, same reasoning.
- `README.md`, `CLAUDE.md`, `llms.txt`, `llms-full.txt`: corrected "Three
  essays are in Marathi" → "One essay (#10) is in Marathi" (4 occurrences
  across the 4 files) — factually only one of the 13 essays is in Marathi,
  confirmed via `<html lang>`.
- `llms.txt`: `**Languages:** English, Marathi, Hindi` → `**Languages:**
  English, Marathi` — no essay is written in Hindi (the only "Hindi"
  mention on the whole site is essay #13 saying Saumitra writes poetry in
  Hindi as a personal aside, not an essay language).
- `llms-full.txt`: corrected the `.hero` layout description and the "Hero
  Stats" bullet list to match the live site — removed the nonexistent "3
  Languages (English, Marathi, Hindi)" stat and added the "1 Book" stat
  that's actually there (`- 1 Book`, `- 13 Essays`, `- 4+ Years of writing`).

**Verified:** `git diff --stat` shows exactly 4 files touched (`CLAUDE.md`,
`README.md`, `llms.txt`, `llms-full.txt`) — `curious-writings.html` and all
13 article files are untouched, since this was a docs-sync pass, not a
site-content edit. Read the full `git diff` line by line; every hunk matches
one of the fixes above, nothing extra. Checked markdown table column counts
in `README.md` (6) and `CLAUDE.md` (7) stayed consistent across every row
after the sed edits. No essay prose, titles, excerpts, or voice were touched
anywhere.

**Open questions / suggestions for Saumitra:**
- `docs/audit-note-2026-09-19.md` is now redundant (folded into this log
  above) but this sandbox can't delete files — safe to delete manually
  whenever convenient.
- Still open, not touched (out of scope for a stale-content pass, needs a
  human call): the second local clone at
  `/Users/curious/Documents/GitHub/curious-writings` mentioned in
  `CLAUDE.md`'s "Known Duplicate Clone" section — worth checking whether
  it's still behind `origin/main` with unpushed diffs, and reconciling or
  removing it if it's just stale. This run's connected folder was (again)
  the canonical `/Users/curious/curious-writings`.
- Still open from 09-19: no favicon on the site / no `favicon.*` file in
  the repo root (silent 404 on the implicit `/favicon.ico` request) — low
  priority, needs a new binary asset rather than a mechanical fix, left for
  your call.
- Nothing else struck me as stale while in these four files this pass —
  contact info, bio blurbs, and the book description all read current.

**Not done this pass (next rotation):** links (was last done 09-08, may be
due for a re-check now that 09-19's technical-hygiene fix and today's docs
edits have landed), typos (last done 09-09), formatting/rendering
consistency (last done 09-17).


---

## 2026-09-22 (morning run) — Links pass

**Note:** originally written as a standalone file, `docs/audit-note-2026-09-22.md`,
because `docs/audit-log.md` itself (along with `CLAUDE.md`, `README.md`, `llms.txt`,
`llms-full.txt`) was still showing local uncommitted changes from the 09-19/09-20
batch at the time. Saumitra committed that batch shortly afterward (commit
`e336d71`, 2026-09-22 07:26 local), which un-blocked logging — folding the
standalone note in here now, same treatment as the 09-19 note got on 09-20.

**Context:** `git status` at the start of that run showed the same five files
modified and uncommitted, unchanged since 09-20. No other files were locally
modified, so the rest of the repo was fair game. Per the 09-20 entry's own
"not done this pass" note, picked up (a) links — most overdue (full pass last
done 09-08, with a follow-up fix on 09-09) and one of the few rotation slots
that doesn't depend on editing any of the five locked files.

**Checked:**
- Every `href`/`src` in `index.html`, `curious-writings.html`, and all 13
  `articles/*.html` files, resolved programmatically against the actual
  filesystem: zero broken internal links.
- The prev/next essay footer nav chain (`class="back-to-all"`, "Next: …"
  links): essays #01–#12 each point to the correct next essay in sequence,
  essay #13 correctly has no "Next" link. The #11/#12 dead-ends fixed on
  09-09 are still holding.
- `curious-writings.html`'s card grid / archive: all 13 essays are linked
  at least once; none missing, none pointing to the wrong file.
- In-page anchor links (`href="#…"`) across all files resolve to an actual
  `id` attribute on the same page — none dangling.
- `sitemap.xml`: still exactly 16 `<loc>` entries (home, `curious-writings.html`,
  book PDF, 13 articles) — matches the live 13-essay site, nothing stale or
  missing (unchanged since 09-20's count).
- External links, spot-checked live: `curious96.com` loads fine.
  `instagram.com/curious_poem` still can't be fetched directly (blocked by
  Instagram's own robots.txt) — not a site-side issue, consistent with
  09-08's finding.
- The root `index.html` → `curious-writings.html` meta-refresh redirect: a
  bare fetch of the root URL returns what looks like an empty page (the
  fetch tool doesn't execute the meta-refresh), but a real browser follows
  it instantly and `curious-writings.html` fetched directly loads with full
  content. Same non-issue 09-08 already confirmed.
- No stray `.git/index.lock` file.

**Fixed:** nothing — no broken links found. All checks came back clean.

**Open questions / suggestions for Saumitra:** the second local clone at
`/Users/curious/Documents/GitHub/curious-writings` (see `CLAUDE.md`'s "Known
Duplicate Clone" section) and the missing favicon are unchanged from prior
passes, still just flags.

**Not done this pass (next rotation):** typos (last done 09-09, most
overdue after links), formatting/rendering consistency (last done 09-17),
further stale-content/technical-hygiene follow-ups.

---

## 2026-09-22 (later run same day) — Typos pass

**Context:** `GIT_OPTIONAL_LOCKS=0 git status` showed a clean working tree at
the start of this run — the 09-19/09-20 batch had been committed (`e336d71`)
before this run started, and the links pass above had already logged (as a
standalone note, since folding it in was itself part of this run's first
step). Per the links-pass "not done this pass" note, picked up (b) typos —
most overdue slot (last full pass 09-09, ~13 days prior).

**Checked:** read every essay's body text in full (all 13 articles,
stripped of markup) plus the homepage card excerpts, hero copy, and story-map
text in `curious-writings.html`, and re-read `CLAUDE.md`, `README.md`,
`PROJECT_CONTEXT.md`, `llms.txt`, and `llms-full.txt` end to end. Also ran a
set of automated regex sweeps across all of the above for common misspelling
patterns (`recieve`, `seperate`, `occured`, `thier`, `definately`,
`existance`, `government`/`goverment`, `alot`, `could/should/would of`,
`loosing`, `wierd`, `concious`, `independant`, `priviledge`, `untill`,
`begining`, `comming`, `runing`, `writting`, `embarass`, `accross`,
doubled words, and a/an agreement before vowel sounds).

**Fixed:** nothing this pass — both the manual read-through and the
automated sweeps came back clean. The essay text has clearly already been
combed for this kind of error in earlier passes (09-09 in particular); no
genuine misspellings turned up anywhere in the 13 articles, the homepage, or
the docs/metadata files.

**Open question for Saumitra (not changed):** essay #01's essay body
("...me and that friend from UIUC shamelessly ate thepleys sitting in front
of the MacD...") and the matching homepage card excerpt for essay #01 in
`curious-writings.html` ("...wore off by the time he was eating thepleys at
McDonald's...") both use the word "thepleys." That doesn't match any English
or transliterated Hindi/Gujarati spelling — my best guess is it was meant to
be "theplas" (the flatbread snack), which would fit the scene (carrying
homemade snacks and eating them at a McDonald's), but since this is your
own essay text and I could be guessing wrong about the intended word, I've
left it untouched rather than editing your prose on a guess. Worth a quick
look and a manual fix if "theplas" (or something else) was intended — happy
to make the edit next run once you confirm the correct spelling.

**Also flagging (not a typo, so not touched):** essay #13 uses American
spellings ("realize" ×2, "flavor" ×1, "socializing") while every other essay
and all the docs consistently use British spellings elsewhere on the site
(realise, colour, labour, recognise, licence, analyse, fulfilment,
mannerism, savouring). Both spellings are individually "correct" so this
isn't a misspelling I'd fix under the typos-only rule, but it's a
site-wide-consistency question you may want to weigh in on — worth noting
for the next formatting/consistency pass, or leave alone if this is simply
how essay #13 was written.

**Verified:** `GIT_OPTIONAL_LOCKS=0 git diff` after this run shows only the
edits to `docs/audit-log.md` itself (folding in the standalone links-pass
note and adding this entry) — no essay, homepage, or other doc content was
touched, since nothing met the bar for a safe mechanical fix this pass.

**Open questions / suggestions for Saumitra (carried forward, unchanged):**
- `docs/audit-note-2026-09-19.md` and `docs/audit-note-2026-09-22.md` are
  both now folded into this log and safe to delete manually whenever
  convenient (this sandbox can't delete files itself).
- The second local clone at `/Users/curious/Documents/GitHub/curious-writings`
  (see `CLAUDE.md`'s "Known Duplicate Clone" section) — still unreconciled,
  still just a flag.
- No favicon on the site — still open, low priority, needs a new binary
  asset rather than a mechanical fix.
- New this pass: the "thepleys" spelling question above, and the
  American/British spelling mix in essay #13, both above.

**Not done this pass (next rotation):** formatting/rendering consistency
(last done 09-17, now the most overdue slot), stale-content/technical-hygiene
follow-ups.
