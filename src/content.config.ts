import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
// content collections: blog, projects, albums (glob-loaded markdown)

const blog = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
	schema: z.object({
		title: z.string(),
		date: z.date(),
		tags: z.array(z.string()),
		// Optional English companion post: name the file `<slug>.en.md`, set lang: "en",
		// and point translationOf at the primary post's slug (its filename without .md).
		lang: z.enum(['tr', 'en']).optional(),
		translationOf: z.string().optional(),
	}),
});

const projects = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		methodology: z.array(z.string()),
		techStack: z.array(z.string()),
		date: z.date(),
		featured: z.boolean(),
		// Optional links shown on the project card.
		repo: z.string().optional(),
		post: z.string().optional(), // path to a related blog post, e.g. /blog/<slug>
	}),
});

const albums = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/albums' }),
	schema: z.object({
		title: z.string(),
		artist: z.string(),
		genre: z.string(),
		releaseYear: z.number(),
		rating: z.number().min(1).max(5),
		coverImage: z.string(),
		spotlight: z.boolean(),
	}),
});

export const collections = { blog, projects, albums };
