import { generateOpenGraphImage } from 'astro-og-canvas';
import type { APIRoute } from 'astro';

// Site-wide fallback OG card, used by any page that doesn't supply its own.
export const GET: APIRoute = async () =>
	new Response(
		await generateOpenGraphImage({
			title: 'Mehmet Korkut',
			description: 'Signal, sound, and the spaces between.',
			bgGradient: [
				[247, 245, 240],
				[236, 233, 224],
			],
			border: { color: [47, 74, 61], width: 24, side: 'inline-start' },
			padding: 70,
			font: {
				title: { color: [43, 43, 43], size: 70, families: ['Lora'], weight: 'SemiBold' },
				description: { color: [90, 88, 82], size: 32, families: ['Inter'] },
			},
			fonts: ['./src/fonts/Lora-600.ttf', './src/fonts/Inter-400.ttf'],
		})
	);
