// Spotify playlists embedded on the Wall of Sound page.
// To add one: grab the playlist's Spotify share link, copy the ID that follows
// `/playlist/`, and add a new entry below.
export type Playlist = {
	title: string;
	spotifyId: string;
};

export const playlists: Playlist[] = [
	{ title: 'Cage of Chaos', spotifyId: '523FychYJYdpw6yyaXQcRL' },
	{ title: 'Metal Ballads', spotifyId: '7sLt5pkUSSJBFKKf341sKz' },
	{ title: 'Roots Beyond Time', spotifyId: '2Tbgan6DDxo0kK4N3VOdC5' },
	{ title: 'The Gojira Paradox', spotifyId: '1FmbRpEAiXK0g62OOMeoz2' },
];
