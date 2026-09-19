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
