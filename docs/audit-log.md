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
