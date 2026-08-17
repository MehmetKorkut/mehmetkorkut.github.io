import { OGImageRoute } from 'astro-og-canvas';
import { getCollection } from 'astro:content';

// One generated OG card per blog post, keyed by post id → /og/<id>.png
const posts = (await getCollection('blog')).filter((post) => post.data.lang !== 'en');
const pages = Object.fromEntries(posts.map((post) => [post.id, post]));

const dateFmt = new Intl.DateTimeFormat('en-US', {
	month: 'short',
	day: 'numeric',
	year: 'numeric',
});

export const { getStaticPaths, GET } = await OGImageRoute({
	pages,
	// Slug becomes the file name: /og/<id>.png
	getSlug: (path) => `${path}.png`,
	getImageOptions: (_path, post) => ({
		title: post.data.title,
		description: `Mehmet Korkut · Logbook  —  ${dateFmt.format(post.data.date)}`,
		// Warm paper background with a forest spine down the left edge.
		bgGradient: [
			[247, 245, 240],
			[236, 233, 224],
		],
		border: { color: [47, 74, 61], width: 24, side: 'inline-start' },
		padding: 70,
		font: {
			title: { color: [43, 43, 43], size: 62, lineHeight: 1.2, families: ['Lora'], weight: 'SemiBold' },
			description: { color: [90, 88, 82], size: 30, families: ['Inter'] },
		},
		fonts: ['./src/fonts/Lora-600.ttf', './src/fonts/Inter-400.ttf'],
	}),
});
