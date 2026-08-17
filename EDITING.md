# Editing your Logbook — a field guide

Everything on the site is either a **Markdown file** (blog posts, album reviews, projects)
or a small **data file** (books, playlists). You almost never need to touch layout
or CSS — edit the content, save, and the page updates itself.

---

## 0. The basics

**Run the site while you edit** (from the project folder):

```bash
npm run dev
```

Open <http://localhost:4321>. Every time you save a file, the browser reloads automatically.
Press `Ctrl+C` in the terminal to stop it.

**Two golden rules**

1. In the `---` block at the top of a file (the "frontmatter"), keep the exact shape:
   `key: value`, quotes around text, `["a", "b"]` for lists. A stray missing quote or bracket
   is the #1 cause of a broken page.
2. Dates are always `YYYY-MM-DD` (e.g. `2026-07-31`).

If a page ever goes blank, check the terminal running `npm run dev` — it prints the exact file
and line of the problem.

**Where things live (quick map)**

| I want to edit…              | File(s)                                            |
| ---------------------------- | -------------------------------------------------- |
| Blog posts                   | `src/content/blog/*.md`                            |
| Currently-reading books      | `src/data/shelf.ts`                                |
| Books-I-read list            | `src/data/library.ts`                              |
| "Books read this year" number| `src/pages/books.astro` (top of file)              |
| Album reviews (Wall of Sound)| `src/content/albums/*.md`                          |
| Projects                     | `src/content/projects/*.md`                        |
| Homepage intro text          | `src/pages/index.astro`                            |
| The word "Logbook" / nav      | `src/components/Nav.astro`, `src/pages/index.astro`|
| Images                       | `public/` folder                                   |

---

## 1. Blog posts

Each post is one Markdown file in `src/content/blog/`. **The filename becomes the URL** —
`my-post.md` → `/blog/my-post`. Use lowercase-with-hyphens, no spaces.

### Add a new post

Create `src/content/blog/a-good-name.md`:

```markdown
---
title: "Your Post Title"
date: 2026-08-01
tags: ["Essay", "Data Science"]
---

Your first paragraph. Write in plain Markdown below the second `---`.

## A subheading

More text. **Bold**, *italic*, a [link](https://example.com), and > blockquotes all work.
```

That's it. The post automatically gets: a spot on the blog list (newest first), a "Read the post"
button, a reading-time estimate, and its own shareable preview image. Nothing else to wire up.

### Edit / rename / delete

- **Edit text or title:** open the file, change it, save.
- **Rename the display title:** change the `title:` line. (The URL stays the same because it comes
  from the *filename*.)
- **Change the URL too:** rename the file itself.
- **Delete a post:** delete the file.

### Body formatting cheatsheet

```markdown
## Big heading          ### Smaller heading
**bold**   *italic*   `inline code`
- bullet list           1. numbered list
> a quoted line
[link text](https://url.com)
```

### Add an English version (the TR / EN toggle)

Any post can carry an English translation that readers switch to with a **TR / EN** button while
reading. Two steps:

1. Next to your post `my-post.md`, create a second file `my-post.en.md`.
2. Give it this frontmatter, then the translated body:

```markdown
---
title: "The English Title"
date: 2026-08-02
tags: ["english", "tags"]
lang: "en"
translationOf: "my-post"     # ← the primary file's name, without ".md"
---

The translated text…
```

That's all. The toggle appears automatically, the two versions swap in place (title, tags,
reading time, and body), and the reader's choice is remembered. The English file stays out of the
blog list, the homepage feed, and the sitemap. A post with no `.en.md` companion just shows no
toggle — nothing else to do.

---

## 2. Books page

Three independent pieces:

### a) Currently reading — `src/data/shelf.ts`

```ts
export const shelf: Book[] = [
	{
		title: 'Book Title',
		author: 'Author Name',        // optional
		note: 'One line about it.',   // optional
		cover: '/books/my-cover.jpg', // optional — see below
	},
	// add or remove entries freely
];
```

