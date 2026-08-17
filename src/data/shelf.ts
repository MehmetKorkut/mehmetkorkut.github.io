// Books currently on the desk — shown on the Books page under "Currently Reading".
export type Book = {
	title: string;
	author?: string;
	note?: string;
	cover?: string; // path to a cover image in /public, e.g. '/books/name.jpg'
};

export const shelf: Book[] = [
	{
		title: 'Dunyanin Sonundaki Mantar',
		cover: '/books/dunyanin-sonundaki-mantar.jpg',
	},
];
