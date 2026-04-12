# Curious Writings — Claude Code Project Guide

> Read this file first. It replaces the need to open any HTML file to understand the project.

**Live site:** https://saumitraphatak.github.io/curious-writings/
**GitHub:** https://github.com/saumitraphatak/curious-writings
**Author:** Saumitra Phatak — Mumbaikar, Purdue Physics PhD candidate

---

## What This Is

A personal essay blog. 12 honest essays written over 4+ years — on life abroad, a Physics PhD, identity, travel between Mumbai and Indiana, and what it means to be genuinely curious. Written in English, Marathi, and Hindi.

---

## Tech Stack

- **Pure static HTML/CSS** — minimal JS (filter bar only), no npm, no build step
- **Google Fonts** via CDN
- Open any `.html` file directly in browser
- git on `main` branch

---

## File Structure

```
curious-writings/
├── curious-writings.html   # Main index — essay card grid (THIS is the homepage, not index.html)
├── index.html              # GitHub Pages redirect → curious-writings.html
├── css/
│   └── styles.css          # All styles (clean, serif-forward reading aesthetic)
├── articles/               # 12 individual essay HTML files
│   ├── 01-india-usa-travel.html
│   ├── 02-usa-two-weeks.html
│   ├── 03-trip-back-home.html
│   ├── 04-im-confused.html
│   ├── 05-fall-2022.html
│   ├── 06-india-trip-2022.html
│   ├── 07-summer-2023.html
│   ├── 08-achievements.html
│   ├── 09-summer-2024.html
│   ├── 10-ek-unhali-sahal.html     # Marathi essay
│   ├── 11-life-quantum-physics.html
│   └── 12-boston-experience.html
├── robots.txt
└── sitemap.xml
```

**Important:** The real homepage is `curious-writings.html`, not `index.html`. The `index.html` only redirects. When editing the home page, edit `curious-writings.html`.

---

## Essay Card Structure (in curious-writings.html)

Each essay is an `<article class="article-card">` with `data-category` attribute:

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

Card #01 also has class `featured` (larger card).

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

1. Create `articles/NN-essay-slug.html` (copy an existing one as template)
2. Add `<article class="article-card reveal" data-category="...">` to `curious-writings.html`
3. Add to `sitemap.xml` with `<loc>` and `<lastmod>`
4. Update hero stat (`<strong>12</strong><small>Essays</small>`) if count changes

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
</body>
</html>
```

---

## All 12 Essays

| # | File | Title | Category | Language | Year |
|---|---|---|---|---|---|
| 01 | 01-india-usa-travel.html | India-USA Travel Experience | journey | English | Aug 2021 |
| 02 | 02-usa-two-weeks.html | Two Weeks in the USA | journey | English | — |
| 03 | 03-trip-back-home.html | Trip Back Home | travel | English | — |
| 04 | 04-im-confused.html | I'm Confused | philosophy | English | — |
| 05 | 05-fall-2022.html | Fall 2022 | phd | English | 2022 |
| 06 | 06-india-trip-2022.html | India Trip 2022 | travel | English | 2022 |
| 07 | 07-summer-2023.html | Summer 2023 | phd | English | 2023 |
| 08 | 08-achievements.html | Achievements | growth | English | — |
| 09 | 09-summer-2024.html | Summer 2024 | phd | English | 2024 |
| 10 | 10-ek-unhali-sahal.html | एक उन्हाळी सहल | travel | Marathi | — |
| 11 | 11-life-quantum-physics.html | Life & Quantum Physics | science | English | — |
| 12 | 12-boston-experience.html | The Boston Experience | travel | English | — |

---

## Design Notes

- Clean, serif-forward reading experience — prioritizes long-form readability
- Category tags are color-coded (journey=blue, phd=purple, travel=green, philosophy=amber, science=teal, marathi=saffron)
- Cards have a `.reveal` class for scroll-in animation
- Mobile: cards stack single column; filter bar scrolls horizontally
- No dark mode (light, paper-white aesthetic)

---

## Development Workflow

```bash
cd /Users/curious/curious-writings
open curious-writings.html    # main page — NOT index.html
git add -A && git commit -m "..."
git push origin main
```
