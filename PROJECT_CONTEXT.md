# Project Context: curious-writings

## Short Description
A personal essay and memoir-in-pieces website centered on Saumitra's PhD journey, migration between India and the United States, family, science, language, and the changing idea of home.

## What This Repo Is For
This repo preserves the original essays while also presenting them as a coherent reading experience. The website should let readers browse individual posts, but it should also gently suggest the larger story: leaving home, learning America, becoming a scientist, returning to India, and making peace with change.

## Current Shape
- Static website.
- Main page: `curious-writings.html`.
- `index.html` redirects to the main page.
- Article pages live in `articles/` and are individually authored HTML files.
- Shared styling is in `css/styles.css`.
- `js/listen.js` supports article listening/speech synthesis.
- Book assets live in `assets/book/`, including the PDF, LaTeX source, and cover image for *The Distance Between Two Homes*.
- SEO/AI context files: `llms.txt`, `llms-full.txt`, `robots.txt`, and `sitemap.xml`.

## Narrative Intent
The site should keep Saumitra's original essay voice: conversational, reflective, sometimes funny, and emotionally direct. Avoid over-polishing the prose into generic memoir language. The best version feels like the author is speaking honestly from inside a PhD life, not summarizing it from far away.

## Maintenance Notes
- When adding new essays, update `curious-writings.html`, `sitemap.xml`, and relevant reading paths.
- Preserve original article style unless doing explicit copyediting.
- Keep the book section prominent but do not let it erase the archive; the archive is the source memory of the project.
- If book assets are replaced, verify PDF and TeX paths still work.

## Local Preview
Open `curious-writings.html` directly in a browser. No build step is currently required.

## Good Future Improvements
- Add previous/next links with story-arc context to article pages.
- Add a compact chronological reading mode.
- Add richer metadata for essays: date, place, phase of PhD, and language.
- Keep the book and essay archive connected without making the homepage too crowded.
