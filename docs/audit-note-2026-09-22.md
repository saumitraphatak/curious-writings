# Daily audit note — 2026-09-22 (standalone; see explanation)

*(Written as a standalone file, not appended to `docs/audit-log.md`, because
that file — along with `CLAUDE.md`, `README.md`, `llms.txt`, and
`llms-full.txt` — still shows local uncommitted changes from the 09-19/09-20
batch. Per the standing instruction to never touch a file `git status`
shows as already locally modified, this run skipped all five entirely,
including logging to the normal file. Please fold this into
`docs/audit-log.md` once that batch is committed (or discarded), same as
the 09-19 note was folded in on 09-20. This is now a 3-day-old pending
batch as of today.)*

## 2026-09-22 — Links pass

**Context:** `git status` at the start of this run showed the same five
files (`CLAUDE.md`, `README.md`, `docs/audit-log.md`, `llms.txt`,
`llms-full.txt`) modified and uncommitted, unchanged since the 09-20 run.
No other files were locally modified, so the rest of the repo was fair
game. Per the rotation's own "not done this pass" note from 09-20, picked
up (a) links — most overdue (full pass last done 09-08, with a follow-up
fix on 09-09) and one of the few slots that doesn't depend on editing any
of the five locked files.

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
  missing (unchanged since 09-20's count; this pass just re-verified it).
- External links, spot-checked live: `curious96.com` loads fine.
  `instagram.com/curious_poem` still can't be fetched directly (blocked by
  Instagram's own robots.txt) — not a site-side issue, consistent with
  09-08's finding.
- The root `index.html` → `curious-writings.html` meta-refresh redirect: a
  bare fetch of the root URL returns what looks like an empty page (the
  fetch tool doesn't execute the meta-refresh), but this is expected — a
  real browser follows it instantly, and `curious-writings.html` fetched
  directly loads with full content (hero, book section, story map, reading
  guides, all 13 essays with metadata). Same non-issue 09-08 already
  confirmed; noting again only because a literal fetch of the bare URL
  looks alarming out of context.
- No stray `.git/index.lock` file (one was flagged as possibly stranded
  back on 09-09; clean now).

**Fixed:** nothing — no broken links found. All checks above came back
clean.

**Not fixed / no action needed:** n/a this pass.

**Open questions / suggestions for Saumitra:**
- Same standing note as 09-19/09-20: five files (`CLAUDE.md`, `README.md`,
  `llms.txt`, `llms-full.txt`, `docs/audit-log.md`) have been sitting
  uncommitted since 09-20 (or earlier — the 09-19 batch may already be
  folded into some of this diff). This is now blocking every rotation slot
  that touches documentation/metadata, and blocking normal logging to
  `docs/audit-log.md` itself. Worth reviewing and committing (or
  discarding) when convenient so the rotation can log normally again.
- `docs/audit-note-2026-09-19.md` is still sitting in the repo (flagged for
  manual deletion on 09-20 too) — safe to delete once its content is
  confirmed folded into `docs/audit-log.md`. This note (`audit-note-2026-09-22.md`)
  will need the same treatment once folded in.
- Everything else open from prior passes (the second local clone at
  `Documents/GitHub/curious-writings`, no favicon on the site) is
  unchanged and still just a flag, not touched this pass.

**Not done this pass (next rotation):** typos (last done 09-09, most
overdue after links), formatting/rendering consistency (last done 09-17),
further stale-content/technical-hygiene follow-ups (both partially blocked
by the five locked files).
