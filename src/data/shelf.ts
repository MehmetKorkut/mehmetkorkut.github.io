// Books currently on the desk — shown on the Books page under "Currently Reading".
export type Book = {
	title: string;
	author?: string;
	note?: string;
	cover?: string; // path to a cover image in /public, e.g. '/books/name.jpg'
};

export const shelf: Book[] = [
	{
		title: "Man's Search for Meaning",
		author: 'Viktor Frankl',
	},
];
