# Curious Writings — Claude Code Project Guide

> Read this file first. It replaces the need to open any HTML file to understand the project.

**Live site:** https://saumitraphatak.github.io/curious-writings/
**GitHub:** https://github.com/saumitraphatak/curious-writings
**Author:** Saumitra Phatak — Mumbaikar, Purdue Physics PhD candidate

---

## What This Is

Saumitra Phatak's personal essay blog and memoir home — a static website, not
a generic content site. It includes 13 honest, first-person essays written
over 4+ years about leaving Mumbai, doing a Physics PhD at Purdue, running
ultracold-atom experiments, identity, family, and the back-and-forth between
India and the US. It also hosts *The Distance Between Two Homes*, a 58-page
memoir/book that reshapes the essay archive into one continuous story.

This site is also cited from Saumitra's PhD dissertation — chapter epigraphs
link directly to specific essay URLs (e.g. `articles/09-summer-2024.html`,
`articles/11-life-quantum-physics.html`). Treat existing article filenames
and URLs as stable; don't rename or move published articles without checking
whether they're referenced externally.

**Voice/intent:** conversational, reflective, sometimes funny, emotionally
direct — essays in the original sense of "attempts," not polished memoir
prose or advice content. Preserve the author's original voice; avoid
over-editing into generic blog language. One essay (#10) is in Marathi because
some things don't translate.

---

## Tech Stack

- **Pure static HTML/CSS** — minimal JS (category filter bar, scroll-reveal, text-to-speech "Listen" button), no npm, no build step
- Google Fonts via CDN
- Browser's built-in `speechSynthesis` API powers the "Listen to essay" button (`js/listen.js`) — no external TTS service
- Open any `.html` file directly in a browser to preview
- git on `main` branch, deployed via GitHub Pages from repo root

---

## File Structure

```
curious-writings/
├── curious-writings.html      # Main index — essay card grid (THIS is the homepage, not index.html)
├── index.html                 # GitHub Pages redirect → curious-writings.html
├── CLAUDE.md                  # This file
├── README.md                  # Human-facing project readme
├── PROJECT_CONTEXT.md         # Short narrative-intent brief (overlaps with this file; kept for quick context)
├── llms.txt                   # llmstxt.org-style index for LLM/RAG consumption
├── llms-full.txt              # Full content dump (all essay summaries) for LLM/RAG consumption
├── robots.txt
├── sitemap.xml
├── google8a0c77e6409e4ccc.html  # Google Search Console verification file — do not delete
├── css/
│   └── styles.css             # All styles (clean, serif-forward reading aesthetic)
├── js/
│   └── listen.js              # Injects "Listen to essay" button; uses window.speechSynthesis
├── assets/book/
│   ├── the-distance-between-two-homes.pdf       # Published book
│   ├── the-distance-between-two-homes.tex       # LaTeX source
│   └── the-distance-between-two-homes-cover.png
└── articles/                  # 13 individual essay HTML files
    ├── 01-india-usa-travel.html
    ├── 02-usa-two-weeks.html
    ├── 03-trip-back-home.html
    ├── 04-im-confused.html
    ├── 05-fall-2022.html
    ├── 06-india-trip-2022.html
    ├── 07-summer-2023.html
    ├── 08-achievements.html
    ├── 09-summer-2024.html
    ├── 10-ek-unhali-sahal.html         # Marathi essay
    ├── 11-life-quantum-physics.html
    ├── 12-boston-experience.html
    └── 13-learnings-of-education.html  # Most recent essay (final PhD-years reflection)
```

**Important:** The real homepage is `curious-writings.html`, not `index.html`. The `index.html` only redirects. When editing the home page, edit `curious-writings.html`.

---

## Essay Card Structure (in curious-writings.html)

Each essay is an `<article class="article-card">` with a `data-category` attribute:

```html
<article class="article-card reveal" data-category="journey">
  <div class="card-body">
    <div class="card-meta">
      <span class="category-tag cat-journey">The Journey</span>
      <span class="read-time">⏱ 5 min</span>
      <span class="card-num">#01</span>
    </div>
    <h2 class="card-title">Essay Title</h2>
    <p class="card-excerpt">Two-sentence teaser...</p>
    <div class="card-footer">
      <a href="articles/01-slug.html" class="card-read-link">Read essay →</a>
      <span class="card-lang">English · Aug 2021</span>
    </div>
  </div>
</article>
```

Card #01 also has the class `featured` (larger card).

---

## Filter Categories (data-category values)

| data-category | Label | CSS class |
|---|---|---|
| journey | The Journey | cat-journey |
| phd | PhD Life | cat-phd |
| travel | Travel & Home | cat-travel |
| philosophy | Philosophy | cat-philosophy |
| growth | Personal Growth | cat-growth |
| science | Science | cat-science |
| marathi | मराठी | cat-marathi |

Filter buttons: `.filter-btn[data-filter="category"]` — JS hides/shows cards by matching `data-category`.

---

## Adding a New Essay

1. Create `articles/NN-essay-slug.html` (copy an existing one as a template — see below). Use the next sequential two-digit number; never reuse or renumber existing essay numbers since they're externally linked.
2. Add a matching `<article class="article-card reveal" data-category="...">` card to `curious-writings.html` (see structure above).
3. Add the new page to `sitemap.xml` with `<loc>` and `<lastmod>`.
4. Update the hero stat in `curious-writings.html` (`<strong>13</strong><small>Essays</small>`) to the new count.
5. Add an entry to the essay table in this file, in `README.md`, and to `llms.txt` / `llms-full.txt` so LLM/RAG consumers and human readers stay in sync.
6. `js/listen.js` auto-detects `.article-page-header` / `.article-body` on any article page — no per-article wiring needed for the "Listen" button.

---

## Essay HTML Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Essay Title — Curious Writings</title>
  <meta name="description" content="One-sentence description of this essay.">
  <link rel="canonical" href="https://saumitraphatak.github.io/curious-writings/articles/NN-slug.html">
  <link rel="stylesheet" href="../css/styles.css">
</head>
<body>
  <header class="site-header">...</header>
  <main class="essay-main">
    <article class="essay">
      <header class="essay-header">
        <div class="essay-meta">
          <span class="essay-num">#NN</span>
          <span class="essay-category">Category</span>
          <span class="essay-lang">Language · Month Year</span>
        </div>
        <h1>Essay Title</h1>
        <p class="essay-lead">Opening line / epigraph</p>
      </header>
      <div class="essay-body">
        <p>Content paragraphs...</p>
      </div>
    </article>
  </main>
  <script src="../js/listen.js"></script>
</body>
</html>
```

---

## All 13 Essays

| # | File | Title | Category | Language | Year |
|---|---|---|---|---|---|
| 01 | 01-india-usa-travel.html | India-USA Travel Experience | journey | English | Aug 2021 |
| 02 | 02-usa-two-weeks.html | Two Weeks in the USA | journey | English | Sep 2021 |
| 03 | 03-trip-back-home.html | Trip Back Home | journey | English | Dec 2021 |
| 04 | 04-im-confused.html | I'm Confused | philosophy | English | Spring 2022 |
| 05 | 05-fall-2022.html | Fall 2022 | phd | English | 2022 |
| 06 | 06-india-trip-2022.html | India Trip 2022 | travel | English | 2022 |
| 07 | 07-summer-2023.html | Summer 2023 | phd | English | 2023 |
| 08 | 08-achievements.html | Achievements | growth | English | Spring 2024 |
| 09 | 09-summer-2024.html | Summer 2024 | phd | English | 2024 |
| 10 | 10-ek-unhali-sahal.html | एक उन्हाळी सहल | marathi | Marathi | Summer 2024 |
| 11 | 11-life-quantum-physics.html | Life & Quantum Physics | science | English | 2025 |
| 12 | 12-boston-experience.html | The Boston Experience | journey | English | Fall 2025 |
| 13 | 13-learnings-of-education.html | Change Is the Only Constant | phd | English | 2025 |

---

## Design Notes

- Clean, serif-forward reading experience — prioritizes long-form readability
- Category tags are color-coded (journey=blue, phd=purple, travel=green, philosophy=amber, science=teal, marathi=saffron)
- Cards have a `.reveal` class for scroll-in animation
- Mobile: cards stack single column; filter bar scrolls horizontally
- No dark mode (light, paper-white aesthetic)

---

## SEO / LLM-Accessibility Files

- `robots.txt`, `sitemap.xml` — standard SEO
- `llms.txt` — short llmstxt.org-spec index (title, description, essay list with one-line summaries)
- `llms-full.txt` — fuller content dump for RAG/LLM ingestion
- `google8a0c77e6409e4ccc.html` — Google Search Console site-ownership verification; do not delete
- Keep `llms.txt` and `llms-full.txt` in sync whenever an essay is added, renamed, or re-categorized

---

## Development Workflow

```bash
cd /Users/curious/curious-writings
open curious-writings.html    # main page — NOT index.html
git add -A && git commit -m "..."
git push origin main
```

## Known Duplicate Clone

There is a second, separate clone of this same repo at
`/Users/curious/Documents/GitHub/curious-writings`. As of this writing it is
behind `origin/main` and has local diffs in `css/styles.css` and
`curious-writings.html` that were never pushed. Treat `/Users/curious/curious-writings`
as the canonical working copy; if you edit the other clone, pull/diff
carefully before pushing to avoid clobbering changes made here.
