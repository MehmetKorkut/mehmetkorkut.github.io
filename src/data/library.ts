// Books finished — shown on the Books page under "Books I Read in {year}".
export type ReadBook = {
	author: string;
	title: string;
};

export const library: ReadBook[] = [
	{ author: 'Douglas Adams', title: 'Otostopcunun Galaksi Rehberi' },
	{ author: 'Tim Hardford', title: 'Veri Dedektifi' },
	{ author: 'Jason Schreler', title: 'Kan, Ter ve Pikseller' },
	{ author: 'Andrej Sarpkowski', title: 'Withcer : Son Dilek' },
	{ author: 'Renata Saleci', title: 'Kaygi Uzerine' },
	{ author: 'John Verdon', title: 'Aklindan Bir Sayi Tut' },
	{ author: 'Jack London', title: 'Yildiz Gezegeni' },
	{ author: 'Jack London', title: 'Martin Eden' },
	{ author: 'Thomas Siebel', title: 'Dijital Donusum' },
];