**Cover image:** put the image file in `public/books/`, then reference it from the site root
(drop the `public`): `public/books/my-cover.jpg` → `cover: '/books/my-cover.jpg'`. An entry with no
`cover` just shows as text.

### b) Books I read — `src/data/library.ts`

A plain flat list, shown under "Books I Read in {year}". Add one line per book:

```ts
export const library: ReadBook[] = [
	{ author: 'Author Name', title: 'Book Title' },
	// list them in whatever order you like — they appear top to bottom
];
```

### c) "Books read this year" number — `src/pages/books.astro`

At the very top of the file:

```ts
const booksThisYear = { count: 15, year: 2026 };
```

Change `count` whenever you finish one; bump `year` in January.

---

## 3. Wall of Sound (album reviews)

One file per album in `src/content/albums/`:

```markdown
---
title: "Album Name"
artist: "Artist Name"
genre: "Progressive Death Metal"
releaseYear: 2001
rating: 5                 # 1–5
coverImage: "https://…/cover.jpg"   # a URL, or /my-cover.jpg from the public/ folder
spotlight: true          # true = featured; keep only ONE album as the spotlight
---

Your review text goes here.
```

All fields are required except the body. Keep exactly one album with `spotlight: true` — that's the
one featured on the homepage and at the top of Wall of Sound.

---

## 4. Projects — `src/content/projects/*.md`

```markdown
---
title: "Project Name"
description: "One or two sentences."
methodology: ["Bayesian modelling", "Time series"]
techStack: ["Python", "D3.js"]
date: 2026-05-01
featured: false          # true = the big highlighted card (keep only one)
---

Optional longer write-up.
```

---

## 5. Guitar

No longer on the site — the guitar practice tracker moved to a private Obsidian note
(`notes/Guitar Practice Log.md`). Track and update it there, not in the site.

---

## 6. Homepage & the "Logbook" label

- **Intro paragraph, the four tags, the card blurbs:** `src/pages/index.astro`.
- **The word "Logbook":** it appears in `src/components/Nav.astro` (next to your name) and
  `src/pages/index.astro` (the hero eyebrow), plus the page title in `src/pages/blog.astro`.
  If you ever rename it, change all of those.
- **The site title "Signal, Sound, and the Spaces Between":** the `<h1>` in `src/pages/index.astro`.

---

## 7. Images

Put image files in the **`public/`** folder. Reference them from the site root, without `public`:
a file at `public/covers/album.jpg` is used as `/covers/album.jpg` (e.g. in an album's
`coverImage`, or in Markdown with `![alt](/covers/album.jpg)`).

---

## 8. Multisport / training data

The charts read from `src/data/activities-summary.json`, which is **generated** by a script — don't
edit the JSON by hand. If you refresh your source data, regenerate it with:

```bash
npm run build:data
```

---

## 9. Before you publish (one-time)

1. In `astro.config.mjs`, set `SITE` to your real deployed URL (it powers the sitemap, canonical
   links, and social preview images).
2. If you deploy to a GitHub Pages *project* site (`username.github.io/nordic-journal`), also add
   `base: '/nordic-journal'` in that file — but **only at publish time**, because it changes every
   link in local dev too.
3. Delete the leftover starter page `src/pages/markdown-page.md` (it's Astro boilerplate that would
   otherwise show up in your sitemap).
4. Sanity-check the whole site compiles:

   ```bash
   npm run build
   ```

   A green "Complete!" means you're good to deploy.

---

## 10. When something breaks

- **Blank page or red error?** Look at the `npm run dev` terminal — it names the file and line.
- **Most common cause:** a frontmatter typo — a missing quote, a missing `]`, or a date that isn't
  `YYYY-MM-DD`.
- **Undo:** if you use git, `git checkout -- path/to/file` restores a file to its last committed
  state. Otherwise just fix the line the terminal points to.
