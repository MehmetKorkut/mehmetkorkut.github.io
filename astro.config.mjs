// @ts-check

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// Deployed URL — powers the sitemap, canonical links, and absolute OG image URLs.
// Set for a GitHub Pages *user* site (mehmetkorkut.github.io), which serves at the
// root, so no `base` path is needed. If you instead deploy to a *project* repo
// (e.g. mehmetkorkut.github.io/nordic-journal), change SITE accordingly AND add
// `base: '/nordic-journal'` to the config below.
const SITE = 'https://mehmetkorkut.github.io';

// https://astro.build/config
export default defineConfig({
	site: SITE,
	integrations: [sitemap()],
	vite: {
		plugins: [tailwindcss()],
	},
});
